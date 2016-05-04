/*  Test 5.10.2 Test case 14 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Modifies a subsription setting requestedLifetimeCounter is max UInt32 and
        requestedMaxKeepAliveCount is (max UInt32)/3. Server expected to revise as best as possible. */

function modifySubscription5102014() {
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        // modify subscription
        subscription.SetParameters( null, null, Constants.UInt32_Max, ( Constants.UInt32_Max / 3 ) );
        addLog( "Changing the lifetimeCount to: " + subscription.LifetimeCount );
        addLog( "Changing the maxKeepAliveCount to: " + subscription.MaxKeepAliveCount );
        ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );
    }
    // delete the subscription we added here 
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: modifySubscription5102014 } );