/*    Test 5.7.2-Err-1 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given an empty list of ContinuationPoints[]
          When BrowseNext is called
          Then the server returns service result Bad_NothingToDo */

function TestBrowseNextNoContinuationPoints( returnDiagnostics ) {
    var request = new UaBrowseNextRequest();
    var response = new UaBrowseNextResponse();
    Test.Session.Session.buildRequestHeader( request.RequestHeader );
    request.RequestHeader.ReturnDiagnostics = returnDiagnostics;
    var uaStatus = Test.Session.Session.browseNext( request, response );
    // check result
    if( uaStatus.isGood() ) UaResponseHeader.IsValid( { Service: { Name: "BrowseNext", Request: request, Response: response }, ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadNothingToDo ) } );
    else addError( "browseNext() failed", uaStatus );
}

function err014() {
    TestBrowseNextNoContinuationPoints( 0 );
    TestBrowseNextNoContinuationPoints( 0x3ff );
    return( true );
}

Test.Execute( { Procedure: err014 } );