/*    Test 5.7.3-5 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given one existent starting node
            And one relativePath element
            And the relativePath element's IncludeSubtypes = true
            And the relativePath element's ReferenceTypeId is a parent of the target node's type
            And the relativePath nodes exist
          When TranslateBrowsePathsToNodeIds is called
          Then the server returns the NodeId of the relativePath element
          Validation is accomplished by comparing the returned NodeId against
          an expected NodeId stored in settings. */
 
function Test573005( startingNodeSetting, pathLength ) {
    var startingNodeId = UaNodeId.fromString( readSetting( startingNodeSetting ).toString() );
    // use Browse to find browseNames, referenceTypeIds, and targetNode
    var pathToBrowse = BrowseToDepth( Test.Session.Session, startingNodeId, BrowseDirection.Forward, pathLength, [] );
    if( !Assert.StringNotNullOrEmpty( pathToBrowse, "Test cannot be completed: could not browse any references from StartingNode " + startingNodeSetting ) ) {
        return( false );
    }
    Assert.Equal( pathLength, pathToBrowse.browseNames.length, "Test cannot be completed: could not create a TranslateBrowsePathsToNodeIds test of the required length from StartingNode " + startingNodeSetting );
    // look up parents of the exact referenceTypeIds
    for( var i = 0; i < pathToBrowse.referenceTypeIds.length; i++ ) {
        pathToBrowse.referenceTypeIds[i] = GetReferenceTypeFirstParent( Test.Session.Session, pathToBrowse.referenceTypeIds[i] );
    }
    pathToBrowse.addLog( startingNodeSetting, startingNodeId );
    TestTranslateBrowsePathsToNodeIdsIncludeSubtypes( Test.Session.Session, startingNodeId, pathToBrowse.browseNames, pathToBrowse.referenceTypeIds, pathToBrowse.targetNodeId, pathLength );
}

function translate573005Wrapper() {
    // test with one relativePath elements
    Test573005( "/Server Test/NodeIds/Paths/Starting Node 1", 1 );
    // test with four relativePath elements
    Test573005( "/Server Test/NodeIds/Paths/Starting Node 1", 4 );
    return( true );
}

Test.Execute( { Procedure: translate573005Wrapper } );