/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to an Array Node while specify an indexRange that will write to the last 3 elements of the array ONLY. */

function write582008() {
    var expectedResults = [];
    for( var i=0; i<items.length; i++ ) {
        expectedResults[i] = new ExpectedAndAcceptedResults( StatusCode.Good );
        expectedResults[i].addExpectedResult( StatusCode.BadWriteNotSupported );

        // we now need to build the string to specify the range
        var lastIndex = items[i].Value.Value.getArraySize() - 1;
        var indexRangeString = ( lastIndex - 2 ) + ":" + lastIndex;
        items[i].IndexRange = indexRangeString;

        // now to specify the values to write
        var arrayWriteValues;
        switch( items[i].Value.Value.DataType ) {
            case BuiltInType.Boolean:
                arrayWriteValues = new UaBooleans();
                arrayWriteValues[0] = true;
                arrayWriteValues[1] = false;
                arrayWriteValues[2] = true;
                items[i].Value.Value.setBooleanArray( arrayWriteValues );
                break;
            case BuiltInType.Byte:
                arrayWriteValues = new UaBytes();
                arrayWriteValues[0] = 5;
                arrayWriteValues[1] = 6;
                arrayWriteValues[2] = 7;
                items[i].Value.Value.setByteArray( arrayWriteValues );
                break;
            case BuiltInType.ByteString:
                arrayWriteValues = new UaByteStrings();
                arrayWriteValues[0] = UaByteString.fromHexString( "0x436F6D706C69616E6365" );
                arrayWriteValues[1] = UaByteString.fromHexString( "0x54657374" );
                arrayWriteValues[2] = UaByteString.fromHexString( "0x546F6F6C" );
                items[i].Value.Value.setByteStringArray( arrayWriteValues );
                break;
            case BuiltInType.DateTime:
                arrayWriteValues = new UaDateTimes();
                arrayWriteValues[0] = UaDateTime.utcNow();
                arrayWriteValues[1] = arrayWriteValues[0].addHours(1);
                arrayWriteValues[2] = arrayWriteValues[1].addHours(1);
                items[i].Value.Value.setDateTimeArray( arrayWriteValues );
                break;
            case BuiltInType.Double:
                arrayWriteValues = new UaDoubles();
                arrayWriteValues[0] = 500;
                arrayWriteValues[1] = 900;
                arrayWriteValues[2] = 3.14;
                items[i].Value.Value.setDoubleArray( arrayWriteValues );
                break;
            case BuiltInType.Float:
                arrayWriteValues = new UaFloats();
                arrayWriteValues[0] = 1.1;
                arrayWriteValues[1] = 2.2;
                arrayWriteValues[2] = 3.14;
                items[i].Value.Value.setFloatArray( arrayWriteValues );
                break;
            case BuiltInType.Guid:
                arrayWriteValues = new UaGuids();
                arrayWriteValues[0] = new UaGuid( "{83B1CA3D-0C92-3DCC-A551-9856BAD027CE}" );
                arrayWriteValues[1] = new UaGuid( "{D8E71CFD-AF83-3FC0-954B-DFEB79C8E7E3}" );
                arrayWriteValues[2] = new UaGuid( "{0E617567-FAFC-32BD-BD4D-BE89B905580D}" );
                items[i].Value.Value.setGuidArray( arrayWriteValues );
                break;
            case BuiltInType.Int16:
                arrayWriteValues = new UaInt16s();
                arrayWriteValues[0] = 5555;
                arrayWriteValues[1] = 6666;
                arrayWriteValues[2] = 5656;
                items[i].Value.Value.setInt16Array( arrayWriteValues );
                break;
            case BuiltInType.Int32:
                arrayWriteValues = new UaInt32s();
                arrayWriteValues[0] = 555555;
                arrayWriteValues[1] = 666666;
                arrayWriteValues[2] = 565656;
                items[i].Value.Value.setInt32Array( arrayWriteValues );
                break;
            case BuiltInType.Int64:
                arrayWriteValues = new UaInt64s();
                arrayWriteValues[0] = 555555555;
                arrayWriteValues[1] = 666666666;
                arrayWriteValues[2] = 565656565;
                items[i].Value.Value.setInt64Array( arrayWriteValues );
                break;
            case BuiltInType.LocalizedText:
                var originalLocalizedTextArray = items[i].OriginalValue.toLocalizedTextArray();
                arrayWriteValues = new UaLocalizedTexts();
                arrayWriteValues[0].Text = "UACTT 1/3";
                arrayWriteValues[0].Locale = originalLocalizedTextArray[originalLocalizedTextArray.length - 3].Locale;
                arrayWriteValues[1].Text = "UACTT 2/3";
                arrayWriteValues[1].Locale = originalLocalizedTextArray[originalLocalizedTextArray.length - 2].Locale;
                arrayWriteValues[2].Text = "UACTT 3/3";
                arrayWriteValues[2].Locale = originalLocalizedTextArray[originalLocalizedTextArray.length - 1].Locale;
                items[i].Value.Value.setLocalizedTextArray( arrayWriteValues );
                break;
            case BuiltInType.QualifiedName:
                arrayWriteValues = new UaQualifiedNames();
                arrayWriteValues[0].Name = "UACTT 1/3";
                arrayWriteValues[1].Name = "UACTT 2/3";
                arrayWriteValues[2].Name = "UACTT 3/3";
                items[i].Value.Value.setQualifiedNameArray( arrayWriteValues );
                break;
            case BuiltInType.String:
                arrayWriteValues = new UaStrings();
                arrayWriteValues[0] = "Hello World #0, CTT 5.8.2-008.js";
                arrayWriteValues[1] = "Hello World #1, CTT 5.8.2-008.js";
                arrayWriteValues[2] = "Hello World #2, CTT 5.8.2-008.js";
                items[i].Value.Value.setStringArray( arrayWriteValues );
                break;
            case BuiltInType.SByte:
                arrayWriteValues = new UaSBytes();
                arrayWriteValues[0] = 100;
                arrayWriteValues[1] = 50;
                arrayWriteValues[2] = 8;
                items[i].Value.Value.setSByteArray( arrayWriteValues );
                break;
            case BuiltInType.UInt16:
                arrayWriteValues = new UaUInt16s();
                arrayWriteValues[0] = 55555;
                arrayWriteValues[1] = 44444;
                arrayWriteValues[2] = 56565;
                items[i].Value.Value.setUInt16Array( arrayWriteValues );
                break;
            case BuiltInType.UInt32:
                arrayWriteValues = new UaUInt32s();
                arrayWriteValues[0] = 55555;
                arrayWriteValues[1] = 66666;
                arrayWriteValues[2] = 56565;
                items[i].Value.Value.setUInt32Array( arrayWriteValues );
                break;
            case BuiltInType.UInt64:
                arrayWriteValues = new UaUInt64s();
                arrayWriteValues[0] = 55555;
                arrayWriteValues[1] = 66666;
                arrayWriteValues[2] = 56565;
                items[i].Value.Value.setUInt64Array( arrayWriteValues );
                break;
            case BuiltInType.Variant:
                arrayWriteValues = new UaVariants();
                arrayWriteValues[0].setInt32( 55555 );
                arrayWriteValues[1].setInt32( 66666 );
                arrayWriteValues[2].setInt32( 56565 );
                items[i].Value.Value.setVariantArray( arrayWriteValues );
                break;
            case BuiltInType.XmlElement:
                arrayWriteValues = new UaXmlElements();
                arrayWriteValues[0] = new UaXmlElement();
                arrayWriteValues[0].setString( "<a>5.8.2-008</a>" );
                arrayWriteValues[1] = new UaXmlElement();
                arrayWriteValues[1].setString( "<b>5.8.2-008</b>" );
                arrayWriteValues[2] = new UaXmlElement();
                arrayWriteValues[2].setString( "<c>5.8.2-008</c>" );
                items[i].Value.Value.setXmlElementArray( arrayWriteValues );
                break;
            default:
                break;
        }//switch
    }// if moveOntoSecondRead
    
    // invoke the writes
    return( WriteHelper.Execute( { NodesToWrite:items, OperationResults:expectedResults, CheckNotSupported:true, ReadVerification:false } ) );
}

Test.Execute( { Procedure: write582008 } );