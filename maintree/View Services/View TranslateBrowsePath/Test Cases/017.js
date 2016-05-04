/*    Test 5.4-2 applied to TranslateBrowsePathsToNodeIds (5.7.3) 
        prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given one starting node
            And the node does not exist
            And diagnostic info is not requested
          When TranslateBrowsePathsToNodeIds is called
          Then the server returns no diagnostic info. */

include( "./library/ClassBased/UaRequestHeader/5.4-002.js" );

function translate573gen002() {
    TestDiagnosticMaskZero( Test.Session.Session, TestTranslateBrowsePathsToNodeIdsOperationErrorDiagnosticMask );
    TestDiagnosticMaskZero( Test.Session.Session, TestTranslateBrowsePathsToNodeIdsServiceErrorDiagnosticMask );
    return( true );
}

Test.Execute( { Procedure: translate573gen002 } );