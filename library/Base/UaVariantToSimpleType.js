/* Converts an array of Byte (byte[]) to a ByteString.
   Function based on work by Matthias Isele */
function byteArrayToByteString( byteArr ) {
    print( "ByteArray to convert: " + byteArr.toString() );
    var byteString = new UaByteString();
    var hexString = "0x"
    // check if empty
    if( byteArr.length <= 0 ) return( byteString.toHexString() );
    // not empty, so prepare the string
    for(var i=0; i<byteArr.length; i++) {
        var byteValue = byteArr[i];
        if( byteValue < 16 ) hexString += "0";
        hexString += byteValue.toString( 16 );
    }
    byteString = UaByteString.fromHexString( hexString );    
    return( byteString );
}

/*  byteStringFromText - is a helper method that will take a string and convert
    it to a UaByteString object, which is then returned to the caller.
*/
function byteStringFromText( text ) {
    var bsStr = "0x";
    if( text == undefined || text == null ) text = "";
    for( var i=0; i<text.length; i++ ) {
        var charcode = text.charCodeAt( i );
        var charHex  = charcode.toString( 16 );
        bsStr += charHex;
    }
    
    var uabs = UaByteString.fromHexString( bsStr );
    return( uabs );
}
/* //Test code for byteStringFromText() function
var bs = byteStringFromText();
print( "bs (empty) = " + bs.toString() );
bs = byteStringFromText( "" );
print( "bs (\"\") = " + bs.toString() );
bs = byteStringFromText ( "hello world" );
print( "bs (\"hello world\") = " + bs.toString() );
*/

/* UaVariantToSimpleType extracts the Value from a UaVariant object and casts it to
   the applicable/native datatype of JavaScript, making for much more safe and reliable
   data conversions etc.
   
   Example usage:
       uaStatus = Test.Session.Session.read( readReq, readRes );
       if( uaStatus.isGood() )
       {
           var var1 = UaVariantToSimpleType( readRes.Results[0].Value );
       }
*/
function UaVariantToSimpleType( uaValue ) {
    if( uaValue.ArrayType === 1 ) return( GetArrayTypeToNativeType( uaValue ) );

    switch( uaValue.DataType ) {
        case BuiltInType.Boolean:
            return( uaValue.toBoolean() );
            break;
        case BuiltInType.Byte:
            return( uaValue.toByte() );
            break;
        case BuiltInType.ByteString:
            return( uaValue.toByteString() );
            break;
        case BuiltInType.DateTime:
            return( uaValue.toDateTime() );
            break;
        case BuiltInType.Double:
            return( uaValue.toDouble() );
            break;
        case BuiltInType.Float:
            return( uaValue.toFloat() );
            break;
        case BuiltInType.Guid:
            return( uaValue.toGuid() );
            break;
        case BuiltInType.Int16:
            return( uaValue.toInt16() );
            break;
        case BuiltInType.Int32:
            return( uaValue.toInt32() );
            break;
        case BuiltInType.Int64:
            return( uaValue.toInt64() );
            break;
        case BuiltInType.SByte:
            return( uaValue.toSByte() );
            break;
        case BuiltInType.String:
            return( uaValue.toString() );
            break;
        case BuiltInType.UInt16:
            return( uaValue.toUInt16() );
            break;
        case BuiltInType.UInt32:
            return( uaValue.toUInt32() );
            break;
        case BuiltInType.UInt64:
            return( uaValue.toUInt64() );
            break;
        case BuiltInType.XmlElement:
            return( uaValue.toXmlElement() );
            break;
        default:
            return( uaValue );
            break;
    }
}

function getDataTypeFromNodeId( nodeid )
{
    var r;
    if( isDefined( nodeid ) )
    {
        var id = nodeid.toString();
        var dt;
        switch( id )
        {
            case "i=1": r = Identifier.Boolean; break;
            case "i=2": r = Identifier.Byte;   break;
            case "i=3": r = Identifier.SByte;  break;
            case "i=4": r = Identifier.Int16;  break;
            case "i=5": r = Identifier.UInt16; break;
            case "i=6": r = Identifier.Int32;  break;
            case "i=7": r = Identifier.UInt32; break;
            case "i=8": r = Identifier.Int64;  break;
            case "i=9": r = Identifier.UInt64; break;
            case "i=10":r = Identifier.Float;  break;
            case "i=11":r = Identifier.Double; break;
            case "i=12":r = Identifier.String; break;
            case "i=13":r = Identifier.DateTime; break;
            case "i=14":r = Identifier.Guid; break;
            case "i=15":r = Identifier.ByteString; break;
            case "i=16":r = Identifier.XmlElement; break;
            default:
                throw( "Unknown DataType NodeId: '" + nodeid + "'." );
        }
    }
    return( r );
}


