/*  Test prepared by Dale Pope; dale.pope@matrikon.com
    Description: Given a valid subscription and an amount of time approaching the subscription's expiration time passes
          When a service requiring the SubscriptionId is called Then the service succeeds. */

function createSubscription5101024( publishingInterval, lifetimeCount ) {
    const GIVETIME = 500; // amount of time to allow for lag 
    var subscription = new Subscription( publishingInterval, true, lifetimeCount, Math.floor( lifetimeCount / 3 ) );
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        var lifetime; // the lifetime in milliseconds
        lifetime = subscription.RevisedPublishingInterval * subscription.RevisedLifetimeCount;
        addLog( "Subscription should live for " + lifetime + " ms" );
        var waitTime = lifetime - GIVETIME;
        addLog( "Waiting " + waitTime + " ms before checking subscription's life status" );
        wait( waitTime );
    }
    // Since we need to call deleteSubscriptions anyway, let's just use it to validate if the subscription expired or not (i.e., the operation result
    // should be BadSubscriptionIdInvalid if the subscription expired before its expected lifetime).
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
}

function createSubscription51001024Master() {
    createSubscription5101024( 100, 10 );
    createSubscription5101024( 100, 30 );
    createSubscription5101024( 800, 15 );
    return( true );
}

Test.Execute( { Procedure: createSubscription51001024Master } );