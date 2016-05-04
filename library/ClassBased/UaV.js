/* Includes: 
    UaVariableAttributes.New()
    UaVariableTypeAttributes.New()
    UaVariant.New()
    UaVariant.Increment()
    UaVariant.FromUaType()
    UaVariant.SetValueMax()
    UaVariant.SetValueMin()
    UaViewAttributes.New()
    UaVQTSupport enumeration
*/
UaVariableAttributes.New = function( args ) {
    var x = new UaVariableAttributes();
    if( isDefined( args.AccessLevel ) ) x.AccessLevel = args.AccessLevel;
    if( isDefined( args.ArrayDimensions ) ) x.ArrayDimensions = args.ArrayDimensions;
    if( isDefined( args.DataType ) ) x.DataType = args.DataType;
    if( isDefined( args.Description ) ) {
        if( isDefined( args.Description.Text ) ) x.Description = args.Description;
        else x.Description.Text = args.Description;
    }
    if( isDefined( args.DisplayName ) ) {
        if( isDefined( args.DisplayName.Text ) ) x.DisplayName = args.DisplayName;
        else x.DisplayName.Text = args.DisplayName;
    }
    if( isDefined( args.Historizing ) ) x.Historizing = args.Historizing;
    if( isDefined( args.MinimumSamplingInterval ) ) x.MinimumSamplingInterval = args.MinimumSamplingInterval;
    if( isDefined( args.SpecifiedAttributes ) ) x.SpecifiedAttributes = args.SpecifiedAttributes;
    if( isDefined( args.UserAccessLevel ) ) x.UserAccessLevel = args.UserAccessLevel;
    if( isDefined( args.UserWriteMask ) ) x.UserWriteMask = args.UserWriteMask;
    if( isDefined( args.Value ) ) x.Value = args.Value;
    if( isDefined( args.ValueRank ) ) x.ValueRank = args.ValueRank;
    if( isDefined( args.WriteMask ) ) x.WriteMask = args.WriteMask;
    if( isDefined( args.ToExtensionObject ) ) {
        var extObj = new UaExtensionObject();
        extObj.setVariableAttributes( x );
        x = extObj;
    }
    return( x );
}

UaVariableTypeAttributes.New = function( args ) {
    var x = new UaVariableTypeAttributes();
    if( isDefined( args.ArrayDimensions ) ) {
        if( !isDefined( args.ArrayDimensions.length ) ) args.ArrayDimensions = [ args.ArrayDimensions ];
        for( i=0; i<args.ArrayDimensions.length; i++ ) x.ArrayDimensions[i] = args.ArrayDimensions[i];
    }
    if( isDefined( args.DataType ) ) x.DataType = args.DataType;
    if( isDefined( args.Description ) ) {
        if( isDefined( args.Description.Text ) ) x.Description = args.Description;
        else x.Description.Text = args.Description;
    }
    if( isDefined( args.DisplayName ) ) {
        if( isDefined( args.DisplayName.Text ) ) x.DisplayName = args.DisplayName;
        else x.DisplayName.Text = args.DisplayName;
    }
    if( isDefined( args.IsAbstract ) ) x.IsAbstract = args.IsAbstract;
    if( isDefined( args.SpecifiedAttributes ) ) x.SpecifiedAttributes = args.SpecifiedAttributes;
    if( isDefined( args.UserWriteMask ) ) x.UserWriteMask = args.UserWriteMask;
    if( isDefined( args.Value ) ) x.Value = args.Value;
    if( isDefined( args.ValueRank ) ) x.ValueRank = args.ValueRank;
    if( isDefined( args.WriteMask ) ) x.WriteMask = args.WriteMask;
    if( isDefined( args.ToExtensionObject ) ) {
        var extObj = new UaExtensionObject();
        extObj.setVariableTypeAttributes( x );
        x = extObj;
    }
    return( x );
}

