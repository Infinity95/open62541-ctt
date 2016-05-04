/*    Test 5.7.3-Err-11 prepared by Dale Pope dale.pope@matrikon.com
      Description: Given an existent starting node; And multiple RelativePath elements; And a RelativePath element has a ReferenceTypeId that does not match
          When TranslateBrowsePathsToNodeIds is called Then the server returns operation result Bad_NoMatch. */

// Change a ReferenceType NodeId to Organizes, HasProperty, or HasTypeDefinition.
function SwapReferenceType( oldType ) {
    const organizesType   = new UaNodeId( Identifier.Organizes );  //UaNodeId.fromString( readSetting( "/Server Test/NodeIds/References/Organizes" ).toString() );
    const hasPropertyType = new UaNodeId( Identifier.HasProperty );//UaNodeId.fromString( readSetting( "/Server Test/NodeIds/References/HasProperty" ).toString() );
    const hasTypeDefinition = new UaNodeId( Identifier.HasTypeDefinition );
    var newType;
    if( oldType.equals( organizesType ) ) newType = new UaNodeId( Identifier.HasEncoding );
    else if( oldType.equals( hasTypeDefinition ) ) newType = hasPropertyType;
    else newType = new UaNodeId( Identifier.HasEncoding );
    return newType;
}

function Test573Err011() {
    // two tests: the last RelativePath has a non-matching ReferenceType,
    // and the second RelativePath has a non-matching ReferenceType
    var startingNodeSettings = [ "/Server Test/NodeIds/Paths/Starting Node 1", "/Server Test/NodeIds/Paths/Starting Node 1" ];
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
        pathsToBrowse[0].referenceTypeIds[3] = SwapReferenceType( pathsToBrowse[0].referenceTypeIds[3] );
        pathsToBrowse[1].referenceTypeIds[1] = SwapReferenceType( pathsToBrowse[1].referenceTypeIds[1] );
        TestTranslateBrowsePathsToNodeIdsMultiMix( Test.Session.Session, startingNodeIds, pathsToBrowse, expectedOperationResults );
    }
    return( true );
}

Test.Execute( { Procedure: Test573Err011 } );