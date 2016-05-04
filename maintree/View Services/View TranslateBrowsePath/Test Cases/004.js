/*    Test 5.7.3-4 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given one existent starting node
            And one relativePath element
            And the relativePath element's IsInverse = true
            And the relativePath nodes exist
          When TranslateBrowsePathsToNodeIds is called
          Then the server returns the NodeId of the relativePath element
          Validation is accomplished by comparing the returned NodeId against
          an expected NodeId stored in settings. */

function translate573004() {
    TestTranslateBrowsePathsToNodeIdsInverse( Test.Session.Session, "/Server Test/NodeIds/Paths/Starting Node 1", 1 );
    return( true );
}

Test.Execute( { Procedure: translate573004 } );