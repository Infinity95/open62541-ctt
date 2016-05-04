/*  Test prepared by Mark Rice; mrice@canarylabs.com
    Description: Read valid attributes (ids: 1, 3, 4) from a set of nodes containing valid nodes, non-existent nodes, and nodes with
        invalid node id syntaxes. Script verifies this by using globally defined variables to specify the invalid and non-existent nodes etc. */

function read581Err008() {
    var allItems = [];
    var goodNodes = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    var unknownNodes = MonitoredItem.fromSettings( Settings.Advanced.NodeIds.Invalid.Unknowns );
    var invalidNodes = MonitoredItem.fromSettings( Settings.Advanced.NodeIds.Invalid.Invalids );
    var attributesToRead = [ Attribute.NodeId, Attribute.BrowseName, Attribute.DisplayName ];

    // this is an array of ExpectedAndAcceptedResult. Size of the array = number of nodes to read
    var expectedResults = [];

    // prepare the good items with the attributes we want to read; read expected to succeed
    for( i=0; i<goodNodes.length; i++ ) {
        for( j=0; j<attributesToRead.length; j++) {
            var newItem = goodNodes[0].clone();
            newItem.AttributeId = attributesToRead[j];
            allItems.push( newItem );
            expectedResults.push( new ExpectedAndAcceptedResults( StatusCode.Good ) );
        }//for j..
    }//for i..
    // prepare the unknown nodes the same way; read expected to fail
    for( i=0; i<unknownNodes.length; i++ ) {
        for( j=0; j<attributesToRead.length; j++) {
            var newItem = unknownNodes[0].clone();
            newItem.AttributeId = attributesToRead[j];
            allItems.push( newItem );
            expectedResults.push( new ExpectedAndAcceptedResults( [ StatusCode.BadNodeIdInvalid, StatusCode.BadNodeIdUnknown ] ) );
        }//for j...
    }//for i...
    // prepare the invalid nodes the same way; read expected to fail
    for( i=0; i<invalidNodes.length; i++ ) {
        for( j=0; j<attributesToRead.length; j++) {
            var newItem = invalidNodes[0].clone();
            newItem.AttributeId = attributesToRead[j];
            allItems.push( newItem );
            expectedResults.push( new ExpectedAndAcceptedResults( [ StatusCode.BadNodeIdInvalid, StatusCode.BadNodeIdUnknown ] ) );
        }
    }
    return( ReadHelper.Execute( { NodesToRead: allItems, OperationResults: expectedResults } ) );
}

Test.Execute( { Procedure: read581Err008 } );