/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Write a value to a dataitem node (of type Float/Double) that matches its ValuePrecision. */

function write614010()
{
    var monitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings, 1 );
    if ( monitoredItems.length == 0 )
    {
        addSkipped( "Static DataItem" );
        return( false );
    }
    
    // Only these datatypes need to be tested (only these have ValuePrecision property)
    var dataTypesToTest = [ BuiltInType.Float, BuiltInType.Double ];
    
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
                
                // Let's do the read first to get the precision value
                var precisionValue = 0.0;
                var readMonitoredItems = MonitoredItem.fromNodeIds ( returnedNodeIds );
                var results = [];
                results[0] = new ExpectedAndAcceptedResults( StatusCode.Good );
                if ( ReadHelper.Execute( {
                        NodesToRead: readMonitoredItems[0] } ) == false ) {
                    addError ( "Read() failed for the 'ValuePrecision' property of the node '" + monitoredItems[i].NodeSetting + "'." );
                    return( false );
                }
                else
                {
                    // Get the value here
                    precisionValue = readMonitoredItems[0].Value.Value.toDouble ();
                }

                // Read the node to get the current value (this is not important for this test
                // but this way when we write a new value, it is pretty close to the existing value )
                var currentValue;
                if ( ReadHelper.Execute( { 
                        NodesToRead: monitoredItems[i] } ) == true ) {
                    currentValue = UaVariantToSimpleType ( monitoredItems[i].Value.Value );
                }

                // Do the write
                var writeValue = generateValueWithPrecision ( precisionValue, currentValue );
                var writeMonitoredItem = MonitoredItem.fromSetting ( monitoredItems[i].NodeSetting, 1 ); 
                writeMonitoredItem.SafelySetValueTypeKnown( writeValue, currentNodeDataType );
                results = [];
                results[0] = new ExpectedAndAcceptedResults( StatusCode.Good );
                results[0].addAcceptedResult ( StatusCode.BadUserAccessDenied );
                print ( "Writing value '" + UaVariantToSimpleType ( writeMonitoredItem.Value.Value ) + "'(matches the value precision) to node '" + monitoredItems[i].NodeSetting + "'." );
                if ( WriteHelper.Execute( {
                        NodesToWrite: writeMonitoredItem, 
                        OperationResults: results, 
                        ReadVerification: true } ) == false ) {
                    addError ( "Write() failed for the node '" + writeMonitoredItem.NodeSetting + "'." );
                }
                else
                {
                    // Write succeeded, now read the value to verify
                    var readMonitoredItem = MonitoredItem.fromSetting ( monitoredItems[i].NodeSetting, 1 ); 
                    results = [];
                    results[0] = new ExpectedAndAcceptedResults( StatusCode.Good );
                    print ( "Write succeeded, now reading the value to verify. The values should match." );
                    if ( ReadHelper.Execute ( {
                            NodesToRead: readMonitoredItem, 
                            OperationResults: results } ) == false ) {
                        addError ( "Read() failed (after the write for verification) of the node '" + readMonitoredItem.NodeSetting + "'." );
                    }
                    else
                    {
                        // Since we wrote a value as per the ValuePrecision, we should read back exactly what we wrote!
                        var readValue = UaVariantToSimpleType ( readMonitoredItem.Value.Value );
                        var writeValue = UaVariantToSimpleType ( writeMonitoredItem.Value.Value );
                        if ( readValue !=  writeValue )
                        {
                            addError( "The received value does not match what was written.\n\tWrite value: " + writeValue + "\n\tReceived Value: " + readValue );
                        }
                        else
                        {
                            addLog( "The received value matches what was written(Value = " + readValue + ")." );
                        }
                    }                
                }
            }
            else
            {
                addSkipped( "The optional 'ValuePrecision' property not found in node '" + monitoredItems[i].NodeSetting + "'." );
            }
        }
        else
        {
            addSkipped( "The optional 'ValuePrecision' property not found in node '" + monitoredItems[i].NodeSetting + "'." );
        }
    }
    return( true );
}

Test.Execute( { Procedure: write614010 } );