var __guids = [ "{F9EAFF8B-8531-4FAD-9671-450D3F8E8E94}",
              "{3A1EDCEF-D550-43A3-B0D1-38C7D476644F}",
              "{519DA274-CF7A-490D-B5D4-BE644834D23C}" ];
var __guidPos = -1;
var __iNodeId = 0;

/* Increments the values within an array:
    parameters:
        uaValue = 
        indexOffsetStart = 
        indexOffsetEnd = 
        incValue = 
        */
function IncrementUaVariantArray( uaValue, indexOffsetStart, indexOffsetEnd, incValue, getRangeOnly ) {
    if( indexOffsetEnd === undefined || indexOffsetEnd === null ) indexOffsetEnd = 1 + indexOffsetStart;
    if( incValue === undefined || incValue === null ) incValue = 1;
    if( !isDefined( getRangeOnly ) ) getRangeOnly = false;
    var x;
    for( var i=indexOffsetStart; i<indexOffsetEnd; i++ ) {
        switch( uaValue.DataType ) {
            case BuiltInType.Boolean:
                x = uaValue.toBooleanArray();
                x[i] = !x[i];
                uaValue.setBooleanArray( x );
                break;
            case BuiltInType.Byte:
                x = uaValue.toByteArray();
                if( x[i] >= Constants.Byte_Max - incValue ) {
                    x[i] -= incValue;
                }
                else {
                    x[i] += incValue;
                }
                uaValue.setByteArray( x );
                break;
            case BuiltInType.ByteString:
                // get the array element first
                // an array or a bytestring?
                if( uaValue.ArrayType === VariantArrayType.Scalar ) {
                    // get the raw bytestring and then get the indexed item
                    var bs = uaValue.toByteString();
                    var bytes = UaByteString.ToByteArray( bs );
                    
                    if( bytes[i] >= Constants.Byte_Max - incValue ) {
                        bytes[i] -= incValue;
                    }
                    else {
                        bytes[i] += incValue;
                    }

                    var newBs = byteArrayToByteString( bytes );
                    uaValue.setByteString( newBs );
                }
                else {
                    // just convert the first char in each bytestring
                    x = uaValue.toByteStringArray();
                    var bsItem = new UaVariant();
                    bsItem.setByteString( x[i] );
                    IncrementUaVariantArray( bsItem, indexOffsetStart, indexOffsetEnd, incValue );
                    x[i] = bsItem.toByteString();
                    uaValue.setByteStringArray( x );
                }
                break;
            case BuiltInType.Double:
                x = uaValue.toDoubleArray();
                if( x[i] === Constants.Double_Max ) {
                    x[i] = 0;
                }
                else {
                    var newVal = x[i] + incValue;
                    if( newVal.toString() === x[i].toString() ) newVal = 0;
                    x[i] = newVal;
                }
                uaValue.setDoubleArray( x );
                break;
            case BuiltInType.Float:
                x = uaValue.toFloatArray();
                if( x[i] === Constants.Float_Max ) {
                    x[i] = 0;
                }
                else {
                    var newVal = x[i] + incValue;
                    if( newVal.toString() === x[i].toString() ) newVal = 0;
                    x[i] = newVal;
                }
                uaValue.setFloatArray( x );
                break;
            case BuiltInType.Int16:
                x = uaValue.toInt16Array();
                if( x[i] >= Constants.Int16_Max - incValue ) {
                    x[i] -= incValue;
                }
                else {
                    x[i] += incValue;
                }
                uaValue.setInt16Array( x );
                break;
            case BuiltInType.Int32:
                x = uaValue.toInt32Array();
                if( x[i] >= Constants.Int32_Max - incValue ) {
                    x[i] -= incValue;
                }
                else {
                    x[i] += incValue;
                }
                uaValue.setInt32Array( x );
                break;
            case BuiltInType.Int64:
                x = uaValue.toInt64Array();
                var newValue = x[i] + incValue;
                if( newValue.toString() === x[i].toString() ) newValue = 0;
                x[i] = newValue;
                uaValue.setInt64Array( x );
                break;
            case BuiltInType.SByte: 
                x = uaValue.toSByteArray();
                if( x[i] >= Constants.SByte_Max - incValue ) {
                    x[i] -= incValue;
                }
                else {
                    x[i] += incValue;
                }
                uaValue.setSByteArray( x );
                break;
            case BuiltInType.UInt16:
                x = uaValue.toUInt16Array();
                if( x[i] === Constants.UInt16_Max ) {
                    x[i] -= incValue;
                }
                else {
                    x[i] += incValue;
                }
                uaValue.setUInt16Array( x );
                break;
            case BuiltInType.UInt32:
                x = uaValue.toUInt32Array();
                if( x[i] === Constants.UInt32_Max ) {
                    x[i] -= incValue;
                }
                else {
                    x[i] += incValue;
                }
                uaValue.setUInt32Array( x );
                break;
            case BuiltInType.UInt64:
                x = uaValue.toUInt64Array();
                var newValue = x[i] + incValue;
                if( newValue.toString() === x[i].toString() ) newValue = 0;
                x[i] = newValue;
                uaValue.setUInt64Array( x );
                break;
            default:
                addError( "IncrementUaVariantArray unable to work with received type: " + BuiltInType.toString( uaValue.DataType ) + " (" + uaValue.DataType + ")" );
                break;
        }
    }
}// function IncrementUaVariantArray( uaValue, indexOffsetStart, indexOffsetEnd, incValue ) 
/* GetArrayTypeToNativeType extracts the Value from a UaVariant object and casts it to 
   the applicable/native datatype of JavaScript, where the value is an array,
   making for more safe and reliabled data conversions etc.
   
   Example usage:
   uaStatus = Test.Session.Session.read( readReq, readRes );
       if( uaStatus.isGood() )
       {
           var var1 = GetArrayTypeToNativeType( readRes.Results[0].Value );
           for( var i=0; i<var1.length; i++ )
           {
               print( var1[i] );
           }
       }
*/
function GetArrayTypeToNativeType( uaValue )
{
    var returnValue = null;
    if( !( uaValue == null || uaValue == BuiltInType.Null ) )
    {
        switch( uaValue.DataType )
        {
            case BuiltInType.Boolean:
                returnValue = uaValue.toBooleanArray();
                break;
            case BuiltInType.Byte:
                returnValue = uaValue.toByteArray();
                break;
            case BuiltInType.ByteString:
                if( uaValue.ArrayType === 1 )
                {
                    returnValue = uaValue.toByteStringArray();
                }
                else
                {
                    returnValue = uaValue.toByteString();
                }
                break;
            case BuiltInType.DateTime:
                returnValue = uaValue.toDateTimeArray();
                break;
            case BuiltInType.Double:
                returnValue = uaValue.toDoubleArray();
                break;
            case BuiltInType.Float:
                returnValue = uaValue.toFloatArray();
                break;
            case BuiltInType.Guid:
                returnValue = uaValue.toGuidArray();
                break;
            case BuiltInType.Int16:
                returnValue = uaValue.toInt16Array();
                break;
            case BuiltInType.Int32:
                returnValue = uaValue.toInt32Array();
                break;
            case BuiltInType.Int64:
                returnValue = uaValue.toInt64Array();
                break;
            case BuiltInType.LocalizedText:
                returnValue = uaValue.toLocalizedTextArray();
                break;
            case BuiltInType.QualifiedName:
                returnValue = uaValue.toQualifiedNameArray();
                break;
            case BuiltInType.SByte:
                returnValue = uaValue.toSByteArray();
                break;
            case BuiltInType.String:
                returnValue = uaValue.toStringArray();
                break;
            case BuiltInType.UInt16:
                returnValue = uaValue.toUInt16Array();
                break;
            case BuiltInType.UInt32:
                returnValue = uaValue.toUInt32Array();
                break;
            case BuiltInType.UInt64:
                returnValue = uaValue.toUInt64Array();
                break;
            case BuiltInType.Variant:
                returnValue = uaValue.toVariantArray();
                break;
            case BuiltInType.XmlElement:
                returnValue = uaValue.toXmlElementArray();
                break;
            default:
                throw( "Built in type not specified or detectable within the parameter: " + BuiltInType.toString( uaValue.DataType ) + " (" + uaValue.DataType + ")" );
        }
    }//if...
    return( returnValue );
}

