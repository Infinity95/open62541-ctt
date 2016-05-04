/*    Test 5.4-2 applied to UnregisterNodes (5.7.5) 
        prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given no NodesToUnregister
            And diagnostic info is not requested
          When UnregisterNodes is called
          Then the server returns specified service diagnostic info */

include( "./library/ServiceBased/ViewServiceSet/UnregisterNodes/diagnostic_mask_test.js" );
include( "./library/ClassBased/UaRequestHeader/5.4-002.js" );

TestDiagnosticMaskZero( Test.Session.Session, TestUnregisterNodesServiceErrorDiagnosticMask );