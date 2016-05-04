/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to an Array Node while specify values for each and every element. Do this for each core data-type. IndexRange = "". */

function write582009() {
    var expectedResults = [];

    for( var i=0; i<items.length; i++ ) {
        expectedResults[i] = new ExpectedAndAcceptedResults( StatusCode.Good );
        expectedResults[i].addExpectedResult( StatusCode.BadWriteNotSupported );
        // now to specify the values to write
        var arrayWriteValues;
        var arrayLength = items[i].Value.Value.getArraySize();
        switch( items[i].Value.Value.DataType ) {
            case BuiltInType.Boolean:
                arrayWriteValues = new UaBooleans();
                for( w=0; w<arrayLength; w++ ) arrayWriteValues[w] = w % 2 === 0 ? true : false;
                items[i].Value.Value.setBooleanArray( arrayWriteValues );
                break;
            case BuiltInType.Byte:
                arrayWriteValues = new UaBytes();
                for( w=0; w<arrayLength; w++ ) arrayWriteValues[w] = w;
                items[i].Value.Value.setByteArray( arrayWriteValues );
                break;
            case BuiltInType.ByteString:
                arrayWriteValues = new UaByteStrings();
                for( w=0; w<arrayLength; w++ ) arrayWriteValues[w] = ( UaByteString.fromStringData( "CTT 5.8.2-009 (" + w + ")" ) );
                items[i].Value.Value.setByteStringArray( arrayWriteValues );
                break;
            case BuiltInType.DateTime:
                arrayWriteValues = new UaDateTimes();
                for( w=0; w<arrayLength; w++ ) {
                    var nowDateTime = UaDateTime.utcNow();
                    nowDateTime.addHours( w );
                    arrayWriteValues[w] = nowDateTime;
                }
                items[i].Value.Value.setDateTimeArray( arrayWriteValues );
                break;
            case BuiltInType.Double:
                arrayWriteValues = new UaDoubles();
                for( w=0; w<arrayLength; w++ ) arrayWriteValues[w] = 0.5 * w;
                items[i].Value.Value.setDoubleArray( arrayWriteValues );
                break;
            case BuiltInType.Float:
                arrayWriteValues = new UaFloats();
                for( w=0; w<arrayLength; w++ ) arrayWriteValues[w] = 1.1 * w;
                items[i].Value.Value.setFloatArray( arrayWriteValues );
                break;
            case BuiltInType.Guid:
                arrayWriteValues = new UaGuids();
                for( w=0; w<arrayLength; w++ ) arrayWriteValues[w] = new UaGuid();
                items[i].Value.Value.setGuidArray( arrayWriteValues );
                break;
            case BuiltInType.Int16:
                arrayWriteValues = new UaInt16s();
                for( w=0; w<arrayLength; w++ ) arrayWriteValues[w] = 10 + w;
                items[i].Value.Value.setInt16Array( arrayWriteValues );
                break;
            case BuiltInType.Int32:
                arrayWriteValues = new UaInt32s();
                for( w=0; w<arrayLength; w++ ) arrayWriteValues[w] = 100 + w;
                items[i].Value.Value.setInt32Array( arrayWriteValues );
                break;
            case BuiltInType.Int64:
                arrayWriteValues = new UaInt64s();
                for( w=0; w<arrayLength; w++ ) arrayWriteValues[w] = 100000 + w;
                items[i].Value.Value.setInt64Array( arrayWriteValues );
                break;
            case BuiltInType.LocalizedText:
                var originalLocalizedTextArray = items[i].OriginalValue.toLocalizedTextArray();
                arrayWriteValues = new UaLocalizedTexts();
                for( w=0; w<arrayLength; w++ ) {
                    arrayWriteValues[w].Locale = originalLocalizedTextArray[w].Locale;
                    arrayWriteValues[w].Text = "UACTT 1/" + ( 1 + w );
                }
                items[i].Value.Value.setLocalizedTextArray( arrayWriteValues );
                break;
            case BuiltInType.QualifiedName:
                arrayWriteValues = new UaQualifiedNames();
                for( w=0; w<arrayLength; w++ ) arrayWriteValues[w].Name = "UACTT 1/" + ( 1+ w );
                items[i].Value.Value.setQualifiedNameArray( arrayWriteValues );
                break;
            case BuiltInType.String:
                arrayWriteValues = new UaStrings();
                for( w=0; w<arrayLength; w++ ) arrayWriteValues[w] = WriteService.GenerateString( { alternate:("Hello World CTT 5.8.2-006.js # " + w) } );
                items[i].Value.Value.setStringArray( arrayWriteValues );
                break;
            case BuiltInType.SByte:
                arrayWriteValues = new UaSBytes();
                for( w=0; w<arrayLength; w++ ) arrayWriteValues[w] = w;
                items[i].Value.Value.setSByteArray( arrayWriteValues );
                break;
            case BuiltInType.UInt16:
                arrayWriteValues = new UaUInt16s();
                for( w=0; w<arrayLength; w++ ) arrayWriteValues[w] = 10 + w;
                items[i].Value.Value.setUInt16Array( arrayWriteValues );
                break;
            case BuiltInType.UInt32:
                arrayWriteValues = new UaUInt32s();
                for( w=0; w<arrayLength; w++ ) arrayWriteValues[w] = 10 + w;
                items[i].Value.Value.setUInt32Array( arrayWriteValues );
                break;
            case BuiltInType.UInt64:
                arrayWriteValues = new UaUInt64s();
                for( w=0; w<arrayLength; w++ ) arrayWriteValues[w] = 10 + w;
                items[i].Value.Value.setUInt64Array( arrayWriteValues );
                break;
            case BuiltInType.Variant:
                arrayWriteValues = new UaVariants();
                for( w=0; w<arrayLength; w++ ) arrayWriteValues[w].setUInt64( 10 + w );
                items[i].Value.Value.setVariantArray( arrayWriteValues );
                break;
            case BuiltInType.XmlElement:
                arrayWriteValues = new UaXmlElements();
                for( w=0; w<arrayLength; w++ ) {
                    arrayWriteValues[w] = new UaXmlElement();
                    arrayWriteValues[w].setString( "<a" + w + ">hello</a" + w + ">" );
                }
                items[i].Value.Value.setXmlElementArray( arrayWriteValues );
                break;
            default:
                break;
        }//switch
    }//for

    //WRITE the nodes.
    return( WriteHelper.Execute( { NodesToWrite:items, OperationResults:expectedResults, CheckNotSupported:true } ) );
}// function write582009() 

Test.Execute( { Procedure: write582009 } );