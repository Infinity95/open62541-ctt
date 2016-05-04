/*    Test 5.7.3-3 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given one existent starting node
            And 10 relativePath elements
            And the relativePath nodes exist
          When TranslateBrowsePathsToNodeIds is called
          Then the server returns the NodeId of the last relativePath element
          Validation is accomplished by comparing the returned NodeId against
          an expected NodeId stored in settings. */

function test573003() {
    var maxDepth = parseInt(readSetting( "/Server Test/NodeIds/Paths/Max Depth" ).toString());
    TestTranslateBrowsePathsToNodeIdsBasic( Test.Session.Session, "/Server Test/NodeIds/Paths/Starting Node 1", maxDepth );
    return( true );
}

Test.Execute( { Procedure: test573003 } );