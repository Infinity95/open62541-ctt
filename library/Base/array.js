/*global BuiltInType, readSetting, UaBooleans, UaByteString, UaByteStrings, UaDateTime,
  UaDateTimes, UaDoubles, UaFloats, UaGuid, UaGuids, UaInt16s, UaInt32s, UaInt64s,
  UaNodeId, UaStrings, UaSBytes, UaUInt16s, UaUInt32s, UaUInt64s
*/

function RandomizeArrayElements( array ) {
    var a = [];
    while( array.length > 0 ) {
        var index = parseInt( array.length * Math.random() );
        if( index === -1 ) continue;
        print( "index: " + index + "; array element value: " + array[index] + ". Length: " + array.length );
        a.push( array[index] );
        array.splice( index, 1 );
    }
    return( a );
}//RandomizeArrayElements


// Convert an array to a printable string. conjunction is typically "and" or "or".
function ArrayToFormattedString( array, conjunction ) {
    var str = array.toString().replace( /\,/g, ", " );
    str = str.replace( /(.*)\,/, "$1, " + conjunction );
    return str;
}


// Find a value within a specified array. Return TRUE if found, otherwise FALSE.
function ArrayContains( arrayToSearch, valueToFind ) {
    if( arrayToSearch.length !== undefined ) {
        for( var i=0; i<arrayToSearch.length; i++ ) {
            if( valueToFind === arrayToSearch[i] ) return( true );
            else {
                try{ if ( valueToFind.equals( arrayToSearch[i] ) ) return( true ); }
                catch( e ){};
            }
        }
    }
    return( false );
}


function ArrayIndexOf( arrayToSearch, valueToFind ) { 
    if( isDefined( arrayToSearch ) && arrayToSearch.length > 0 && valueToFind !== undefined && valueToFind !== null ){
        for( var i=0; i<arrayToSearch.length; i++ ) {
            if( arrayToSearch[i] === valueToFind ) {
                return( i );
            }
        }// for i...
    }
    else return( -1 );
}// function ArrayIndexOf( arrayToSearch, valueToFind )


function ArrayRemoveElement( arrayToModify, valueToFind ) {
    if( isDefined( arrayToModify ) && arrayToModify.length > 0 && valueToFind !== undefined && valueToFind !== null ){
        var index = ArrayIndexOf( arrayToModify, valueToFind );
        if( index >= 0 ) { 
            arrayToModify.splice( index, 1 );
        }//if array contains
    }// if parameters are good
}// function ArrayRemoveElement( arrayToModify, valueToFind )


// Does the array contain the NodeId?
function IsNodeIdInArray( nodeIds, nodeId ) {
    for( var n = 0; n < nodeIds.length; n++ ) {
        if( nodeIds[n].equals( nodeId ) ) return true;
    }
    return false;
}


// Add the nodeId to an array (if the array does not already contain it)
function AddUniqueNodeIdToArray( nodeIds, nodeId ) {
    var found = IsNodeIdInArray( nodeIds, nodeId );
    if( !found ) nodeIds.push( nodeId );
}


// From a NodeId setting, create the NodeId and add it to the array
// only if the NodeId is not null and not already in the array.
function AddNodeIdSettingToUniqueArray( nodeIds, nodeIdSetting, maxLength ) {
    var settingValue = readSetting( nodeIdSetting );
    if( settingValue !== undefined && settingValue !== null && settingValue.toString() !== "undefined" ) {
        var nodeId = UaNodeId.fromString( settingValue.toString() );
        if( nodeId === null ) return;
        if( nodeIds.length < maxLength ) AddUniqueNodeIdToArray( nodeIds, nodeId );
    }
}


