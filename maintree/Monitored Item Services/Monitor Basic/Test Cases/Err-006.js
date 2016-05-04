/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: CreateMonitoredItems, unknown NodeId. */

function CreateMonitoredItemsErr006() { 
    // create our invalid NodeId 
    var item = MonitoredItem.Clone( scalarItems[0] );
    item.AttributeId = 999;
    return( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, SubscriptionId: MonitorBasicSubscription, OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadAttributeIdInvalid ) } ) );
}//func

Test.Execute( { Procedure: CreateMonitoredItemsErr006 } );