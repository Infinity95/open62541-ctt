/*  Test 5.10.2 Error Test case 2 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Modify an invalid subscription, subscriptionId=0. */

function modifySubscription5102Err002() {
    var basicSubscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: basicSubscription } ) ) {
        basicSubscription.originalSubscriptionId = basicSubscription.SubscriptionId;
        basicSubscription.SubscriptionId = 0;
        ModifySubscriptionHelper.Execute( {
                SubscriptionId: basicSubscription,
                RequestedPublishingInteravl:2000,
                RequestedMaxKeepAliveCount: 30,
                RequestedMaxKeepAliveCount: 10,
                MaxNotificationsPerPublish: 0,
                Priority: 0, 
                ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid )} ) ;
         
          basicSubscription.SubscriptionId = basicSubscription.originalSubscriptionId;
    }
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription } );
    return( true );
}

Test.Execute( { Procedure: modifySubscription5102Err002 } );