// Create an array of unique NodeIds by looking up every NodeId setting.
// The array will not exceed maxLength.
function GetMultipleUniqueNodeIds( maxLength )
{
    var nodeIds = [];
    
    if( nodeIds.length !== maxLength )
    {
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Scalar/Bool", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Scalar/Byte", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Scalar/DateTime", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Scalar/Float", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Scalar/Double", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Scalar/Guid", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Scalar/Int16", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Scalar/Int32", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Scalar/Int64", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Scalar/String", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Scalar/SByte", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Scalar/ByteString", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Scalar/UInt16", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Scalar/UInt32", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Scalar/UInt64", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Scalar/XmlElement", maxLength );
    }
    if( nodeIds.length !== maxLength )
    {
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Arrays/Bool", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Arrays/DateTime", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Arrays/Float", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Arrays/Double", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Arrays/Guid", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Arrays/Int16", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Arrays/Int32", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Arrays/Int64", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Arrays/String", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Arrays/ByteString", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Arrays/UInt16", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Arrays/UInt32", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Arrays/UInt64", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Static/All Profiles/Arrays/XmlElement", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/References/Has 3 Forward References 1", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/References/Has 3 Forward References 2", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/References/Has 3 Forward References 3", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/References/Has 3 Forward References 4", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/References/Has 3 Forward References 5", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/References/Has Inverse And Forward References", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/References/Has References With Different Parent Types", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/References/Has 3 Inverse References 1", maxLength );
        AddNodeIdSettingToUniqueArray( nodeIds, "/Server Test/NodeIds/Paths/Starting Node 1", maxLength );
    }

    return nodeIds;
}


