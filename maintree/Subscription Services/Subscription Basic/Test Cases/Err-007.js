/*  Test 5.10.2 Error case 3 prepared by Development; compliance@opcfoundation.org
    Description: Specifies a negative number for the publishing interval. */

function modifySubscription5102Err003() {
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        subscription.SetParameters( -5 ); //publishingInterval
        ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );
        Assert.CoercedEqual( fastestPublishingIntervalSupported, subscription.RevisedPublishingInterval, "Expected UA Server to revise the publishingInterval to its fastest supported value. See setting: /Server Test/Capabilities/Fastest Publish Interval Supported" );
    }
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: modifySubscription5102Err003 } );