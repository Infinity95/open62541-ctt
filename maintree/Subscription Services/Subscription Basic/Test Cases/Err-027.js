/*  Test 5.10.6 Test 5 prepared by compliance@opcfoundation.org
    Description: Script deletes multiple subscriptions using the subscriptionIds of subscriptions that have already been deleted. */

function deleteSubscription5106Err005() {
    var subscriptions = [];
    // STEP 1: Create the subscriptions
    for( var s=0; s<2; s++ ) {
        subscriptions.push( new Subscription( 1000 ) );
        CreateSubscriptionHelper.Execute( { Subscription: subscriptions[s] } );
    }
    // STEP 2: Delete the subscriptions
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions } );
    // STEP 3: Repeat, expect fail
    for( var s=0; s<2; s++ ) subscriptions[s].SubscriptionCreated = true; // fake the subscription into thinking it exists, otherwise the DeleteSubscriptions helper will ignore it
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions, OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ), new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ) ] } );
    return( true );
}

Test.Execute( { Procedure: deleteSubscription5106Err005 } );