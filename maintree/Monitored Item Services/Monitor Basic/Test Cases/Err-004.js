/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: CreateMonitoredItems, invalid NodeId. */

function CreateMonitoredItemsErr004() { 
    var item = MonitoredItem.Clone( scalarItems[0] );
    item.NodeId = new UaNodeId( readSetting( "/Advanced/NodeIds/Invalid/InvalidNodeId1" ) );
    return( CreateMonitoredItemsHelper.Execute( { 
            ItemsToCreate: item,
            SubscriptionId: MonitorBasicSubscription,
            OperationResults: new ExpectedAndAcceptedResults( [ StatusCode.BadNodeIdUnknown, StatusCode.BadNodeIdInvalid ] )
            } ) );
}//func

Test.Execute( { Procedure: CreateMonitoredItemsErr004 } );