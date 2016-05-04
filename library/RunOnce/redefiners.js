/* Functions in this library include: 

     - Bit.IsOn( value, bit )                       : Tests a bit if it is TRUE
     - Bit.IsOff( value, bit )                      : Tests a bit if it is FALSE
     - SecurityPolicy.Validate = function( value )  : Adds "validate" to SecurityPolicy enumeration for easy validation of a specified argument value.
     - ServerState.Validate = function( value )     : Adds "validate" to ServerState enumeration.
     - Attribute.fromString = function( args )      : Adds "fromString" to convert a partial attribute name to its enumerated value.
     - UaArgument.New()
     - UaByteString.FromByteArray = function( bytes ) : Converts byte[] to ByteString
     - UaByteString.FromByteArray = function( bytes ) : Cnoverts ByteString to byte[]
     - UaDataValue.SetVQT = function( args )          : Easy way to set value, quality, and timestamps
     - UaStatusCode.ToHexString = function( number )  : Converts a number to a hex string (signed/unsigned)
*/


var OPCF = new Object();    //OPCF namespace
OPCF.HA = new Object();

const REDEFINDERS = new redefiners();
const AGGREGATEBITS = 0x001f;
const DATAVALUEINFOTYPE = 0x0400;

var AggregateBit = {
        Raw: 0x00,
        Calculated: 0x01,
        Interpolated: 0x02,
        DataSourceMask: 0x03,
        Partial: 0x04,
        ExtraData: 0x08,
        MultipleValues: 0x10
    }

// Takes an attribute name (not fully qualified) and returns its enumerated value 
Attribute.fromString = function( args ) {
    if( args === undefined || args === null ) {
        return( "" );
    }
    else {
        switch( args ) {
            case "AccessLevel": return( Attribute.AccessLevel );
            case "ArrayDimensions": return( Attribute.ArrayDimensions );
            case "BrowseName": return( Attribute.BrowseName );
            case "ContainsNoLoops": return( Attribute.ContainsNoLoops );
            case "DataType": return( Attribute.DataType );
            case "Description": return( Attribute.Description );
            case "DisplayName": return( Attribute.DisplayName );
            case "EventNotifier": return( Attribute.EventNotifier );
            case "Executable": return( Attribute.Executable );
            case "Historizing": return( Attribute.Historizing );
            case "InverseName": return( Attribute.InverseName );
            case "IsAbstract": return( Attribute.IsAbstract );
            case "MinimumSamplingInterval": return( Attribute.MinimumSamplingInterval );
            case "NodeClass": return( Attribute.NodeClass );
            case "NodeId": return( Attribute.NodeId );
            case "UserAccessLevel": return( Attribute.UserAccessLevel );
            case "UserExecutable": return( Attribute.UserExecutable );
            case "UserWriteMask": return( Attribute.UserWriteMask );
            case "Value": return( Attribute.Value );
            case "ValueRank": return( Attribute.ValueRank );
            case "WriteMask": return( Attribute.WriteMask );
            default:
                addError( "Attribute not valid: " + args );
        }
    }
}// Attribute.fromString = function( args )

// Takes an attribute name (not fully qualified) and returns its enumerated value 
Attribute.fromWriteMaskBit = function( args ) {
    if( args === undefined || args === null ) {
        return( "" );
    }
    else {
        switch( args ) {
            case 0: return( Attribute.AccessLevel );
            case 1: return( Attribute.ArrayDimensions );
            case 2: return( Attribute.BrowseName );
            case 3: return( Attribute.ContainsNoLoops );
            case 4: return( Attribute.DataType );
            case 5: return( Attribute.Description );
            case 6: return( Attribute.DisplayName );
            case 7: return( Attribute.EventNotifier );
            case 8: return( Attribute.Executable );
            case 9: return( Attribute.Historizing );
            case 10: return( Attribute.InverseName );
            case 11: return( Attribute.IsAbstract );
            case 12: return( Attribute.MinimumSamplingInterval );
            case 13: return( Attribute.NodeClass );
            case 14: return( Attribute.NodeId );
            case 15: return( Attribute.Symmetric );
            case 16: return( Attribute.UserAccessLevel );
            case 17: return( Attribute.UserExecutable );
            case 18: return( Attribute.UserWriteMask );
            case 19: return( Attribute.ValueRank );
            case 20: return( Attribute.WriteMask );
            case 21: return( Attribute.ValueForVariableType );
            default:
                addError( "Attribute not valid: " + args );
        }
    }
}// Attribute.fromWriteMaskBit = function( args )

