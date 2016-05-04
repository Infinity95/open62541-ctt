/*  Test 5.10.1 Error test 3 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create a subscription where the requested publishing interval is a not a number. */

function createSubscription5101Err003()
{
    var subscription = new Subscription( NaN );
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) )
    {
        Assert.NotEqual( NaN, subscription.RevisedPublishingInterval, "Server expected to revise the PublishingInterval from NaN" );
    }
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: createSubscription5101Err003 } );