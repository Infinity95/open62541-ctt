/*  Test 5.10.1 test 6 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Create a subscription where requestedLifetimeCount is 3 and requestedMaxKeepAliveCount is 1.
        All returned parameter values are valid and correct. revisedLifetimeCounter is at least 3 times
        that of the revisedMaxKeepAliveCount.*/

function createSubscription5101006() {
    var subscription = new Subscription( null, null, 3, 1 );
    CreateSubscriptionHelper.Execute( { Subscription: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: createSubscription5101006 } );