// Converts the UaVariant type to a native Javascript type
UaVariant.FromUaType = function( args ) {
    if( !isDefined( args ) ) throw( "args not specified." );
    if( !isDefined( args.Value ) )throw( "[UaVariant.ToJSValue] args.Value not specified." );
    if( args.Value.ArrayType === VariantArrayType.Scalar ) {
        switch( args.Value.DataType ) {
            case BuiltInType.Boolean:         return( args.Value.toBoolean() );        break;
            case BuiltInType.Byte:            return( args.Value.toByte() );           break;
            case BuiltInType.ByteString:      return( args.Value.toByteString() );     break;
            case BuiltInType.DataValue:       return( args.Value.toDataValue() );      break;
            case BuiltInType.DiagnosticInfo:  return( args.Value.toDiagnosticInfo() ); break;
            case BuiltInType.DateTime:        return( args.Value.toDateTime() );       break;
            case BuiltInType.DataValue:       return( args.Value.toDataValue() );      break;
            case BuiltInType.Double:          return( args.Value.toDouble() );         break;
            case BuiltInType.ExpandedNodeId:  return( args.Value.toExpandedNodeId() );  break;
            case BuiltInType.ExtensionObject: return( args.Value.toExtensionObject() ); break;
            case BuiltInType.Float:           return( args.Value.toFloat() );         break;
            case BuiltInType.Guid:            return( args.Value.toGuid() );          break;
            case BuiltInType.Int16:           return( args.Value.toInt16() );         break;
            case BuiltInType.Int32:           return( args.Value.toInt32() );         break;
            case BuiltInType.Int64:           return( args.Value.toInt64() );         break;
            case BuiltInType.LocalizedText:   return( args.Value.toLocalizedText() ); break;
            case BuiltInType.NodeId:          return( args.Value.toNodeId() );        break;
            case BuiltInType.SByte:           return( args.Value.toSByte() );      break;
            case BuiltInType.StatusCode:      return( args.Value.toStatusCode() ); break;
            case BuiltInType.String:          return( args.Value.toString() );     break;
            case BuiltInType.QualifiedName:   return( args.Value.toQualifiedName() ); break;
            case BuiltInType.UInt16:          return( args.Value.toUInt16() );     break;
            case BuiltInType.UInt32:          return( args.Value.toUInt32() );     break;
            case BuiltInType.UInt64:          return( args.Value.toUInt64() );     break;
            case BuiltInType.Variant:         return( args.Value.toVariant() );    break;
            case BuiltInType.XmlElement:      return( args.Value.toXmlElement() ); break;
            default: return( null );                                               break;
        }// switch
    }
    else if( args.Value.ArrayType === VariantArrayType.Array ) {
        switch( args.Value.DataType ) {
            case BuiltInType.Boolean:         return( args.Value.toBooleanArray() );    break;
            case BuiltInType.Byte:            return( args.Value.toByteArray() );       break;
            case BuiltInType.ByteString:      return( args.Value.toByteStringArray() ); break;
            case BuiltInType.DateTime:        return( args.Value.toDateTimeArray() );   break;
            case BuiltInType.DataValue:       return( args.Value.toDataValueArray() );  break;
            case BuiltInType.DiagnosticInfo:  return( args.Value.toDiagnosticInfoArray() ); break;
            case BuiltInType.Double:          return( args.Value.toDoubleArray() );     break;
            case BuiltInType.ExpandedNodeId:  return( args.Value.toExpandedNodeIdArray() );  break;
            case BuiltInType.ExtensionObject: return( args.Value.toExtensionObjectArray() ); break;
            case BuiltInType.Float:           return( args.Value.toFloatArray() );      break;
            case BuiltInType.Guid:            return( args.Value.toGuidArray() );       break;
            case BuiltInType.Int16:           return( args.Value.toInt16Array() );      break;
            case BuiltInType.Int32:           return( args.Value.toInt32Array() );      break;
            case BuiltInType.Int64:           return( args.Value.toInt64Array() );      break;
            case BuiltInType.LocalizedText:   return( args.Value.toLocalizedTextArray() ); break;
            case BuiltInType.NodeId:          return( args.Value.toNodeIdArray() );        break;
            case BuiltInType.SByte:           return( args.Value.toSByteArray() );      break;
            case BuiltInType.StatusCode:      return( args.Value.toStatusCodeArray() ); break;
            case BuiltInType.String:          return( args.Value.toStringArray() );     break;
            case BuiltInType.QualifiedName:   return( args.Value.toQualifiedNameArray() ); break;
            case BuiltInType.UInt16:          return( args.Value.toUInt16Array() );     break;
            case BuiltInType.UInt32:          return( args.Value.toUInt32Array() );     break;
            case BuiltInType.UInt64:          return( args.Value.toUInt64Array() );     break;
            case BuiltInType.Variant:         return( args.Value.toVariantArray() );    break;
            case BuiltInType.XmlElement:      return( args.Value.toXmlElementArray() ); break;
            default: return( null );                                                    break;
        }// switch
    }
}

