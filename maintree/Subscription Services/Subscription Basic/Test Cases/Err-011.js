/*  Test 5.10.3 Error test case 7 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: No subscriptions have been previously set-up in the session. Call SetPublishingMode (Enabled=true) for a SubscriptionId of 1. */

function setPublishingMode5103Err007() {
    // clear the existing session and subscription.
    Test.Disconnect();
    if( Test.Connect() ) {
        // create a fictitious subscription of id = 1
        var subscription = new Subscription();
        subscription.SubscriptionId = 1;
        // now to call setPublishingMode, which we expect to fail
        var expectedResult = [ new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ) ];
        SetPublishingModeHelper.Execute( { SubscriptionIds: subscription, PublishingEnabled: true, OperationResults: expectedResult } );
        // clean-up
        Test.Disconnect();
        return( initialize() ); //defined in intiailize.js
    }
    else return( false );
}

Test.Execute( { Procedure: setPublishingMode5103Err007 } );