/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Read a single attribute from a valid node where the type is an array data type, but specify an indexRange that will retrieve the
        last 3 elements of the array ONLY. */

function readArray581028( nodeSetting, nodeType ) {
    print( "\nTESTING TYPE: " + BuiltInType.toString( nodeType ) + "\nSETTING: " + nodeSetting );
    print( "-------------------------------------------------------------------" );

    var item = MonitoredItem.fromSetting( nodeSetting, 0 );
    var actualArray = [], expectedArray = [];
    if( item == null ) return( false );
    item.Value.Value = generateArrayWriteValue( 0, 3, nodeType );


    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        STEP 1) INITIAL READING OF WHOLE ARRAY.
    */
    var readArray;
    print( "Get the initial value of the array." );
    if( ReadHelper.Execute( { NodesToRead: item, TimestampsToReturn: TimestampsToReturn.Both } ) ) {
        // store the array value, because we'll compare against it later...
        var valueAsArray = GetArrayTypeToNativeType( ReadHelper.Response.Results[0].Value );

        // check the data type
        var moveOntoSecondRead = true;
        if( nodeType == BuiltInType.Byte || nodeType == BuiltInType.ByteString ) {
            moveOntoSecondRead = Assert.GreaterThan( 3, valueAsArray.length, "Array too short. Needs to be at least 4 characters long. Node '" + item.NodeId + "' on setting '" + nodeSetting + "'" );
        }
        else {
            Assert.Equal( 1, ReadHelper.Response.Results[0].Value.ArrayType, "Expected an Array type." );
            moveOntoSecondRead = Assert.GreaterThan( 3, ReadHelper.Response.Results[0].Value.getArraySize(), "Array too short. Needs to be at least 4 elements long. Node '" + item.NodeId + "' on setting '" + nodeSetting + "'" );
        }
        if( moveOntoSecondRead ) {
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        STEP 2) READING ARRAY SPECIFYING AN INDEX RANGE TO RETREIVE THE
                2ND ELEMENT OF THE ARRAY ONLY. */
            // we now need to build the string to specify the range
            // treat byte[] and bytestring differently from other data-types
            var lastIndex;
            if( nodeType === BuiltInType.Byte || nodeType === BuiltInType.ByteString ) {
                // treat bytestring different to bytestring[]
                if( ReadHelper.Response.Results[0].Value.ArrayType === 1 ) {
                    // bytestring[]
                    lastIndex = valueAsArray.length - 1;
                }
                else {
                    // bytestring
                    lastIndex = valueAsArray.utf8ToString().length - 1;
                }
            }
            else {
                lastIndex = valueAsArray.length - 1;
            }
            var indexRangeString = ( lastIndex - 2 ) + ":" + lastIndex;
            item.IndexRange = indexRangeString;

            print( "Get the last 3 elements of the array: '" + item.IndexRange + "'." );
            if( ReadHelper.Execute( { NodesToRead: item, TimestampsToReturn: TimestampsToReturn.Both } ) ) {
                // depending upon the data-type, we will either do an element-by-element
                // check, or a string compare
                if( nodeType == BuiltInType.Byte || nodeType == BuiltInType.ByteString ) {
                    // we need to treat ByteString differently to ByteString[]
                    if( ReadHelper.Response.Results[0].Value.ArrayType === 1 ) {
                        // bytestring[]
                        // check that array elements 2-4 are equal
                        var newValueAsArray = GetArrayTypeToNativeType( ReadHelper.Response.Results[0].Value );
                        for( var v=(lastIndex-2); v<=lastIndex; v++ ) {
                            var offset = v - (lastIndex-2);
                            Assert.Equal( valueAsArray[v], newValueAsArray[ offset ], "Expected to receive the same array element." );
                        }//for v...
                    }
                    else {
                        // bytestring
                        var range = valueAsArray.getRange(lastIndex-2,lastIndex);
                        Assert.Equal(ReadHelper.Response.Results[0].Value.toByteString(), range, "Expected: " + range.toHexString() + " but received: " + ReadHelper.Response.Results[0].Value.toByteString().toHexString());
                    }
                }
                else {
                    // should have only received three values
                    readArray = GetArrayTypeToNativeType( ReadHelper.Response.Results[0].Value );
                    Assert.Equal( 3, readArray.length, "Number of requested array elements was not equal to the number of returned elements" );

                    // get the 3 values into variables
                    for ( var i = 0; i < readArray.length; i++ ) {
                        actualArray.push( UaVariantToSimpleType( readArray[i] ) );
                    }
                    for ( var j= ( valueAsArray.length - 3 ); j <valueAsArray.length ; j++ ) {
                        expectedArray.push( UaVariantToSimpleType( valueAsArray[j] ) ) ;  
                    }
                    print( "\tSame? " + Assert.ArraysEqual( expectedArray, actualArray, "The requested array element was not returned" ) + "; Original[2]='" + expectedArray + "' vs Now[0]='" + actualArray + "'" );
                }//if nodeType...
            }//if Read
        }//if moveOntoSecondRead
    }//if Read
}

function read581028() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings );
    if( items == null || items.length == 0 ) {
        addSkipped( SETTING_UNDEFINED_SCALARARRAYS );
        return( false );
    }
    for( var i=0; i<items.length; i++ ) {
        readArray581028( items[i].NodeSetting, UaNodeId.GuessType( items[i].NodeSetting ) );
    }
    return( true );
}

Test.Execute( { Procedure: read581028 } );