Bit = {
    IsOn: function( args ) {
        // args: Value, Bit
        if( args === undefined || args == null ) return( false );
        if( args.Value === undefined || args.Value === null || args.Bit === undefined || args.Bit === null ) return( false );
        return( ( args.Value & ( 1 << args.Bit ) ) !== 0 );
    },
    
    IsOff: function( args ) {
        // args: Value, Bit
        if( args === undefined || args == null ) return( false );
        if( args.Value === undefined || args.Value === null || args.Bit === undefined || args.Bit === null ) return( false );
        return( ( args.Value & ( 1 << args.Bit ) ) === 0 );
    }
}

BuiltInType.Duration = 290;
BuiltInType.UtcTime = 294;

HistoryUpdateType.Validate = function( args ) { return( args === HistoryUpdateType.Delete || args === HistoryUpdateType.Insert || args === HistoryUpdateType.Replace || args === HistoryUpdateType.Update ); }
PerformUpdateType.Validate = function( args ) { return( args === PerformUpdateType.Insert || args === PerformUpdateType.Remove || args === PerformUpdateType.Replace || args === PerformUpdateType.Update ); }


// Validates a value against the SecurityPolicy enumeration
SecurityPolicy.Validate = function( value ) {
    if( value === undefined || value === null || value.length === 0 ) return( false );
    // was the value specified as a number? if so then convert to string
    var valAsNum = parseInt( value );
    if( valAsNum >= 0 ) value = SecurityPolicy.policyToString( value );
    // value was specified as a string, so convert to a number, and then reverse-check
    var valAsEnum = SecurityPolicy.policyFromString( value );
    return( SecurityPolicy.policyToString( valAsEnum ) === value );
}// SecurityPolicy.Validate = function( value )


// Validates a value against the ServerState enumeration
ServerState.Validate = function( value ) {
    if( value === undefined || value === null || value.length === 0 ) return( false );
    // was the value specified as a number? if so then convert to string
    var valAsNum = parseInt( value );
    if( valAsNum >= 0 && valueAsNum <= 7) return( true );
    else return( false );
}// ServerState.Validate = function( value )