UaVariant.New = function( args ) { 
    if( !isDefined( args ) ) throw( "args not specified." );
    if( !isDefined( args.Value ) ) throw( "[UaVariant.New] args.Value not specified." );
    if( args.Value === "null" ) args.Value = null;
    if( !isDefined( args.Type ) ) args.Type = BuiltInType.Variant;
    if( !isDefined( args.Array ) ) args.Array = false;
    var v = new UaVariant();
    if( !args.Array ) {
        switch( args.Type ) {
            case BuiltInType.Boolean: v.setBoolean( args.Value ); break;
            case BuiltInType.Byte: v.setByte( args.Value ); break;
            case BuiltInType.ByteString: v.setByteString( args.Value ); break;
            case BuiltInType.DateTime: v.setDateTime( args.Value) ; break;
            case BuiltInType.DataValue: v.setDataValue( args.Value ); break;
            case BuiltInType.DiagnosticInfo: v.setDiagnosticInfo( args.Value ); break;
            case BuiltInType.Double: v.setDouble( args.Value ); break;
            case BuiltInType.ExpandedNodeId: v.setExpandedNodeId( args.Value ); break;
            case BuiltInType.ExtensionObject: v.setExtensionObject( args.Value ); break;
            case BuiltInType.Float: v.setFloat( args.Value ); break;
            case BuiltInType.Guid: v.setGuid( args.Value ); break;
            case BuiltInType.Int16: v.setInt16( args.Value ); break;
            case BuiltInType.Int32: v.setInt32( args.Value ); break;
            case BuiltInType.Int64: v.setInt64( args.Value ); break;
            case BuiltInType.LocalizedText: v.setLocalizedText( args.Value ); break;
            case BuiltInType.NodeId: v.setNodeId( args.Value ); break;
            case BuiltInType.SByte: v.setSByte( args.Value ); break;
            case BuiltInType.StatusCode: v.setStatusCode( args.Value ); break;
            case BuiltInType.String: v.setString( args.Value ); break;
            case BuiltInType.QualifiedName: v.setQualifiedName( args.Value ); break;
            case BuiltInType.UInt16: v.setUInt16( args.Value ); break;
            case BuiltInType.UInt32: v.setUInt32( args.Value ); break;
            case BuiltInType.UInt64: v.setUInt64( args.Value ); break;
            case BuiltInType.Variant: v.setVariant( args.Value ); break;
            case BuiltInType.XmlElement: v.setXmlElement( args.Value ); break;
        }
    }
    else {
        if( !isDefined( args.Value.length ) ) throw( "UaVariant.New() cannot create an array because the specified value is not an array!" );
        if( isDefined( args.Value.name ) ) {
            // the 'Value' is using a native type, e.g. UaInt16s()
            switch( args.Type ) {
                case BuiltInType.Boolean: v.setBooleanArray( args.Value ); break;
                case BuiltInType.Byte: v.setByteArray( args.Value ); break;
                case BuiltInType.ByteString: v.setByteStringArray( args.Value ); break;
                case BuiltInType.DateTime: v.setDateTimeArray( args.Value) ; break;
                case BuiltInType.DataValue: v.setDataValueArray( args.Value ); break;
                case BuiltInType.DiagnosticInfo: v.setDiagnosticInfoArray( args.Value ); break;
                case BuiltInType.Double: v.setDoubleArray( args.Value ); break;
                case BuiltInType.ExpandedNodeId: v.setExpandedNodeIdArray( args.Value ); break;
                case BuiltInType.ExtensionObject: v.setExtensionObjectArray( args.Value ); break;
                case BuiltInType.Float: v.setFloatArray( args.Value ); break;
                case BuiltInType.Guid: v.setGuidArray( args.Value ); break;
                case BuiltInType.Int16: v.setInt16Array( args.Value ); break;
                case BuiltInType.Int32: v.setInt32Array( args.Value ); break;
                case BuiltInType.Int64: v.setInt64Array( args.Value ); break;
                case BuiltInType.LocalizedText: v.setLocalizedTextArray( args.Value ); break;
                case BuiltInType.NodeId: v.setNodeIdArray( args.Value ); break;
                case BuiltInType.SByte: v.setSByteArray( args.Value ); break;
                case BuiltInType.StatusCode: v.setStatusCodeArray( args.Value ); break;
                case BuiltInType.String: v.setStringArray( args.Value ); break;
                case BuiltInType.QualifiedName: v.setQualifiedNameArray( args.Value ); break;
                case BuiltInType.UInt16: v.setUInt16Array( args.Value ); break;
                case BuiltInType.UInt32: v.setUInt32Array( args.Value ); break;
                case BuiltInType.UInt64: v.setUInt64Array( args.Value ); break;
                case BuiltInType.Variant: v.setVariantArray( args.Value ); break;
                case BuiltInType.XmlElement: v.setXmlElementArray( args.Value ); break;
            }//switch
        }
        else {
            switch( args.Type ) {
                case BuiltInType.Boolean: {
                    var x = new UaBooleans();
                    for( var i=0; i<args.Value.length; i++ ) x[i] = args.Value[i];
                    v.setBooleanArray( x ); break;
                }
                case BuiltInType.Byte: v.setByteArray( args.Value ); break;
                case BuiltInType.ByteString: v.setByteStringArray( args.Value ); break;
                case BuiltInType.DateTime: v.setDateTimeArray( args.Value) ; break;
                case BuiltInType.DataValue: v.setDataValueArray( args.Value ); break;
                case BuiltInType.DiagnosticInfo: v.setDiagnosticInfoArray( args.Value ); break;
                case BuiltInType.Double: v.setDoubleArray( args.Value ); break;
                case BuiltInType.ExpandedNodeId: v.setExpandedNodeIdArray( args.Value ); break;
                case BuiltInType.ExtensionObject: v.setExtensionObjectArray( args.Value ); break;
                case BuiltInType.Float: v.setFloatArray( args.Value ); break;
                case BuiltInType.Guid: v.setGuidArray( args.Value ); break;
                case BuiltInType.Int16: v.setInt16Array( args.Value ); break;
                case BuiltInType.Int32: {
                    var x = new UaInt32s();
                    for( var i=0; i<args.Value.length; i++ ) x[i] = args.Value[i];
                    v.setInt32Array( x ); break;
                }
                case BuiltInType.Int64: v.setInt64Array( args.Value ); break;
                case BuiltInType.LocalizedText: v.setLocalizedTextArray( args.Value ); break;
                case BuiltInType.NodeId: v.setNodeIdArray( args.Value ); break;
                case BuiltInType.SByte: v.setSByteArray( args.Value ); break;
                case BuiltInType.StatusCode: v.setStatusCodeArray( args.Value ); break;
                case BuiltInType.String: v.setStringArray( args.Value ); break;
                case BuiltInType.QualifiedName: v.setQualifiedNameArray( args.Value ); break;
                case BuiltInType.UInt16: v.setUInt16Array( args.Value ); break;
                case BuiltInType.UInt32: {
                    var x = new UaUInt32s();
                    for( var i=0; i<args.Value.length; i++ ) x[i] = args.Value[i];
                    v.setUInt32Array( x ); break;
                }
                case BuiltInType.UInt64: v.setUInt64Array( args.Value ); break;
                case BuiltInType.Variant: v.setVariantArray( args.Value ); break;
                case BuiltInType.XmlElement: v.setXmlElementArray( args.Value ); break;
            }//switch
        }
    }
    return( v );
}