/* Parameters include;
    monitoredItems:      monitoredItem objects (base/Objects)
    valuesToGenerate:    how many values to generate within the array
    offset:              a starting number used to generate each value 
    setValue:            enumeration defining a specific set of values to initialize with
//*/
function SetArrayWriteValuesInMonitoredItems( monitoredItems, valuesToGenerate, offset, setValue ) {
    if( offset === undefined ) {
        offset = new Date().getSeconds(); // use this to get current Second, use it to generate different values
    }
    var arrayWriteValues;
    var i;
    var temp;

    print( "\n\n\nGenerating " + valuesToGenerate + " Array values (offset " + offset + ") ..." );
    for( var m=0; m<monitoredItems.length; m++ ) {
        var dataType = monitoredItems[m].DataType;
        if( dataType === undefined || dataType === null ) {
            dataType = UaNodeId.GuessType( monitoredItems[m].NodeSetting );
        }
        switch( dataType )
        {
            case BuiltInType.Boolean:
                arrayWriteValues = new UaBooleans();
                for( i=0; i<valuesToGenerate; i++ ) {
                    if( setValue !== undefined && setValue !== null ) {
                        arrayWriteValues[i] = false;
                    }
                    else {
                        arrayWriteValues[i] = ( i + offset ) % 2;
                    }
                }
                monitoredItems[m].Value.Value.setBooleanArray( arrayWriteValues );
                break;

            case BuiltInType.Byte:
                arrayWriteValues = new UaBytes();
                for( i=0; i<valuesToGenerate; i++ ) {
                    if( setValue !== undefined && setValue !== null ) {
                        arrayWriteValues[i] = 0;
                    }
                    else {
                        arrayWriteValues[i] = i;
                    }
                }
                monitoredItems[m].Value.Value.setByteArray( arrayWriteValues );
                break;

            case BuiltInType.ByteString:
                if( monitoredItems[m].Value.Value.ArrayType == 0 ) {
                    var strVal = "";
                    // we need to create a string whose length matches the requirement
                    for( i=0; i<valuesToGenerate; i++ ) {
                        strVal += "A";
                    }
                    arrayWriteValues = UaByteString.fromStringData( strVal );
                    monitoredItems[m].Value.Value.setByteString( arrayWriteValues );
                }
                else
                {
                    arrayWriteValues = new UaByteStrings();
                    for( i=0; i<valuesToGenerate; i++ ) {
                        var strVal = "";
                        // we need to create a string whose length matches the requirement
                        for( var n=0; n<valuesToGenerate; n++ ) {
                            if( setValue !== undefined && setValue !== null ) {
                                strVal += "*";
                            }
                            else {
                                strVal += String.fromCharCode( ( i + "A".charCodeAt( 0 ) ) );
                            }
                        }
                        arrayWriteValues[i] = UaByteString.fromStringData( strVal );
                    }
                    monitoredItems[m].Value.Value.setByteStringArray( arrayWriteValues );
                }
                break;

            case BuiltInType.DateTime:
                arrayWriteValues = new UaDateTimes();
                var now = UaDateTime.utcNow();
                for( i=0; i<valuesToGenerate; i++ ) {
                    if( setValue !== undefined && setValue !== null ) {
                        arrayWriteValues[i] = new UaDateTime();
                    }
                    else {
                        arrayWriteValues[i] = now.addSeconds( offset + i );
                    }
                }
                monitoredItems[m].Value.Value.setDateTimeArray( arrayWriteValues );
                break;

            case BuiltInType.Double:
                arrayWriteValues = new UaDoubles();
                for( i=0; i<valuesToGenerate; i++ ) {
                    if( setValue !== undefined && setValue !== null ) {
                        arrayWriteValues[i] = 0;
                    }
                    else {
                        arrayWriteValues[i] = offset * ( i + 1 ) * 2.1;
                    }
                }
                monitoredItems[m].Value.Value.setDoubleArray( arrayWriteValues );
                break;

            case BuiltInType.Float:
                arrayWriteValues = new UaFloats();
                for( i=0; i<valuesToGenerate; i++ ) {
                    if( setValue !== undefined && setValue !== null ) {
                        arrayWriteValues[i] = 0.0;
                    }
                    else {
                        arrayWriteValues[i] = 1.1 * ( i + 1 ) * offset;
                    }
                }
                monitoredItems[m].Value.Value.setFloatArray( arrayWriteValues );
                break;

            case BuiltInType.Guid:
                arrayWriteValues = new UaGuids();
                for( i=0; i<valuesToGenerate; i++ ) {
                    if( setValue !== undefined && setValue !== null ) {
                        arrayWriteValues[i] = new UaGuid( "{00000000-0000-0000-0000-000000000}" );
                    }
                    else {
                        temp = "{09C200B1-0CFB-479B-9F8E-3DEE6A01" + ( 40960 + offset + i ).toString(16) + "}";
                        arrayWriteValues[i] = new UaGuid( temp );
                    }
                }
                monitoredItems[m].Value.Value.setGuidArray( arrayWriteValues );
                break;

            case BuiltInType.Int16:
                arrayWriteValues = new UaInt16s();
                for( i=0; i<valuesToGenerate; i++ ) {
                    if( setValue !== undefined && setValue !== null ) {
                        arrayWriteValues[i] = 0;
                    }
                    else {
                        arrayWriteValues[i] = (offset + i) * 2;
                    }
                }
                monitoredItems[m].Value.Value.setInt16Array( arrayWriteValues );
                break;

            case BuiltInType.Int32:
                arrayWriteValues = new UaInt32s();
                for( i=0; i<valuesToGenerate; i++ ) {
                    if( setValue !== undefined && setValue !== null ) {
                        arrayWriteValues[i] = 0;
                    }
                    else {
                        arrayWriteValues[i] = ( offset + i ) * 10;
                    }
                }
                monitoredItems[m].Value.Value.setInt32Array( arrayWriteValues );
                break;

            case BuiltInType.Int64:
                arrayWriteValues = new UaInt64s();
                for( i=0; i<valuesToGenerate; i++ ) {
                    if( setValue !== undefined && setValue !== null ) {
                        arrayWriteValues[i] = 0;
                    }
                    else {
                        arrayWriteValues[i] = offset * ( i + 1 ) * 100;
                    }
                }
                monitoredItems[m].Value.Value.setInt64Array( arrayWriteValues );
                break;

            case BuiltInType.String:
                arrayWriteValues = new UaStrings();
                for( i=0; i<valuesToGenerate; i++ ) {
                    if( setValue !== undefined && setValue !== null ) {
                        arrayWriteValues[i] = "";
                    }
                    else {
                        arrayWriteValues[i] = "Hello World @" + ( offset + i );
                    }
                }
                monitoredItems[m].Value.Value.setStringArray( arrayWriteValues );
                break;

            case BuiltInType.SByte:
                arrayWriteValues = new UaSBytes();
                for( i=0; i<valuesToGenerate; i++ ) {
                    if( setValue !== undefined && setValue !== null ) {
                        arrayWriteValues[i] = 0;
                    }
                    else {
                        arrayWriteValues[i] = ( offset + i );
                    }
                }
                monitoredItems[m].Value.Value.setSByteArray( arrayWriteValues );
                break;

            case BuiltInType.UInt16:
                arrayWriteValues = new UaUInt16s();
                for( i=0; i<valuesToGenerate; i++ ) {
                    if( setValue !== undefined && setValue !== null ) {
                        arrayWriteValues[i] = 0;
                    }
                    else {
                        arrayWriteValues[i] = Math.abs( offset ) * ( i + 1 ) * 2;
                    }
                }
                monitoredItems[m].Value.Value.setUInt16Array( arrayWriteValues );
                break;

            case BuiltInType.UInt32:
                arrayWriteValues = new UaUInt32s();
                for( i=0; i<valuesToGenerate; i++ ) {
                    if( setValue !== undefined && setValue !== null ) {
                        arrayWriteValues[i] = 0;
                    }
                    else {
                        arrayWriteValues[i] = Math.abs( offset ) * ( i + 1 ) * 2;
                    }
                }
                monitoredItems[m].Value.Value.setUInt32Array( arrayWriteValues );
                break;

            case BuiltInType.UInt64:
                arrayWriteValues = new UaUInt64s();
                for( i=0; i<valuesToGenerate; i++ ) {
                    if( setValue !== undefined && setValue !== null ) {
                        arrayWriteValues[i] = 0;
                    }
                    else {
                        arrayWriteValues[i] = Math.abs( offset ) * ( i + 1 ) * 10;
                    }
                }
                monitoredItems[m].Value.Value.setUInt64Array( arrayWriteValues );
                break;

            case BuiltInType.XmlElement:
                arrayWriteValues = new UaXmlElements();
                for (i = 0; i < valuesToGenerate; i++) {
                    if( setValue !== undefined && setValue !== null ) {
                        var aXml = new UaXmlElement();
                        aXml.setString( "<a>" + i + "</a>" );
                        arrayWriteValues[i] = aXml;
                    }
                    else {
                        arrayWriteValues[i] = new UaXmlElement();
                        arrayWriteValues[i].setString( "<uactt" + i + ">" + (offset + i) + "</uactt" + i + ">" );
                    }
                }
                monitoredItems[m].Value.Value.setXmlElementArray( arrayWriteValues );
                break; 

            case BuiltInType.LocalizedText:
                arrayWriteValues = new UaLocalizedTexts();
                for( i=0; i<valuesToGenerate; i++ ) {
                    var lt = new UaLocalizedText();
                    lt.Locale = "en";
                    if( isDefined( setValue ) ) { 
                        lt.Text = setValue.toString();
                    }
                    else {
                        lt.Text = "UaCttLT#" + (offset + i );
                    }
                    arrayWriteValues[i] = lt;
                }//for i
                monitoredItems[m].Value.Value.setLocalizedTextArray( arrayWriteValues );
                break;

            case BuiltInType.QualifiedName:
                arrayWriteValues = new UaQualifiedNames();
                for( i=0; i<valuesToGenerate; i++ ) {
                    var qn = new UaQualifiedName();
                    qn.NamespaceIndex=100;
                    if( isDefined( setValue ) ) { 
                        qn.Name = setValue.toString();
                    }
                    else {
                        qn.Name = "UaCttLT#" + (offset + i );
                    }
                    arrayWriteValues[i] = qn;
                }//for i
                monitoredItems[m].Value.Value.setQualifiedNameArray( arrayWriteValues );
                break;

            case BuiltInType.Variant:
                arrayWriteValues = new UaVariants();
                for( i=0; i<valuesToGenerate; i++ ) {
                    var variant = new UaVariant();
                    if( i % 2 == 0 ) variant.setUInt16( offset + i );
                    else variant.setString("Hello World @" + ( offset + i ) );
                    arrayWriteValues[i] = variant;
                }
                monitoredItems[m].Value.Value.setVariantArray( arrayWriteValues );
                break;
 
             default:
                addError( "Could not generate array values: data type " + dataType.toString() + " is not supported" );
                break;
        }//switch
    }// for m...
}// function SetArrayWriteValuesInMonitoredItems( monitoredItems, valuesToGenerate, offset, setValue ) 


