/*  Test 5.10.2 Error case 4 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specifies requestedPublishingInterval as a NaN. The test assumes that the Server will treat NaN the same as it would 0/zero. */

function modifySubscription5102Err004() {
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        subscription.SetParameters( NaN ); //publishingInterval
        ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );
        Assert.CoercedEqual( fastestPublishingIntervalSupported, subscription.RevisedPublishingInterval, "Expected UA Server to revise the publishingInterval to its fastest supported value. See setting: /Server Test/Capabilities/Fastest Publish Interval Supported" );
    }
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: modifySubscription5102Err004 } );