/*  Test 5.10.1 Error test 002 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Creates the MAX number of supported subscriptions using the default parameters.
        Then tries to create one more. Expecting a Bad_TooManySubscriptions result. */

function createSubscription5101Err002() {
    var maxSubscriptionCount = gServerCapabilities.MaxSupportedSubscriptions;
    addLog( "Testing MAX # of supported Subscriptions: " + maxSubscriptionCount + "; defined in setting: /Server Test/Capabilities/Max Supported Subscriptions" );
    // is this an "unlimited" setting, if so then set to an arbitrary value of 100
    if( maxSubscriptionCount === 0 ) {
        addLog( "Unlimited subscriptions specified in the settings (value=0); setting to arbitrary value of 100." );
        maxSubscriptionCount = 100;
    }
    var subscriptions = [];
    // first: create the max # of subscriptions allowed
    for( var i=0; i<maxSubscriptionCount; i++ ) {
        addLog( ( i + 1 ) + " of " + maxSubscriptionCount + " subscriptions being created..." );
        var subscription = new Subscription( null, null, 15+maxSubscriptionCount, 5, 0, 0 );
        if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) subscriptions[i] = subscription;
    }// for i...
    addLog( "All " + maxSubscriptionCount + " subscriptions created (as specified by the max # supported).\nNow to add one more subscription, which we expect to fail..." );

    // now to add one more subscription, which should fail!
    var subscriptionToFail = new Subscription( null, null, 15, 5, 0, 0 );
    var expectedResults = new ExpectedAndAcceptedResults( [ StatusCode.BadTooManySubscriptions, StatusCode.Good ] );
    CreateSubscriptionHelper.Execute( { Subscription: subscriptionToFail, ServiceResult: expectedResults } );
    if( subscriptionToFail.SubscriptionCreated ) DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptionToFail } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions } );
    return( true );
}

Test.Execute( { Procedure: createSubscription5101Err002 } );