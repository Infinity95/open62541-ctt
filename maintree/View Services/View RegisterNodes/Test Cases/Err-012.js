/*    Test 5.4-Err-2 applied to UnregisterNodes (5.7.5) 
        prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given an empty/null authenticationToken
          When UnregisterNodes is called
          Then the server returns service error Bad_SecurityChecksFailed */

include( "./library/ClassBased/UaRequestHeader/5.4-Err-002.js" );

function Test575GenErr002Unregister( request, response ) {
    return Test.Session.Session.unregisterNodes( request, response );
}

function Test575GenErr002Assert( request, response, expectedServiceResult ) {
    return( UaResponseHeader.IsValid( { Service: { Name: "RegisterNodes", Request: request, Response: response }, ServiceResult: expectedServiceResult } ) );
}

function Test575GenErr002() {
    var nodesToUnregister = GetMultipleUniqueNodeIds( 1 );
    var request = CreateDefaultUnregisterNodesRequest( Test.Session.Session );
    var response = new UaUnregisterNodesResponse();
    for( var i = 0; i < nodesToUnregister.length; i++ ) request.NodesToUnregister[i] = nodesToUnregister[i];
    TestNullAuthenticationToken( Test575GenErr002Unregister, Test575GenErr002Assert, request, response );
    return( true );
}

Test.Execute( { Procedure: Test575GenErr002 } );