// Simply extracts the DATA portion from a ByteString, and returns as a String
function GetDataFromByteString( uaValue )
{
    // if a UaVariant was passed in, just grab the Value.
    if( uaValue.Value !== undefined )
    {
        uaValue = uaValue.Value.toString();
    }
    else
    {
        uaValue = uaValue.toString();
    }
    var indexOfData = uaValue.lastIndexOf( "=" );
    if( indexOfData < 0 )
        return( "" );
    var dataPortion = uaValue.substring( 1 + indexOfData );
    return( dataPortion );
}


// Simple function that returns TRUE/FALSE if the specified value (pass in a 
// UaVariant object) is already at the max value.
function IsValueAtMax( uaValue )
{
    if( uaValue == null || uaValue == BuiltInType.Null ||
        uaValue.DataType === undefined || uaValue.ArrayType === undefined )
    {
        return( false );
    }
    switch( uaValue.DataType )
    {
        case BuiltInType.Boolean:
            return( uaValue.toBoolean() === true );
        case BuiltInType.Byte:
            return( uaValue.toByte() === Constants.Byte_Max );
        case BuiltInType.ByteString:
            return( uaValue.toByteString().length === 0 );
        case BuiltInType.Double:
            return( uaValue.toDouble() === Constants.Double_Max );
        case BuiltInType.Float:
            return( uaValue.toFloat() === Constants.Float_Max );
        case BuiltInType.Int16:
            return( uaValue.toInt16() === Constants.Int16_Max );
        case BuiltInType.Int32:
            return( uaValue.toInt32() === Constants.Int32_Max );
            break;
        case BuiltInType.Int64:
            return( uaValue.toInt64() === Constants.Int64_Max );
        case BuiltInType.SByte:
            return( uaValue.toSByte() === Constants.SByte_Max );
        case BuiltInType.UInt16:
            return( uaValue.toUInt16() === Constants.UInt16_Max );
        case BuiltInType.UInt32:
            return( uaValue.toUInt32() === Constants.UInt32_Max );
        case BuiltInType.UInt64:
            return( uaValue.toUInt64() === Constants.UInt64_Max );
    }
}

