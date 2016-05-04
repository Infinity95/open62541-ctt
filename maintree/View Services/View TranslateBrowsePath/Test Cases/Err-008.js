/*    Test 5.7.3-Err-8 prepared by Dale Pope dale.pope@matrikon.com
      Description: Given an existent starting node; And multiple RelativePath elements; And a RelativePath element prior to the last contains a null BrowseName
          When TranslateBrowsePathsToNodeIds is called Then the server returns operation result Bad_BrowseNameInvalid. */

function Test573Err008() {
    var startingNodeSettings = [
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
            pathsToBrowse[i].targetNodeId = [ ];
            expectedOperationResults[i] = new ExpectedAndAcceptedResults();
            expectedOperationResults[i].addExpectedResult( StatusCode.BadBrowseNameInvalid );
        }
        else {
            addSkipped( "Could not obtain a Browse Path for the node configured in setting: " + startingNodeSettings[i] + ". Aborting test." );
            continueTest = false;
            break;
        }
    }
    if( continueTest ) {
        pathsToBrowse[0].browseNames[0] = new UaQualifiedName();
        pathsToBrowse[1].browseNames[2] = new UaQualifiedName();
        TestTranslateBrowsePathsToNodeIdsMultiMix( Test.Session.Session, startingNodeIds, pathsToBrowse, expectedOperationResults );
    }
    return( true );
}

Test.Execute( { Procedure: Test573Err008 } );