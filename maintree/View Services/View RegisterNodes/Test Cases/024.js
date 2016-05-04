/*    Test 5.4-1 applied to UnregisterNodes (5.7.5) prepared by Dale Pope dale.pope@matrikon.com
      Description: Given no NodesToUnregister; And diagnostic info is requested; When UnregisterNodes is called;
          Then the server returns specified service diagnostic info */

include( "./library/ServiceBased/ViewServiceSet/UnregisterNodes/diagnostic_mask_test.js" );
include( "./library/ClassBased/UaRequestHeader/5.4-001.js" );

function test024() {
    TestDiagnosticMasks( Test.Session.Session, TestUnregisterNodesServiceErrorDiagnosticMask );
    return( true );
}

Test.Execute( { Procedure: test024 } );