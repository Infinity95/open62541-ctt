/*  Test 5.10.4 Test 3, prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Acknowledge multiple valid sequence numbers from a valid subscription.
        ServiceResult = Good.
            results[i] = Good.
            Verify sequence numbers acknowledged are not returned in availableSequenceNumbers.
        How this test works:
            1) setup the subscription and monitored item
            2) call Publish() a number of times (in a loop) each time NOT validating the sequence number.
            3) each unacknowledged sequenceNumber is buffered in a variable called "receivedSequenceNumbers".
            4) after the loop is complete (see CONST PUBLISHCALLCOUNT for the loop count) all
                sequenceNumbers received are sent back and acknowledged in one call.
           The test will then clean up the monitoredItems etc. */
   
Test.Execute( { Procedure: function test() {
    const PUBLISHCALLCOUNT = 3; //how many times to call "Publish" in a loop.
    // step 1 - adding some items to subscribe to (monitor).
    // define the monitored items and then make the call to monitor them!
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( !isDefined( item ) ) {
        addSkipped( "Static Scalar (numeric)" );
        return( false );
    }
    // read the items to get their values
    ReadHelper.Execute( { NodesToRead: item, MaxAge: 0 } );
    // step 2 - create the subscription.
    var basicSubscription = new Subscription( undefined, undefined, undefined, 10 );
    if( !CreateSubscriptionHelper.Execute( { Subscription: basicSubscription } ) ) return( false );
    else PublishHelper.RegisterSubscription( basicSubscription );
    // we will define HOW MANY notifications to expect. Later, depending upon the server we may need to use this 
    // to adjust our expectations on how many notifications to expect.
    var expectedNotifications = 0;
    // 4 params are: (1) items to monitor (2) timestamps (3) subscription (4) sesssion
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: basicSubscription } ) ) {
        // publish calls, get some sequenceNumber's buffered for later acknowledgement.
        for( var z=0; z<PUBLISHCALLCOUNT; z++ ) {
            // write some values to the monitoredItems
            UaVariant.Increment( { Value: item.Value } );
            WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } );
            PublishHelper.WaitInterval( { Items: item, Subscription: basicSubscription } );

            // call Publish()() to get the dataChanges and do not ack any sequenceNumbers
            PublishHelper.Execute( { NoAcks:true } );
            expectedNotifications++;
        }//for

        // check how many AvailableSequenceNumbers there are, show what's available first
        addLog( "AvailableSequenceNumbers are: " + PublishHelper.Response.AvailableSequenceNumbers.toString() );
        Assert.Equal( PUBLISHCALLCOUNT, PublishHelper.Response.AvailableSequenceNumbers.length, "All dataChange notifications (sequences) should be present since we have not acknowledged any." );
        if( Assert.NotEqual( 0, PublishHelper.UnAcknowledgedSequenceNumbers.length, "Check Publish.Response.AvailableSequenceNumbers (expected empty)." ) ) {
            // wait 1 publishing cycle
            print( "*** waiting " + basicSubscription.RevisedPublishingInterval + " msecs (1 publishing cycle)" );
            PublishHelper.WaitInterval( { Items: item, Subscription: basicSubscription } );

            PublishHelper.Execute();
            Assert.Equal( 0, PublishHelper.Response.AvailableSequenceNumbers.length, "No sequences should be available since all have been acknowledged." );
        }
        // delete the items we added in this test
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: basicSubscription } );
    }
    // delete the subscription we added here 
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription } );
    PublishHelper.UnregisterSubscription( basicSubscription );
    return( true );
} } );