UaVariant.Increment = function( args ) {
    if( !isDefined( args ) ) throw( "UaVariant.Increment::args not specified." );
    if( !isDefined( args.Value ) ) throw( "UaVariant.Increment::args.Value not specified." );
    if( !isDefined( args.Increment ) ) args.Increment = 1;
    var val = isDefined( args.Value.Value )? args.Value.Value : args.Value; // if the Variant (contains VQT) then re-wire to be just V.
    if( undefined === val.setBoolean ) throw( "UaVariant.Increment:args.Value is not a UaVariant type." );
    // check if the current value is null or NaN, if so, set the value to the minimum value.
    if( val.isEmpty() || val.toString() === "null" || val.toString() === "NaN" ) UaVariant.SetValueMin( { Value: args.Value } );
    if( isDefined( args.Range ) ) { 
        if( !isDefined( args.Range.High ) || !isDefined( args.Range.Low ) ) throw( "UaVariant.Increment::args.Range is not a valid 'Range' object." );
        // do we need to switch the high/low ordering?
        if( args.Range.High < args.Range.Low ) {
            var low = args.Range.Low;
            args.Range.Low = args.Range.High;
            args.Range.High = low;
        }
        // now to increment the value.
        switch( val.DataType ) {
            case BuiltInType.Byte: 
                if( val.toByte() >= args.Range.High || val.toByte() < args.Range.Low ) val.setByte( args.Range.Low ); 
                break;
            case BuiltInType.Double:
                var referenceValue = val.toDouble() + args.Increment;
                if( isNaN( val.toDouble() ) + isNaN( referenceValue ) + referenceValue == val.toDouble() ) {
                    val.setDouble( 0.0 );
                }
                if( val.toDouble() >= args.Range.High || val.toDouble() < args.Range.Low ) val.setDouble( args.Range.Low );
                break;
            case BuiltInType.Duration:
                if( val.toDouble() === 9007199254740992 ) val.toDouble( 0 );
                if( val.toDouble() >= args.Range.High || val.toDouble() < args.Range.Low ) val.setDouble( args.Range.Low );
                break;
            case BuiltInType.Float:
                var referenceValue = val.toFloat() + 0.1;
                if( isNaN( val.toFloat() ) + isNaN( referenceValue ) + referenceValue == val.toFloat() ) {
                    val.setFloat( 0.0 );
                }
                if( val.toFloat() >= args.Range.High || val.toFloat() < args.Range.Low ) val.setFloat( args.Range.Low );
                break;
            case BuiltInType.Guid:
                switch( __guidPos++ ) {
                    case 0: val = new UaGuid( __guids[0] ); break;
                    case 1: val = new UaGuid( __guids[1] ); break;
                    case 2: 
                        __guidPos = -1;
                        val = new UaGuid( __guids[2] );
                        break;
                    default:
                        __guidPos = -1;
                        val = new UaGuid( __guids[1] );
                        break;
                }
            case BuiltInType.Int16:
                if( val.toInt16() >= args.Range.High || val.toInt16() < args.Range.Low ) val.setInt16( args.Range.Low );
                break;
            case BuiltInType.Int32:
                if( val.toInt32() >= args.Range.High || val.toInt32() < args.Range.Low ) val.setInt32( args.Range.Low );
                break;
            case BuiltInType.Int64:
                if( val.toInt64() >= args.Range.High || val.toInt64() < args.Range.Low ) val.setInt64( args.Range.Low );
                if( val.toInt64() > Math.pow(2, 30) ) val.setInt64( 0 );
                else if( val.toInt64() < 0 ) val.setInt64( 0 );
                val.setInt64( parseInt( val.toInt64() ) );
                break;
            case BuiltInType.SByte:
                if( val.toSByte() >= args.Range.High || val.toSByte() < args.Range.Low ) val.setSByte( args.Range.Low );
                break;
            case BuiltInType.UInt16:
                if( val.toUInt16() >= args.Range.High || val.toUInt16() < args.Range.Low ) val.setUInt16( args.Range.Low );
                break;
            case BuiltInType.UInt32:
                if( val.toUInt32() >= args.Range.High || val.toUInt32() < args.Range.Low ) val.setUInt32( args.Range.Low );
                break;
            case BuiltInType.UInt64:
                if( val.toUInt64() >= args.Range.High || val.toUInt64() < args.Range.Low ) val.setUInt64( args.Range.Low );
                if( val.toUInt64() > Math.pow(2, 30) ) val.setUInt64( 0 );
                break;
        }
    }
    // now to increment
    switch( val.DataType ) {
        case BuiltInType.Boolean:       val.setBoolean( !val.toBoolean() );                                break;
        case BuiltInType.Byte:          val.setByte( val.toByte() + args.Increment );                      break;
        case BuiltInType.ByteString:    val.setByteString( UaByteString.Increment( val.toByteString() ) ); break;
        case BuiltInType.DateTime:      {
            var nextDay = val.toDateTime();
            nextDay.addDays( args.Increment );
            val.setDateTime( nextDay );
            break;
        }
        case BuiltInType.Double:        val.setDouble( val.toDouble() + args.Increment );                  break;
        case BuiltInType.Float:         val.setFloat( val.toFloat() + args.Increment );                    break;
        case BuiltInType.Int16:         val.setInt16( val.toInt16() + args.Increment );                    break;
        case BuiltInType.Int32:         val.setInt32( val.toInt32() + args.Increment );                    break;
        case BuiltInType.Int64: {
            if( val.toInt64() > Math.pow( 2, 30 ) ) val.setInt64( 0 );
            else if( val.toInt64() < 0 ) val.setInt64( 0 ); 
            else val.setInt64( val.toInt64() + args.Increment );
            break;
        }
        case BuiltInType.LocalizedText: val.Text = UaDateTime.utcNow().toString();                         break;
        case BuiltInType.NodeId:        val.setNodeId( val.toNodeId() );                                   break;
        case BuiltInType.SByte:         val.setSByte( val.toSByte() + args.Increment );                    break;
        case BuiltInType.StatusCode:    val.setStatusCode( val.toStatusCode() + args.Increment );          break;
        case BuiltInType.String: {
            var stringAsBs = UaByteString.fromStringData( val.toString() );
            stringAsBs = UaByteString.Increment( stringAsBs );
            var bsAsString = stringAsBs.utf8ToString();
            val.setString( bsAsString );
            break;
        }
        case BuiltInType.QualifiedName: val.setQualifiedName( val.toQualifiedName() );                     break;
        case BuiltInType.UInt16:        val.setUInt16( val.toUInt16() + args.Increment );                  break;
        case BuiltInType.UInt32:        val.setUInt32( val.toUInt32() + args.Increment );                  break;
        case BuiltInType.UInt64: {
            if( val.toUInt64() > Math.pow( 2, 30 ) ) val.setUInt64( 0 );
            else val.setUInt64( val.toUInt64() + args.Increment );
            break;
        }
        case BuiltInType.XmlElement: {
            var x = new UaXmlElement();
            x.setString(  "<time>" + UaDateTime.utcNow() + "</time>" );
            val.setXmlElement( x ); 
            break;
        }
    }
    // change the passed-in argument in addition to returning the new value 
    if( isDefined( args.Value.Value ) ) args.Value.Value = val;
    else args.Value = val;
    return( val.clone() );
}

