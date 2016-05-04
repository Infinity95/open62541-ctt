/*    Test 5.7.2-Err-3 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given one node to browse
            And the node exists
            And the node has at least three forward references
            And RequestedMaxReferencesPerNode is 1
            And Browse has been called
            And BrowseNext has been called
            And ReleaseContinuationPoints was true
          When BrowseNext is called
            And ContinuationPoint is as from Browse result
          Then the server returns operation result Bad_ContinuationPointInvalid. */

include( "./library/ServiceBased/ViewServiceSet/BrowseNext/release_continuationpoints_test.js" );

function Test572Err3( returnDiagnostics ) {
    // BrowseNext with ReleaseContinuationPoints = true (when more references exist)
    var firstResponse = TestBrowseNextWhenMoreReferencesExist( Test.Session.Session, true );
    if( firstResponse === -1 || firstResponse === undefined ) {
        return( false );
    }
    // BowseNext with old ContinuationPoint
    var request = CreateDefaultBrowseNextRequest( Test.Session.Session );
    var response = new UaBrowseNextResponse();
    request.RequestHeader.ReturnDiagnostics = returnDiagnostics;
    request.ContinuationPoints[0] = firstResponse[0].Results[0].ContinuationPoint;
    var uaStatus = Test.Session.Session.browseNext( request, response );
    // check result
    if( uaStatus.isGood() ) {
        var expectedOperationResultsArray = [1];
        expectedOperationResultsArray[0] = new ExpectedAndAcceptedResults();
        expectedOperationResultsArray[0].addExpectedResult( StatusCode.BadContinuationPointInvalid );
        checkBrowseNextError( request, response, expectedOperationResultsArray );
    }
    else {
        addError( "browseNext() failed", uaStatus );
    }
}

function browseNext572err003() {
    Test572Err3( 0 );
    Test572Err3( 0x3ff );
    return( true );
}

Test.Execute( { Procedure: browseNext572err003 } );