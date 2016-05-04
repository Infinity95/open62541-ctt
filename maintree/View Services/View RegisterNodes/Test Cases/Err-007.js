/*    Test 5.4-Err-2 applied to RegisterNodes (5.7.4) 
        prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given an empty/null authenticationToken
          When RegisterNodes is called
          Then the server returns service error Bad_SecurityChecksFailed */

include( "./library/ClassBased/UaRequestHeader/5.4-Err-002.js" );

function Test574GenErr002Register( request, response ) { 
    return Test.Session.Session.registerNodes( request, response ); 
}

function Test574GenErr002Assert( request, response, expectedServiceResult ) { 
    return( UaResponseHeader.IsValid( { Service: { Name: "RegisterNodes", Request: request, Response: response }, ServiceResult: expectedServiceResult } ) );
}

function Test574GenErr002() {
    var nodesToRegister = GetMultipleUniqueNodeIds( 1 );
    var request = CreateDefaultRegisterNodesRequest( Test.Session.Session );
    var response = new UaRegisterNodesResponse();
    for( var i=0; i<nodesToRegister.length; i++ ) request.NodesToRegister[i] = nodesToRegister[i];
    TestNullAuthenticationToken( Test574GenErr002Register, Test574GenErr002Assert, request, response );
    return( true );
}

Test.Execute( { Procedure: Test574GenErr002 } );