/*  Test 5.10.4 Test 4, prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Acknowledge multiple valid sequence numbers from multiple valid subscriptions. ServiceResult = Good. Results[i] = Good.
            Verify sequence numbers acknowledged are not returned in availableSequenceNumbers.
        How this test works:
            1) setup the subscription and monitored item
            2) call Publish() a number of times (in a loop) each time NOT validating the sequence number.
            3) each unacknowledged sequenceNumber is buffered in a variable called "receivedSequenceNumbers".
            4) after the loop is complete (see CONST PUBLISHCALLCOUNT for the loop count) all
                sequenceNumbers received are sent back and acknowledged in one call.
           The test will then clean up the monitoredItems etc. */

function publish5104004() {
    const SUBSCRIPTIONCOUNT = 2;
    const PUBLISHCALLCOUNT = 3; //how many times to call "Publish" in a loop.

    var subscriptions = [ new Subscription( undefined, undefined, undefined, 10 ),
                          new Subscription( undefined, undefined, undefined, 10 ) ];
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings );
    while( items.length > 2 ) items.pop();

    // read the values to get their base
    ReadHelper.Execute( { NodesToRead: items } );
    items = [ [ items[0], items[1] ], [ items[0].clone(), items[1].clone() ] ];

    // step 1 - create the subscriptions and monitored items
    for( sc=0; sc<subscriptions.length; sc++ ) {
        if( !CreateSubscriptionHelper.Execute( { Subscription: subscriptions[sc] } ) ) return( false );
        // step 2 - adding some items to subscribe to (monitor).
        // 4 params are: (1) items to monitor (2) timestamps (3) subscription (4) sesssion
        if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items[sc], TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscriptions[sc] } ) ) {
            for( var z=0; z<sc; z++ ) {
                // unregister the subscription with Publish 
                PublishHelper.UnregisterSubscription( subscriptions );
                DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions[z] } );
            }
            return( false );
        }
    }

    PublishHelper.ClearServerNotifications();
    PublishHelper.Clear();
    PublishHelper.RegisterSubscription( subscriptions );

    // step #2 - publish calls, get some sequenceNumber's buffered for later acknowledgement.
    for( var z=0; z<PUBLISHCALLCOUNT; z++ ) {
        // write some values to all items
        UaVariant.Increment( { Value: items[0][0].Value } ); //items[0][0].Value.Value.setInt16( new Date().getMilliseconds() );
        UaVariant.Increment( { Value: items[0][1].Value } ); //items[0][1].Value.Value.setInt32( new Date().getMilliseconds() );
        WriteHelper.Execute( { NodesToWrite: items[0], ReadVerification: false } );
        PublishHelper.WaitInterval( { Items: items[0], Subscription: subscriptions[0] } );

        // call Publish()() twice - 1 per subscription
        PublishHelper.Execute( { NoAcks: true } );
        PublishHelper.Execute( { NoAcks: true } );

        // wait 1 publishing cycle
        print( "*** waiting " + subscriptions[0].RevisedPublishingInterval + " msecs (1 publishing cycle)" );
        PublishHelper.WaitInterval( { Items: items[0], Subscription: subscriptions[0] } );
    }//for

    // make sure we have a collection of unack'd sequences
    Assert.Equal( PUBLISHCALLCOUNT, PublishHelper.Response.AvailableSequenceNumbers.length, "All dataChange notifications (sequences) should be present since we have not acknowledged any." );
    Assert.NotEqual( 0, PublishHelper.UnAcknowledgedSequenceNumbers.length, "We should not have ack'd anything!" );

    // now to acknowledge everything in one call
    // rebuild our request, and specify the sequence number and subscriptionId
    print( "\n\n\n~~~~~~~~~~~~~~~ Last Publish call ~~~~~~~~~~~~~~~~~~~~~~~\n" );
    if( PublishHelper.Execute() ) {
        // AvailableSequenceNumbers should be empty now!
        Assert.Equal( 0, PublishHelper.Response.AvailableSequenceNumbers.length, "No sequences should be available since all have been acknowledged." );

        // call Publish() again, we should receive just a keep-alive
        PublishHelper.Execute();
        Assert.False( PublishHelper.CurrentlyContainsData(), "No dataChanges expected (keep-alive only)." );
    }

    // clean-up
    for( sc=0; sc<SUBSCRIPTIONCOUNT; sc++ ) {
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items[sc], SubscriptionId: subscriptions[sc] } );
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions[sc] } );
    }
    PublishHelper.UnregisterSubscription( subscriptions );
    items = null;
    subscriptions = null;
    return( true );
}

Test.Execute( { Procedure: publish5104004 } );