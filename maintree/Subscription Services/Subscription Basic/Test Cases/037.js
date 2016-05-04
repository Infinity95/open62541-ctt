/*  Test 5.10.2 Test case 15 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Modifies a subsription setting RequestedLifetimeCounter is max UInt32 and requestedMaxKeepAliveCount is (max UInt32)/2.
        Server expected to revise as best as possible. */

function modifySubscription5102015() {
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        // modify subscription
        subscription.SetParameters( null, null, Constants.UInt32_Max, ( Constants.UInt32_Max / 2 ) );
        addLog( "Changing the lifetimeCount to: " + subscription.LifetimeCount );
        addLog( "Changing the maxKeepAliveCount to: " + subscription.MaxKeepAliveCount );
        ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );
    }
    // delete the subscription we added here 
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: modifySubscription5102015 } );