/* args, parameters:
    - Value : (required) UaVariant object
    - NewValue: (optional) a value to use when adding to the array */
function SafeArray(){}
SafeArray.AddElement = function( args ) {
    if( !isDefined( args ) ) throw( "arrayAddElement::args not specified." );
    if( !isDefined( args.Value ) ) throw( "arrayAddElement::args.Value not specified." );
    if( !isDefined( [ args.Value.DataType, args.Value.ArrayType ] ) ) throw("arrayAddElement::Value is not a UaVariant type." );
    var newVal = isDefined( args.NewValue )? args.NewVal : null;
    switch( args.Value.DataType ) {
        case Identifier.Boolean:
            if( newVal === null ) newVal = true;
            var bools = args.Value.toBooleanArray();
            bools[args.Value.getArraySize()] = newVal;
            args.Value.setBooleanArray( bools );
            break;
        case BuiltInType.Byte:
            if( newVal === null ) newVal = 100;
            var bytes = args.Value.toByteArray();
            bytes[args.Value.getArraySize()] = newVal;
            args.Value.setByteArray( bytes );
            break;
        case BuiltInType.ByteString:
            // is this a REAL bytestring? or a Byte[] converted to a ByteString?
            if( args.Value.ArrayType !== 0 ) {
                if( newVal === null ) newVal = UaByteString.fromStringData( "hello world" );
                var bstrings = args.Value.toByteStringArray();
                bstrings[args.Value.getArraySize()] = newVal;
                args.Value.setByteStringArray( bstrings );
            }
            else {
                // this seems to be Bytes[] converted to ByteString. We must go ByteString->byte[] and then byte[]->ByteString
                if( newVal === null ) newVal = 127;
                var bytes = UaByteString.ToByteArray( args.Value.toByteString() );
                bytes[bytes.length] = newVal;
                newVal = UaByteString.FromByteArray( bytes );
                args.Value.setByteString( newVal );
            }
            break;
        case BuiltInType.DateTime:
            if( newVal === null ) newVal = UaDateTime.utcNow();
            var dates = args.Value.toDateTimeArray();
            dates[args.Value.getArraySize()] = newVal;
            args.Value.setDateTimeArray( dates );
            break;
        case BuiltInType.Double:
            if( newVal === null ) newVal = 1000;
            var dbls = args.Value.toDoubleArray();
            dbls[args.Value.getArraySize()] = newVal;
            args.Value.setDoubleArray( dbls );
            break;
        case BuiltInType.Float:
            if( newVal === null ) newVal = 0.1;
            var floats = args.Value.toFloatArray();
            floats[args.Value.getArraySize()] = newVal;
            args.Value.setFloatArray( floats );
            break;
        case BuiltInType.Int16:
            if( newVal === null ) newVal = 1016;
            var int16s = args.Value.toInt16Array();
            int16s[args.Value.getArraySize()] = newVal;
            args.Value.setInt16Array( int16s );
            break;
        case BuiltInType.Int32:
            if( newVal === null ) newVal = 10032;
            var int32s = args.Value.toInt32Array();
            int32s[args.Value.getArraySize()] = newVal;
            args.Value.setInt32Array( int32s );
            break;
        case BuiltInType.Int64:
            if( newVal === null ) newVal = 100064;
            var int64s = args.Value.toInt64Array();
            int64s[args.Value.getArraySize()] = newVal;
            args.Value.setInt64Array( int64s );
            break;
        case BuiltInType.UInt16:
            if( newVal === null ) newVal = -1016;
            var uint16s = args.Value.toUInt16Array();
            uint16s[args.Value.getArraySize()] = newVal;
            args.Value.setUInt16Array( uint16s );
            break;
        case BuiltInType.UInt32:
            if( newVal === null ) newVal = -10032;
            var uint32s = args.Value.toUInt32Array();
            uint32s[args.Value.getArraySize()] = newVal;
            args.Value.setUInt32Array( uint32s );
            break;
        case BuiltInType.UInt64:
            if( newVal === null ) newVal = 100064;
            var uint64s = args.Value.toUInt64Array();
            uint64s[args.Value.getArraySize()] = newVal;
            args.Value.setUInt64Array( uint64s );
            break;
        case BuiltInType.String:
            if( newVal === null ) newVal = WriteService.GenerateString( gServerCapabilities.MaxStringLength );
            var strings = args.Value.toStringArray();
            strings[args.Value.getArraySize()] = newVal;
            args.Value.setStringArray( strings );
            break;
        case BuiltInType.SByte:
            if( newVal === null ) newVal = 100;
            var sbytes = args.Value.toSByteArray();
            sbytes[args.Value.getArraySize()] = newVal;
            args.Value.setSByteArray( sbytes );
            break;
        case BuiltInType.XmlElement:
            break;
    }//switch
}// Array.AddElement = function( args )