StatusCode.GetValueBased = function( args ) {
    if( !isDefined( args ) ) throw( "args not specified." );
    if( !isDefined( args.RawValues ) ) throw( "RawValues not specified." );
    if( !isDefined( args.Configuration ) ) args.Configuration = UaAggregateConfiguration.New();
    var goodCount = 0, badCount = 0, totalCount = 0;
    // count our values, good, bad, and total
    for( var i=0; i<args.RawValues.length; i++ ) {
        totalCount++;
        if( args.RawValues[i].StatusCode.isBad() ) badCount++;
        else if( args.RawValues[i].StatusCode.isGood() ) goodCount++;
    }
    // now to define our status code
    var v = args.StatusCode;
    v = StatusCode.SetCodeBits( { StatusCode: args.StatusCode, StatusBit: StatusCode.Good } );
    if( ( goodCount / totalCount ) * 100 < args.Configuration.PercentDataGood ) 
        v = StatusCode.SetCodeBits( { StatusCode: args.StatusCode, StatusBit: StatusCode.UncertainDataSubNormal } );
    if( ( badCount / totalCount ) * 100 >= args.Configuration.PercentDataBad ) 
        v.StatusCode = StatusCode.Bad;
    return( v.StatusCode );
}// StatusCode.GetValueBased = function( args )
StatusCode.SetAggregateBit = function( args ) {
    if( !isDefined( args ) ) throw( "args not specified." );
    if( !isDefined( args.StatusCode ) ) throw( "StatusCode not specified." );
    if( !isDefined( args.AggregateBit ) ) throw( "AggregateBit not specified." );
    var v = args.StatusCode.StatusCode;
    v |= DATAVALUEINFOTYPE;
    v &= ~AGGREGATEBITS;
    v |= ( args.AggregateBit & AGGREGATEBITS );
    var newQ = new UaStatusCode( v );
    return( newQ );
}// StatusCode.SetAggregateBits = function( aggregateBit )
StatusCode.SetCodeBits = function( args ) {
    if( !isDefined( args ) ) throw( "args not specified." );
    if( !isDefined( args.StatusCode ) ) throw( "StatusCode not specified." );
    if( !isDefined( args.StatusBit ) ) throw( "StatusBit not specified." );
    var v = args.StatusCode.StatusCode;
    v &= 0x0000ffff;
    v |= ( args.StatusBit & 0xffff0000 );
    var newQ = new UaStatusCode( v );
    return( newQ );
}// StatusCode.SetCodeBits = function( args )

UaEUInformation.New = function( args ) {
    var n = new UaEUInformation();
    if( !isDefined( args ) ) return( n );
    if( isDefined( args.Description ) ) n.Description = args.Description;
    if( isDefined( args.DisplayName ) ) {
        if( isDefined( args.DisplayName.Text ) ) n.DisplayName = args.DisplayName;
        else n.DisplayName.Text = args.DisplayName;
    }
    if( isDefined( args.NamespaceUri ) ) n.NamespaceUri = args.NamespaceUri;
    if( isDefined( args.UnitId ) ) n.UnitId = args.UnitId;
    return( n );
}

function redefiners() {
    // BuiltInType: add enumerations that are not currently available
    BuiltInType.Number = 26;
}// function redefiners()

String.prototype.format = function (args) {
    var str = this;
    return str.replace(String.prototype.format.regex, function(item) {
        var intVal = parseInt(item.substring(1, item.length - 1));
        var replace;
        if (intVal >= 0) replace = args[intVal];
        else if (intVal === -1) replace = "{";
        else if (intVal === -2) replace = "}";
        else replace = "";
    return replace;
    } );
};
String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");
String.prototype.pad = function( args ) {// length, align
    if( !isDefined( args ) ) throw( "args not specified." );
    if( !isDefined( args.Length ) ) throw( "args.Length not specified." );
    if( !isDefined( args.Align ) ) args.Align = "left";
    args.Align = args.Align.toString().toLowerCase();
    if( args.Align !== "left" && args.Align !== "right" && args.Align !== "both" ) args.Align = "left";
    var str = this;
    if( str.length > args.Length ) return( str );
    var s = "";
    var numSpaces = ( args.Length - str.length );
    if( args.Align === "left" ) { s += str; for( var i=0; i<numSpaces; i++ ) s += " "; }
    else if( args.Align === "right" ){ for( var i=0; i<numSpaces; i++ ) s += " "; s += str; }
    else if( args.Align === "both" ) {
        for( var i=0; i<( numSpaces / 2 ); i++ ) s += " ";
        s += str;
        for( var i=0; i<( numSpaces / 2 ); i++ ) s += " ";
        if( s.length > args.Length ) s = s.substring( 0, s.length - 1 );
    }
    return( s );
}
String.prototype.indent = function( indents ) {
    var s = this;
    var lines = s.split( "\n" );
    s = "";
    for( l=0; l<lines.length; l++ ) {
        for( var i=0; i<indents; i++ ) s += "\t"
        s += lines[l];
        if( l !== lines.length - 1 ) s += "\n";
    }
    return( s );
}
String.prototype.padDigits = function( number, digits ) {
    return Array( Math.max( digits - String( number ).length + 1, 0 ) ).join( 0 ) + number;
}
String.prototype.printArray = function( a ) {
    if( a !== undefined && a !== null && a.length !== undefined && a.length !== null ) {
        for( var i=0; i<a.length; i++ ) print( a[i] );
    }
}

