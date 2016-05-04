/*    Test 5.7.3-Err-1 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given one invalid starting node
            And one relativePath element
            And the relativePath nodes exist
          When TranslateBrowsePathsToNodeIds is called
          Then the server returns operation result Bad_NodeIdInvalid. */

// Test translate a NodeId of invalid syntax.
function TestTranslateOneInvalidSyntaxNodeId( invalidStartingNodeSetting, returnDiagnostics ) {
    var goodStartingNodeSetting = "/Server Test/NodeIds/Paths/Starting Node 1";
    var goodStartingNodeId = UaNodeId.fromString( readSetting( goodStartingNodeSetting ).toString() );
    if( goodStartingNodeId === undefined || goodStartingNodeId === null ) {
        addSkipped( "[Configuration Issue?] Unable to conduct test. Check setting '" + goodStartingNodeSetting + "'." );
        return( false );
    }
    var pathToBrowse = BrowseToDepth( Test.Session.Session, goodStartingNodeId, BrowseDirection.Forward, 1, [] );
    var invalidStartingNodeId = UaNodeId.fromString( readSetting( invalidStartingNodeSetting ).toString() );
    addLog( "Testing invalid starting node <" + invalidStartingNodeSetting +"> <" + invalidStartingNodeId + ">" );
    var request = CreateDefaultTranslateBrowsePathsToNodeIdsRequest( Test.Session.Session, [ invalidStartingNodeId ], [ pathToBrowse.browseNames ], [ pathToBrowse.referenceTypeIds ] );
    var response = new UaTranslateBrowsePathsToNodeIdsResponse();
    request.RequestHeader.ReturnDiagnostics = returnDiagnostics;
    var uaStatus = Test.Session.Session.translateBrowsePathsToNodeIds( request, response );
    // check result
    if( uaStatus.isGood() ) {
        var expectedOperationResultsArray = [1];
        expectedOperationResultsArray[0] = new ExpectedAndAcceptedResults();
        expectedOperationResultsArray[0].addExpectedResult( StatusCode.BadNodeIdInvalid );
        expectedOperationResultsArray[0].addExpectedResult( StatusCode.BadNodeIdUnknown );
        checkTranslateBrowsePathsToNodeIdsError( request, response, expectedOperationResultsArray );
    }
    else {
        addError( "browse() failed: " + uaStatus );
    }
}

function translate573err001() {
    var settings = Settings.Advanced.NodeIds.Invalid.Invalids;
    for( var s=0; s<settings.length; s++ ) {
        TestTranslateOneInvalidSyntaxNodeId( settings[s], 0 );
    }
    for( var s=0; s<settings.length; s++ ) {
        TestTranslateOneInvalidSyntaxNodeId( settings[s], 0x3ff );
    }
    return( true );
}

Test.Execute( { Procedure: translate573err001 } );