function _removeElement( args ) {
    var _a = [];
    for( i=0; i<args.Value.length; i++ ) _a.push( args.Value[i] );
    if( args.Index === undefined || args.Index === null ) args.Index = _a.length - 1;
    _a.splice( args.Index, args.Index );
    for( i=0; i<_a.length; i++) args.Type[i] = _a[i];
    return( args.Type );
}//function _removeElement( args ) 

SafeArray.RemoveElement = function( args ) {
    if( !isDefined( args ) ) throw( "arrayAddElement::args not specified." );
    if( !isDefined( args.Value ) ) throw( "arrayAddElement::args.Value not specified." );
    if( !isDefined( [ args.Value.DataType, args.Value.ArrayType ] ) ) throw("arrayAddElement::Value is not a UaVariant type." );
    var index = isDefined( args.Element )? args.Element : null;
    switch( args.Value.DataType ) {
        case Identifier.Boolean:
            var bools = _removeElement( { Value: args.Value.toBooleanArray(), Type:new UaBooleans(), Element: args.Element } );
            args.Value.setBooleanArray( bools );
            break;
        case BuiltInType.Byte:
            var bytes = _removeElement( { Value: args.Value.toByteArray(), Type: new UaBytes(), Element: args.Element } );
            args.Value.setByteArray( bytes );
            break;
        case BuiltInType.ByteString:
            // is this a REAL bytestring? or a Byte[] converted to a ByteString?
            if( args.Value.ArrayType !== 0 ) {
                var bstrings = _removeElement( { Value: args.Value.toByteStringArray(), Type: new UaByteStrings(), Element: args.Element } );
                args.Value.setByteStringArray( bstrings );
            }
            else {
                // this seems to be Bytes[] converted to ByteString. We must go ByteString->byte[] and then byte[]->ByteString
                var bytes = UaByteString.ToByteArray( args.Value.toByteString() );
                bytes = _removeElement( { Value: bytes, Type: new UaBytes(), Element: args.Element } );
                bytes = UaByteString.FromByteArray( bytes );
                args.Value.setByteString( bytes );
            }
            break;
        case BuiltInType.DateTime:
            var dates = _removeElement( { Value: args.Value.toDateTimeArray(), Type: new UaDateTimes(), Element: args.Element } );
            args.Value.setDateTimeArray( dates );
            break;
        case BuiltInType.Double:
            var dbls = _removeElement( { Value: args.Value.toDoubleArray(), Type: new UaDoubles(), Element: args.Element } );
            args.Value.setDoubleArray( dbls );
            break;
        case BuiltInType.Float:
            var floats = _removeElement( { Value: args.Value.toFloatArray(), Type: new UaFloats(), Element: args.Element } );
            args.Value.setFloatArray( floats );
            break;
        case BuiltInType.Int16:
            var int16s = _removeElement( { Value: args.Value.toInt16Array(), Type: new UaInt16s(), Element: args.Element } );
            args.Value.setInt16Array( int16s );
            break;
        case BuiltInType.Int32:
            var int32s = _removeElement( { Value: args.Value.toInt32Array(), Type: new UaInt32s(), Element: args.Element } );
            args.Value.setInt32Array( int32s );
            break;
        case BuiltInType.Int64:
            var int64s = _removeElement( { Value: args.Value.toInt64Array(), Type: new UaInt64s(), Element: args.Element } );
            args.Value.setInt64Array( int64s );
            break;
        case BuiltInType.UInt16:
            var uint16s = _removeElement( { Value: args.Value.toUInt16Array(), Type: new UaUInt16s(), Element: args.Element } );
            args.Value.setUInt16Array( uint16s );
            break;
        case BuiltInType.UInt32:
            var uint32s = _removeElement( { Value: args.Value.toUInt32Array(), Type: new UaUInt32s(), Element: args.Element } );
            args.Value.setUInt32Array( uint32s );
            break;
        case BuiltInType.UInt64:
            var uint64s = _removeElement( { Value: args.Value.toUInt64Array(), Type: new UaUInt64s(), Element: args.Element } );
            args.Value.setUInt64Array( uint64s );
            break;
        case BuiltInType.String:
            var strings = _removeElement( { Value: args.Value.toStringArray(), Type: new UaStrings(), Element: args.Element } );
            args.Value.setStringArray( strings );
            break;
        case BuiltInType.SByte:
            var sbytes = _removeElement( { Value: args.Value.toSByteArray(), Type: new UaSBytes(), Element: args.Element } );
            args.Value.setSByteArray( sbytes );
            break;
        case BuiltInType.XmlElement:
            break;
    }//switch
}// Array.RemoveElement = function( args )

/*
// TEST CODE
include( "./library/Base/safeInvoke.js" );
include( "./library/ServiceBased/AttributeServiceSet/Write.js" );
var v = new UaVariant();
var b = new UaBooleans();
b[0] = true; b[1] = false; b[2] = true; b[3] = false; b[4] = true;
v.setBooleanArray( b );
SafeArray.AddElement( { Value: v } );
print( "Booleans: " + v );
SafeArray.RemoveElement( { Value: v } );
print( "Booleans: " + v );
SafeArray.AddElement( { Value: v } );
SafeArray.RemoveElement( { Value: v, Element: 2 } );
// */