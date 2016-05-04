/*    Test prepared by Dale Pope dale.pope@matrikon.com
     Description:
          Given one existent starting node of AnalogItemType type
            And one relativePath element referring to InstrumentRange
          When TranslateBrowsePathsToNodeIds is called
          Then the server returns the NodeId of the InstrumentRange
            Or the server returns operation result BadNoMatch
            Or the server returns service result BadServiceUnsupported

          Given one existent starting node of AnalogItemType type
            And one relativePath element referring to EngineeringUnits
          When TranslateBrowsePathsToNodeIds is called
          Then the server returns the NodeId of the EngineeringUnits
            Or the server returns operation result BadNoMatch
            Or the server returns service result BadServiceUnsupported */

include( "./library/ServiceBased/ViewServiceSet/TranslateBrowsePathsToNodeIds/test_browse_paths_translate_or_fail.js" );

function analog613013() {
    var startingNode = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings )[0];
    var testNode = new UaNodeId( Identifier.HasProperty );
    TestBrowsePathTranslatesOrFails( [ startingNode.NodeId ], [CreateQualifiedNamesArrayFromString( "0:InstrumentRange"  )], [[testNode]] );
    TestBrowsePathTranslatesOrFails( [ startingNode.NodeId ], [CreateQualifiedNamesArrayFromString( "0:EngineeringUnits" )], [[testNode]] );
    return( true );
}// function analog613013()

Test.Execute( { Procedure: analog613013 } );