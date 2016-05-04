/*    Test 5.7.3-15 prepared by Dale Pope dale.pope@matrikon.com
      Description: Given one existent starting node; And one relativePath element; And the relativePath element's IncludeSubtypes = true
            And the relativePath element's ReferenceTypeId is a "grandparent" of the target node's type; And the relativePath nodes exist
          When TranslateBrowsePathsToNodeIds is called; Then the server returns the NodeId of the relativePath element
          Validation is accomplished by comparing the returned NodeId against an expected NodeId stored in settings. */
 
function Test573015( startingNodeSetting, pathLength ) {
    var startingNodeId = UaNodeId.fromString( readSetting( startingNodeSetting ).toString() );
    // use Browse to find browseNames, referenceTypeIds, and targetNode
    var pathToBrowse = BrowseToDepth( Test.Session.Session, startingNodeId, BrowseDirection.Forward, pathLength, [] );
    if( pathToBrowse === null ) {
        addSkipped( "Unable to obtain a path to Browse for the first part of this test. Can't test TranslateBrowsePathsToNodeIds." );
        return( false );
    }
    Assert.Equal( pathLength, pathToBrowse.browseNames.length, "Test cannot be completed: could not create a TranslateBrowsePathsToNodeIds test of the required length from StartingNode " + startingNodeSetting );
    // get parent and then the parent's paent
    for( var i = 0; i < pathToBrowse.referenceTypeIds.length; i++ ) pathToBrowse.referenceTypeIds[i] = GetReferenceTypeFirstParent( Test.Session.Session, pathToBrowse.referenceTypeIds[i] );

    pathToBrowse.addLog( startingNodeSetting, startingNodeId );
    TestTranslateBrowsePathsToNodeIdsIncludeSubtypes( Test.Session.Session, 
        startingNodeId,
        pathToBrowse.browseNames,
        pathToBrowse.referenceTypeIds,
        pathToBrowse.targetNodeId,
        pathLength
    );
}

function Test573015Wrapper() {
    // test with one relativePath elements
    Test573015( "/Server Test/NodeIds/Paths/Starting Node 1", 1 );
    // test with four relativePath elements
    Test573015( "/Server Test/NodeIds/Paths/Starting Node 1", 4 );
    return( true );
}

Test.Execute( { Procedure: Test573015Wrapper } );