function AddAnalogValue(uaValue, newValue) {
    switch (uaValue.DataType) {
        case BuiltInType.Boolean:
            return (!uaValue.toBoolean());
            break;
        case BuiltInType.Byte:
            return (newValue + uaValue.toByte());
            break;
        case BuiltInType.ByteString:
            uaValue.setByteString(newValue.toByteString());
            return (uaValue);
            break;
        case BuiltInType.Double:
            if (isNaN(uaValue.toDouble()) + isNaN(newValue) + newValue == uaValue.toDouble()) {
                uaValue.setDouble(0.0);
            }
            return (uaValue.toDouble() + newValue);
            break;
        case BuiltInType.Duration:
            if (uaValue.toDouble() === 9007199254740992) uaValue.toDouble(0);
            return (uaValue.toDouble() + newValue);
            break;
        case BuiltInType.Float:
            if (isNaN(uaValue.toFloat()) + isNaN(newValue) + newValue == uaValue.toFloat()) {
                uaValue.setFloat(0.0);
            }
            return (uaValue.toFloat() + newValue);
            break;
        case BuiltInType.Int16:
            return (uaValue.toInt16() + newValue);
            break;
        case BuiltInType.Int32:
            return (uaValue.toInt32() + newValue);
            break;
        case BuiltInType.Int64:
            if (uaValue.toInt64() > Math.pow(2, 30)) uaValue.setInt64(0);
            else if (uaValue.toInt64() < 0) uaValue.setInt64(0);
            uaValue.setInt64(1 + parseInt(uaValue.toInt64()));
            return (uaValue.toInt64() + newValue);
            break;
        case BuiltInType.SByte:
            return (uaValue.toSByte() + newValue);
            break;
        case BuiltInType.String:
            var s = "-" + UaDateTime.utcNow() + "-";
            return (s);
            break;
        case BuiltInType.UInt16:
            return (uaValue.toUInt16() + newValue);
            break;
        case BuiltInType.UInt32:
            return (uaValue.toUInt32() + newValue);
            break;
        case BuiltInType.UInt64:
            if (uaValue.toUInt64() > Math.pow(2, 30)) uaValue.setUInt64(0);
            return (uaValue.toUInt64() + newValue);
            break;
        case BuiltInType.UtcTime:
            var dt = uaValue.toDateTime();
            dt.addDays(1);
            return (dt);
            break;
        default:
            return (uaValue);
            break;
    }
}// function AddAnalogValue( uaValue, newValue ) 

/*/ test code for IsValueAtMax()
function printVal( msg, func, minVal, maxVal )
{
    func( minVal );
    var r1 = IsValueAtMax( v );
    func( maxVal );
    var r2 = IsValueAtMax( v );
    print( msg + " when value=" + minVal + " then isMax=" + r1 + "; but when value=" + maxVal + " the isMax=" + r2 );
}
var v = new UaVariant();
printVal( "Boolean", v.setBoolean, false, true );
printVal( "Byte", v.setByte, Constants.Byte_Min, Constants.Byte_Max );
printVal( "Double", v.setDouble, Constants.Double_Min, Constants.Double_Max );
printVal( "Float", v.setFloat, Constants.Float_Min, Constants.Float_Max );
printVal( "Int16", v.setInt16, Constants.Int16_Min, Constants.Int16_Max );
printVal( "Int32", v.setInt32, Constants.Int32_Min, Constants.Int32_Max );
printVal( "Int64", v.setInt64, Constants.Int64_Min, Constants.Int64_Max );
printVal( "SByte", v.setSByte, Constants.SByte_Min, Constants.SByte_Max );
printVal( "UInt16", v.setUInt16, Constants.UInt16_Min, Constants.UInt16_Max );
printVal( "UInt32", v.setUInt32, Constants.UInt32_Min, Constants.UInt32_Max );
printVal( "UInt64", v.setUInt64, Constants.UInt64_Min, Constants.UInt64_Max );
//*/