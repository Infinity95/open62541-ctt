/*  Test 5.10.2 Error Test case 1 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Modify an invalid subscription. */

function modifySubscription5102Err001() {
    var basicSubscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: basicSubscription } ) ) {
        basicSubscription.originalSubscriptionId = basicSubscription.SubscriptionId;
        basicSubscription.SubscriptionId = 0x999;

        ModifySubscriptionHelper.Execute( { SubscriptionId: basicSubscription, RequestedPublishingInteravl:2000, RequestedMaxKeepAliveCount: 30, RequestedMaxKeepAliveCount: 10, MaxNotificationsPerPublish: 0, Priority: 0, ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid )} );
        basicSubscription.SubscriptionId = basicSubscription.originalSubscriptionId;
     } //createSubscription
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription } );
    return( true );
}

Test.Execute( { Procedure: modifySubscription5102Err001 } );