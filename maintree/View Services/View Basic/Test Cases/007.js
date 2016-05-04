/*    Test 5.7.1-8 prepared by Dale Pope dale.pope@matrikon.com
      Description: Given multiple nodes to browse; When Browse is called; Then the server returns each nodes references
          Validation is accomplished by first browsing each node individually, collecting the references, then browsing the nodes simultaneously and
          comparing these references to the first.*/

function Test571008( returnDiagnostics ) {
    if( nodeClassItems.length !== Settings.ServerTest.NodeIds.NodeClasses.Settings.length ) addWarning( "Some NodeClasses are not configured and will not be tested by this script." );
    var expectedReferences = [];
    var references = [];
    // Browse each node individually
    for( var i=0; i<nodesToBrowse.length; i++ ) expectedReferences[i] = GetTest1ReferencesFromNodeId( Test.Session.Session, nodesToBrowse[i] );
    // make request and browse
    var request = CreateTest1BrowseRequests( Test.Session.Session, nodesToBrowse );
    var response = new UaBrowseResponse();
    request.RequestHeader.ReturnDiagnostics = returnDiagnostics;
    uaStatus = Test.Session.Session.browse( request, response );
   
    // check result
    if( uaStatus.isGood() ) {
        AssertBrowseValidParameter( request, response );

        // compare expected references to returned references
        if( Assert.Equal( request.NodesToBrowse.length, response.Results.length, "The number of NodesToBrowse does not match the number of Results." ) ) {
            for( var i=0; i<response.Results.length; i++ ) {
                AssertResultHasExpectedReferences( expectedReferences[i], response.Results[i], expectedReferences[i].length )
            }
        }
    }
    else {
        addError( "Browse() failed: " + uaStatus, uaStatus );
    }
}

function test571008core() {
    // check the nodesToBrowse
    if( nodesToBrowse === undefined || nodesToBrowse === null || nodesToBrowse.length === 0 ) {
        addSkipped( "[Configuration Issue?] Unable to complete test. Check settings 'NodeClasses' category." );
        return( false );
    }
    Test571008( 0 );
    Test571008( 0x3FF );
    return( true );
}

Test.Execute( { Procedure: test571008core } );