NodeAttributesMask.fromSettings = function() {
    var sPath = "/Server Test/NodeIds/NodeManagement/SupportedAttributes/";
    var r = new Object();
    r.Value = 0;
    r.AccessLevel     = readSetting( sPath + "AccessLevel" ) == 2 ? true : false;      if( r.AccessLevel ) r.Value += NodeAttributesMask.AccessLevel;
    r.ArrayDimensions = readSetting( sPath + "ArrayDimensions" ) == 2 ? true : false;  if( r.ArrayDimensions ) r.Value += NodeAttributesMask.ArrayDimensions;
    r.BrowseName      = readSetting( sPath + "BrowseName" )  == 2 ? true : false; if( r.BrowseName ) r.Value += NodeAttributesMask.BrowseName;
    r.DataType        = readSetting( sPath + "DataType" )    == 2 ? true : false; if( r.DataType ) r.Value += NodeAttributesMask.DataType;
    r.Description     = readSetting( sPath + "Description" ) == 2 ? true : false; if( r.Description ) r.Value += NodeAttributesMask.Description;
    r.DisplayName     = readSetting( sPath + "DisplayName" ) == 2 ? true : false; if( r.DisplayName ) r.Value += NodeAttributesMask.DisplayName;
    r.EventNotifier   = readSetting( sPath + "EventNotifier" ) == 2 ? true : false; if( r.EventNotifier ) r.Value += NodeAttributesMask.EventNotifier;
    r.Executable      = readSetting( sPath + "Executable" )   == 2 ? true : false;  if( r.Executable ) r.Value += NodeAttributesMask.Executable;
    r.Historizing     = readSetting( sPath + "Historizing" )  == 2 ? true : false;  if( r.Historizing ) r.Value += NodeAttributesMask.Historizing;
    r.InverseName     = readSetting( sPath + "InverseName" )  == 2 ? true : false;  if( r.InverseName ) r.Value += NodeAttributesMask.InverseName;
    r.MinimumSamplingInterval = readSetting( sPath + "MinimumSamplingInterval" )    == 2 ? true : false; if( r.MinimumSamplingInterval ) r.Value += NodeAttributesMask.MinimumSamplingInterval;
    r.NodeClass       = readSetting( sPath + "NodeClass" )    == 2 ? true : false; if( r.NodeClass ) r.Value += NodeAttributesMask.NodeClass;
    r.NodeId          = readSetting( sPath + "NodeId" )    == 2 ? true : false; if( r.NodeId ) r.Value += NodeAttributesMask.NodeId;
    r.UserAccessLevel = readSetting( sPath + "UserAccessLevel" )    == 2 ? true : false; if( r.UserAccessLevel ) r.Value += NodeAttributesMask.UserAccessLevel;
    r.UserExecutable  = readSetting( sPath + "UserExecutable" )    == 2 ? true : false;  if( r.UserExecutable ) r.Value += NodeAttributesMask.UserExecutable;
    r.UserWriteMask   = readSetting( sPath + "UserWriteMask" )    == 2 ? true : false;   if( r.UserWriteMask ) r.Value += NodeAttributesMask.UserWriteMask;
    r.ValueValue      = readSetting( sPath + "Value" )    == 2 ? true : false;           if( r.ValueValue ) r.Value += NodeAttributesMask.Value;
    r.ValueRank       = readSetting( sPath + "ValueRank" ) == 2 ? true : false;          if( r.ValueRank ) r.Value += NodeAttributesMask.ValueRank;
    r.WriteMask       = readSetting( sPath + "WriteMask" ) == 2 ? true : false;          if( r.WriteMask ) r.Value += NodeAttributesMask.WriteMask;
    return( r );
}
