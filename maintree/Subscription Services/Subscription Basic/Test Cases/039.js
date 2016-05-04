/*  Test 5.10.2 Test case 17 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Modifies a subsription setting RequestedLifetimeCounter is max UInt32
        and requestedMaxKeepAliveCount is max UInt32.
        Server expected to revise as best as possible. */

function modifySubscription5102017() {
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        // modify subscription
        subscription.SetParameters( null, null, Constants.UInt32_Max, Constants.UInt32_Max );
        addLog( "Changing the lifetimeCount to: " + subscription.LifetimeCount );
        addLog( "Changing the maxKeepAliveCount to: " + subscription.MaxKeepAliveCount );
        Assert.Equal( true, ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } ) );
    }
    // delete the subscription we added here 
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}// function modifySubscription5102017() 

Test.Execute( { Procedure: modifySubscription5102017 } );