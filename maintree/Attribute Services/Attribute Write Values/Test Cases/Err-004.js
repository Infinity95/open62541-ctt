/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to a valid attributes (DisplayName, Value) of multiple unknown nodes, in a single call. */

function write582Err010() {
    // define the nodeIds we're going to read from the settings
    var items = MonitoredItem.fromSettings( [
        "/Advanced/NodeIds/Invalid/UnknownNodeId1",
        "/Advanced/NodeIds/Invalid/UnknownNodeId2",
        "/Advanced/NodeIds/Invalid/UnknownNodeId3",
        "/Advanced/NodeIds/Invalid/UnknownNodeId4",
        ] );
    var allItems = [];

    var errorsExpected = [];

    // --------------< UNKNOWN SYNTAX NODE >---------------------
    for( var i=0; i<items.length; i++ ) {
        items[i].Value.Value.setInt16( 100 );
        errorsExpected.push( new ExpectedAndAcceptedResults( [ StatusCode.BadNodeIdInvalid, StatusCode.BadNodeIdUnknown ] ) );
        allItems.push( items[i] );

        // write to the DisplayName
        var item2 = items[i].clone();
        item2.AttributeId = Attribute.DisplayName;
        item2.Value.Value.setString( "display #1" );
        allItems.push( item2 );

        // prepare our expected error
        errorsExpected.push( new ExpectedAndAcceptedResults( [ StatusCode.BadNodeIdInvalid, StatusCode.BadNodeIdUnknown ] ) );
    }
    return( WriteHelper.Execute( { NodesToWrite: allItems, OperationResults: errorsExpected, ReadVerification: false } ) );
}

Test.Execute( { Procedure: write582Err010 } );