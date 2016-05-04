/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Modify an existing active subscription (with at least 1 static monitoredItem with a
        queuesize=1; discardOldest=false  while specifying the maxNotificationsPerPublish of 1.
        Invoke more writes to the monitoredItem Node than its queueSize will support.
        call Publish()() twice. */

function modifySubscription5102025() {
    var items = [ MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0],
                  MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[1] ];
    if( !isDefined( items ) ) { 
        addSkipped( "Not enough static scalar nodes defined; need 2 or more. Aborting." ); 
        return( false );
    }

    // delete the subscription created in 'initialize.js'
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: MonitorQueueSize1Subscription } );
    ReadHelper.Execute( { NodesToRead:items } );

    var subscription = new Subscription();
    subscription.MaxNotificationsPerPublish = 0;
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        for( var z=0; z<items.length; z++ ) {
            items[z].QueueSize = 1;
            items[z].DiscardOldest = false;
        }
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: subscription } ) ) {
            // call Publish() to get the initial dataChange
            PublishHelper.Execute( { FirstPublish: true } );
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive initial data." ) ) Assert.Equal( 2, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive 2 notifications in the initial publish response." );

            // modify subscription
            subscription.MaxNotificationsPerPublish = 1;
            ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );

            // now write multiple values to the node, which should exceed the queue
            for( var i=0; i<2; i++ ) {
                for( var z=0; z<items.length; z++ ){ UaVariant.Increment( { Value: items[z].Value } ) };
                WriteHelper.Execute( { NodesToWrite: items, ReadVerification: false } );
                PublishHelper.WaitInterval( { Items: items[0] } );
            }//for i


            // now to call Publish() (once per item)
            // first callback will be incomplete because of the MaxNotificationsPerPublish=1
            PublishHelper.Execute();
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange notification." ) ) {
                Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive ONE notification only." );
                Assert.True( PublishHelper.Response.MoreNotifications, "Publish().Response.MoreNotifications expected TRUE but received FALSE.\nExplanation: Multiple notifications should be queued in the Server as we have deliberately written multiple values to fill a queue, but since only 1-notification per publish is requested the server should send all remaining notifications in subsequent Publish calls; the MoreNotifications property informs the Client that more notifications are available." );
            }
            // second callback will be the last!
            PublishHelper.Execute();
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange notification." ) ) {
                Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive ONE notification only." );
                Assert.False( PublishHelper.Response.MoreNotifications, "MoreNotifications NOT expected. This 2nd call to Publish() expected the last set of notifications that could not fit into the previous Publish() call." );
            }


            // we should have received all items by now; (a) check our array; (b) expect publish KeepAlive
            PublishHelper.Execute();
            Assert.False( PublishHelper.CurrentlyContainsData(), "Expected to receive a KeepAlive only as all notifications should have been previously received." );
            Assert.NotEqual( StatusCode.Good | OVERFLOWBIT, PublishHelper.ReceivedDataChanges[0].MonitoredItems[0].Value.StatusCode.StatusCode, "StatusCode overflow bit is set for the last/newest item in the queue that was overwritten. Normally this would be good, but it is NOT applicable when QueueSize is 1." );

            // clean-up
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: subscription } );
        }
    }
    // delete the subscription we added here 
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );

    // re-create the subscription previously established in 'initialize.js'
    CreateSubscriptionHelper.Execute( { Subscription: MonitorQueueSize1Subscription } );
    return( true );
}

Test.Execute( { Procedure: modifySubscription5102025 } );