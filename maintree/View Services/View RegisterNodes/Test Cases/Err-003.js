/*    Test 5.7.4-Err-3 prepared by Dale Pope dale.pope@matrikon.com
      Description: Given one node; And the node does not exist; When RegisterNodes is called; Then the server returns the NodeId */

include( "./library/Base/array.js" );

function Test574Err003( nodeIdSetting ) {
    var maxLength = 1;
    var nodesToRegister = [];
    AddNodeIdSettingToUniqueArray( nodesToRegister, nodeIdSetting, maxLength );
    addLog( "Registering one non-existent node: " + nodesToRegister[0] );
    if( nodesToRegister.length !== maxLength ) {
        addError( "Test cannot be completed: found " + nodesToRegister.length + " unique NodeIds of a required " + maxLength );
        return( false );
    }
    var request = CreateDefaultRegisterNodesRequest( Test.Session.Session );
    var response = new UaRegisterNodesResponse();
    for( var i = 0; i < nodesToRegister.length; i++ ) {
        request.NodesToRegister[i] = nodesToRegister[i];
    }
    var uaStatus = Test.Session.Session.registerNodes( request, response );
    // check result
    if( uaStatus.isGood() ) {
        assertRegisterNodesSuccess( Test.Session.Session, request, response, false );
        UnregisterTestedNodes( Test.Session.Session, response.RegisteredNodeIds );
    }
    else {
        addError( "RegisterNodes() returned failed: " + uaStatus, uaStatus );
    }
}

function err003() {
    Test574Err003( "/Advanced/NodeIds/Invalid/UnknownNodeId1" );
    Test574Err003( "/Advanced/NodeIds/Invalid/UnknownNodeId2" );
    Test574Err003( "/Advanced/NodeIds/Invalid/UnknownNodeId3" );
    Test574Err003( "/Advanced/NodeIds/Invalid/UnknownNodeId4" );
    Test574Err003( "/Advanced/NodeIds/Invalid/UnknownNodeId5" );
    return( true );
}

Test.Execute( { Procedure: err003 } );