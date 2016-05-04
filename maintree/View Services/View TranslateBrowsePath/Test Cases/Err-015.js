/*    Test 5.7.3-Err-15 prepared by Dale Pope dale.pope@matrikon.com
      Description: Given an existent starting node; And multiple RelativePath elements; And a RelativePath element has a ReferenceTypeId that 
                   is the parent of the reference's ReferenceType; And IncludeSubtypes is false; When TranslateBrowsePathsToNodeIds is called
                   Then the server returns operation result Bad_NoMatch. */

function Test573Err015() {
    // two tests: the last RelativePath has a non-existent ReferenceType,
    // and the second RelativePath has a non-existent ReferenceType
    // plus three tests: one for each non-existent NodeId setting
    var startingNodeSettings = [
        "/Server Test/NodeIds/Paths/Starting Node 1",
        "/Server Test/NodeIds/Paths/Starting Node 1",
        "/Server Test/NodeIds/Paths/Starting Node 1",
        "/Server Test/NodeIds/Paths/Starting Node 1"
    ];
    var settingValue = readSetting( startingNodeSettings[0] ).toString();
    if( settingValue === undefined || settingValue === null || settingValue === "" ) {
        addSkipped( "[Configuration Issue?] Unable to conduct test. Check setting '" + startingNodeSettings[0] + "'." );
        return( false );
    }
    var startingNodeIds = [];
    var expectedOperationResults = [];
    var i;
    for( i = 0; i < startingNodeSettings.length; i++ ) {
        startingNodeIds[i] = UaNodeId.fromString( readSetting( startingNodeSettings[i] ).toString() );
        expectedOperationResults[i] = new ExpectedAndAcceptedResults();
        expectedOperationResults[i].addExpectedResult( StatusCode.BadNoMatch ); 
    }
    var pathsToBrowse = [
        BrowseToDepth( Test.Session.Session, startingNodeIds[0], BrowseDirection.Forward, 1, [] ),
        BrowseToDepth( Test.Session.Session, startingNodeIds[1], BrowseDirection.Forward, 4, [] ),
        BrowseToDepth( Test.Session.Session, startingNodeIds[2], BrowseDirection.Forward, 4, [] ),
        BrowseToDepth( Test.Session.Session, startingNodeIds[3], BrowseDirection.Forward, 4, [] )
    ];
    if( pathsToBrowse[0] === null || pathsToBrowse[1] === null || pathsToBrowse[2] === null || pathsToBrowse[3] === null ) {
        addSkipped( "Unable to obtain a Browse Path for setting: " + startingNodeSettings[0] + ". Aborting test of TranslateBrowsePathsToNodeIds." );
    }
    else {
        pathsToBrowse[0].referenceTypeIds[0] = GetReferenceTypeFirstParent( Test.Session.Session, pathsToBrowse[0].referenceTypeIds[0] );
        pathsToBrowse[1].referenceTypeIds[0] = GetReferenceTypeFirstParent( Test.Session.Session, pathsToBrowse[1].referenceTypeIds[0] );
        pathsToBrowse[2].referenceTypeIds[2] = GetReferenceTypeFirstParent( Test.Session.Session, pathsToBrowse[2].referenceTypeIds[2] );
        pathsToBrowse[3].referenceTypeIds[3] = GetReferenceTypeFirstParent( Test.Session.Session, pathsToBrowse[3].referenceTypeIds[3] );
        pathsToBrowse[0].targetNodeId = [];
        pathsToBrowse[1].targetNodeId = [];
        pathsToBrowse[2].targetNodeId = [];
        pathsToBrowse[3].targetNodeId = [];
        TestTranslateBrowsePathsToNodeIdsMultiMix( Test.Session.Session, startingNodeIds, pathsToBrowse, expectedOperationResults, true );
    }
    return( true );
}

Test.Execute( { Procedure: Test573Err015 } );