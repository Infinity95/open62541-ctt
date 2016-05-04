/*    Test 5.7.3-Err-7 prepared by Dale Pope dale.pope@matrikon.com
      Description: Given an existent starting node; And a null BrowseName; When TranslateBrowsePathsToNodeIds is called
          Then the server returns operation result Bad_BrowseNameInvalid. */

function Test573Err007() {
    var startingNodeSettings = [ "/Server Test/NodeIds/Paths/Starting Node 1" ];
    var settingValue = readSetting( startingNodeSettings[0] ).toString();
    if( settingValue === undefined || settingValue === null || settingValue === "" ) {
        addSkipped( "[Configuration Issue?] Unable to conduct test. Check setting '" + startingNodeSettings[0] + "'." );
        return( false );
    }
    var startingNodeIds = [];
    var pathsToBrowse = [];
    var expectedOperationResults = [];
    var i;
    for( i = 0; i < startingNodeSettings.length; i++ ) {
        startingNodeIds[i] = UaNodeId.fromString( readSetting( startingNodeSettings[i] ).toString() );
        pathsToBrowse[i] = BrowseToDepth( Test.Session.Session, startingNodeIds[i], BrowseDirection.Forward, 1, [] );
        pathsToBrowse[i].browseNames = [ new UaQualifiedName() ];
        pathsToBrowse[i].targetNodeId = [ ];
        expectedOperationResults[i] = new ExpectedAndAcceptedResults();
        expectedOperationResults[i].addExpectedResult( StatusCode.BadBrowseNameInvalid );
    }
    TestTranslateBrowsePathsToNodeIdsMultiMix( Test.Session.Session, startingNodeIds, pathsToBrowse, expectedOperationResults );
    return( true );
}

Test.Execute( { Procedure: Test573Err007 } );