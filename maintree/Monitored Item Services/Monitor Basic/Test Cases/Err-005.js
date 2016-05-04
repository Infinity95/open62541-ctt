/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: CreateMonitoredItems, unknown NodeId. */

function CreateMonitoredItemsErr005() { 
    var item = MonitoredItem.Clone( scalarItems[0] );
    item.NodeId = new UaNodeId( readSetting( "/Advanced/NodeIds/Invalid/UnknownNodeId1" ) );
    return( CreateMonitoredItemsHelper.Execute( { 
            ItemsToCreate: item,
            SubscriptionId: MonitorBasicSubscription,
            OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadNodeIdUnknown )
            } ) );
}//CreateMonitoredItemsErr005

Test.Execute( { Procedure: CreateMonitoredItemsErr005 } );