/*  Test 5.10.1 Test 30, prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Create a subscription (no monitoredItems) with a requestedPublishingInterval of 1000,
        a requestedMaxKeepAliveCount of 10, and a requestedLifetimeCount of 30.
        Wait (revisedPublishingInterval * revisedMaxKeepAliveCount / 2) milliseconds and then call Publish().
        call Publish() again. */

function createSubscription5101030() {
    var timeTolerance = parseInt( readSetting( "/Server Test/Time Tolerence" ) );
    var subscription = new Subscription2( { PublishingInterval:1000, RequestedMaxKeepAliveCount:10, RequestedLifetimeCount: 30, PublishingEnabled:false } );
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        // test #1
        var waitTime = subscription.RevisedPublishingInterval * ( subscription.RevisedMaxKeepAliveCount / 2 );
        print( "Waiting " + waitTime + " ms prior to calling initial Publish." );
        wait( waitTime );
        PublishHelper.Execute();

        // test #1 expectations state: publish #1 is a keepalive and sequenceNumber=1
        Assert.False( PublishHelper.CurrentlyContainsData(), "Expected a KeepAlive only. We have not added any monitored items to the subscription!" );
        Assert.Equal( 1, PublishHelper.Response.NotificationMessage.SequenceNumber, "The first sequence number should always be 1." );
        Assert.Equal( subscription.SubscriptionId, PublishHelper.Response.SubscriptionId, "Received Publish response in relation to an unexpected Subscription." );
        // check the timing, we expect the response to be immediate; so allow a max of 500ms
        Assert.InRange( 0, 500 + timeTolerance, PublishHelper.PublishDuration, "Expected the initial Publish response to be immediate, i.e. less than 500ms." );

        // test #2 - this time no wait
        PublishHelper.Execute();

        // test #2 expectations state: publish #2 is a keepalive and sequenceNumber=1
        Assert.False( PublishHelper.CurrentlyContainsData(), "Expected a KeepAlive only. We have not added any monitored items to the subscription!" );
        Assert.Equal( 1, PublishHelper.Response.NotificationMessage.SequenceNumber, "The first sequence number should always be 1." );
        Assert.Equal( subscription.SubscriptionId, PublishHelper.Response.SubscriptionId, "Received Publish response in relation to an unexpected Subscription." );
        waitTime = subscription.RevisedPublishingInterval *( subscription.RevisedMaxKeepAliveCount + 1 );
        print( "2nd time difference was: " + PublishHelper.PublishDuration + "\texpected wait time approx: " + waitTime + " ms." );
        Assert.InRange( 0, 500 + waitTime + timeTolerance, PublishHelper.PublishDuration, "Expected the second Publish response to delay until it was the right time to send. Expected a delay not to exceed '" + waitTime + "' ms." );
    }
    // Since we need to call deleteSubscriptions anyway, let's just use it to
    // validate if the subscription expired or not (i.e., the operation result
    // should be BadSubscriptionIdInvalid if the subscription expired before
    // its expected lifetime).
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: createSubscription5101030 } );