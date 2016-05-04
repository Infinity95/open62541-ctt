/*  Test 5.10.2 Test case 6 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Modifies a subsription setting RequestedPublishingInterval=0; Server revises the value. */

function modifySubscription5102006() {
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: defaultStaticItem, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) {
            subscription.SetParameters( 0 );
            ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );
            // check the revised publishingInterval matches the fastest the server supports
            Assert.CoercedEqual( fastestPublishingIntervalSupported, subscription.RevisedPublishingInterval, "RevisedPublishingInterval is not set to the fastest value the UA Server supports. Check setting: /Server Test/Capabilities/Fastest Publish Interval Supported" );
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: defaultStaticItem, SubscriptionId: subscription } );
        }
    }
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: modifySubscription5102006 } );