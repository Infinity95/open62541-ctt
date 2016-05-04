/*  Test 5.10.3 Error test case 1 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Tries to disable publishing for an invalid subscriptionId. */

function setPublishingMode5103Err001()
{
    basicSubscription1 = new Subscription();
    if( CreateSubscriptionHelper.Execute( { 
                Subscription: basicSubscription1 } ) )
    {
        // invalidate the subscriptinId inside of our object
        basicSubscription1.SubscriptionId += 0x1234;

        // this is an array of ExpectedAndAcceptedResult. Size of the array = number of SubscriptionIds
        var ExpectedOperationResultsArray = [];
        ExpectedOperationResultsArray[0] = new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid );

        // set publishing mode
        SetPublishingModeHelper.Execute( { 
                    SubscriptionIds: basicSubscription1, 
                    PublishingEnabled: false, 
                    OperationResults: ExpectedOperationResultsArray } );

        // delete all subscriptions added above, but correct the subscriptionId first...
        basicSubscription1.SubscriptionId -= 0x1234;
    }
    DeleteSubscriptionsHelper.Execute( {
                SubscriptionIds: basicSubscription1 } );
    return( true );
}

Test.Execute( { Procedure: setPublishingMode5103Err001 } );