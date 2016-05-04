/*    Test prepared by Dale Pope dale.pope@matrikon.com
     Description:
          Given multiple existent starting nodes of AnalogItemType type
            And multiple relativePath elements referring to InstrumentRange
          When TranslateBrowsePathsToNodeIds is called
          Then the server returns the NodeIds of the InstrumentRanges
            Or the server returns operation result BadNoMatch
            Or the server returns service result BadServiceUnsupported

          Given multiple existent starting node of AnalogItemType type
            And multiple relativePath element referring to EngineeringUnits
          When TranslateBrowsePathsToNodeIds is called
          Then the server returns the NodeId of the EngineeringUnits
            Or the server returns operation result BadNoMatch
            Or the server returns service result BadServiceUnsupported
*/

include( "./library/ServiceBased/ViewServiceSet/TranslateBrowsePathsToNodeIds/test_browse_paths_translate_or_fail.js" );

function analog613014() {
    var startingNodes = UaNodeId.FromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings );
    if( startingNodes.length < 2 ) {
        addSkipped( "Static Analog" );
        return( false );
    }

    // double the number of startingNodes: set the first half to InstrumentRange
    // and the second half to EngineeringUnits
    var numNodes = startingNodes.length;
    var browseNames = [];
    var referenceTypeIds = [];
    for( var i=numNodes-1; i >= 0; i-- ) {
        startingNodes[i+numNodes] = startingNodes[i];

        browseNames[i] = CreateQualifiedNamesArrayFromString( "0:InstrumentRange" );
        browseNames[i+numNodes] = CreateQualifiedNamesArrayFromString( "0:EngineeringUnits" );

        var testNode = new UaNodeId( Identifier.HasProperty );
        referenceTypeIds[i] = [testNode];// CreateNodeIdsArrayFromString( "NS0 | IdentifierTypeNumeric | 46" );
        referenceTypeIds[i+numNodes] = [testNode];//CreateNodeIdsArrayFromString( "NS0 | IdentifierTypeNumeric | 46" );
    }

    TestBrowsePathTranslatesOrFails( startingNodes, browseNames, referenceTypeIds );
    return( true );
}// function analog613014() 

Test.Execute( { Procedure: analog613014 } );