/*  Test 5.10.2 Test case 10 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Modifies a subsription setting requestedLifetimeCounter is 3 and requestedMaxKeepAliveCount is 1.
        Server expected to set revisedLifetimeCounter to at least 3 times that of the revisedMaxKeepAliveCount. */

function modifySubscription5102010() {
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        // modify subscription
        subscription.SetParameters( null, null, 3, 1 );
        addLog( "Changing the lifetimeCount to: " + subscription.LifetimeCount );
        addLog( "Changing the maxKeepAliveCount to: " + subscription.MaxKeepAliveCount );
        ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );
    }
    // delete the subscription we added here 
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: modifySubscription5102010 } );