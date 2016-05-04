/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Create a subscription where the requestedPublishingInterval is the
        max size of a FLOAT. */

function createSubscription5101004() {
    var subscription = new Subscription( Constants.Double_Max );
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) Assert.NotEqual( Constants.Double_Max, subscription.RevisedPublishingInterval, "Expected the server to revise the publishingInterval from Float_Max." );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: createSubscription5101004 } );