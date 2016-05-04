/*    Test 5.7.4-Err-4 prepared by Dale Pope dale.pope@matrikon.com
      Description: Given 500 nodes; And the nodes do not exist; When RegisterNodes is called; Then the server returns the NodeIds */

include( "./library/Base/array.js" );

function Test574Err004() {
    var maxLength = 500;
    var nodeToRegister = UaNodeId.fromString( readSetting( "/Advanced/NodeIds/Invalid/UnknownNodeId2" ).toString() );
    addLog( "Registering " + maxLength + " non-existent nodes" );
    var request = CreateDefaultRegisterNodesRequest( Test.Session.Session );
    var response = new UaRegisterNodesResponse();
    // add the node multiple times
    for( var i = 0; i < maxLength; i++ ) {
        request.NodesToRegister[i] = nodeToRegister;
    }
    var uaStatus = Test.Session.Session.registerNodes( request, response );
    // check result (could be Good or Bad_TooManyOperations)
    if( uaStatus.isGood() ) {
        if( response.ResponseHeader.ServiceResult.isGood() ) {
            assertRegisterNodesSuccess( Test.Session.Session, request, response, false );
            UnregisterTestedNodes( Test.Session.Session, response.RegisteredNodeIds );
        }
        else {
            var ExpectedServiceResult = new ExpectedAndAcceptedResults( StatusCode.BadTooManyOperations );
            checkRegisterNodesFailed( request, response, ExpectedServiceResult );
        }
    }
    else {
        addError( "registerNodes() returned failed", uaStatus );
    }
    return( false );
}

Test.Execute( { Procedure: Test574Err004 } );