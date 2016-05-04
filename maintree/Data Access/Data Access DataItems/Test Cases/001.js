/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: 
          Given one existent starting node of DataItem type
            And one relativePath element referring to Definition
          When TranslateBrowsePathsToNodeIds is called
          Then the server returns the NodeId of the Definition
            Or the server returns operation result BadNoMatch
            Or the server returns service result BadServiceUnsupported

          Given one existent starting node of DataItem type
            And one relativePath element referring to ValuePrecision
          When TranslateBrowsePathsToNodeIds is called
          Then the server returns the NodeId of the ValuePrecision
            Or the server returns operation result BadNoMatch
            Or the server returns service result BadServiceUnsupported */

include( "./library/ServiceBased/ViewServiceSet/TranslateBrowsePathsToNodeIds/test_browse_paths_translate_or_fail.js" );

function browse614001 ()
{
    var monitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings, 1 );
    if ( monitoredItems.length == 0 )
    {
        addSkipped( "Static DataItem" );
        return( false );
    }
    
    TestBrowsePathTranslatesOrFails( [monitoredItems[0].NodeId], [CreateQualifiedNamesArrayFromString( "0:Definition" )], [[new UaNodeId( Identifier.HasProperty )]], [ BuiltInType.String ] );
    TestBrowsePathTranslatesOrFails( [monitoredItems[0].NodeId], [CreateQualifiedNamesArrayFromString( "0:ValuePrecision" )], [[new UaNodeId( Identifier.HasProperty )]], [ BuiltInType.Double ] );
    return( true );
}

Test.Execute( { Procedure: browse614001 } );