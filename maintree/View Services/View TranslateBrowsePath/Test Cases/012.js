/*    Test 5.7.3-12 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given four existent starting nodes
            And existent relativePath nodes
          When TranslateBrowsePathsToNodeIds is called
          Then the server returns the NodeId of the last relativePath element for each starting node
          Validation is accomplished two ways: some by comparing 
          the returned NodeId against an expected NodeId stored in
          settings, and some by browsing the startingNode to 
          determine input parameters and expected target NodeId. */

function Test573012() {
    var startingNodeSettings = [
        "/Server Test/NodeIds/Paths/Starting Node 1",
        "/Server Test/NodeIds/Paths/Starting Node 1",
        "/Server Test/NodeIds/Paths/Starting Node 1",
        "/Server Test/NodeIds/References/Has 3 Forward References 1"
    ];
    var startingNodeIds = [
        UaNodeId.fromString( readSetting( startingNodeSettings[0] ).toString() ),
        UaNodeId.fromString( readSetting( startingNodeSettings[0] ).toString() ),
        UaNodeId.fromString( readSetting( startingNodeSettings[0] ).toString() ),
        UaNodeId.fromString( readSetting( startingNodeSettings[0] ).toString() )
    ];
    // check the nodes are configured
    for( i=0; i<startingNodeIds.length; i++ ) {
        if( startingNodeIds[i] === undefined || startingNodeIds[i] === null ) {
            addSkipped( "[Configuration Issue?] Unable to conduct test. Check setting '" + startingNodeSettings[i] + "'." );
            return( false );
        }
    }
    // use Browse to find browseNames, referenceTypeIds, and targetNodes
    var browseDepths = [1, 2, 3, 4];
    var pathsToBrowse = [
        BrowseToDepth( Test.Session.Session, startingNodeIds[0], BrowseDirection.Forward, browseDepths[0], [] ),
        BrowseToDepth( Test.Session.Session, startingNodeIds[1], BrowseDirection.Forward, browseDepths[1], [] ),
        BrowseToDepth( Test.Session.Session, startingNodeIds[2], BrowseDirection.Forward, browseDepths[2], [] ),
        BrowseToDepth( Test.Session.Session, startingNodeIds[3], BrowseDirection.Forward, browseDepths[3], [] )
    ];
    var browseNames = [];
    var referenceTypeIds = [];
    var targetNodeIds = [];
    for( var i = 0; i < pathsToBrowse.length; i++ ) {
        if( pathsToBrowse[i] === null ) {
            addWarning( "Unable to browse down " + browseDepths[i] + " deep on Node specified in setting: " + startingNodeSettings[i] );
            continue;
        }
        browseNames[i] = pathsToBrowse[i].browseNames;
        referenceTypeIds[i] = pathsToBrowse[i].referenceTypeIds;
        targetNodeIds[i] = [ pathsToBrowse[i].targetNodeId ];
        addLog( "BrowsePaths[" + i + "] will" );
        pathsToBrowse[i].addLog( startingNodeSettings[i], startingNodeIds[i] );
    }
    TestTranslateBrowsePathsToNodeIdsMulti( Test.Session.Session, startingNodeIds, browseNames, referenceTypeIds, targetNodeIds );
    return( true );
}

Test.Execute( { Procedure: Test573012 } );