/*  Test 5.10.2 Test case 8 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Modifies a subsription setting RequestedLifetimeCount and RequestedMaxKeepAliveCount variables to different values. */

function modifySubscription5102008() {
    const OFFSET = 0xA;
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        print( "\n(1) lifetimeCount > current && keepAlive > current" );
        subscription.SetParameters( null, null, ( subscription.RevisedLifetimeCount + OFFSET ), ( subscription.RevisedMaxKeepAliveCount + OFFSET ) );
        ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );

        print( "\n(2) lifetimeCount < current && keepAlive > current" );
        subscription.SetParameters( null, null, ( subscription.RevisedLifetimeCount - OFFSET) , ( subscription.RevisedMaxKeepAliveCount + OFFSET ) );
        ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );

        print( "\n(3) lifetimeCount = current && keepAlive > current" );
        subscription.SetParameters( null, null, subscription.RevisedLifetimeCount, ( subscription.RevisedMaxKeepAliveCount + OFFSET ) );
        ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );

        print( "\n(4) lifetimeCount > current && keepAlive < current" );
        subscription.SetParameters( null, null, ( subscription.RevisedLifetimeCount + OFFSET ), ( subscription.RevisedMaxKeepAliveCount - OFFSET ) );
        ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );

        print( "\n(5) lifetimeCount < current && keepAlive < current ");
        subscription.SetParameters( null, null, ( subscription.RevisedLifetimeCount - OFFSET ), ( subscription.RevisedMaxKeepAliveCount - OFFSET ) );
        ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );

        print( "\n(6) lifetimeCount = current && keepAlive < current" );
        subscription.SetParameters( null, null, subscription.RevisedLifetimeCount, ( subscription.RevisedMaxKeepAliveCount - OFFSET ) );
        ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );

        print( "\n(7) lifetimeCount > current && keepAlive = current" );
        subscription.SetParameters( null, null, ( subscription.RevisedLifetimeCount + OFFSET ), subscription.RevisedMaxKeepAliveCount );
        ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );

        print( "\n(8) lifetimeCount < current && keepAlive = current" );
        subscription.SetParameters( null, null, ( subscription.RevisedLifetimeCount - OFFSET ), subscription.RevisedMaxKeepAliveCount );
        ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );

        print( "\n(9) lifetimeCount = current && keepAlive = current" );
        subscription.SetParameters( null, null, subscription.RevisedLifetimeCount, subscription.RevisedMaxKeepAliveCount );
        ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );
    }
    // delete the subscription we added here 
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: modifySubscription5102008 } );