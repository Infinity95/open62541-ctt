/*  Test 5.10.4 Test 1, prepared by Development; compliance@opcfoundation.org
    Description: Calls Publish using the default parameters. */

function publish5104001() {
    // step 1 - adding some items to subscribe to (monitor). Define the monitored items and then make the call to monitor them!
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    if( items === null || items.length === 0 ) {
        addSkipped( SETTING_UNDEFINED_SCALARSTATIC );
        return( false );
    }

    // step 2, create the subscription
    var basicSubscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: basicSubscription } ) ) {
        // 4 params are: (1) items to monitor (2) timestamps (3) subscription (4) sesssion
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: basicSubscription } ) ) {    
            addLog( "Waiting '" + basicSubscription.RevisedPublishingInterval + " msecs' (1 publish interval) before calling Publish." );
            PublishHelper.WaitInterval( { Items: items, Subscription: basicSubscription } );
            PublishHelper.Execute();
            // check the first sequenceNumber is one (1)
            Assert.Equal( 1, PublishHelper.Response.NotificationMessage.SequenceNumber, "First SequenceNumber should be 1, always and not matter if there's a notificationMessage or not." );
            // clean-up
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: basicSubscription } )
        }
    }
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription } );
    return( true );
}

Test.Execute( { Procedure: publish5104001 } );