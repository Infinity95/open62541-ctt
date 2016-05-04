/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to a single valid attribute for an invalid node. Operation level result is �Bad_NodeIdInvalid� or �Bad_NodeIdUnknown�. */

function write582Err006() {
    var items = MonitoredItem.fromSettings( Settings.Advanced.NodeIds.Invalid.Invalids );
    var errorsExpected = [];
    for( var i=0; i<items.length; i++ ) {
        items[i].Value.Value = new UaVariant();
        items[i].Value.Value.setDouble( 13.523 );
        errorsExpected[i] = new ExpectedAndAcceptedResults( [ StatusCode.BadNodeIdInvalid, StatusCode.BadNodeIdUnknown ] );
    }
    return( WriteHelper.Execute( { NodesToWrite: items, OperationResults: errorsExpected, ReadVerification: false } ) );
}

Test.Execute( { Procedure: write582Err006 } );