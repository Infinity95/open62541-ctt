/*  Test Error 1, prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Tries to disable publishing for a mix of valid and invalid subscriptionIds. */

function setPublishingMode5103Err002()
{
    const SUBSCRIPTIONCOUNT = 5;
    var subscriptions = [];
    // create all of the subscriptions first
    for( var s=0; s<SUBSCRIPTIONCOUNT; s++ )
    {
        subscriptions[s] = new Subscription();
        CreateSubscriptionHelper.Execute( { 
                    Subscription: subscriptions[s] } );
    }

    // set publishing mode
    var expectedResults = [];
    for( var s=0; s<SUBSCRIPTIONCOUNT; s++ )
    {
        subscriptions[s].SubscriptionId += 0x1234;
        expectedResults[s] = new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid );
    }

    SetPublishingModeHelper.Execute( { 
                SubscriptionIds: subscriptions, 
                PublishingEnabled: false, 
                OperationResults: expectedResults } );

    // delete all subscriptions added above
    for( var s=0; s<SUBSCRIPTIONCOUNT; s++ )
    {
        subscriptions[s].SubscriptionId -= 0x1234;
        DeleteSubscriptionsHelper.Execute( { 
                    SubscriptionIds: subscriptions[s] } );
    }
    return( true );
}

Test.Execute( { Procedure: setPublishingMode5103Err002 } );