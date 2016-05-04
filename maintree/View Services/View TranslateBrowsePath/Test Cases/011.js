/*    Test 5.7.3-11 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given one existent starting node
            And one relativePath element
            And the relativePath element's ReferenceTypeId is a null NodeId
            And includeSubtypes is true
            And the relativePath element's BrowseName matches a node
          When TranslateBrowsePathsToNodeIds is called
          Then the server returns the NodeId of the relativePath element
          Validation is accomplished by comparing the returned NodeId against
          an expected NodeId stored in settings. */

function Test573011() { 
    /* test null NodeIds:
        Numeric   identifier = 0
        String    identifier = empty string
        String    identifier = null string
        Guid      identifier = guid with all fields = 0
        Opaque    identifier = bytestring with length = 0
    */
    var startingNodeSetting = "/Server Test/NodeIds/Paths/Starting Node 1";
    var startingNodeId = UaNodeId.fromString( readSetting( startingNodeSetting ).toString() );
    if( startingNodeId === undefined || startingNodeId === null ) {
        addSkipped( "[Configuration Issue?] Unable to conduct test. Check setting 'Starting Node 1'." );
        return( false );
    }
    var pathLength = 1;
    // use Browse to find browseNames, referenceTypeIds, and targetNode
    var pathToBrowse = BrowseToDepth( Test.Session.Session, startingNodeId, BrowseDirection.Forward, pathLength, [] );
    Assert.Equal( pathLength, pathToBrowse.browseNames.length, "Test cannot be completed: could not create a TranslateBrowsePathsToNodeIds test of the required length from StartingNode " + startingNodeSetting );
    var nullNodeIds = [
        UaNodeId.fromString( "ns=0;i=0" ),
        UaNodeId.fromString( "ns=0;s=" ),
        UaNodeId.fromString( "ns=0;s=" + String.fromCharCode(0) ),
        UaNodeId.fromString( "ns=0;g={00000000-0000-0000-0000-000000000000}" ),
        UaNodeId.fromString( "ns=0;b=" )
    ];
    for( var i = 0; i < nullNodeIds.length; i++ ) {
        pathToBrowse.referenceTypeIds[0] = nullNodeIds[i];
        pathToBrowse.addLog( startingNodeSetting, startingNodeId );
        TestTranslateBrowsePathsToNodeIdsNullReferenceTypeId( Test.Session.Session,
            startingNodeId,
            pathToBrowse.browseNames,
            pathToBrowse.referenceTypeIds,
            pathToBrowse.targetNodeId,
            pathLength
        );
    }
    // test null NodeIds throughout the RelativePaths
    addLog( "Test ReferenceTypeId as a null NodeId throughout the RelativePath elements" );
    pathLength = nullNodeIds.length;
    // use Browse to find browseNames, referenceTypeIds, and targetNode
    pathToBrowse = BrowseToDepth( Test.Session.Session, startingNodeId, BrowseDirection.Forward, pathLength, [] );
    if( pathToBrowse !== null ) {
        Assert.Equal( pathLength, pathToBrowse.browseNames.length, "Test cannot be completed: could not create a TranslateBrowsePathsToNodeIds test of the required length from StartingNode " + startingNodeSetting );
        for( i = 0; i < pathToBrowse.browseNames.length; i++ ) pathToBrowse.referenceTypeIds[i] = nullNodeIds[i];
        TestTranslateBrowsePathsToNodeIdsNullReferenceTypeId( Test.Session.Session, 
            startingNodeId,
            pathToBrowse.browseNames,
            pathToBrowse.referenceTypeIds,
            pathToBrowse.targetNodeId,
            pathLength
        );
    }
    else addSkipped( "Unable to obtain a path to Browse. Can't test TranslateBrowsePathsToNodeIds." );
    return( true );
}

Test.Execute( { Procedure: Test573011 } );