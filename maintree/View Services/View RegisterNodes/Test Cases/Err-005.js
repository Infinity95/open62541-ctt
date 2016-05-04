/*    Test 5.7.4-Err-5 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
      Description: Specify an invalid node id. Expects success. */

function Test574Err005( ) {
    var request = CreateDefaultRegisterNodesRequest( Test.Session.Session );
    var response = new UaRegisterNodesResponse();
    request.NodesToRegister[0] = UaNodeId.fromString( readSetting( "/Advanced/NodeIds/Invalid/InvalidSyntaxNodeId1" ).toString() );
    request.NodesToRegister[1] = UaNodeId.fromString( readSetting( "/Advanced/NodeIds/Invalid/InvalidSyntaxNodeId2" ).toString() );
    var uaStatus = Test.Session.Session.registerNodes( request, response );
    addLog( "RegisterNodes() registering 1 invalid node. Result: " + uaStatus, uaStatus );
    // check result (could be Good or Bad_TooManyOperations)
    if( uaStatus.isGood() ) {
        if( Assert.Equal( StatusCode.Good, response.ResponseHeader.ServiceResult.StatusCode, "RegisterNodes() should have succeeded because the invalid node id that was specified within the 'nodesToRegister' correctcollection is actually structurally ." ) ) {
            // the call succeeded, so now we need to Unregister the node!
            var unRequest = new UaUnregisterNodesRequest();
            Test.Session.Session.buildRequestHeader( unRequest.RequestHeader );
            var unResponse = new UaUnregisterNodesResponse();
            unRequest.NodesToUnregister[0] = request.NodesToRegister[0];
            unRequest.NodesToUnregister[1] = request.NodesToRegister[1];
            uaStatus = Test.Session.Session.unregisterNodes( unRequest, unResponse );
            addLog( "UnregisterNodes() unregistering the 1 invalid node, that should have failed previously!. Result: " + uaStatus, uaStatus );
        }
    }
    else {
        addError( "registerNodes() returned failed: " + uaStatus, uaStatus );
        return( false );
    }
    return( true );
}

Test.Execute( { Procedure: Test574Err005 } );