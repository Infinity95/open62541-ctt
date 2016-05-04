/*    Test 5.7.3-Err-3 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given no BrowsePath elements
          When TranslateBrowsePathsToNodeIds is called
          Then the server returns the service result Bad_NothingToDo */

function Test573Err003( returnDiagnostics ) {
    var request = new UaTranslateBrowsePathsToNodeIdsRequest();
    var response = new UaTranslateBrowsePathsToNodeIdsResponse();
    Test.Session.Session.buildRequestHeader( request.RequestHeader );
    request.RequestHeader.ReturnDiagnostics = returnDiagnostics;
    var uaStatus = Test.Session.Session.translateBrowsePathsToNodeIds( request, response );
    if( uaStatus.isGood() ) UaResponseHeader.IsValid( { Service: { Name: "TranslateBrowsePathsToNodeIds", Request: request, Response: response }, ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadNothingToDo ) } )
    else addError( "translateBrowsePathsToNodeIds() failed", uaStatus );
}

function translate573err003Wrapper() {
    Test573Err003( 0 );
    Test573Err003( 0x3ff );
    return( true );
}

Test.Execute( { Procedure: translate573err003Wrapper } );