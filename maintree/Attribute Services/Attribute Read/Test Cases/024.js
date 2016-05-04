/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Read a single attribute from a valid node where the type is an array data type, but specify an indexRange that will retrieve the 2nd element only.
      HOW THIS SCRIPT WORKS:
         1. Read the raw array value.
         2. Read the array value specifying the IndexRange.
         3. Compare the value of the 2nd read matches element #2 of the first read.*/

function read581026() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings, 0 );
    if( items === null || items.length === 0 ) {
        addSkipped( SETTING_UNDEFINED_SCALARARRAYS );
        return( false );
    }
    // STEP 1: read all arrays in their entirety; check all items are arrays
    if( !ReadHelper.Execute( { NodesToRead: items } ) ) return( false );
    for( var i=0; i<items.length; i++ ) {
        Assert.True( ( items[i].Value.Value.ArrayType === VariantArrayType.Array 
                        || items[i].Value.Value.ArrayType === VariantArrayType.Matrix
                        || items[i].Value.Value.DataType === BuiltInType.ByteString ), "Read.Response[" + i + "] is not an array. Item: " + items[i].NodeId + " (setting: " + items[i].NodeSetting + ")." );
        items[i].OriginalValue = items[i].Value.Value.clone();
    }//for i...

    // STEP 2: read indexRange=1
    for( var i=0; i<items.length; i++ ) items[i].IndexRange = "1";
    if( !ReadHelper.Execute( { NodesToRead: items } ) ) return( false );
    for( var i=0; i<items.length; i++ ) {
        if( Assert.True( ( items[i].Value.Value.ArrayType === VariantArrayType.Array 
                            || items[i].Value.Value.ArrayType === VariantArrayType.Matrix 
                            || items[i].Value.Value.DataType === BuiltInType.ByteString ), "Read.Response[" + i + "] is not an array. Item: " + items[i].NodeId + " (setting: " + items[i].NodeSetting + ")." ) ) {
            if( !items[i].Value.Value.DataType === BuiltInType.ByteString ) Assert.Equal( 1, items[i].Value.Value.getArraySize(), "Expected to receive just one array element only." );
            // now compare value received to the original value 
            var varOfArray1 = UaVariant.FromUaType( { Value: items[i].Value.Value } );
            var varOfArray2 = UaVariant.FromUaType( { Value: items[i].OriginalValue } );
            if( items[i].Value.Value.DataType == BuiltInType.ByteString && isDefined( varOfArray1.getRange )) { // could be a bytestring (array of byte) or a bytestring array
                Assert.Equal( varOfArray1.getRange( 0, 0 ), varOfArray2.getRange( 1, 1 ), "Did not receive the expected value from IndexRange '1' on item '" + items[i].NodeSetting + "'." );
                print( "[" + BuiltInType.toString( items[i].Value.Value.DataType ) + "] '" + varOfArray1.getRange( 0, 0 ) + "' = '" + varOfArray2.getRange( 1, 1 ) + "'" );
            }
            else {
                Assert.Equal( varOfArray1[0], varOfArray2[1], "Did not receive the expected value from IndexRange '1' on item '" + items[i].NodeSetting + "'." );
                print( "[" + BuiltInType.toString( items[i].Value.Value.DataType ) + "] '" + varOfArray1[0] + "' = '" + varOfArray2[1] + "'" );
            }
        }
    }//for i...
    return( true );
}

Test.Execute( { Procedure: read581026 } );