/*    Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
      Description:
            Create a valid subscription and add the MonitoredItems needed by this test.
            Wait the longest time between Sampling and Publishing interval before calling SetTriggering:
            Specify a valid SubscriptionId (subscription created with default parameters),
            TriggeringItemId (MonitoringMode is sampling) and one LinksToAdd (items are sampling).
            Call Publish.
            Write a value to the triggeringItem and call Publish.
            Write a value to the linked item only and call Publish.
            Write a value to the triggeringItem and call Publish.
            Note: the nodes for the linked items should be static and not dynamic.
      Expected Results:
            All service and operation level results are Good.
            The 1st publish call yields a keep alive. (Since the sampling was done before we call SetTriggering)
            The 2nd publish call yields a data change for the linked item. 
            The 3rd Publish call yields a keep alive.
            The 4th Publish call yields values the linked item */

function setTriggering594013() {
    const TRIGGERINGITEM_SETTING = "/Server Test/NodeIds/Static/All Profiles/Scalar/Int32";
    const TRIGGEREDITEM1_SETTING = "/Server Test/NodeIds/Static/All Profiles/Scalar/UInt32";

    var triggeringItem = MonitoredItem.fromSetting( TRIGGERINGITEM_SETTING, 0, Attribute.Value, "", MonitoringMode.Sampling, true, undefined, 1, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both );
    var addLinkedItem  = MonitoredItem.fromSetting( TRIGGEREDITEM1_SETTING, 1, Attribute.Value, "", MonitoringMode.Sampling, true, undefined, 1, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both );
    if( triggeringItem == null || addLinkedItem == null ) {
        _dataTypeUnavailable.store( [ "Int32", "UInt32" ] );
        addSkipped( "Static Scalar (Int32, UInt32)" );
        return( false );
    }

    if( !MonitorTriggeringSubscription.SubscriptionCreated ) {
        addError( "Subscription for conformance unit Monitor Value Change was not created." );
        return( false );
    }

    // read all items so that we can get their current values
    addLog( "Reading the triggering and linked items first to obtain their current value." );
    ReadHelper.Execute( { NodesToRead: [ addLinkedItem, triggeringItem ] } );

    // add the monitored items to the subscription
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: [ triggeringItem, addLinkedItem ], TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorTriggeringSubscription } ) ) {
        PublishHelper.WaitInterval( { Items: addLinkedItem, Subscription: MonitorTriggeringSubscription } );

        if( SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: triggeringItem, LinksToAdd: addLinkedItem } ) ) {
            // Publish #1 - expecting no items returned
            // wait one publishing cycle before calling publish
            addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + " msecs' before calling Publish #1." );
            PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
            PublishHelper.Execute( { FirstPublish: true } );
            Assert.False( PublishHelper.CurrentlyContainsData(), "Publish #1 expected First Publish to be a KeepAlive (no data changes)." );

            // Publish #2; write to the triggeringItem, get the linked item in a data-change
            UaVariant.Increment( { Value: triggeringItem.Value } );
            if( WriteHelper.Execute( { NodesToWrite: triggeringItem, ReadVerification: false } ) ) {
                // wait one publishing cycle before calling publish
                addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + "' msecs before calling Publish #2." );
                PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
                // call Publish()() and see what we receive....
                PublishHelper.Execute();
                if ( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish #2 expected a data-change with the LINKED item." ) == false ) {
                    Assert.False( PublishHelper.HandleIsInCurrentDataChanges( triggeringItem.ClientHandle ),  "Publish #2 -- Triggeringitem found by mistake" );
                    Assert.True( PublishHelper.HandleIsInCurrentDataChanges( addLinkedItem.ClientHandle ),  "Publish #2 -- LinkedItem not found" );
                }
            }// write.Execute()
            
            // Publish #3; write to a linked item
            UaVariant.Increment( { Value: addLinkedItem.Value } );
            if( WriteHelper.Execute( { NodesToWrite: addLinkedItem, ReadVerification: false } ) ) {
                // wait one publishing cycle before calling publish
                addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + "' msecs before calling Publish #3." );
                PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
                // call Publish()() and see what we receive....
                PublishHelper.Execute();
                if ( Assert.False( PublishHelper.CurrentlyContainsData(), "Publish #3 expected to receive a keep-alive since data has NOT changed for the triggering item. Even though we wrote to the linked item, we must wait for the triggering item to change value now." ) == false ) {
                    Assert.False( PublishHelper.HandleIsInCurrentDataChanges( triggeringItem.ClientHandle ),  "Publish #3 -- Triggeringitem is found" );
                    Assert.False( PublishHelper.HandleIsInCurrentDataChanges( addLinkedItem.ClientHandle ),  "Publish #3 -- LinkedItem is found" );
                }
            }// write.Execute()
            
            // Publish #4; write to trigger
            UaVariant.Increment( { Value: triggeringItem.Value } );
            if( WriteHelper.Execute( { NodesToWrite: triggeringItem, ReadVerification: false } ) ) {
                // wait one publishing cycle before calling publish
                addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + "' msecs before calling Publish #4." );
                PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
                // call Publish()() and see what we receive....
                PublishHelper.Execute();
                if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish #4 expected to receive LINKED item's notification since linked item and triggered item both changed!" ) ) {
                    Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Publish #4 -- Expected to receive 1 notifications: 1 x linked." );
                    Assert.True( PublishHelper.HandleIsInCurrentDataChanges( addLinkedItem.ClientHandle ), "Publish #4 -- Did not find LINKED item '" + triggeringItem.NodeSetting + "' in Publish response (mode=Sampling)." );
                }
                else {
                    Assert.False( PublishHelper.HandleIsInCurrentDataChanges( triggeringItem.ClientHandle ),  "Publish #4 -- Triggeringitem is found" );
                    Assert.True( PublishHelper.HandleIsInCurrentDataChanges( addLinkedItem.ClientHandle ),  "Publish #4 -- LinkedItem is not found" );
                }
            }// write.Execute()
        }// setTriggering.Execute()
    }// createMonitoredItems.Execute()
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: [triggeringItem, addLinkedItem], SubscriptionId: MonitorTriggeringSubscription } );
    PublishHelper.Clear();
    return( true );
}// function setTriggering594013()

Test.Execute( { Procedure: setTriggering594013 } );