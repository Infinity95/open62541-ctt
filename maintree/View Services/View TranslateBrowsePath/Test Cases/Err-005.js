/*    Test 5.7.3-Err-5 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given an existent starting node and no RelativePath elements.
          When TranslateBrowsePathsToNodeIds is called server returns operation result Bad_NothingToDo.*/

function Test573Err005() {
    var startingNodeSetting = "/Server Test/NodeIds/Paths/Starting Node 1";
    var startingNodeIds = [ UaNodeId.fromString( readSetting( startingNodeSetting ).toString() ) ];
    if( startingNodeIds === undefined || startingNodeIds === null || startingNodeIds[0] === null || startingNodeIds[0] === undefined ) {
        addSkipped( "[Configuration Issue?] Unable to conduct test. Check setting '" + startingNodeSetting + "'." );
        return( false );
    }
    var pathsToBrowse = [ new BrowsePathInfo() ];
    pathsToBrowse[0].targetNodeId = [ ];
    var expectedOperationResults = [ new ExpectedAndAcceptedResults( StatusCode.BadNothingToDo ) ];
    TestTranslateBrowsePathsToNodeIdsMultiMix( Test.Session.Session, startingNodeIds, pathsToBrowse, expectedOperationResults );
    return( true );
}

Test.Execute( { Procedure: Test573Err005 } );