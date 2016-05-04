/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write the MAXIMUM value for each supported data-type. */

function write582016() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, 0, Attribute.Value );
    if( items == null || items.length < 3 ) {
        addSkipped( SETTING_UNDEFINED_SCALARSTATIC );
        return( false );
    }
    // do a reading of the items first, to get the values and DATA TYPES!!!!
    if( ReadHelper.Execute( { NodesToRead: items } ) ) {
        var itemsToWrite = []; // these are the items that we will use for Writing 
        var expectedResults = [];
        for( var i=0; i<items.length; i++ ) {
            var addItemToWriteList = true;
            // clone the current value, and store in a new property called 'originalValue'
            items[i].originalValue = items[i].Value.Value.clone();
            // generate a value based on the type
            switch( items[i].Value.Value.DataType ) {
                case BuiltInType.Boolean: items[i].Value.Value.setBoolean( true );break;
                case BuiltInType.SByte:   items[i].Value.Value.setSByte( Constants.SByte_Max ); break;
                case BuiltInType.Byte:    items[i].Value.Value.setByte( Constants.Byte_Max ); break;
                case BuiltInType.Int16:   items[i].Value.Value.setInt16( Constants.Int16_Max ); break;
                case BuiltInType.Int32:   items[i].Value.Value.setInt32( Constants.Int32_Max ); break;
                case BuiltInType.Int64:   items[i].Value.Value.setInt64( Constants.Int32_Max ); break;
                case BuiltInType.UInt16:  items[i].Value.Value.setUInt16( Constants.UInt16_Max ); break;
                case BuiltInType.UInt32:  items[i].Value.Value.setUInt32( Constants.UInt32_Max ); break;
                case BuiltInType.UInt64:  items[i].Value.Value.setUInt64( Constants.UInt32_Max ); break;
                case BuiltInType.Float:   items[i].Value.Value.setFloat( Constants.Float_Max ); break;
                case BuiltInType.Double:  items[i].Value.Value.setDouble( Constants.Double_Max ); break;
                default:
                    print( "Data Type not defined for testing: " + BuiltInType.toString( items[i].Value.Value.DataType ) );
                    addItemToWriteList = false;
            }
            if( addItemToWriteList ) {
                // add the item to our list of items to write to
                itemsToWrite.push( items[i] );
                // now specify the expected results for this individual write transaction
                var newErr = new ExpectedAndAcceptedResults( StatusCode.Good );
                newErr.addExpectedResult( StatusCode.BadWriteNotSupported );
                expectedResults.push( newErr );
            }
        }// for i...
        // now Write
        if( itemsToWrite == null || itemsToWrite.length < 3 ) {
            addWarning( "Not enough nodes to test with. Aborting test." );
            return( false );
        }
        WriteHelper.Execute( { NodesToWrite: itemsToWrite, OperationResults: expectedResults, CheckNotSupported: true } );

        // lastly, revert back to the previous values (recorded in the clonedItems)
        for( var i=0; i<itemsToWrite.length; i++ ) itemsToWrite[i].Value.Value = itemsToWrite[i].originalValue;
        WriteHelper.Execute( { NodesToWrite: itemsToWrite, OperationResults: expectedResults, CheckNotSupported: true } );
    }
    else return( false );
    return( true );
}

Test.Execute( { Procedure: write582016 } );