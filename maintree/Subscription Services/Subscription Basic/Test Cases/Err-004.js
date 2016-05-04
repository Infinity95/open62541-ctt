/*  Test 5.10.1 Error Test 4, prepared by Dale Pope; dale.pope@matrikon.com
    Description:
          Given a valid subscription And an amount of time equal to the subscription's expiry time passes
          When Publish is called Then a StatusChangeNotification of Bad_Timeout is returned
          When a service requiring the SubscriptionId is called Then the service fails */

function createSubscription5101Err004( publishingInterval, lifetimeCount ) {
    const GIVETIME = 5000; // amount of time to allow the server to be late by 
    var expectedError;
    var subscriptionErr004 = new Subscription( publishingInterval, true, lifetimeCount, Math.floor( lifetimeCount / 3 ) );
    if( CreateSubscriptionHelper.Execute( { Subscription: subscriptionErr004 } ) ) {
        var lifetime; // the lifetime in milliseconds
        lifetime = subscriptionErr004.RevisedPublishingInterval * subscriptionErr004.RevisedLifetimeCount;
        var waitTime = lifetime + GIVETIME;

        // failsafe: check if this wait-time will cause the session to timeout
        var sessionTimeout = parseInt( readSetting( "/Server Test/Session/RequestedSessionTimeout" ).toString() );
        if( waitTime >= sessionTimeout ) {
            addError( "The wait time (" + ( waitTime / 1000 ) + " seconds) on the subscription exceeds the session timeout (" + ( sessionTimeout / 1000 ) + " seconds). Please increase setting '/Server Test/Session/RequestedSessionTimeout'" );
            DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptionErr004 } );
        }
        else {
            addLog( "Subscription should live for " + lifetime + " ms, plus an addition " + GIVETIME + "ms will be added to account for low-priority threads typically associated with clean-up operations like this. Session timeout is: " + ( sessionTimeout / 1000 ) + " seconds" );
            addLog( "Waiting " + waitTime + " ms before checking subscription's life status" );
            wait( waitTime );

            // call Publish() to validate the StatusChangeNotification was generated
            PublishHelper.Execute( { ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoSubscription ] ) } );
            if( PublishHelper.Response.ResponseHeader.ServiceResult.isGood() ) {
                if( Assert.Equal( 1, PublishHelper.CurrentStatusChanges.length, "Number of StatusChangeNotifications was incorrect (StatusChange is not the same as a DataChange)." ) ) {
                    Assert.StatusCodeIs( StatusCode.BadTimeout, PublishHelper.CurrentStatusChanges[0].Status, "Received StatusChangeNotification was not BadTimeout" );
                }
            }
            // Since we should call deleteSubscriptions if the subscription doesn't expire, let's use it to validate if the subscription expired or not (i.e., the 
            // operation result should be BadSubscriptionIdInvalid if the subscription expired before its expected lifetime).
            DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptionErr004, OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ) } );
        }
    }
}

function createSub5101Err004wrapper() { 
    createSubscription5101Err004( 800, 15 ); 
    return( true );
}

Test.Execute( { Procedure: createSub5101Err004wrapper } );