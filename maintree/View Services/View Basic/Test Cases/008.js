/*    Test 5.7.1-9 prepared by Dale Pope dale.pope@matrikon.com
      Description: Given 13 nodes to browse; And half the nodes exist; And half the nodes result in an operation error of some type
            And at least one node does not exist; And at least one referenceTypeId does not exist
          When Browse is called: Then the server returns references of the existent nodes; And appropriate status codes for the browse-failure nodes
          Validation is accomplished by first browsing each node individually, collecting the references, then browsing the nodes simultaneously and
          comparing these references to the first. "BadReferenceTypeIdInvalid" is expected because the NodeId specified is syntactically incorrect. */

function Test571009( returnDiagnostics ) {
    // check all of the nodeClass options are configured
    if( nodeClassItems.length !== Settings.ServerTest.NodeIds.NodeClasses.Settings.length ) {
        addWarning( "Some NodeClasses are not configured for testing. Please configure ALL NodeClass settings to maximize this test: '/Server Test/NodeIds/NodeClasses'." );
    }
    var invalidSettings = [
        "/Advanced/NodeIds/Invalid/UnknownNodeId1",
        "/Advanced/NodeIds/Invalid/UnknownNodeId2",
        "/Advanced/NodeIds/Invalid/UnknownNodeId3",
        "/Advanced/NodeIds/Invalid/InvalidSyntaxNodeId1",
        "/Advanced/NodeIds/Invalid/InvalidSyntaxNodeId2",
        ];

    var nodeIdsToBrowse = [];
    var expectedReferences = [];
    var expectedOperationResultsArray = [];

    // now to construct the nodes to browse, and the expected results
    for( var i=0; i<nodeClassItems.length; i++ ) {
        nodeIdsToBrowse.push( nodeClassItems[i].NodeId );
        expectedReferences.push( GetTest1ReferencesFromNodeId( Test.Session.Session, nodeClassItems[i].NodeId ) );
        expectedOperationResultsArray.push( new ExpectedAndAcceptedResults( StatusCode.Good ) );
    }

    // now construct the nodes that should be invalid/non-existent
    // now to construct the nodes to browse, and the expected results
    for( var i=0; i<invalidSettings.length; i++ ) {
        var currNode = UaNodeId.fromString( readSetting( invalidSettings[i] ).toString() );
        if( isDefined( currNode ) ) {
            nodeIdsToBrowse.push( currNode );
            // set expected status codes
            var expectedOpResults = new ExpectedAndAcceptedResults( [ StatusCode.BadNodeIdUnknown, StatusCode.BadNodeIdInvalid ] );
            if( i >= 3 ) {
                expectedOpResults.addExpectedResult( StatusCode.BadReferenceTypeIdInvalid );
            }
            expectedOperationResultsArray.push( expectedOpResults );
            expectedReferences.push( [] );
        }
    }   

    // make request and browse
    var request = CreateTest1BrowseRequests( Test.Session.Session, nodeIdsToBrowse );
    var lastItem = nodeIdsToBrowse.length - 1;
    request.NodesToBrowse[lastItem].NodeId = request.NodesToBrowse[0].NodeId;
    request.NodesToBrowse[lastItem].ReferenceTypeId = UaNodeId.fromString( readSetting( "/Advanced/NodeIds/Invalid/UnknownNodeId1" ).toString() );
    request.RequestHeader.ReturnDiagnostics = returnDiagnostics;
    var response = new UaBrowseResponse();

    uaStatus = Test.Session.Session.browse( request, response );

    var references = [];

    // check result
    if( uaStatus.isGood() ) {
        AssertBrowseMixedParameter( request, response, expectedOperationResultsArray );
        // compare expected references to returned references
        if( Assert.Equal( request.NodesToBrowse.length, response.Results.length, "The number of NodesToBrowse does not match the number of Results." ) ) {
            for( var i=0; i<response.Results.length; i++ ) {
                if( isDefined( expectedReferences[i] ) && expectedReferences[i].length > 0 ) {
                    AssertResultHasExpectedReferences( expectedReferences[i], response.Results[i], expectedReferences[i].length )
                }
            }
        }
    }
    else {
        addError( "Browse() failed: " + uaStatus, uaStatus );
    }
}

function test008(){ 
    Test571009( 0 );
    Test571009( 0x3FF );
    return( true );
}

Test.Execute( { Procedure: test008 } );