/*  Test 5.10.1 Test 28, prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Create a subscription (no monitored items) with a requestedPublishingInterval of 1000 and 
        a requestedMaxKeepAliveCount of 5; publishingEnabled = false. call Publish(). call Publish() again. */

function createSubscription5101028()
{
    var subscription = new Subscription2( {
            PublishingInterval:3000,
            RequestedMaxKeepAliveCount:3,
            PublishingEnabled:false } );
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) )
    {
        // test #1
        PublishHelper.Execute( { FirstPublish: true } );

        // test #1 expectations state: publish #1 is a keepalive and sequenceNumber=1
        Assert.False( PublishHelper.CurrentlyContainsData(), "Expected a KeepAlive only. We have not added any monitored items to the subscription!" );
        Assert.Equal( 1, PublishHelper.Response.NotificationMessage.SequenceNumber, "The first sequence number should always be 1." );
        Assert.Equal( subscription.SubscriptionId, PublishHelper.Response.SubscriptionId, "Received Publish response in relation to an unexpected Subscription." );


        // test #2
        PublishHelper.Execute();

        // test #2 expectations state: publish #1 is a keepalive and sequenceNumber=1
        Assert.False( PublishHelper.CurrentlyContainsData(), "Expected a KeepAlive only. We have not added any monitored items to the subscription!" );
        Assert.Equal( 1, PublishHelper.Response.NotificationMessage.SequenceNumber, "The first sequence number should always be 1." );
        Assert.Equal( subscription.SubscriptionId, PublishHelper.Response.SubscriptionId, "Received Publish response in relation to an unexpected Subscription." );
    }
    // Since we need to call deleteSubscriptions anyway, let's just use it to
    // validate if the subscription expired or not (i.e., the operation result
    // should be BadSubscriptionIdInvalid if the subscription expired before
    // its expected lifetime).
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: createSubscription5101028 } );