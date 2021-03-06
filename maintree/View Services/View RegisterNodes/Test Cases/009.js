/*    Test 5.4-1 applied to RegisterNodes (5.7.4) 
        prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given no NodesToRegister
            And diagnostic info is requested
          When RegisterNodes is called
          Then the server returns specified service diagnostic info */

include( "./library/ServiceBased/ViewServiceSet/RegisterNodes/diagnostic_mask_test.js" );
include( "./library/ClassBased/UaRequestHeader/5.4-001.js" );

function test009() {
    TestDiagnosticMasks( Test.Session.Session, TestRegisterNodesServiceErrorDiagnosticMask );
    return( true );
}

Test.Execute( { Procedure: test009 } );