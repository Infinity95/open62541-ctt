/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Write to "Definition" property of a DataItem. Acquire the handle to the "Definition" nodeId using the TranslateBrowsePathsToNodeIds service. */

function write614006()
{
    var monitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings, 1 );
    if ( monitoredItems.length == 0 )
    {
        addSkipped( "Static DataItem" );
        return( false );
    }
    
    // Get the nodeID of the "Definition" property
    var returnedNodeIds = getPropertyNodeId( Test.Session.Session, monitoredItems[0].NodeId, "0:Definition" );
    
    // Did we actually find the property
    if( returnedNodeIds !== null && returnedNodeIds !== undefined )
    {
        if( returnedNodeIds.length > 0)
        {
            Assert.Equal ( returnedNodeIds.length, 1, "Expected a single nodeID from the translate operation.");

            // Let's do the read first and cache the value 
            var cachedDefinitionValue = "ThisIsANonCachedValue";
            var readMonitoredItems = MonitoredItem.fromNodeIds ( returnedNodeIds );
            var results = [];
            results[0] = new ExpectedAndAcceptedResults( StatusCode.Good );
            if ( !ReadHelper.Execute ( { 
                    NodesToRead: readMonitoredItems[0], 
                    OperationResults: results 
                    } ) )
            {
                addWarning ( "read() failed for the 'Definition' property of the node '" + monitoredItems[0].NodeSetting + "'." );
            }
            else
            {
                // Cache the value here
                cachedDefinitionValue = readMonitoredItems[0].Value.Value.toString();
            }

            // Now do the write
            var writeMonitoredItems = MonitoredItem.fromNodeIds ( returnedNodeIds );
            writeMonitoredItems[0].SafelySetValueTypeKnown( cachedDefinitionValue, BuiltInType.String );
            results = [];
            results[0] = new ExpectedAndAcceptedResults( StatusCode.Good );
            results[0].addAcceptedResult ( [ StatusCode.BadUserAccessDenied, StatusCode.BadNotWritable ] );
            if ( !WriteHelper.Execute ( {
                        NodesToWrite: writeMonitoredItems[0], 
                        OperationResults: results 
                        } ) )
            {
                addError ( "Write() failed for the 'Definition' property of the node '" + monitoredItems[0].NodeSetting + "'." );
            }
        }
        else
        {
            addSkipped( "The optional 'Definition' property not found in node '" + monitoredItems[0].NodeSetting + "'." );
        }
    }
    else
    {
        addSkipped ( "The optional 'Definition' property not found in node '" + monitoredItems[0].NodeSetting + "'." );
    }
    return( true );
}

Test.Execute( { Procedure: write614006 } );