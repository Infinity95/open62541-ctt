/*    Test 5.7.1-Err-9 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given an empty list of NodesToBrowes[]
          When Browse is called
          Then the server returns service result Bad_NothingToDo */

function TestBrowseNoNodes( returnDiagnostics ) {
    var request = new UaBrowseRequest();
    var response = new UaBrowseResponse();
    Test.Session.Session.buildRequestHeader( request.RequestHeader );
    request.RequestHeader.ReturnDiagnostics = returnDiagnostics;
    // NodesToBrowse[] defaults to be empty, so we can move on
    var uaStatus = Test.Session.Session.browse( request, response );
    // check result
    if( uaStatus.isGood() ) UaResponseHeader.IsValid( { Service: { Name: "Browse", Request: request, Response: response }, ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadNothingToDo ) } );
    else addError( "browse() failed", uaStatus );
}

function err008() {
    TestBrowseNoNodes( 0 );
    TestBrowseNoNodes( 0x3ff );
    return( true );
}

Test.Execute( { Procedure: err008 } );