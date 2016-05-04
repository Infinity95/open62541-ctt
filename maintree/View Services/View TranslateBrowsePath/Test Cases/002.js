/*    Test 5.7.3-2 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given one existent starting node
            And four relativePath elements
            And the relativePath nodes exist
          When TranslateBrowsePathsToNodeIds is called
          Then the server returns the NodeId of the last relativePath element
          Validation is accomplished by comparing the returned NodeId against
          an expected NodeId stored in settings. */

function translate573002() {
    TestTranslateBrowsePathsToNodeIdsBasic( Test.Session.Session, "/Server Test/NodeIds/Paths/Starting Node 1", 4 );
    return( true );
}

Test.Execute( { Procedure: translate573002 } );