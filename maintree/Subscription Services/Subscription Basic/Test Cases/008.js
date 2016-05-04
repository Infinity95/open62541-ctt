/*  Test 5.10.1 test 8 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Create a subscription where requestedLifetimeCounter is less than requestedMaxKeepAliveCount.
        ServiceResult = Good.
        revisedLifetimeCounter returns a value at least 3 times that of the revisedMaxKeepAliveCount.
        All other parameter values are valid and correct. If the revised is not 3x then the
        test is fail! */

function createSubscription5101008() {
    var subscription = new Subscription( null, null, 1, 15 );
    CreateSubscriptionHelper.Execute( { Subscription: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: createSubscription5101008 } );