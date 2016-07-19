/*    Test 5.7.4-6 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given one node repeated multiple times in nodesToRegister[]
            And the node exists
          When RegisterNodes is called
          Then the server returns nodes that refer to the given node
            (note: the returned nodeIds can be identical to the passed nodeIds or can be different) */

Test.Execute( { Procedure: function test() {
    var maxLength = 20;
    addLog( "Registering the same node " + maxLength + " times" );
    var request = CreateDefaultRegisterNodesRequest( Test.Session.Session );
    var response = new UaRegisterNodesResponse();
    var nodeToRegister = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings )[0];
    // add the node multiple times
    for( var i = 0; i < maxLength; i++ ) request.NodesToRegister[i] = nodeToRegister.NodeId;
    // invoke the call
    var uaStatus = Test.Session.Session.registerNodes( request, response );
    if( uaStatus.isGood() ) {
        assertRegisterNodesSuccess( Test.Session.Session, request, response );
        UnregisterTestedNodes( Test.Session.Session, response.RegisteredNodeIds );
    }
    else addError( "registerNodes() failed", uaStatus );
    return( true );
} } );