/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to a element 1 within an array, for each supported data-type. */

function write582005() {
    const MIN_ARRAY_UBOUND = 2;

    // specify the element number that we want to write to 
    for( var i=0; i<items.length; i++ ) items[i].IndexRange = "1";
    var finalItems = [];

    var newArrayValue;
    var expectedResults = [];

    for( var i=0; i<items.length; i++ ) {
        var arrayWriteValues;
        switch( UaNodeId.GuessType( items[i].NodeSetting ) ) {
            case BuiltInType.Boolean:
                addLog( "[" + i + "] Will write to an array of Booleans" );
                arrayWriteValues = new UaBooleans();
                arrayWriteValues[0] = true;
                items[i].Value.Value.setBooleanArray( arrayWriteValues );
                break;
            case BuiltInType.Byte:
                addLog( "[" + i + "] Will write to an array of Bytes" );
                arrayWriteValues = new UaBytes();
                arrayWriteValues[0] = 5;
                items[i].Value.Value.setByteArray( arrayWriteValues );
                break;
            case BuiltInType.ByteString:
                addLog( "[" + i + "] Will write to an array of ByteStrings" );
                arrayWriteValues = new UaByteStrings();
                arrayWriteValues[0] = UaByteString.fromHexString( "0x5A6170" );
                items[i].Value.Value.setByteStringArray( arrayWriteValues );
                break;
            case BuiltInType.DateTime:
                addLog( "[" + i + "] Will write to an array of DateTimes" );
                arrayWriteValues = new UaDateTimes();
                arrayWriteValues[0] = UaDateTime.utcNow();
                items[i].Value.Value.setDateTimeArray( arrayWriteValues );
                break;
            case BuiltInType.Double:
                addLog( "[" + i + "] Will write to an array of Doubles" );
                arrayWriteValues = new UaDoubles();
                arrayWriteValues[0] = 500.1;
                items[i].Value.Value.setDoubleArray( arrayWriteValues );
                break;
            case BuiltInType.Float:
                addLog( "[" + i + "] Will write to an array of Floats" );
                arrayWriteValues = new UaFloats();
                arrayWriteValues[0] = 1.1;
                items[i].Value.Value.setFloatArray( arrayWriteValues );
                break;
            case BuiltInType.Guid:
                addLog( "[" + i + "] Will write to an array of Guids" );
                arrayWriteValues = new UaGuids();
                arrayWriteValues[0] = new UaGuid( "{24BC8E6E-56E5-4783-AA30-FFB3B2454F90}" );
                items[i].Value.Value.setGuidArray( arrayWriteValues );
                break;
            case BuiltInType.Int16:
                addLog( "[" + i + "] Will write to an array of Int16s" );
                arrayWriteValues = new UaInt16s();
                arrayWriteValues[0] = 5555;
                items[i].Value.Value.setInt16Array( arrayWriteValues );
                break;
            case BuiltInType.Int32:
                addLog( "[" + i + "] Will write to an array of Int32s" );
                arrayWriteValues = new UaInt32s();
                arrayWriteValues[0] = 555555;
                items[i].Value.Value.setInt32Array( arrayWriteValues );
                break;
            case BuiltInType.Int64:
                addLog( "[" + i + "] Will write to an array of Int64s" );
                arrayWriteValues = new UaInt64s();
                arrayWriteValues[0] = 555555555;
                items[i].Value.Value.setInt64Array( arrayWriteValues );
                break;
            case BuiltInType.LocalizedText:
                addLog( "[" + i + "] will write to an array of LocalizedText" );
                arrayWriteValues = new UaLocalizedTexts();
                arrayWriteValues[0].Text = "Hello world, CTT.";
                items[i].Value.Value.setLocalizedTextArray( arrayWriteValues );
                break;
            case BuiltInType.QualifiedName:
                addLog( "[" + i + "] will write to an array of QualifiedName" );
                arrayWriteValues = new UaQualifiedNames();
                arrayWriteValues[0].Name = "Hello world, CTT.";
                items[i].Value.Value.setQualifiedNameArray( arrayWriteValues );
                break;
            case BuiltInType.String:
                addLog( "[" + i + "] Will write to an array of Strings" );
                arrayWriteValues = new UaStrings();
                arrayWriteValues[0] = "Hello World, CTT 5.8.2-006.js";
                items[i].Value.Value.setStringArray( arrayWriteValues );
                break;
            case BuiltInType.SByte:
                addLog( "[" + i + "] Will write to an array of SBytes" );
                arrayWriteValues = new UaSBytes();
                arrayWriteValues[0] = 100;
                items[i].Value.Value.setSByteArray( arrayWriteValues );
                break;
            case BuiltInType.UInt16:
                addLog( "[" + i + "] Will write to an array of UInt16s" );
                arrayWriteValues = new UaUInt16s();
                arrayWriteValues[0] = 55555;
                items[i].Value.Value.setUInt16Array( arrayWriteValues );
                break;
            case BuiltInType.UInt32:
                addLog( "[" + i + "] Will write to an array of UInt32s" );
                arrayWriteValues = new UaUInt32s();
                arrayWriteValues[0] = 55555;
                items[i].Value.Value.setUInt32Array( arrayWriteValues );
                break;
            case BuiltInType.UInt64:
                addLog( "[" + i + "] Will write to an array of UInt64s" );
                arrayWriteValues = new UaUInt64s();
                arrayWriteValues[0] = 55555;
                items[i].Value.Value.setUInt64Array( arrayWriteValues );
                break;
            case BuiltInType.Variant:
                addLog( "[" + i + "] will write to an array of Variant" );
                arrayWriteValues = new UaVariants();
                arrayWriteValues[0].setString( "Hello world, CTT." );
                items[i].Value.Value.setVariantArray( arrayWriteValues );
                break;
            case BuiltInType.XmlElement:
                addLog( "[" + i + "] Will write to an array of XmlElements" );
                arrayWriteValues = new UaXmlElements();
                arrayWriteValues[0] = new UaXmlElement();
                arrayWriteValues[0].setString( "<HelloWorld>CTT 5.8.2-006.js</HelloWorld>" );
                items[i].Value.Value.setXmlElementArray( arrayWriteValues );
                break; 
            default:
                break;
        }//switch
    
        // acceptable results for the write request
        var expectedResult = new ExpectedAndAcceptedResults( StatusCode.Good );
        expectedResult.addExpectedResult( StatusCode.BadWriteNotSupported );
        expectedResults.push( expectedResult );
    }//for
    //WRITE the nodes.
    WriteHelper.Execute( { NodesToWrite:items, OperationResults:expectedResults, CheckNotSupported:true, ReadVerification:false } );
    return( true );
}

Test.Execute( { Procedure: write582005 } );