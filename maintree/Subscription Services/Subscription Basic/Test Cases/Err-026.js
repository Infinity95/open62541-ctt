/*  Test 5.10.6 Error test 4 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specifies an already deleted subscriptionId. */

function deleteSubscription5106err004()
{
    basicSubscription1 = new Subscription();
    CreateSubscriptionHelper.Execute( { Subscription: basicSubscription1 } );

    var deleteSubscriptionRequest = new UaDeleteSubscriptionsRequest();
    var deleteSubscriptionResponse = new UaDeleteSubscriptionsResponse();
    Test.Session.Session.buildRequestHeader( deleteSubscriptionRequest.RequestHeader );

    deleteSubscriptionRequest.SubscriptionIds[0] = basicSubscription1.SubscriptionId;

    //first run at deleting the subscription SHOULD WORK!
    var uaStatus = Test.Session.Session.deleteSubscriptions( deleteSubscriptionRequest, deleteSubscriptionResponse );
    if( uaStatus.isGood() )
    {
        // this is an array of ExpectedAndAcceptedResult. Size of the array = number of SubscriptionIds
        var ExpectedOperationResultsArray = [];
        ExpectedOperationResultsArray[0] = new ExpectedAndAcceptedResults( StatusCode.Good );
        
        checkDeleteSubscriptionsError( deleteSubscriptionRequest, deleteSubscriptionResponse, ExpectedOperationResultsArray );
    }
    else
    {
        addError( "DeleteSubscriptions() status " + uaStatus, uaStatus );
    }

    //second run at deleting the same subscription SHOULD FAIL!
    uaStatus = Test.Session.Session.deleteSubscriptions( deleteSubscriptionRequest, deleteSubscriptionResponse );
    if( uaStatus.isGood() )
    {
        // this is an array of ExpectedAndAcceptedResult. Size of the array = number of SubscriptionIds
        var ExpectedOperationResultsArray = [];
        ExpectedOperationResultsArray[0] = new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid );
        checkDeleteSubscriptionsError( deleteSubscriptionRequest, deleteSubscriptionResponse, ExpectedOperationResultsArray );
    }
    else
    {
        addError( "DeleteSubscriptions() status " + uaStatus, uaStatus );
    }
    return( true );
}

Test.Execute( { Procedure: deleteSubscription5106err004 } );