UaVariant.SetValueMax = function( args ) {
    if( !isDefined( args ) ) throw( "UaVariant.SetValueMax::args not specified." );
    if( !isDefined( args.Value ) ) throw( "UaVariant.SetValueMax::args.Value not specified." );
    if(  isDefined( args.Value.Value ) ) args.Value = args.Value.Value; // if the Variant (contains VQT) then re-wire to be just V.
    if(  isDefined( args.Type ) ) args.Value.DateType = args.Type;
    switch( args.Value.DataType ) {
        case BuiltInType.Boolean:     args.Value.setBoolean( true );                  break;
        case BuiltInType.Byte:        args.Value.setByte( Constants.Byte_Max );       break;
        case BuiltInType.ByteString:  args.Value.setByteString( new UaByteString() ); break;
        case BuiltInType.Double:      args.Value.setDouble( Constants.Double_Max );   break;
        case BuiltInType.Duration:    args.Value.setDouble( Constants.Double_Max );   break;
        case BuiltInType.Float:       args.Value.setFloat( Constants.Float_Max );     break;
        case BuiltInType.Int16:       args.Value.setInt16( Constants.Int16_Max );     break;
        case BuiltInType.Int32:       args.Value.setInt32( Constants.Int32_Max );     break;
        case BuiltInType.Int64:       args.Value.setInt64( 0x7FFFFFFFFFFFFFFF );      break;
        case BuiltInType.SByte:       args.Value.setSByte( Constants.SByte_Max );     break;
        case BuiltInType.UInt16:      args.Value.setUInt16( Constants.UInt16_Max );   break;
        case BuiltInType.UInt32:      args.Value.setUInt32( Constants.UInt32_Max );   break;
        case BuiltInType.UInt64:      args.Value.setUInt64( 0xFFFFFFFFFFFFFFF8 );     break;
        default: addWarning( "Skipping data-type '" + BuiltInType.toString( args.Value.DataType ) + " generation of a MAX value." );
    }
}

