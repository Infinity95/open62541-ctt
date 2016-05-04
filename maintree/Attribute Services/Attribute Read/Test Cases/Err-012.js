/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Read a Node of each basic core Array data type. Specify an IndexRange that is outside the bounds of the array, i.e.
        lower bound = upper bound + 1
        upper bound = upper bound + 5 */

function read581Err012() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings, 0 );
    if( items === null || items.length === 0 ) {
        addSkipped( SETTING_UNDEFINED_SCALARARRAYS );
        return( false );
    }

    // STEP 1) INITIAL READING OF WHOLE ARRAY.
    if( ReadHelper.Execute( { NodesToRead: items } ) ) {
        var expectedResults = [];
        // look at all items to define an index range that exceeds the bounds of the array
        for( var i=0; i<items.length; i++ ) {
            var valueAsArray = GetArrayTypeToNativeType( items[i].Value.Value );
            var arraySize;
            // is this an array type or a ByteString?
            if( items[i].Value.ArrayType === 1 ) arraySize = items[i].Value.Value.getArraySize();
            else {
                // bytestring?
                if( items[i].Value.DataType == BuiltInType.ByteString ) arraySize = items[i].Value.toByteString().length;
            }
            if( Assert.GreaterThan( 2, arraySize, "Expect 3 or more elements in the array." ) ) {
                var outOfBoundsIndexRange = "" + ( valueAsArray.length + 1 ) + ":" + ( valueAsArray.length + 5 );
                items[i].IndexRange = outOfBoundsIndexRange;
    
                expectedResults.push( new ExpectedAndAcceptedResults( StatusCode.BadIndexRangeNoData ) );
            }// if moveOntoSecondRead
        }//for i...
        ReadHelper.Execute( { NodesToRead: items, OperationResults: expectedResults } );
    }
    return( true );
}

Test.Execute( { Procedure: read581Err012 } );