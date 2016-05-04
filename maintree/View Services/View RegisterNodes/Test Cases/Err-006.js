/*    Test 5.7.4-Err-6 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
      Description: Specify a mix of valid and invalid nodeIds */

function Test574Err006() {
    var request = CreateDefaultRegisterNodesRequest( Test.Session.Session );
    var response = new UaRegisterNodesResponse();
    request.NodesToRegister[0] = UaNodeId.fromString( readSetting( "/Advanced/NodeIds/Invalid/InvalidSyntaxNodeId1" ).toString() );
    request.NodesToRegister[1] = NodeIdSettings.GetScalarStaticNodeIds(1)[0];
    var uaStatus = Test.Session.Session.registerNodes( request, response );
    addLog( "RegisterNodes() registering 1 valid, and 1 invalid node. Result: " + uaStatus );
    // check result, should be Good.
    if( uaStatus.isGood() ) {
        if( Assert.Equal( StatusCode.Good, response.ResponseHeader.ServiceResult.StatusCode, "RegisterNodes() should have succeeded because the invalid node id that was specified within the 'nodesToRegister' collection was structurally OK." ) ) {
            // the call succeeded, so now we need to Unregister the node!
            var unRequest = new UaUnregisterNodesRequest();
            Test.Session.Session.buildRequestHeader( unRequest.RequestHeader );
            var unResponse = new UaUnregisterNodesResponse();
            for( var i=0; i<request.NodesToRegister.length; i++ ) unRequest.NodesToUnregister[i] = request.NodesToRegister[i];
            uaStatus = Test.Session.Session.unregisterNodes( unRequest, unResponse );
            addLog( "UnregisterNodes() unregistering the 1 invalid node, that should have failed previously!. Result: " + uaStatus );
        }
    }
    else addError( "registerNodes() returned failed", uaStatus );
    return( true );
}

Test.Execute( { Procedure: Test574Err006 } );