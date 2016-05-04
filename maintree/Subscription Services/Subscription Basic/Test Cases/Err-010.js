/*  Test 5.10.3 Error test case 4 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Tries to enable publishing for an invalid subscriptionId. */

function setPublishingMode5103Err004()
{
    basicSubscription1 = new Subscription( null, false );
    
    if( CreateSubscriptionHelper.Execute( {
            Subscription: basicSubscription1 } ) )
    {
        // break the subscriptionId in our object (We'll correct it when we delete the subscription)
        basicSubscription1.SubscriptionId += 0x1234;

        var expectedOperationResultsArray = [ new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ) ];
        SetPublishingModeHelper.Execute( { 
                    SubscriptionIds: basicSubscription1, 
                    PublishingEnabled: false, 
                    OperationResults: expectedOperationResultsArray } );

        basicSubscription1.SubscriptionId -= 0x1234;
    }
    DeleteSubscriptionsHelper.Execute( { 
            SubscriptionIds: basicSubscription1 } );
    return( true );
}

Test.Execute( { Procedure: setPublishingMode5103Err004 } );