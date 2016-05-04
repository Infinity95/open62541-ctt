/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: CreateMonitoredItems: ItemsToCreate[] is empty. */

function CreateMonitoredItemsErr017() { 
    return( CreateMonitoredItemsHelper.Execute( { 
            ItemsToCreate: [],
            SubscriptionId: MonitorBasicSubscription,
            ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadNothingToDo )
            } ) );
}//func

Test.Execute( { Procedure: CreateMonitoredItemsErr017 } );