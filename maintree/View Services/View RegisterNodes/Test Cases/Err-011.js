/*    Test 5.7.5-Err-2 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given an empty list of nodesToUnregister[]
          When UnregisterNodes is called
          Then the server returns service result Bad_NothingToDo */

function UnregisterNoNodes( returnDiagnostics ) {
    var request = new UaUnregisterNodesRequest();
    var response = new UaUnregisterNodesResponse();
    Test.Session.Session.buildRequestHeader( request.RequestHeader );
    request.RequestHeader.ReturnDiagnostics = returnDiagnostics;
    var uaStatus = Test.Session.Session.unregisterNodes( request, response );
    if( uaStatus.isGood() ) UaResponseHeader.IsValid( { Service: { Name: "RegisterNodes", Request: request, Response: response }, ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadNothingToDo ) } );
    else addError( "unregisterNodes() failed", uaStatus );
}

function testerr011() { 
    UnregisterNoNodes( 0 );
    UnregisterNoNodes( 0x3ff );
    return( true );
}

Test.Execute( { Procedure: testerr011 } );