/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Multiple items; Specify an invalid NodeId in CreateMonitoredItems  */

function CreateMonitoredItemsErr003() { 
    // create our collection of invalid NodeIds 
    var items = MonitoredItem.Clone( scalarItems );
    var expectations = [];
    for( var i=0; i<items.length; i++ ) {
        items[i].NodeId = UaNodeId.fromString( "ns=99;s=helloWorld0" + i );
        expectations.push( new ExpectedAndAcceptedResults( [ StatusCode.BadNodeIdInvalid, StatusCode.BadNodeIdUnknown ] ) );
    }// for i...
    return( CreateMonitoredItemsHelper.Execute( { 
            ItemsToCreate: items,
            SubscriptionId: MonitorBasicSubscription,
            OperationResults: expectations
            } ) );
}//func

Test.Execute( { Procedure: CreateMonitoredItemsErr003 } );