UaVariant.SetValueMiddle = function( args ) {
    if( !isDefined( args ) ) throw( "UaVariant.SetValueMiddle::args not specified." );
    if( !isDefined( args.Value ) ) throw( "UaVariant.SetValueMiddle::args.Value not specified." );
    if(  isDefined( args.Value.Value ) ) args.Value = args.Value.Value; // if the Variant (contains VQT) then re-wire to be just V.
    if(  isDefined( args.Type ) ) args.Value.DateType = args.Type;
    switch( args.Value.DataType ) {
        case BuiltInType.Boolean:  args.Value.setBoolean( true );                                       break;
        case BuiltInType.Byte:     args.Value.setByte( Constants.Byte_Max - Constants.Byte_Min );       break;
        case BuiltInType.Double:   args.Value.setDouble( Constants.Double_Max - Constants.Double_Min ); break;
        case BuiltInType.Float:    args.Value.setFloat( Constants.Float_Max - Constants.Float_Min );    break;
        case BuiltInType.Int16:    args.Value.setInt16( Constants.Int16_Max - Constants.Int16_Min );    break;
        case BuiltInType.Int32:    args.Value.setInt32( Constants.Int32_Max - Constants.Int32_Min );    break;
        case BuiltInType.Int64:    args.Value.setInt64( 0x7FFFFFFFFFFFFFFF - 0x8000000000000000 );      break;
        case BuiltInType.SByte:    args.Value.setSByte( Constants.SByte_Max - Constants.SByte_Min );    break;
        case BuiltInType.UInt16:   args.Value.setUInt16( Constants.UInt16_Max - Constants.UInt16_Min ); break;
        case BuiltInType.UInt32:   args.Value.setUInt32( Constants.UInt32_Max - Constants.UInt32_Min ); break;
        case BuiltInType.UInt64:   args.Value.setUInt64( 0xFFFFFFFFFFFFFFF8 / 2 );                      break;
        default: addWarning( "Skipping data-type '" + BuiltInType.toString( args.Value.DataType ) + " generation of a MIDDLE value..." );
    }
}

