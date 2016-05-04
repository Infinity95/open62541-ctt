/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
       Create 1 active subscription monitoring a static node whose queueSize = 2.
       Write 2 values to the node. call Publish(). Write 2 more values to the node.
       Change the monitoring mode to Disabled. call Publish(). Change the monitoring
       mode to Reporting. call Publish().
    Expected Results:
        All service and operation level results are �Good�.
        The 1st Publish yields the 2 data changes, whose values match those written.
        The 2nd publish call yields no data (because the queue in the server should be cleared).
        The 3rd publish call yields the data previously written.
    NOTE:
        Although the Subscription is DISABLED, we do not expect the monitoredItems queue 
        to be cleared which is why the last Publish call expects to receive both values 
        previously written.
        If we modified the mode of each MonitoredItem to DISABLED then we would expect 
        the queue for item to be cleared. */

Test.Execute( { Procedure: function test() {
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( item === null ) { 
        addWarning( "Test cannot be completed: no static array NodeIds were found in settings" ); 
        return( false ); 
    }
    // read the initial value, and then we can increment...
    if( !ReadHelper.Execute( { NodesToRead: item } ) ) return( false );

    var MonitorQueueSize2Subscription = new Subscription();
    CreateSubscriptionHelper.Execute( { Subscription: MonitorQueueSize2Subscription } );
    if( !MonitorQueueSize2Subscription.SubscriptionCreated ) {
        addError( "Test aborted. Subscription for 'Monitor Value Change' was not created." ); 
        return( false ); 
    }

    const NUM_WRITES = 2;

    // setup the item per the test-case requirements
    item.QueueSize = 2;

    // create the monitoredItem
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorQueueSize2Subscription } ) ) {
        // check the revisedQueueSize
        if( item.QueueSize < 2 ) addWarning( "Unable to complete test because the Server did not accept the QueueSize of 2, but revised the QueueSize to: " + item.RevisedQueueSize );
        else {
            // generate the values to write
            var i = 0;
            var writeValues = [];
            for( i=0; i<NUM_WRITES; i++ ) writeValues[i] = UaVariant.Increment( { Value: item.Value } );

            // Clear the server's notification queue
            PublishHelper.ClearServerNotifications();

            // TEST 1: WRITE 2 VALUES, call Publish()
            // now to write 2 values to the item, we'll use the system clock to do this
            for( i=0; i<NUM_WRITES; i++ ) {
                item.Value.Value = writeValues[i];
                if( Assert.True( WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } ), "Expected the write to succeed." ) ) PublishHelper.WaitInterval( { Items: item, Subscription: MonitorQueueSize2Subscription } );
            }// for i...

            PublishHelper.WaitInterval( { Items: item, Subscription: MonitorQueueSize2Subscription } );
            PublishHelper.Execute();
            // Publish #1, 2 dataChanges expected. Values match those just written
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected the Publish to yield dataChanges." ) ) {
                Assert.Equal( 1, PublishHelper.CurrentDataChanges.length, "Expected to receive one dataChangeNotification." );
                Assert.Equal( NUM_WRITES, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive one value change per write, a total of " + NUM_WRITES + " values." );
                for( i=0; i<NUM_WRITES; i++ ) Assert.CoercedEqual( writeValues[i], PublishHelper.CurrentDataChanges[0].MonitoredItems[i].Value.Value, "Expected to receive the same value written." );

                // TEST 2: WRITE 2 MORE VALUES, CHANGE MONITORING MODE, call Publish()
                for( i=0; i<NUM_WRITES; i++ ) {
                    item.Value.Value = writeValues[i];
                    if( Assert.True( WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } ), "Expected the write to succeed." ) ) PublishHelper.WaitInterval( { Items: item, Subscription: MonitorQueueSize2Subscription } );
                }// for i...
                // now change the monitoringMode to Disabled
                if( !SetMonitoringModeHelper.Execute( { MonitoringMode: MonitoringMode.Disabled, MonitoredItemIds: item, SubscriptionId: MonitorQueueSize2Subscription } ) ) {
                    addError( "Test aborted. SetMonitoringMode failed. Cannot test if the queue was cleared in the server." );
                }
                else {
                    // call Publish(), we should get no dataChanges
                    Assert.True( PublishHelper.Execute() && ( PublishHelper.CurrentlyContainsData() == false ), "Expected Publish to succeed, but with zero dataChanges because the monitoringMode was set to Disabled." );

                    // change the monitoringMode back to Reporting, call Publish() again
                    if( !SetMonitoringModeHelper.Execute( { MonitoringMode: MonitoringMode.Reporting, MonitoredItemIds: item, SubscriptionId: MonitorQueueSize2Subscription } ) ) {
                        addError( "Test aborted. SetMonitoringMode failed. Cannot test if the queue was cleared in the server." );
                    }
                    else {
                        // call Publish(), we should still have received a single callback yielding value last written.
                        if( Assert.True( PublishHelper.Execute() && ( PublishHelper.CurrentlyContainsData() ), "Expected Publish to succeed and a single dataChange notification because the monitoringMode was set to Disabled and then Reporting, which should always result in the server sending an \"initial\" data change." ) ) {
                            // the queue was emptied when setting the monitoring mode to disabled - so just expect 1 value
                            if(Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected " + item.QueueSize + " items in dataChange notification messsage." ) ) {
                                // make sure the the value received matchs the previously written value
                                Assert.CoercedEqual( writeValues[1], PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.Value, "Expected to receive the same value as the one previously written." );
                            }
                        }
                    }
                }
            }
        }
    }
    // CLEAN UP
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorQueueSize2Subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: MonitorQueueSize2Subscription } );
    return( false );
} } );