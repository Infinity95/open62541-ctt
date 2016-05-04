/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to a single valid attribute for an invalid node. */

function write582Err002() {
    var item = MonitoredItem.fromSettings( "/Advanced/NodeIds/Invalid/UnknownNodeId1" )[0];
    item.Value.Value.setDouble( 13.523 );
    return( WriteHelper.Execute( { NodesToWrite: item, OperationResults: new ExpectedAndAcceptedResults( [ StatusCode.BadNodeIdInvalid, StatusCode.BadNodeIdUnknown ] ), ReadVerification: false } ) );
}

Test.Execute( { Procedure: write582Err002 } );