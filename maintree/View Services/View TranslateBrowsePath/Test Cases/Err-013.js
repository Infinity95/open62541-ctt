/*    Test 5.7.3-Err-13 prepared by Dale Pope dale.pope@matrikon.com
      Description: Given an existent starting node; And multiple RelativePath elements; And a RelativePath element has a non-existent ReferenceTypeId
          When TranslateBrowsePathsToNodeIds is called; Then the server returns operation result Bad_NoMatch. */

function Test573Err013() {
    // two tests: the last RelativePath has a non-existent ReferenceType,
    // and the second RelativePath has a non-existent ReferenceType
    // plus three tests: one for each non-existent NodeId setting
    var startingNodeSettings = [
        "/Server Test/NodeIds/Paths/Starting Node 1",
        "/Server Test/NodeIds/Paths/Starting Node 1",
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
    var pathsToBrowse = [];
    var expectedOperationResults = [];
    var i;
    var continueTest = true;
    for( i = 0; i < startingNodeSettings.length; i++ ) {
        startingNodeIds[i] = UaNodeId.fromString( readSetting( startingNodeSettings[i] ).toString() );
        pathsToBrowse[i] = BrowseToDepth( Test.Session.Session, startingNodeIds[i], BrowseDirection.Forward, 4, [] );
        if( pathsToBrowse[i] !== null ) {
            pathsToBrowse[i].targetNodeId = [];
            expectedOperationResults[i] = new ExpectedAndAcceptedResults();
            expectedOperationResults[i].addExpectedResult( StatusCode.BadNoMatch ); 
        }
        else {
            addSkipped( "Could not obtain a Browse Path for the node configured in setting: " + startingNodeSettings[i] + ". Aborting test." );
            continueTest = false;
            break;
        }
    }
    if( continueTest ) {
        pathsToBrowse[0].referenceTypeIds[3] = UaNodeId.fromString( readSetting( "/Advanced/NodeIds/Invalid/UnknownNodeId1" ).toString() );
        pathsToBrowse[1].referenceTypeIds[1] = UaNodeId.fromString( readSetting( "/Advanced/NodeIds/Invalid/UnknownNodeId1" ).toString() );
        pathsToBrowse[2].referenceTypeIds[2] = UaNodeId.fromString( readSetting( "/Advanced/NodeIds/Invalid/UnknownNodeId2" ).toString() );
        pathsToBrowse[3].referenceTypeIds[2] = UaNodeId.fromString( readSetting( "/Advanced/NodeIds/Invalid/UnknownNodeId3" ).toString() );
        pathsToBrowse[4].referenceTypeIds[2] = UaNodeId.fromString( readSetting( "/Advanced/NodeIds/Invalid/UnknownNodeId4" ).toString() );
        pathsToBrowse[5].referenceTypeIds[2] = UaNodeId.fromString( readSetting( "/Advanced/NodeIds/Invalid/UnknownNodeId5" ).toString() );
        TestTranslateBrowsePathsToNodeIdsMultiMix( Test.Session.Session, startingNodeIds, pathsToBrowse, expectedOperationResults, true );
    }
    return( true );
}

Test.Execute( { Procedure: Test573Err013 } );