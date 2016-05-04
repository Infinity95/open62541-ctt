function ReadBrowseNameOfUnregisteredNode( Session, nodeId ) {
    var request = new UaReadRequest();
    var response = new UaReadResponse();
    Session.buildRequestHeader( request.RequestHeader );
    request.NodesToRead[0].NodeId = nodeId;
    request.NodesToRead[0].AttributeId = Attribute.BrowseName;
    var uaStatus = Session.read( request, response );
    if( !uaStatus.isGood() ) addError( "Read() status " + uaStatus, uaStatus );
    else if( !response.ResponseHeader.ServiceResult.isGood() ) addError( "Read of unregistered NodeId Service Result is not good: " + response.ResponseHeader.ServiceResult, response.ResponseHeader.ServiceResult );
    else if( StatusCode.BadNodeIdUnknown !== response.Results[0].StatusCode.StatusCode ) addError( "Read of unregistered NodeId return wrong Result[0].StatusCode: " + response.Results[0].StatusCode, response.Results[0].StatusCode );
}

// the service is expected to succeed
// all operations are expected to succeed
function checkUnregisterNodesValidParameter( Session, request, response, originalNodeIds, suppressMessaging ) {
    var succeeded = true;
    // check in parameters
    if( !isDefined( suppressMessaging ) ) suppressMessaging = false;
    // If a registered NodeId differs from the original, try reading the BrowseName
    // using the now unregistered NodeId; the read should fail.
    for( var i=0; i<request.NodesToUnregister.length; i++ ) {
        if( originalNodeIds[i] !== null ) {
            if( !request.NodesToUnregister[i].equals( originalNodeIds[i] ) ) {
                ReadBrowseNameOfUnregisteredNode( Session, request.NodesToUnregister[i] );
            }
        }
    }
    return succeeded;
}