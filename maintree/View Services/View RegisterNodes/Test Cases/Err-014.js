/*    Test 5.4-Err-4 applied to UnregisterNodes (5.7.5) 
        prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given a RequestHeader.Timestamp of 0
          When UnregisterNodes is called
          Then the server returns service error Bad_InvalidTimestamp */

include( "./library/ClassBased/UaRequestHeader/5.4-Err-004.js" );

function Test575GenErr004UnregisterNodes( request, response ) {
    return Test.Session.Session.unregisterNodes( request, response );
}

function Test575GenErr004Assert( request, response, expectedServiceResult ) {
    return( UaResponseHeader.IsValid( { Service: { Name: "RegisterNodes", Request: request, Response: response }, ServiceResult: expectedServiceResult } ) );
}

function Test575GenErr004() {
    var nodesToUnregister = GetMultipleUniqueNodeIds( 1 );
    var request = CreateDefaultUnregisterNodesRequest( Test.Session.Session );
    var response = new UaUnregisterNodesResponse();
    for( var i = 0; i < nodesToUnregister.length; i++ ) request.NodesToUnregister[i] = nodesToUnregister[i];
    TestInvalidRequestHeaderTimestamp( Test575GenErr004UnregisterNodes, Test575GenErr004Assert, request, response );
    return( true );
}

Test.Execute( { Procedure: Test575GenErr004 } );