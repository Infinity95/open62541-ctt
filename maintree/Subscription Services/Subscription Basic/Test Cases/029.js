/*  Test 5.10.2 Test case 7 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Modifies a subsription setting RequestedPublishingInterval=Max Float; Server should revise the value to a value it supports. */

function modifySubscription5102007() {
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: defaultStaticItem, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) {
            subscription.SetParameters( Constants.Float_Max );
            ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );
            // check the revised publishingInterval matches the fastest the server supports
            Assert.NotEqual( Constants.Float_Max, subscription.RevisedPublishingInterval, "ModifySubscription's RevisedPublishingInterval should not support such large numbers." );
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: defaultStaticItem, SubscriptionId: subscription } );
        }
    }
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: modifySubscription5102007 } );