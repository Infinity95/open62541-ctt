/*  Test 5.10.1-023 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: MaxNotificationsPerPublish=1. QueueSize is 3; write 3 values (1 per sampling interval); call Publish();
        expect all values to be returned. sampling interval is 1/3 the revised publishing interval. */

function createSubscription5101023() {
    // define the sampling rate of 1/3 the revised publishing interval
    var MonitorQueueSize2Subscription = new Subscription2( { MaxNotificationsPerPublish: 1 } );
    var samplingInterval = parseInt( MonitorQueueSize2Subscription.RevisedPublishingInterval / 3 )

    // create the monitored item
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( !isDefined( item ) ) { addError( "No items configured for testing. Aborting." ); return( false ); }

    // read the item to get an initial value 
    if( !ReadHelper.Execute( { NodesToRead: item } ) ) return( false ); // no need to log an error, the helper will do that!

    // create a new subscription
    CreateSubscriptionHelper.Execute( { Subscription: MonitorQueueSize2Subscription } );

    // create the monitored item, with a queue size of 3
    item.QueueSize = 3;
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorQueueSize2Subscription } ) ) {
        addError( "Couldn't create the monitored item. Aborting." );
        return( false );
    }

    // clear the publish queue of initial values
    PublishHelper.WaitInterval( { Items: item, Subscription: MonitorQueueSize2Subscription } );
    PublishHelper.ClearServerNotifications();

    // iteratively invoke writes
    for( var i=0; i<3; i++ ) {
        // update the value with a new one
        item.SafelySetValueTypeKnown( parseInt( 1 + item.Value.Value ), item.Value.Value.DataType );

        // now write - we expect success
        WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } );

        // wait the *revised* sampling interval and add a little extra delay to compensate for systems with less-strict timing
        wait( 25 + item.RevisedSamplingInterval );
    }//for i...

    // truth time, call Publish(); we expect 1 notification - but we call 3 times
    for( var i=0; i<3; i++ ) {
        PublishHelper.Execute();
        if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() expected to receive a dataChange notification." ) ) {
            // expect 1 notification
            Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Publish() expected to see one notification only." );
            // expect "MoreNotifications" is true; except for the last item
            if( i < 2 ) Assert.True( PublishHelper.Response.MoreNotifications, "Publish() expected the Server to flag 'MoreNotifications' because more should be in the queue." );
            else {
                Assert.False( PublishHelper.Response.MoreNotifications, "Pubilsh() did not expect 'MoreNotifications' to be flagged. We should have received all updates already. Calling Publish() to see if there is another data change notification." );
                PublishHelper.Execute();
                Assert.False( PublishHelper.CurrentlyContainsData(), "Publish() did not expect to receive another data change notification.", "Publish() did not receive another notification, as expected." );
            }
        }
    }

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorQueueSize2Subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: MonitorQueueSize2Subscription } );
    PublishHelper.Clear();
    item = null;
    return( true );
}

Test.Execute( { Procedure: createSubscription5101023 } );