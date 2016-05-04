/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to the first 3 elements (IndexRage="0:2") of a Node. Do this for each core data-type.
        However, also write to other elements in the array too. */

function write582007() {
    for( var i=0; i<items.length; i++ ){ items[i].IndexRange = "0:2"; }
    var expectedResults = [];

    //dynamically construct IDs of nodes to write, specifically their values.
    for( var i=0; i<items.length; i++ ) {
        expectedResults[i] = new ExpectedAndAcceptedResults( StatusCode.Good );
        expectedResults[i].addExpectedResult( StatusCode.BadWriteNotSupported );

        // this variable will contain the SPECIFIC UA Array object that will 
        // then be passed to the WRITE call.
        var arrayWriteValues;
        switch( UaNodeId.GuessType( items[i].NodeSetting ) ) {
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
                arrayWriteValues[1] = UaDateTime.utcNow();
                arrayWriteValues[1].addHours(1);
                arrayWriteValues[2] = UaDateTime.utcNow();
                arrayWriteValues[2].addHours(2);
                items[i].Value.Value.setDateTimeArray( arrayWriteValues );
                break;
            case BuiltInType.Double:
                arrayWriteValues = new UaDoubles();
                arrayWriteValues[0] = 500;
                arrayWriteValues[1] = 900;
                arrayWriteValues[2] = 1800;
                items[i].Value.Value.setDoubleArray( arrayWriteValues );
                break;
            case BuiltInType.Float:
                arrayWriteValues = new UaFloats();
                arrayWriteValues[0] = 1.1;
                arrayWriteValues[1] = 2.2;
                arrayWriteValues[2] = 3.3;
                items[i].Value.Value.setFloatArray( arrayWriteValues );
                break;
            case BuiltInType.Guid:
                arrayWriteValues = new UaGuids();
                arrayWriteValues[0] = new UaGuid( "{27CA74D7-320E-404E-A987-C78AB0BCC555}" );
                arrayWriteValues[1] = new UaGuid( "{2DE544F1-F463-4D38-81F6-2DA7191E16E3}" );
                arrayWriteValues[2] = new UaGuid( "{CDB4AC4D-AA56-417D-A045-C79894BCA4E0}" );
                items[i].Value.Value.setGuidArray( arrayWriteValues );
                break;
            case BuiltInType.Int16:
                arrayWriteValues = new UaInt16s();
                arrayWriteValues[0] = 5555;
                arrayWriteValues[1] = 6666;
                arrayWriteValues[2] = 7777;
                items[i].Value.Value.setInt16Array( arrayWriteValues );
                break;
            case BuiltInType.Int32:
                arrayWriteValues = new UaInt32s();
                arrayWriteValues[0] = 555555;
                arrayWriteValues[1] = 666666;
                arrayWriteValues[2] = 777777;
                items[i].Value.Value.setInt32Array( arrayWriteValues );
                break;
            case BuiltInType.Int64: 
                arrayWriteValues = new UaInt64s();
                arrayWriteValues[0] = 555555555;
                arrayWriteValues[1] = 666666666;
                arrayWriteValues[2] = 777777777;
                items[i].Value.Value.setInt64Array( arrayWriteValues );
                break;
            case BuiltInType.LocalizedText:
                var originalLocalizedTextArray = items[i].OriginalValue.toLocalizedTextArray();
                arrayWriteValues = new UaLocalizedTexts();
                for( var z=0; z<3; z++ ) {
                    var lt = new UaLocalizedText();
                    lt.Locale = originalLocalizedTextArray[z].Locale;
                    lt.Text = "CTT_" + z;
                    arrayWriteValues[z] = lt;
                }
                items[i].Value.Value.setLocalizedTextArray( arrayWriteValues );
                break;
            case BuiltInType.QualifiedName:
                arrayWriteValues = new UaQualifiedNames();
                for( var z=0; z<3; z++ ) {
                    var qn = new UaQualifiedName();
                    qn.Name = "CTT_" + z;
                    arrayWriteValues[z] = qn;
                }
                items[i].Value.Value.setQualifiedNameArray( arrayWriteValues );
                break;
            case BuiltInType.String:
                arrayWriteValues = new UaStrings();
                arrayWriteValues[0] = WriteService.GenerateString( "Hello World #1" );
                arrayWriteValues[1] = WriteService.GenerateString( "Hello World #2" );
                arrayWriteValues[2] = WriteService.GenerateString( "Hello World #3" );
                items[i].Value.Value.setStringArray( arrayWriteValues );
                break;
            case BuiltInType.SByte:
                arrayWriteValues = new UaSBytes();
                arrayWriteValues[0] = 100;
                arrayWriteValues[1] = 50;
                arrayWriteValues[2] = 80;
                items[i].Value.Value.setSByteArray( arrayWriteValues );
                break;
            case BuiltInType.UInt16:
                arrayWriteValues = new UaUInt16s();
                arrayWriteValues[0] = 55555;
                arrayWriteValues[1] = 44444;
                arrayWriteValues[2] = 45454;
                items[i].Value.Value.setUInt16Array( arrayWriteValues );
                break;
            case BuiltInType.UInt32: 
                arrayWriteValues = new UaUInt32s();
                arrayWriteValues[0] = 55555;
                arrayWriteValues[1] = 66666;
                arrayWriteValues[2] = 77777;
                items[i].Value.Value.setUInt32Array( arrayWriteValues );
                break;
            case BuiltInType.UInt64:
                arrayWriteValues = new UaUInt64s();
                arrayWriteValues[0] = 55555;
                arrayWriteValues[1] = 66666;
                arrayWriteValues[2] = 77777;
                items[i].Value.Value.setUInt64Array( arrayWriteValues );
                break;
            case BuiltInType.Variant:
                arrayWriteValues = new UaVariants();
                for( var z=0; z<3; z++ ) {
                    arrayWriteValues[z] = new UaVariant();
                    arrayWriteValues[z].setInt16( z );
                }
                items[i].Value.Value.setVariantArray( arrayWriteValues );
                break;
            case BuiltInType.XmlElement:
                arrayWriteValues = new UaXmlElements();
                arrayWriteValues[0] = new UaXmlElement();
                arrayWriteValues[0].setString( "<HelloWorld1>CTT 5.8.2-006.js</HelloWorld1>" );
                arrayWriteValues[1] = new UaXmlElement();
                arrayWriteValues[1].setString( "<HelloWorld2>CTT 5.8.2-006.js</HelloWorld2>" );
                arrayWriteValues[2] = new UaXmlElement();
                arrayWriteValues[2].setString( "<HelloWorld3>CTT 5.8.2-006.js</HelloWorld3>" );
                items[i].Value.Value.setXmlElementArray( arrayWriteValues );
                break;
            default:
                break;
        }//switch
    }//for

    //WRITE the nodes.
    if( WriteHelper.Execute( { NodesToWrite: items, OperationResults: expectedResults, CheckNotSupported: true } ) ) {
        // we now need to read-back the arrays and make sure that ONLY the first three elements
        // were written. We can compare the current values to the originals that were read in initialize.js.
        // request an index range of 0:3; (to include the additional item)
        for( var i=0; i<items.length; i++ ) { 
            // did the write succeed?
            if( WriteHelper.Response.Results[i].StatusCode != StatusCode.BadWriteNotSupported ) items[i].IndexRange = "0:3"; 
            else {
                addSkipped( "Skipping test because writing to IndexRange is not Supported." );
                return( false );
            }        
        }
        // invoke the read.
        ReadHelper.Execute( { NodesToRead:items, TimestampsToReturn:TimestampsToReturn.Server } );
        // now compare the results. We expect the element 3 (4th item) to be unchanged.
        for( var i=0; i<items.length; i++ ) {
            // get the original and new values into native array types
            var originalNT = UaVariantToSimpleType( items[i].OriginalValue );
            var newNT = UaVariantToSimpleType( items[i].Value.Value );
            Assert.Equal( originalNT[3], newNT[3], "Expected element 3 (4th element) to remain unchanged." );
        }
    }
    return( true );
}

Test.Execute( { Procedure: write582007 } );