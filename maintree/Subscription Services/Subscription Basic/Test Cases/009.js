/*  Test 5.10.1 test 9 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Create a subscription where requestedLifetimeCounter is less than 3 times the requestedMaxKeepAliveCount.
        ServiceResult = Good.
        All returned parameter values are valid and correct. revisedLifetimeCounter is at least
        3 times that of the revisedMaxKeepAliveCount. If the revised is not 3x then the test
        is fail! */

function createSubscription5101009() {
    var subscription = new Subscription( null, null, 10, 15 );
    CreateSubscriptionHelper.Execute( { Subscription: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: createSubscription5101009 } );