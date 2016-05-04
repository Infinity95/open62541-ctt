/*    Test 5.4-Err-4 applied to RegisterNodes (5.7.4) 
        prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given a RequestHeader.Timestamp of 0
          When RegisterNodes is called
          Then the server returns service error Bad_InvalidTimestamp. */

include( "./library/ClassBased/UaRequestHeader/5.4-Err-004.js" );

function Test574GenErr004RegisterNodes( request, response ) {
    return Test.Session.Session.registerNodes( request, response );
}

function Test574GenErr004Assert( request, response, expectedServiceResult ) {
    return( UaResponseHeader.IsValid( { Service: { Name: "RegisterNodes", Request: request, Response: response }, ServiceResult: expectedServiceResult } ) );
}

function Test574GenErr004() {
    var nodesToRegister = GetMultipleUniqueNodeIds( 1 );
    var request = CreateDefaultRegisterNodesRequest( Test.Session.Session );
    var response = new UaRegisterNodesResponse();
    for( var i = 0; i < nodesToRegister.length; i++ ) request.NodesToRegister[i] = nodesToRegister[i];    
    TestInvalidRequestHeaderTimestamp( Test574GenErr004RegisterNodes, Test574GenErr004Assert, request, response );
    return( true );
}

Test.Execute( { Procedure: Test574GenErr004 } );
