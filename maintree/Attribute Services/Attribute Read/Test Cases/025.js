/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Read a single attribute from a valid node where the type is an array data type, but specify an indexRange that will retrieve the 2nd through 4th element only.
      HOW THIS SCRIPT WORKS:
         1. Read the raw array value.
         2. Read the array value specifying the IndexRange 2-4.
         3. Compare the value of the 2nd read matches elements #2, #3 and #4
            of the first read.
         4. REPEAT FOR EACH DATA TYPE. */

function readArray581027( nodeSetting, nodeType ) {
    const MIN_ARRAY_SIZE = 5;

    print( "\nTESTING TYPE: " + BuiltInType.toString( nodeType ) + "\nSETTING: " + nodeSetting );
    print( "-------------------------------------------------------------------" );
    var item = MonitoredItem.fromSetting( nodeSetting, 0, Attribute.Value, ("0:" + MIN_ARRAY_SIZE) );
    if( item == null ) return( false );
    item.Value.Value = generateArrayWriteValue( 0, MIN_ARRAY_SIZE, nodeType );
    item.IndexRange = "";


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    print( "\n\n\nSTEP 1) INITIAL READING OF WHOLE ARRAY.\n" );
    var readArray;
    if( ReadHelper.Execute( { NodesToRead: item, TimestampsToReturn: TimestampsToReturn.Both } ) ) {
        // store the array value, because we'll compare against it later...
        var valueAsArray = GetArrayTypeToNativeType( item.Value.Value );

        // check the data type
        var moveOntoSecondRead = true;
        if( nodeType == BuiltInType.ByteString || item.Value.Value.DataType == BuiltInType.ByteString ) {
            moveOntoSecondRead = Assert.GreaterThan( MIN_ARRAY_SIZE - 1, valueAsArray.length, "Array too short. Needs to be at least 5 characters long. Node '" + item.NodeId + "' on setting '" + nodeSetting + "'" );
        }
        else {
            Assert.Equal( 1, item.Value.Value.ArrayType, "Expected an Array type." );
            moveOntoSecondRead = Assert.GreaterThan( MIN_ARRAY_SIZE - 1, item.Value.Value.getArraySize(), "Array too short. Needs to be at least 5 elements long. Node '" + item.NodeId + "' on setting '" + nodeSetting + "'" );
        }
        if( moveOntoSecondRead ) {
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            print( "\n\n\nSTEP 2) READING ARRAY SPECIFYING AN INDEX RANGE TO RETREIVE THE 2ND/3RD ELEMENT OF THE ARRAY ONLY.\n" );
            item.IndexRange = "2:4";
            if( ReadHelper.Execute( { NodesToRead: item, TimestampsToReturn: TimestampsToReturn.Both } ) ) {
                // depending upon the data-type, we will either do an element-by-element
                // check, or a string compare
                if( nodeType == BuiltInType.ByteString || item.Value.Value.DataType == BuiltInType.ByteString ) {
                    // we need to treat ByteString differently to ByteString[]
                    if( item.Value.Value.ArrayType === 1 ) {
                        // bytestring[]
                        // check that array elements 2-4 are equal
                        var newValueAsArray = GetArrayTypeToNativeType( item.Value.Value );
                        for( var v=2; v<=4; v++ ) Assert.Equal( valueAsArray[v], newValueAsArray[ (v-2) ], "Expected to receive the same array element." );
                    }
                    else {
                        var range = valueAsArray.getRange(2,4);
                        Assert.Equal(item.Value.Value.toByteString(), range, "Expected: " + range.toHexString() + " but received: " + item.Value.Value.toByteString().toHexString());
                    }
                }
                else {
                    // should have only received three values
                    readArray = GetArrayTypeToNativeType( item.Value.Value );
                    Assert.Equal( 3, readArray.length, "Number of requested array elements was not equal to the number of returned elements" );

                    // get the 3 values into variables
                    var varOfArray1 = UaVariantToSimpleType ( valueAsArray[2] );
                    var varOfArray2 = UaVariantToSimpleType ( valueAsArray[3] );
                    var varOfArray3 = UaVariantToSimpleType ( valueAsArray[4] );
                    var indexedRead1 = UaVariantToSimpleType( readArray[0] );
                    var indexedRead2= UaVariantToSimpleType ( readArray[1] );
                    var indexedRead3 = UaVariantToSimpleType( readArray[2] );
                    print( "\tSame? " + Assert.Equal( varOfArray1, indexedRead1, "The requested array element was not returned" ) + "; Original[2]='" + varOfArray1 + "' vs Now[0]='" + indexedRead1 + "'" );
                    print( "\tSame? " + Assert.Equal( varOfArray2, indexedRead2, "The requested array element was not returned" ) + "; Original[3]='" + varOfArray2 + "' vs Now[1]='" + indexedRead2 + "'" );
                    print( "\tSame? " + Assert.Equal( varOfArray3, indexedRead3, "The requested array element was not returned" ) + "; Original[4]='" + varOfArray3 + "' vs Now[2]='" + indexedRead3 + "'" );
                }
            }// if Read
        }// Assert.GreaterThan
    }//if Read
}

function read81027() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings );
    if( items == null || items.length == 0 ) { 
        addSkipped( SETTING_UNDEFINED_SCALARARRAYS );
        return( false );
    }
    for( var i=0; i<items.length; i++ ) readArray581027( items[i].NodeSetting, UaNodeId.GuessType( items[i].NodeSetting ) );
    return( true );
}

Test.Execute( { Procedure: read81027 } );