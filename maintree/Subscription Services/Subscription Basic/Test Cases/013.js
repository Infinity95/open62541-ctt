/*  Test 5.10.1 test 13 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Create a subscription where requestedLifetimeCounter is max UInt32 and requestedMaxKeepAliveCount is max UInt32.
        ServiceResult = Good
        All returned parameter values are valid and correct. revisedLifetimeCounter is at least 
        3 times that of the revisedMaxKeepAliveCount. */

function createSubscription5101013()
{
    const PUBLISHINGENABLED = true;
    const REQUESTEDLIFTETIME = Constants.UInt32_Max; //injection;
    const REQUESTEDMAXKEEPALIVE = Constants.UInt32_Max; //injection;
    const MAXNOTIFICATIONS = 0;
    const PRIORITY = 0;

    var subscription = new Subscription( null, PUBLISHINGENABLED, REQUESTEDLIFTETIME, REQUESTEDMAXKEEPALIVE, MAXNOTIFICATIONS, PRIORITY );
    CreateSubscriptionHelper.Execute( { Subscription: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: createSubscription5101013 } );