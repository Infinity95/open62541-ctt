/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Create a subscription where requestedLifetimeCounter is max UInt32 and requestedMaxKeepAliveCount is (max UInt32)/3
        ServiceResult = Good
        All returned parameter values are valid and correct. revisedLifetimeCounter is at least 
        3 times that of the revisedMaxKeepAliveCount. */

function createSubscription5101010() {
    var subscription = new Subscription( null, null, Constants.UInt32_Max, (Constants.UInt32_Max/3) );
    CreateSubscriptionHelper.Execute( { Subscription: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: createSubscription5101010 } );