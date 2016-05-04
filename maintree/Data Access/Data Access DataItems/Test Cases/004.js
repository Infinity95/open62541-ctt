/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: 
        Write the following 3 values to a dataitem node of each supported type:
        Min of datatype, Max of datatype, and a number in the middle of the datatype range. */

function write614004() {
    // DataItem type nodes array
    var dataItemTypeNodes = Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings;

    // Test each of the dataitem node one by one
    for( var i=0; i<dataItemTypeNodes.length; i++ ) {
        // Get the value of the setting, and make sure it contains a value
        var writeMonitoredItem = MonitoredItem.fromSetting( dataItemTypeNodes[i], 1 );
        if( writeMonitoredItem == null ) {
            _dataTypeUnavailable.store( BuiltInType.toString( UaNodeId.GuessType( dataItemTypeNodes[i] ) ) );
            continue;
        }
        
        // Get the datatype of the current node we are processing
        var currentNodeDataType = UaNodeId.GuessType( dataItemTypeNodes[i] ) ;     
        
        // In this loop we write the three values for this test (in the order listed below)
        // 1) Max value of datatype
        // 2) Min value of datatype
        // 3) Value in the middle of the datatype range
        for ( var n=0; n<3; n++) {
            // Get the value we are writing
            var writeValue = 0;
            switch (n)
            {
                // Max
                case 0:
                    writeValue = getMaxValueDataType ( currentNodeDataType );
                    writeMonitoredItem.SafelySetValueTypeKnown( writeValue, currentNodeDataType );
                    print ( "Writing max datatype('" + BuiltInType.toString ( currentNodeDataType ) + "') value of '" + UaVariantToSimpleType( writeMonitoredItem.Value.Value ) + "'to dataitem node '" + dataItemTypeNodes[i] + "'." );
                    break;
                // Min
                case 1:
                    writeValue = getMinValueDataType ( currentNodeDataType );
                    writeMonitoredItem.SafelySetValueTypeKnown( writeValue, currentNodeDataType );
                    print ( "Writing min datatype('" + BuiltInType.toString ( currentNodeDataType ) + "') value of '" + UaVariantToSimpleType( writeMonitoredItem.Value.Value ) + "'to dataitem node '" + dataItemTypeNodes[i] + "'." );
                    break;
                // Middle
                case 2:
                    writeValue = getMiddleValueDataType ( currentNodeDataType );
                    writeMonitoredItem.SafelySetValueTypeKnown( writeValue, currentNodeDataType );
                    print ( "Writing value in the middle of the datatype('" + BuiltInType.toString ( currentNodeDataType ) + "') range: '" + UaVariantToSimpleType( writeMonitoredItem.Value.Value ) + "'to dataitem node '" + dataItemTypeNodes[i] + "'." );
                    break;
            }

            // Write value
            var results = [];
            results[0] = new ExpectedAndAcceptedResults( StatusCode.Good );
            if( WriteHelper.Execute( { NodesToWrite: writeMonitoredItem, OperationResults: results } ) == false )
            {
                addWarning ( "Write failed for node: '" + writeMonitoredItem.NodeSetting + "'." );
                continue;
            }
            
            // Read (to verify written value/type)
            print ( "Reading node '" + dataItemTypeNodes[i] + "' after the write to check the written values." );
            var readMonitoredItem = MonitoredItem.fromSetting( dataItemTypeNodes[i], 1 );            
            if ( ReadHelper.Execute ( {
                    NodesToRead: readMonitoredItem, 
                    TimestampsToReturn: TimestampsToReturn.Neither, 
                    MaxAge: 0 
                    } ) )
            {
                // Check: Value
                print( "Checking the value..." );
                var writeVal = UaVariantToSimpleType ( writeMonitoredItem.Value.Value  );
                var readVal  = UaVariantToSimpleType ( readMonitoredItem.Value.Value );                    
                Assert.Equal( writeVal, readVal, "The expected and received value for the node '" + dataItemTypeNodes[i] + "' are different." );
            }
        }
    }
    return( true );
}

Test.Execute( { Procedure: write614004 } );