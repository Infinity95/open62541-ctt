/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Write to "ValuePrecision" property of a DataItem. Acquire the handle to the "ValuePrecision" nodeId using the TranslateBrowsePathsToNodeIds service. */

function write614007 ()
{
    var monitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings, 1 );
    if ( monitoredItems.length == 0 )
    {
        addSkipped( "Static DataItem" );
        return( false );
    }

    // Only these datatypes need to be tested (only thesse have ValuePrecision property)
    var dataTypesToTest = [ BuiltInType.Float, BuiltInType.Double, BuiltInType.DateTime ];

    // Loop through the items and test the datatypes of interest
    for ( var i=0; i<monitoredItems.length; i++ )
    {
        // Continue only if datatype of interest
        var currentNodeDataType = UaNodeId.GuessType( monitoredItems[i].NodeSetting );
        var dataTypesToTestIndex = 0;
        for ( dataTypesToTestIndex=0; dataTypesToTestIndex<dataTypesToTest.length; dataTypesToTestIndex++ )
        {
            if ( dataTypesToTest[ dataTypesToTestIndex ] == currentNodeDataType ) break;
        }
        // If not the correct type, move to the next item
        if ( dataTypesToTestIndex >= dataTypesToTest.length) continue;

        // Get the nodeID of the "ValuePrecision" property
        var returnedNodeIds = getPropertyNodeId( Test.Session.Session, monitoredItems[i].NodeId, "0:ValuePrecision" );

        // Did we actually find the property
        if( returnedNodeIds !== null && returnedNodeIds !== undefined )
        {
            if ( returnedNodeIds.length > 0)
            {
                Assert.Equal ( returnedNodeIds.length, 1, "Expected a single nodeID from the translate operation on node '" + monitoredItems[i].NodeSetting + "'.");

                // Do the write
                var writeMonitoredItems = MonitoredItem.fromNodeIds ( returnedNodeIds );
                writeMonitoredItems[0].SafelySetValueTypeKnown( 2.0, BuiltInType.Double );
                results = [];
                results[0] = new ExpectedAndAcceptedResults( StatusCode.Good );
                results[0].addAcceptedResult ( [ StatusCode.BadUserAccessDenied, StatusCode.BadNotWritable ] );
                if ( WriteHelper.Execute ( {
                        NodesToWrite: writeMonitoredItems[0], 
                        OperationResults: results, 
                        ReadVerification: true } ) == false ) {
                    addError ( "write() failed for the 'ValuePrecision' property of the node '" + monitoredItems[i].NodeSetting + "'." );
                }
            }
            else
            {
                addSkipped ( "The optional 'ValuePrecision' property not found in node '" + monitoredItems[i].NodeSetting + "'." );
            }
        }
        else
        {
            addSkipped ( "The optional 'ValuePrecision' property not found in node '" + monitoredItems[i].NodeSetting + "'." );
        }
    }
    return( true );
}

Test.Execute( { Procedure: write614007 } );