UaVariant.SetValueMin = function( args ) {
    if( !isDefined( args ) ) throw( "UaVariant.SetValueMin::args not specified." );
    if( !isDefined( args.Value ) ) throw( "UaVariant.SetValueMin::args.Value not specified." );
    if(  isDefined( args.Value.Value ) ) args.Value = args.Value.Value; // if the Variant (contains VQT) then re-wire to be just V.
    var dataType = isDefined( args.Type ) ? args.Type : args.Value.DataType;
    switch( dataType ) {
        case BuiltInType.Boolean:     args.Value.setBoolean( false );                   break;
        case BuiltInType.Byte:        args.Value.setByte( Constants.Byte_Min );         break;
        case BuiltInType.ByteString:  args.Value.setByteString( new UaByteString() );   break;
        case BuiltInType.DateTime:    args.Value.setDateTime( new UaDateTime() );       break;
        case BuiltInType.Double:      args.Value.setDouble( Constants.Double_Min );     break;
        case BuiltInType.Duration:    args.Value.setDouble( Constants.Double_Min );     break;
        case BuiltInType.Float:       args.Value.setFloat( Constants.Float_Min );       break;
        case BuiltInType.Int16:       args.Value.setInt16( Constants.Int16_Min );       break;
        case BuiltInType.Int32:       args.Value.setInt32( Constants.Int32_Min );       break;
        case BuiltInType.Int64:       args.Value.setInt64( 0x8000000000000000 );        break;
        case BuiltInType.SByte:       args.Value.setSByte( Constants.SByte_Min );       break;
        case BuiltInType.String:      args.Value.setString( "" );                       break;
        case BuiltInType.UInt16:      args.Value.setUInt16( Constants.UInt16_Min );     break;
        case BuiltInType.UInt32:      args.Value.setUInt32( Constants.UInt32_Min );     break;
        case BuiltInType.UInt64:      args.Value.setUInt64( 0 );                        break;
        case BuiltInType.UtcTime:     args.Value.setDateTime( new UaDateTime() );       break;
        case BuiltInType.XmlElement:  args.Value.setXmlElement( new UaXmlElement() );   break;
        default: addWarning( "Skipping data-type '" + BuiltInType.toString( args.Value.DataType ) + "' generation of a MIN value..." );
    }
}

