/*    Test 5.7.2-5 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given two nodes to browse
            And the nodes exist
            And each node has at least three forward references
            And RequestedMaxReferencesPerNode is 1
            And Browse has been called separately for each node
          When BrowseNext is called
          Then the server returns references for both nodes
            And ContinuationPoints for both nodes
          Validation is accomplished by first browsing all references on a node,
          then performing the test while comparing the appropriate references to the 
          references returned by each BrowseNext call. So this test only validates
          that Browse all references is consistent with Browse one reference
          followed by BrowseNexts. */

// Using an array of ContinuationPoints, built a BrowseNextRequest, call BrowseNext, and validate.
function BrowseNextFromContinuationPointsAndAssertReferencesMatch( Session, expectedReferences, referenceIndex, releaseContinuationPoints, continuationPoints ) {
    var request = CreateDefaultBrowseNextRequest( Session );
    // build request
    request.ReleaseContinuationPoints = releaseContinuationPoints;
    for( var i = 0; i < continuationPoints.length; i++ ) {
        request.ContinuationPoints[i] = continuationPoints[i];
    }
    return BrowseNextAndAssertReferencesMatch( Session, expectedReferences, referenceIndex, referenceIndex, request );
}

function TestBrowseNextOnCombinedNodes() {
    const SETTING1 = "/Server Test/NodeIds/References/Has 3 Forward References 1";
    const SETTING2 = "/Server Test/NodeIds/References/Has 3 Forward References 2";
    var i;
    var nodeIdsToBrowse = [
        UaNodeId.fromString( readSetting( SETTING1 ).toString() ),
        UaNodeId.fromString( readSetting( SETTING2 ).toString() )
    ];
    if( nodeIdsToBrowse === null || nodeIdsToBrowse[0] === null || nodeIdsToBrowse[1] === null ) {
        addSkipped( "Setting(s) not configured. Please check '" + SETTING1 + "' and '" + SETTING2 + "'." );
        return( false );
    }
    // get expected references
    var expectedReferences = GetDefaultReferencesFromNodeIds( Test.Session.Session, nodeIdsToBrowse );
    for( i = 0; i < expectedReferences.length; i++ ) {
        if( expectedReferences[i].length < 3 ) {
            addError( "Test cannot be completed: node does not have at least three references: " + nodeIdsToBrowse[i] );
            return( false );
        }
    }
    // Browse for first references
    var firstResponse1 = GetBrowseResponseForOneReference( Test.Session.Session, [ nodeIdsToBrowse[0] ] );
    if( firstResponse1 == -1 ) {
        return( false );
    }
    var firstResponse2 = GetBrowseResponseForOneReference( Test.Session.Session, [ nodeIdsToBrowse[1] ] );
    if( firstResponse2 == -1 ) {
        return( false );
    }
    var continuationPoints = [
        firstResponse1.Results[0].ContinuationPoint,
        firstResponse2.Results[0].ContinuationPoint
    ];
    // BrowseNext
    var response = BrowseNextFromContinuationPointsAndAssertReferencesMatch( Test.Session.Session, expectedReferences, 1, false, continuationPoints );
    // Validate that each ContinuationPoint is not empty
    var haveAllContinuationPoints = true;
    Assert.Equal( continuationPoints.length, response.Results.length, "Number of ContinuationPoints did not match number of Results" );
    for( i = 0; i < response.Results.length; i++ ) {
        var result = response.Results[i];       
        if( StatusCode.Good != result.StatusCode.StatusCode ) {
            addError( "StatusCode from BrowseNext is not Good when more references exist: " + result.StatusCode, result.StatusCode );
        }
        if( !Assert.False( result.ContinuationPoint.isEmpty(), "ContinuationPoint is empty when more references exist: " + result.ContinuationPoint ) ) {
            haveAllContinuationPoints = false;
        }
    }
    // BrowseNext again to validate ContinuationPoints were truly correct
    if( haveAllContinuationPoints ) {
        response = BrowseNextFromResponseAndAssertReferencesMatch( Test.Session.Session, expectedReferences, 2, 2, false, response.Results );
    }
    releaseContinuationPoints( Test.Session.Session, response );
    return( true );
}

Test.Execute( { Procedure: TestBrowseNextOnCombinedNodes } );