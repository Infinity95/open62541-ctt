/*    Test 5.4-1 applied to TranslateBrowsePathsToNodeIds (5.7.3) 
        prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given one starting node
            And the node does not exist
            And diagnostic info is requested
          When TranslateBrowsePathsToNodeIds is called
          Then the server returns specified operation diagnostic info */

include( "./library/ClassBased/UaRequestHeader/5.4-001.js" );

function translate573gen001() {
    TestDiagnosticMasks( Test.Session.Session, TestTranslateBrowsePathsToNodeIdsOperationErrorDiagnosticMask );
    TestDiagnosticMasks( Test.Session.Session, TestTranslateBrowsePathsToNodeIdsServiceErrorDiagnosticMask );
    return( true );
}

Test.Execute( { Procedure: translate573gen001 } );