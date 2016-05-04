/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:  Single item; Specify an invalid subscriptionId in CreateMonitoredItems */

function CreateMonitoredItemsErr001() { 
    var invalidSubscription = new Subscription();
    invalidSubscription.SubscriptionId = 0xffff;
    return( CreateMonitoredItemsHelper.Execute( { 
            ItemsToCreate: scalarItems[0],
            SubscriptionId: invalidSubscription,
            ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid )
            } ) );
}//func

Test.Execute( { Procedure: CreateMonitoredItemsErr001 } );