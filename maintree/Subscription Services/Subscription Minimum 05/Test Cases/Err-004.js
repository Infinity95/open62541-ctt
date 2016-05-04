/*  Error test 4 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specifies multiple subscriptionIds, some valid and others not. */

function deleteSubscription5106Err003()
{
    var subscriptions = [
        new Subscription(),
        new Subscription(),
        new Subscription(),
        new Subscription()
        ];

    for( var s=0; s<subscriptions.length; s++ )
    {
        CreateSubscriptionHelper.Execute( {
                    Subscription: subscriptions[s] } );
    }

    var expectedResults = [
        new ExpectedAndAcceptedResults( StatusCode.Good ),
        new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ),
        new ExpectedAndAcceptedResults( StatusCode.Good ),
        new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ) ];

    subscriptions[1].SubscriptionId += 0x123;
    subscriptions[3].SubscriptionId += 0x123;

    for( var d=0; d<subscriptions.length; d++ )
    {
        DeleteSubscriptionsHelper.Execute( { 
                    SubscriptionIds: subscriptions[d], 
                    OperationResults: expectedResults[d] } );
    }

    // delete subscription added above, first REVERT the subscriptionIds
    subscriptions[1].SubscriptionId -= 0x123;
    subscriptions[3].SubscriptionId -= 0x123;
    DeleteSubscriptionsHelper.Execute( { 
                SubscriptionIds: subscriptions[1] } );
    DeleteSubscriptionsHelper.Execute( { 
                SubscriptionIds: subscriptions[3] } );

    // clean-up
    expectedResults = null;
    subscriptions = null;
    return( true );
}

Test.Execute( { Procedure: deleteSubscription5106Err003 } );