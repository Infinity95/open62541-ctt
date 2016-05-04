/*  Test 5.10.1 test 5 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Creates a subscription where the requestedLifetimeCounter=0, the
        requestedMaxKeepAliveCount=0.
        The server is expected to revise both values to what it supports.
        RevisedLifetimeCount must be by minimum 3x larger than revisedMaxKeepAliveCount. */

function createSubscription5101005() {
    var subscription = new Subscription( null, null, 0, 0 );
    CreateSubscriptionHelper.Execute( { Subscription: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: createSubscription5101005 } );