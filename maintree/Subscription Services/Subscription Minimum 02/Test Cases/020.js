/*  Test prepared by OPC Foundation: compliance@opcfoundation.org 
: Create a subscription for event subscription (subscribing to Server.Notifier) and create a 2nd subscription for monitoring other scalar nodes. */

function createSubscription510020() {
    // FIRST: GET OUR ITEMS SETUP
    // get server object
    var serverItem = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.Server ), 1, Attribute.EventNotifier )[0];
    // get scalar items
    var scalarItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    if( !isDefined( scalarItems ) || scalarItems.length === 0 ) { addSkipped( "Not enough static scalar items configured." ); return( false ); }
    // get event item(s)
    var eventTriggerItems = MonitoredItem.fromSettings( [ "/Server Test/NodeIds/Events/TriggerNode01", "/Server Test/NodeIds/Events/TriggerNode02" ], undefined, Attribute.NodeClass );
    if( !isDefined( eventTriggerItems ) || eventTriggerItems.length === 0 ) { addSkipped( "Not enough event trigger node items configured." ); return( false ); }

    // determine the type of the triggers
    if( !ReadHelper.Execute( { NodesToRead: eventTriggerItems } ) ) { addError( "Unable to read trigger nodes. Aborting test." ); return( false ); }
    for( var i=0; i<eventTriggerItems.length; i++ ) {
        eventTriggerItems[i].AttributeId = Attribute.Value;                                   // change the attribute to .Value
        if( eventTriggerItems[i].Value.Value.toInt32() == NodeClass.Variable ) {
            ReadHelper.Execute( { NodesToRead: eventTriggerItems[i] } );                      // read the value, so that we have it
            eventTriggerItems[i].OriginalValue = eventTriggerItems[i].Value.Value.clone();    // remember the initial value so we can revert to it later
            eventTriggerItems[i].invokeTrigger = function() {
                UaVariant.Increment( { Value: this.Value } );                                 // increment the value
                return( WriteHelper.Execute( { NodesToWrite: this } ) );                      // write the value to the server
            }
        }
        else if( eventTriggerItems[i].Value.Value.toInt32() == NodeClass.Method ) {
            this.parentObject = init_GetMethodParent( init_GetMethodParent( this ) );
            eventTriggerItems[i].invokeTrigger = function() {
                if( !isDefined( this.parentObject ) ) {
                    return( CallHelper.Execute( { MethodsToCall: [ { MethodId: this.NodeId, ObjectId: this.parentObject.NodeId } ] } ) );
                }
            }
        }
        else eventTriggerItems[i].invokeTrigger = function() { return( true ); }
    }//for i...

    // get the initial values for all scalar items and cache them
    if( !ReadHelper.Execute( { NodesToRead: scalarItems } ) ) { addError( "Unable to read items. Aborting test." ); return( false ); }
    for( var i=0; i<scalarItems.length; i++ ) scalarItems[i].OriginalValue = scalarItems[i].Value.Value.clone();




    var result = false;

    // SECOND: SETUP OUR SUBSCRIPTIONS...
    // subscription #1 is for our events
    var eventsSub = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: eventsSub } ) ) { addError( "Create subscription failed for 'Events'." ); return( false ); }
    // subcsription #2 for our data
    var dataSub = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: dataSub } ) ) addError( "Create subscription failed for 'Data'." );
    else {

        // add our items to the subscriptions; first the events, second the data
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: serverItem, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: eventsSub } ) ) {
            if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: scalarItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: dataSub } ) ) {


                // STEP 2: Call Publish Twice; expect initial data change; might receive events
                var dataReceived = false, eventsReceived = false;
                PublishHelper.WaitInterval( { Subscription: eventsSub, Items: serverItem } );
                for( var i=0; i<2; i++ ) {
                    PublishHelper.Execute();
                    if( PublishHelper.CurrentlyContainsData() ) dataReceived = true; else if( PublishHelper.CurrentlyContainsEvents() ) eventsReceived = true;
                }
                Assert.True( dataReceived, "Initial dataChange notification expected, but not received." );
                if( !eventsReceived ) addWarning( "Initial event notifications expected, but none were received (this might be because more time is needed or some action is required to cause events)." );



                // STEP 3: Write to event trigger and then call Publish twice; expected events; do not expect data
                dataReceived = false, eventsReceived = false;
                for( var i=0; i<eventTriggerItems.length; i++ ) eventTriggerItems[i].invokeTrigger();
                PublishHelper.WaitInterval( { Subscription: eventsSub, Items: serverItem } );
                for( var i=0; i<2; i++ ) {
                    PublishHelper.Execute();
                    if( PublishHelper.CurrentlyContainsData() ) dataReceived = true; else if( PublishHelper.CurrentlyContainsEvents() ) eventsReceived = true;
                }
                Assert.True( eventsReceived, "No events received in Publish. Expected events because we wrote to the trigger nodes." );
                Assert.False( dataReceived,  "Data change notifications received. No data changes were expected because we did not change the value of the Variables." );



                // STEP 4: Write to scalars and call Publish twice; expected data but do not expect events
                dataReceived = false, eventsReceived = false;
                for( var i=0; i<scalarItems.length; i++ ) UaVariant.Increment( { Value: scalarItems[i].Value } );
                WriteHelper.Execute( { NodesToWrite: scalarItems } );
                PublishHelper.WaitInterval( { Subscription: eventsSub, Items: serverItem } );
                for( var i=0; i<2; i++ ) {
                    PublishHelper.Execute();
                    if( PublishHelper.CurrentlyContainsData() ) dataReceived = true; else if( PublishHelper.CurrentlyContainsEvents() ) eventsReceived = true;
                }
                Assert.True(  dataReceived,   "No dataChange received. Expected a dataChange because we have previously written to the scalar nodes." );
                Assert.False( eventsReceived, "Event data received; did not expect to receive any events." );



                // STEP 5: write to the triggers and scalar items and call Publish twice; expect events and data
                dataReceived = false, eventsReceived = false;
                for( var i=0; i<scalarItems.length; i++ ) UaVariant.Increment( { Value: scalarItems[i].Value } );
                for( var i=0; i<eventTriggerItems.length; i++ ) eventTriggerItems[i].invokeTrigger();
                PublishHelper.WaitInterval( { Subscription: eventsSub, Items: serverItem } );
                for( var i=0; i<2; i++ ) {
                    PublishHelper.Execute();
                    if( PublishHelper.CurrentlyContainsData() ) dataReceived = true; else if( PublishHelper.CurrentlyContainsEvents() ) eventsReceived = true;
                }
                Assert.True(  dataReceived,  "No dataChange received. Expected a dataChange because we have previously written to the scalar nodes." );
                Assert.True( eventsReceived, "No Events received. Expected to receive events." );



                // STEP 6: don't write/change anything, just invoke 2 Publish calls...
                dataReceived = false, eventsReceived = false;
                PublishHelper.WaitInterval( { Subscription: eventsSub, Items: serverItem } );
                for( var i=0; i<2; i++ ) {
                    PublishHelper.Execute();
                    if( PublishHelper.CurrentlyContainsData() ) dataReceived = true; else if( PublishHelper.CurrentlyContainsEvents() ) eventsReceived = true;
                }
                Assert.False( dataReceived,   "Received dataChange notifications even though we did not change any of the data." );
                Assert.False( eventsReceived, "Received event notifications even though we did not invoke any of the triggers." );
                


                // CLEANUP: Put back all values to their original setting
                print( "Cleanup..." );
                for( var i=0; i<scalarItems.length; i++ ) scalarItems[i].Value.Value = scalarItems[i].OriginalValue;
                for( var i=0; i<eventTriggerItems.length; i++ ) if( isDefined( eventTriggerItems[i].OriginalValue ) ) {
                    eventTriggerItems[i].Value.Value = eventTriggerItems[i].OriginalValue;
                    scalarItems.push( eventTriggerItems[i] );
                }
                WriteHelper.Execute( { NodesToWrite: scalarItems, SuppressMessaging: true, ReadVerification: false } );
                

            }// create monitored items #2 (data)
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: scalarItems, SubscriptionId: dataSub } );
        }// create monitored items #1 (events)
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: serverItem, SubscriptionId: eventsSub } );
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: dataSub } );
    }
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: eventsSub } );

    return( result );
}

createSubscription510020();