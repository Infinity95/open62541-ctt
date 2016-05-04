/*    Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
      Description: Create a triggered item (reporting). Add 2 linked (triggered ) nodes: 1 x INT & 1x  Float, with the mode set to Sampling, and configured
        with a DeadbandAbsolute filter: For Integers: the deadbandValue will be 5. For Floats: the deadbandValue will be 0.5.
        Write a �reset value� to each linked node. call Publish().
        In a loop: Write a new value to the triggering Node and also write the following values to the linked items, each time waiting for the RevisedPublishingInterval before calling Publish:
            Int: 0, 5, 6, 5, 10.
            Float: 0.0, 0.5, 0.6, 0.5, 1.0 */

function setTriggering594020() {
    // define our 3 items: 1xTrigger and 2xLinked
    // create the monitoredItems
    var triggeringItem =    MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings, 0, Attribute.Value, "", MonitoringMode.Reporting, true, undefined, undefined, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both )[2];
    var addLinkedItems = [  MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.IntegerSettings, 1, Attribute.Value, "", MonitoringMode.Sampling,  true, undefined, undefined, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both )[0],
                            MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.FloatSettings, 2, Attribute.Value, "", MonitoringMode.Sampling,  true, undefined, undefined, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both )[0] ];
    if( triggeringItem == null || addLinkedItems == null || addLinkedItems.length < 2 ) { addSkipped( "Static Scalar (numeric). Not enough nodes to test with. Please check settings." ); return( false ); }
    if( !MonitorTriggeringSubscription.SubscriptionCreated ) { addError( "Subscription for conformance unit Monitor Value Change was not created." ); return( false ); }

    // create the 2 deadbands we'll need for our linked items
    var filterInt   = Event.GetDataChangeFilter( DeadbandType.Absolute, 5,   DataChangeTrigger.StatusValue );
    var filterFloat = Event.GetDataChangeFilter( DeadbandType.Absolute, 0.5, DataChangeTrigger.StatusValue );
    addLinkedItems[0].Filter = filterInt;
    addLinkedItems[1].Filter = filterFloat;

    // sanity check; make sure trigger and linked items are not the same
    if( addLinkedItems[0].NodeId == triggeringItem.NodeId || addLinkedItems[1].NodeId == triggeringItem.NodeId ) {
        addSkipped( "Triggering Item is the same as one of the Linked items. Aborting test. Please check settings and add more nodes for testing." );
        return( false );
    }

    // read the values of all items first so that we have their current value and data-type
    ReadHelper.Execute( { NodesToRead: [ triggeringItem, addLinkedItems[0], addLinkedItems[1] ] } );

    // reset all values for our deadband tests
    triggeringItem.SafelySetValueTypeKnown   ( 100, UaNodeId.GuessType( triggeringItem.NodeSetting ) );
    addLinkedItems[0].SafelySetValueTypeKnown( 100, UaNodeId.GuessType( addLinkedItems[0].NodeSetting ) );
    addLinkedItems[1].SafelySetValueTypeKnown( 100, UaNodeId.GuessType( addLinkedItems[1].NodeSetting ) );
    WriteHelper.Execute( { NodesToWrite: [ triggeringItem, addLinkedItems[0], addLinkedItems[1] ], ReadVerification: false } );

    // CreateMonitoredItems might not succeed if the Server doesn't support DeadbandAbsolute
    var anticipatedResults = [];
    anticipatedResults[0] = new ExpectedAndAcceptedResults( StatusCode.Good );
    anticipatedResults[1] = new ExpectedAndAcceptedResults( StatusCode.Good );
    anticipatedResults[1].addExpectedResult( StatusCode.BadMonitoredItemFilterUnsupported );
    anticipatedResults[2] = new ExpectedAndAcceptedResults( StatusCode.Good );
    anticipatedResults[2].addExpectedResult( StatusCode.BadMonitoredItemFilterUnsupported );

    // add the monitored items to the subscription
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: [triggeringItem, addLinkedItems[0], addLinkedItems[1]], TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorTriggeringSubscription, OperationResults: anticipatedResults } ) ) {
        // just check results[1] which is the first linked item, if this failed then the other linked item would've failed too
        if( createMonItemsResp.Results[1].StatusCode.StatusCode === StatusCode.BadMonitoredItemFilterUnsupported ) addNotSupported( "DeadbandAbsolute" );
        else {
            // set-up the triggering service call
            if( SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: triggeringItem, LinksToAdd: addLinkedItems } ) ) {
                // publish #1.1
                PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
                PublishHelper.Execute();
                if( Assert.GreaterThan( 0, PublishHelper.ReceivedDataChanges.length, "Publish expected to receive at least one data-change for the triggering item." ) ) {
                    // check for triggering item
                    Assert.True( PublishHelper.HandleIsInReceivedDataChanges( triggeringItem.ClientHandle ), "Expected 1st Publish call to yield data for TRIGGERING item!" );
                    var handlesReceived = new IntegerSet;
                    // check for triggered items
                    for( i=0; i<addLinkedItems.length; i++ ) {
                        if( PublishHelper.HandleIsInReceivedDataChanges( addLinkedItems[i].ClientHandle ) ) {
                            addLog("Received datachange for item " + addLinkedItems[i].NodeSetting);
                            handlesReceived.insert(addLinkedItems[i].ClientHandle);
                        }
                    }
                    // write to triggering item if we didn't get values for all triggered items
                    if( handlesReceived.size() < addLinkedItems.length ) {
                        UaVariant.Increment( { Value: triggeringItem.Value } );
                        Assert.True( WriteHelper.Execute( { NodesToWrite: triggeringItem, ReadVerification: false } ), "Writes are needed in order to test the trigger." );
                        // publish #1.2
                        PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
                        PublishHelper.Execute();

                        // we expect the triggering item plus all triggered items we didn't get in the last publish
                        Assert.Equal( addLinkedItems.length + 1 - handlesReceived.size(), PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected " + ( addLinkedItems.length + 1 - handlesReceived.size() ) +  " values in datachange, received " + PublishHelper.CurrentDataChanges[0].MonitoredItems.length + "." )
                        // check handles
                        for( i = 0; i < addLinkedItems.length; i++) {
                            // handle is included in datachange
                            if( PublishHelper.HandleIsInCurrentDataChanges( addLinkedItems[i].ClientHandle ) ) {
                                if( handlesReceived.contains(addLinkedItems[i].ClientHandle) ) addError("Received unexpected datachange for item " + addLinkedItems[i].NodeSetting);
                                else {
                                    handlesReceived.insert(addLinkedItems[i].ClientHandle);
                                    addLog("Received datachange for item " + addLinkedItems[i].NodeSetting);
                                }
                            }
                            else {
                                if( !handlesReceived.contains(addLinkedItems[i].ClientHandle) ) addError("No datachange received for item " + addLinkedItems[i].NodeSetting);
                            }
                        }
                    }
                }

                // configure the deadband values to write 
                var deadbandValuesInt   = [ 0, 6, 7, 6, 20 ];
                var deadbandValuesFloat = [ 0.0, 0.6, 0.5, 0.6, 1.5 ];
                var successes           = [ true, true, false, false, true ];

                // go into our actual TEST LOOP where we will:
                //  (1) write a value to the linked items
                //  (2) wait for the publish interval
                //  (3) call Publish()
                //  (4) make sure we received data and that it matches the values previously written
                for( var i=0; i<deadbandValuesInt.length; i++ ) {
                    // write deadband values to linked nodes
                    UaVariant.Increment( { Value: triggeringItem.Value } );
                    addLinkedItems[0].SafelySetValueTypeKnown( deadbandValuesInt[i],   UaNodeId.GuessType( addLinkedItems[0].NodeSetting ) );
                    addLinkedItems[1].SafelySetValueTypeKnown( deadbandValuesFloat[i], UaNodeId.GuessType( addLinkedItems[1].NodeSetting ) );
                    WriteHelper.Execute( { NodesToWrite: [ triggeringItem, addLinkedItems[0], addLinkedItems[1] ], ReadVerification: false } );

                    // call Publish() and check that we have received what we're expecting
                    PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
                    PublishHelper.Execute();
                    
                    //if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a data change for the linked item." ) )
                    if( Assert.GreaterThan( 0, PublishHelper.ReceivedDataChanges.length, "Expected to receive a data change for the linked item." ) ) {
                        // are we expecting this to succeed?
                        if( successes[i] ) {
                            // check the 3 nodes are returned
                            if( Assert.Equal( 3, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive 3 items in the response for Publish # " + (1+i) ) ) {
                                // check the handles
                                Assert.True( PublishHelper.HandleIsInReceivedDataChanges( triggeringItem.ClientHandle ),    "Expected Publish call # " + (1+i) + " to yield data change for the triggering item: " + triggeringItem.NodeSetting );
                                Assert.True( PublishHelper.HandleIsInReceivedDataChanges( addLinkedItems[0].ClientHandle ), "Expected Publish call # " + (1+i) + " to yield data change for the linked item: " +  addLinkedItems[0].NodeSetting );
                                Assert.True( PublishHelper.HandleIsInReceivedDataChanges( addLinkedItems[1].ClientHandle ), "Expected Publish call # " + (1+i) + " to yield data change for the linked item: " +  addLinkedItems[1].NodeSetting );
                                // now check the values match what we wrote - (we only care about the linked items here)
                                Assert.CoercedEqual( deadbandValuesInt[i],   addLinkedItems[0].Value.Value, "Expected to receive the same value previously written for linked item: " + addLinkedItems[0].NodeSetting  );
                                Assert.CoercedEqual( deadbandValuesFloat[i], addLinkedItems[1].Value.Value, "Expected to receive the same value previously written for linked item: " + addLinkedItems[1].NodeSetting  );
                            }
                            else addError( "Unexepectedly received the following datachanges:\n\t" + PublishHelper.PrintReceivedDataChanges( true ) );
                        }
                        else {
                            // we expect the deadband to filter the value 
                            if( Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive 1 item in the response for Publish # " + (1+i) ) ) {
                                Assert.True( PublishHelper.HandleIsInReceivedDataChanges( triggeringItem.ClientHandle ), "Expected Publish call # " + (1+i) + " to yield data change for the triggering item: " + triggeringItem.NodeSetting );
                            }
                        }
                    }
                }//for i...
            }// setTriggering.Execute()
        }
    }
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: [ triggeringItem, addLinkedItems[0], addLinkedItems[1] ], SubscriptionId: MonitorTriggeringSubscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: setTriggering594020 } );