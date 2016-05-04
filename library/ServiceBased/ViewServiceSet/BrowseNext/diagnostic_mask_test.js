// generate an operation error and validate diagnostics
function TestBrowseNextOperationErrorDiagnosticMask( Session, returnDiagnosticMask ) {
    addLog( "Testing BrowseNext operation error with RequestHeader.ReturnDiagnostics = " + returnDiagnosticMask );
    var request = CreateDefaultBrowseNextRequest( Session );
    request.ContinuationPoints[0] = new UaByteString( "NotReal" );
    var response = new UaBrowseNextResponse();
    request.RequestHeader.ReturnDiagnostics = returnDiagnosticMask;
    var uaStatus = Session.browseNext( request, response );
    // check result
    if( uaStatus.isGood() ) UaResponseHeader.IsValid( { Service: { Name: "BrowseNext", Request: request, Response: response }, ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadContinuationPointInvalid ) } );
    else addError( "BrowseNext() status " + uaStatus, uaStatus );
}


// generate service error and validate diagnostics
function TestBrowseNextServiceErrorDiagnosticMask( Session, returnDiagnosticMask ) {
    print( "Testing BrowseNext service error with RequestHeader.ReturnDiagnostics = " + returnDiagnosticMask );
    var request = new UaBrowseNextRequest();
    var response = new UaBrowseNextResponse();
    Session.buildRequestHeader( request.RequestHeader );
    request.RequestHeader.ReturnDiagnostics = returnDiagnosticMask;
    var uaStatus = Session.browseNext( request, response );
    // check result
    if( uaStatus.isGood() ) UaResponseHeader.IsValid( { Service: { Name: "BrowseNext", Request: request, Response: response }, ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadNothingToDo ) } );
    else addError( "BrowseNext() status " + uaStatus, uaStatus );
}