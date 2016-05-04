/*  Error test 3 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specifies multiple invalid subscriptionIds. */

function deleteSubscription5106err002()
{
    basicSubscription1 = new Subscription();
    basicSubscription2 = new Subscription();
    basicSubscription3 = new Subscription();
    basicSubscription4 = new Subscription();

    CreateSubscriptionHelper.Execute( { 
                Subscription: basicSubscription1 } );
    CreateSubscriptionHelper.Execute( { 
                Subscription: basicSubscription2 } );
    CreateSubscriptionHelper.Execute( { 
                Subscription: basicSubscription3 } );
    CreateSubscriptionHelper.Execute( {
                Subscription: basicSubscription4 } );

    var deleteSubscriptionRequest = new UaDeleteSubscriptionsRequest();
    var deleteSubscriptionResponse = new UaDeleteSubscriptionsResponse();
    Test.Session.Session.buildRequestHeader( deleteSubscriptionRequest.RequestHeader );

    deleteSubscriptionRequest.SubscriptionIds[0] = basicSubscription1.SubscriptionId;
    deleteSubscriptionRequest.SubscriptionIds[1] = ( basicSubscription2.SubscriptionId + 0x1234 );
    deleteSubscriptionRequest.SubscriptionIds[2] = ( basicSubscription3.SubscriptionId + 0x2345 );
    deleteSubscriptionRequest.SubscriptionIds[3] = ( basicSubscription4.SubscriptionId + 0x3456 );

    print( "\nAbout to delete 4 subscriptions, the last 3 are INVALID." );
    for( var p=0; p<deleteSubscriptionRequest.SubscriptionIds.length; p++ )
    {
        print( "\tDeleting subscription id: " + deleteSubscriptionRequest.SubscriptionIds[p] );
    }

    var uaStatus = Test.Session.Session.deleteSubscriptions( deleteSubscriptionRequest, deleteSubscriptionResponse );
    if( uaStatus.isGood() )
    {
        // this is an array of ExpectedAndAcceptedResult. Size of the array = number of SubscriptionIds
        var ExpectedOperationResultsArray = [
            new ExpectedAndAcceptedResults( StatusCode.Good ),
            new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ),
            new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ),
            new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ) ];
        checkDeleteSubscriptionsError( deleteSubscriptionRequest, deleteSubscriptionResponse, ExpectedOperationResultsArray );
    }
    else
    {
        addError( "DeleteSubscriptions() status " + uaStatus, uaStatus );
    }

    // delete subscription added above
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription2 } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription3 } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription4 } );

    //clean-up
    basicSubscription1 = null;
    basicSubscription2 = null;
    basicSubscription3 = null;
    basicSubscription4 = null;
    return( true );
}

Test.Execute( { Procedure: deleteSubscription5106err002 } );