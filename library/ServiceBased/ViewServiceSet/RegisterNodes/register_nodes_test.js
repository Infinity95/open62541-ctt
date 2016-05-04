include( "./library/ServiceBased/ViewServiceSet/Browse/get_references.js" );

function UnregisterTestedNodes( Session, nodesToUnregister ) {
    var request = CreateDefaultUnregisterNodesRequest( Session );
    var response = new UaUnregisterNodesResponse();
    // add the nodes
    for( var i = 0; i < nodesToUnregister.length; i++ ) request.NodesToUnregister[i] = nodesToUnregister[i];
    Session.unregisterNodes( request, response );
}

function TestRegisterNodes( Session, nodesToRegister, returnDiagnostics ) {
    print( "Registering " + nodesToRegister.length + " nodes" );
    var request = CreateDefaultRegisterNodesRequest( Session );
    var response = new UaRegisterNodesResponse();
    request.RequestHeader.ReturnDiagnostics = returnDiagnostics;

    // add the nodes
    for( var i = 0; i < nodesToRegister.length; i++ ) request.NodesToRegister[i] = nodesToRegister[i];
    
    var uaStatus = Session.registerNodes( request, response );
    if( uaStatus.isGood() ) {
        assertRegisterNodesSuccess( Session, request, response );
        UnregisterTestedNodes( Session, response.RegisteredNodeIds );
    }
    else addError( "RegisterNodes() status " + uaStatus, uaStatus );
}


// Browse from the nodesToBrowse for additional unique NodeIds.
// NodeIds are appended to nodesToBrowse, which means the new
// NodeIds will eventually be browsed as well (effectively
// browsing the entire model).
// nodesToBrowse will not exceed maxLength.
function BrowseForUniqueNodeIds( Session, nodesToBrowse, maxLength ) {
    for( var i = 0; ( i < nodesToBrowse.length ) && ( nodesToBrowse.length < maxLength ); i++ ) {
        var references = GetTest1ReferencesFromNodeId( Session, nodesToBrowse[i] );
        for( var j = 0; ( j < references.length ) && ( nodesToBrowse.length < maxLength ); j++ ) AddUniqueNodeIdToArray( nodesToBrowse, references[j].NodeId.NodeId );
    }
}


function TestRegisterMultipleNodes( Session, maxLength, returnDiagnostics ) {
    var nodesToRegister = GetMultipleUniqueNodeIds( maxLength );
    if( nodesToRegister.length !== maxLength ) {
        print( "Found " + nodesToRegister.length + " unique NodeIds in settings" );
        print( "Require " + maxLength + " unique NodeIds; attempting to browse for more" );
        // Try browsing the current nodesToRegister to find more nodes.
        BrowseForUniqueNodeIds( Session, nodesToRegister, maxLength );
        if( nodesToRegister.length === maxLength ) addLog( "Successfully found " + nodesToRegister.length + " unique nodes" );
        else {
            addSkipped( "Test cannot be completed: found " + nodesToRegister.length + " unique NodeIds of a requred " + maxLength );
            return;
        }
    }
    TestRegisterNodes( Session, nodesToRegister, returnDiagnostics );
}