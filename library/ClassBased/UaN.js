/* Includes: 
    UaNodeId.FromSettings( settings ) - returns an array of node ids of items that can be used
    UaNodeId.GuessType   ( setting  ) - return the data-type that reasonably matches the name of a setting
    UaNodeId.Validate()
    UaNodeTypeDescriptions.New()
*/

UaNodeId.FromSettings = function( settings ) {
    var nids = [];
    var items = MonitoredItem.fromSettings( settings );
    if( isDefined( items ) && items.length > 0 ) for( var i=0; i<items.length; i++ ) nids.push( items[i].NodeId );
    return( nids );
}

UaNodeId.GuessType = function( nodeSetting ) {
    // look for a data type string in the nodeSetting's parent/Value Data Type
    if( nodeSetting === undefined || nodeSetting === null ) return( BuiltInType.Null );
    var dataTypeString;
    var parentSetting = nodeSetting.match( /\/.*\/(.*\/)/ );
    if( parentSetting[1].search( /(^| )Set( |$)/ ) < 0 ) {
        // no such setting, so just use the setting name as the data type string
        dataTypeString = nodeSetting.match( /\/.*\/(.*?)(EURange|EngineeringUnits)?$/ )[1];
    }
    else dataTypeString = readSetting( parentSetting[0] + "Value Data Type" ).toString();
    switch( dataTypeString ) {
        case "Bool": return BuiltInType.Boolean;
        case "Byte": return BuiltInType.Byte;
        case "ByteString": return BuiltInType.ByteString;
        case "DateTime":   return BuiltInType.DateTime;
        case "Double":     return BuiltInType.Double;
        case "Duration":   return DATATYPE_DURATION;
        case "Float":      return BuiltInType.Float;
        case "Guid":       return BuiltInType.Guid;
        case "Int16":      return BuiltInType.Int16;
        case "Int32":      return BuiltInType.Int32;
        case "Int64":      return BuiltInType.Int64;
        case "Integer":    return DATATYPE_INTEGER;
        case "LocalizedText": return BuiltInType.LocalizedText;
        case "NodeId":        return BuiltInType.NodeId;
        case "Number":        return DATATYPE_NUMERIC;
        case "QualifiedName": return BuiltInType.QualifiedName;
        case "String":        return BuiltInType.String;
        case "SByte":  return BuiltInType.SByte;
        case "Time":   return DATATYPE_TIME;
        case "UInt16": return BuiltInType.UInt16;
        case "UInt32": return BuiltInType.UInt32;
        case "UInt64": return BuiltInType.UInt64;
        case "UInteger": return DATATYPE_UINTEGER;
        case "UtcTime":  return DATATYPE_UTCTIME;
        case "Variant":  return BuiltInType.Variant;
        case "XmlElement": return BuiltInType.XmlElement;
        default: break;
   }
   return "";
};

UaNodeId.Validate = function( args ) {
    if( args === undefined || args === null ) return( false );
    // identifier type
    if( args.IdentifierType === undefined || args.IdentierType === null ) return( false );
    if( !IdentifierType.Validate( args.IdentifierType ) ) return( false );
    // namespace index
    if( args.NamespaceIndex === undefined || args.NamespaceIndex === null ) return( false );
    if( !( !isNaN( parseFloat( args.NamespaceIndex ) ) && isFinite( args.NamespaceIndex ) ) ) return( false );
    // guid
    switch( args.IdentifierType ) {
        case IdentifierType.Numeric: break;
        case IdentifierType.String:
            var s = args.getIdentifierString();
            if( !Assert.GreaterThan( 0, s.length, "NodeId STRING length cannot be zero." ) ) return( false );
            if( !Assert.LessThan( 2048, s.length, "NodeId STRING length cannot exceed 2048" ) ) return( false );
            break;
        case IdentifierType.Guid: 
            var g = args.getIdentifierGuid();
            if( !Assert.GreaterThan( 0, g.length, "NodeId GUID length cannot be zero." ) ) return( false );
            if( !Assert.LessThan( 16, g.length, "NodeId GUID length cannot be greater than 16" ) ) return( false );
            break;
        case IdentifierType.Opaque: 
            var o = args.getIdentifierOpaque();
            if( !Assert.GreaterThan( 0, o.length, "NodeId OPAQUE length cannot be zero." ) ) return( false );
            if( !Assert.LessThan( 16, o.length, "NodeId OPAQUE length cannot be greater than 16" ) ) return( false );
            break;
    }
    return( true );
}

UaNodeTypeDescriptions.New = function( args ) {
    var t = new UaNodeTypeDescription();
    if( isDefined( args ) ) {
        if( isDefined( args.DataToReturn ) ) {
            if( !isDefined( args.DataToReturn.length ) ) args.DataToReturn = [ args.DataToReturn ];
            for( var d=0; d<args.DataToReturn.length; d++ ) t.DataToReturn[d] = args.DataToReturn[d];
        }
        if( isDefined( args.IncludeSubTypes ) ) t.IncludeSubTypes = args.IncludeSubTypes;
        if( isDefined( args.TypeDefinitionNode ) ) t.TypeDefinitionNode = args.TypeDefinitionNode;
    }
    return( t );
}