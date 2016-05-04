/*  Test 5.10.1 Test 21 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Creates a subscription without any monitored items.
        Waits (revised pub interval * lifetimecount / 2 ), calls publish - expects a keep alive. Do this twice. */

function createSubscription5101021() {
    var sub = new Subscription2( { PublishingInterval:1000, RequestedLifetimeCount: 20 } );
    if( CreateSubscriptionHelper.Execute( { Subscription: sub } ) ) {
        var waitPeriod = parseInt( ( sub.RevisedPublishingInterval * sub.RevisedLifetimeCount ) / 2 );
        print( "Waiting: " + waitPeriod + " msec. before calling Publish" );
        for( var i=0; i<2; i++ ) {
            wait( waitPeriod );
            PublishHelper.Execute();
            Assert.False( PublishHelper.CurrentlyContainsData(), "Expected a KeepAlive return only." );
        }//for i...
    }
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: sub } );
    return( true );
}

Test.Execute( { Procedure: createSubscription5101021 } );