UaViewAttributes.New = function( args ) {
    var x = new UaViewAttributes();
    if( isDefined( args.ContainsNoLoops ) ) x.ContainsNoLoops = args.ContainsNoLoops;
    if( isDefined( args.Description ) ) {
        if( isDefined( args.Description.Text ) ) x.Description = args.Description;
        else x.Description.Text = args.Description;
    }
    if( isDefined( args.DisplayName ) ) {
        if( isDefined( args.DisplayName.Text ) ) x.DisplayName = args.DisplayName;
        else x.DisplayName.Text = args.DisplayName;
    }
    if( isDefined( args.EventNotifier ) ) x.EventNotifier = args.EventNotifier;
    if( isDefined( args.SpecifiedAttributes ) ) x.SpecifiedAttributes = args.SpecifiedAttributes;
    if( isDefined( args.UserWriteMask ) ) x.UserWriteMask = args.UserWriteMask;
    if( isDefined( args.WriteMask ) ) x.WriteMask = args.WriteMask;
    if( isDefined( args.ToExtensionObject ) ) {
        var extObj = new UaExtensionObject();
        extObj.setViewAttributes( x );
        x = extObj;
    }
    return( x );
}

// Enumeration representing VQT capabilities
var UaVQTSupport = {
    None:            0,
    Value:           1,
    StatusCode:      2,
    ServerTimestamp: 4,
    SourceTimestamp: 8,
    toString: function( value ) {                                    // returns the string representation of the enumerated object
        var s = "";                                                  // string variable placeholder
        for( var v in this ) if( this[v] & value ) s += v + ",";     // iterate through each reflective property to find a match of the value
        return( s.substring( 0, s.length - 1 ) );                    // return the string, even if empty
    }
};