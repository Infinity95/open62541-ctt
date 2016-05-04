/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: 
          Given multiple existent starting nodes of DataItem type
            And multiple relativePath elements referring to Definition
          When TranslateBrowsePathsToNodeIds is called
          Then the server returns the NodeIds of the Definitions
            Or the server returns operation result BadNoMatch
            Or the server returns service result BadServiceUnsupported

          Given multiple existent starting node of DataItem type
            And multiple relativePath element referring to ValuePrecision
          When TranslateBrowsePathsToNodeIds is called
          Then the server returns the NodeId of the ValuePrecision
            Or the server returns operation result BadNoMatch
            Or the server returns service result BadServiceUnsupported */

include( "./library/ServiceBased/ViewServiceSet/TranslateBrowsePathsToNodeIds/test_browse_paths_translate_or_fail.js" );

function browse614002 ()
{
    var monitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings, 1 );
    var startingNodes = [];
    for ( var n=0; n<monitoredItems.length; n++ )
    {
        startingNodes[n] = monitoredItems[n].NodeId;
        startingNodes[n].equals( new UaNodeId() );
    }
    
    if( startingNodes.length < 2 )
    {
        addWarning( "Test cannot be completed: too few DataItem NodeIds defined in settings" );
        return( false );
    }
    
    // double the number of startingNodes: set the first half to Definition
    // and the second half to ValuePrecision
    var numNodes = startingNodes.length;
    var browseNames = [];
    var referenceTypeIds = [];
    var dataTypes = [];
    for( var i = numNodes-1; i >= 0; i-- )
    {
        startingNodes[i+numNodes] = startingNodes[i].clone();
        
        browseNames[i] = CreateQualifiedNamesArrayFromString( "0:Definition" );
        browseNames[i+numNodes] = CreateQualifiedNamesArrayFromString( "0:ValuePrecision" );

        referenceTypeIds[i] = [new UaNodeId( Identifier.HasProperty )];//CreateNodeIdsArrayFromString( "NS0 | IdentifierTypeNumeric | 46" );
        referenceTypeIds[i+numNodes] = [new UaNodeId( Identifier.HasProperty )];//CreateNodeIdsArrayFromString( "NS0 | IdentifierTypeNumeric | 46" );
        
        dataTypes[i] = BuiltInType.String;
        dataTypes[i+numNodes] = BuiltInType.Double;
    }
    
    TestBrowsePathTranslatesOrFails( startingNodes, browseNames, referenceTypeIds, dataTypes );
    return( true );
}

Test.Execute( { Procedure: browse614002 } );