/*    Test 5.4-Err-3 applied to RegisterNodes (5.7.5) 
        prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given a non-existent authenticationToken
          When UnregisterNodes is called
          Then the server returns service error Bad_SecurityChecksFailed */

include( "./library/ClassBased/UaRequestHeader/5.4-Err-003.js" );

function Test575GenErr003UnregisterNodes( request, response ) {
    return Test.Session.Session.unregisterNodes( request, response );
}

function Test575GenErr003Assert( request, response, expectedServiceResult ) {
    return( UaResponseHeader.IsValid( { Service: { Name: "RegisterNodes", Request: request, Response: response }, ServiceResult: expectedServiceResult } ) );
}

function Test575GenErr003() {
    var nodesToUnregister = GetMultipleUniqueNodeIds( 1 );
    var request = CreateDefaultUnregisterNodesRequest( Test.Session.Session );
    var response = new UaUnregisterNodesResponse();
    for( var i = 0; i < nodesToUnregister.length; i++ ) request.NodesToUnregister[i] = nodesToUnregister[i];
    TestNonexistentAuthenticationToken( Test575GenErr003UnregisterNodes, Test575GenErr003Assert, request, response );
    return( true );
}

Test.Execute( { Procedure: Test575GenErr003 } );