/*  Test 5.10.1 test 3 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Creates a subscription requesting 0 as the requestedPublishingInterval.
        The Server should reject this and set it to a value that it supports. */

function createSubscription5101003() {
    var subscription = new Subscription( 0 );
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        Assert.NotEqual( 0, subscription.RevisedPublishingInterval, "Expected the server to revise the publishingInterval from 0." );
    }
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    // clear the publish object's properties...
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: createSubscription5101003 } );