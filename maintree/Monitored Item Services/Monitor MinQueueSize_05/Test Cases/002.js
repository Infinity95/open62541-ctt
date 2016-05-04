/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: QueueSize is 3; write 3 values (1 per sampling interval); call Publish(); expect all values to be returned.
        sampling interval is 1/3 the revised publishing interval. */

function createSubscription5101022() {
    // define the sampling rate of 1/3 the revised publishing interval
    var MonitorQueueSize2Subscription = new Subscription();
    var samplingInterval = parseInt( MonitorQueueSize2Subscription.RevisedPublishingInterval / 3 )

    CreateSubscriptionHelper.Execute( { Subscription: MonitorQueueSize2Subscription } );

    // create the monitored item
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( !isDefined( item ) ) { addError( "No items configured for testing. Aborting." ); return( false ); }

    // read the item to get an initial value 
    if( !ReadHelper.Execute( { NodesToRead: item } ) ) return( false ); // no need to log an error, the helper will do that!

    // create the monitored item; queusize=3
    item.QueueSize = 3;
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorQueueSize2Subscription } ) ) {
        addError( "Couldn't create the monitored item. Aborting." );
        return( false );
    }

    // clear the publish queue of initial values
    PublishHelper.WaitInterval( { Items: item, Subscription: MonitorQueueSize2Subscription } );
    PublishHelper.ClearServerNotifications();

    // iteratively invoke writes
    for( i=0; i<3; i++ ) {
        // update the value with a new one
        item.SafelySetValueTypeKnown( parseInt( 1 + item.Value.Value ), item.Value.Value.DataType );

        // now write - we expect success
        WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } );

        // wait the *revised* sampling interval
        wait( item.RevisedSamplingInterval * 2 );
    }//for i...

    // truth time, call Publish(); we expect 3 notifications
    PublishHelper.Execute();
    if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange notification." ) ) {
        Assert.Equal( 3, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to see a notification of each write conducted." );
    }

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorQueueSize2Subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: MonitorQueueSize2Subscription } );
    PublishHelper.Clear();
    item = null;
    return( true );
}

Test.Execute( { Procedure: createSubscription5101022 } );