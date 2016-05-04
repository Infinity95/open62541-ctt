/*  Test 5.10.1 Test 31, prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Create a subscription with a requestedPublishingInterval of 1000, a requestedMaxKeepAliveCount of 10, and a requestedLifetimeCount of 30.
        Add a static monitoredItem to the subscription. Wait (revisedPublishingInterval * revisedMaxKeepAliveCount / 2) milliseconds and then
        write a value, wait one publishing cycle and then call Publish(). call Publish() again. */

function createSubscription5101031() {
    var subscription = new Subscription2( { PublishingInterval:1000, RequestedMaxKeepAliveCount:10, RequestedLifetimeCount:30 } );
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        // now create our static monitored item
        if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: [defaultStaticItem], TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: subscription } ) ) {
            addError( "Aborting test; unable to add monitored item." );
            return( false );
        }

        // test #1
        var waitTime = subscription.RevisedPublishingInterval * ( subscription.RevisedMaxKeepAliveCount / 2 );
        print( "Waiting " + waitTime + " ms prior to calling initial call to WriteService." );
        wait( waitTime );

        UaVariant.Increment( { Value: defaultStaticItem.Value } );
        WriteHelper.Execute( { NodesToWrite: defaultStaticItem } );

        // wait one publish cycle and call Publish() 
        print( "Waiting one publish cycle (" + subscription.RevisedPublishingInterval + " ms.) before calling Publish..." );
        PublishHelper.WaitInterval( { Items: defaultStaticItem, Subscription: subscription } );
        PublishHelper.Execute();

        // test #1 expectations state: publish #1 is a keepalive and sequenceNumber=1
        Assert.True( PublishHelper.CurrentlyContainsData(), "Expected an initial data change." );
        Assert.Equal( 1, PublishHelper.Response.NotificationMessage.SequenceNumber, "The first sequence number should always be 1." );
        Assert.Equal( subscription.SubscriptionId, PublishHelper.Response.SubscriptionId, "Received Publish response in relation to an unexpected Subscription." );

        // test #2 - this time dont wait before callling Publish 
        PublishHelper.Execute();

        // test #2 expectations state: publish #1 is a keepalive and sequenceNumber=1
        Assert.False( PublishHelper.CurrentlyContainsData(), "Expected a keep-alive only since the value of the monitored item has not changed." );
        Assert.Equal( 2, PublishHelper.Response.NotificationMessage.SequenceNumber, "The next sequence number was expected, i.e. '2'." );
        Assert.Equal( subscription.SubscriptionId, PublishHelper.Response.SubscriptionId, "Received Publish response in relation to an unexpected Subscription." );
        waitTime = subscription.RevisedPublishingInterval * subscription.RevisedMaxKeepAliveCount;
        print( "2nd time difference was: " + PublishHelper.PublishDuration + "\texpected wait time approx: " + waitTime + " ms." );
        Assert.InRange( 0, ( 1500 + waitTime ), PublishHelper.PublishDuration, "Expected the second Publish response to delay until it was the right time to send. Expected a delay not to exceed '" + waitTime + "' ms." );
    }

    // remove the monitored item
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: [defaultStaticItem], SubscriptionId: subscription } );

    // Since we need to call deleteSubscriptions anyway, let's just use it to validate if the subscription expired or not (i.e., the operation result
    // should be BadSubscriptionIdInvalid if the subscription expired before its expected lifetime).
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: createSubscription5101031 } );