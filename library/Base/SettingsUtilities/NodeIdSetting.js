// NodeIdSetting class to store CTT NodeId setting info.

/*globals addError, addWarningOnce, BuiltInType, include, readSetting, Setting, UaNodeId
*/


const DATATYPE_NUMERIC  = 26;
const DATATYPE_INTEGER  = 27;
const DATATYPE_UINTEGER = 28;
const DATATYPE_UTCTIME  = 294;
const DATATYPE_DURATION = 291;
const DATATYPE_TIME     = 292;
const SETTING_UNDEFINED_SCALARARRAYS = "Array nodes not defined. Check settings: /Server Test/NodeIds/Static/All Profiles/Arrays.";
const SETTING_UNDEFINED_SCALARSTATIC = "Scalar nodes not defined. Check settings: /Server Test/NodeIds/Static/All Profiles/Scalar.";
const SETTING_UNDEFINED_NODECLASSES  = "NodeClass nodes not defined. Check settings: /Server Test/NodeIds/NodeClasses.";
const SETTING_UNDEFINED_DADATAITEM   = "DataItem nodes not defined. Check settings: /Server Test/NodeIds/Static/DA Profile/DataItem.";
const SETTING_UNDEFINED_DAANALOG     = "AnalogType nodes not defined. Check settings: /Server Test/NodeIds/Static/DA Profile/AnalogType.";
const SETTING_UNDEFINED_DADISCRETE   = "Discrete nodes not defined. Check settings: /Server Test/NodeIds/Static/DA Profile/DiscreteType.";
const SETTING_UNDEFINED_DAMULTISTATE = "MultiStateValueDiscrete nodes not defined. Check settings: /Server Test/NodeIds/Static/DA Profile/MultiStateValueDiscreteType.";
const SETTING_UNDEFINED_REFERENCES   = "Reference nodes not defined. Check settings: /Server Test/NodeIds/References.";


include( "./library/Base/SettingsUtilities/Setting.js" );
include( "./library/Base/warnOnce.js" );

function NodeIdSetting() {
    this.id = null;
    this.datatype = null;
}
NodeIdSetting.prototype = new Setting();


// Read a given NodeId setting, storing info
NodeIdSetting.prototype.read = function( settingName ) {
    Setting.prototype.read.call( this, settingName );
    if( this.value !== "" ) {
        this.id = UaNodeId.fromString( this.value );
        this.guessType();
        if( this.id === null ) addError( "Setting <" + this.name + "> is not a valid NodeId string: " + this.value );
    }        
};


// Read an optional NodeId setting.
NodeIdSetting.prototype.readOptional = function( settingName ) {
    this.read( settingName );
    if( this.value === "" ) addWarning( "Setting not configured: '" + settingName + "'" );
};


// Read a required NodeId setting.
NodeIdSetting.prototype.readRequired = function( settingName ) {
    this.read( settingName );
    if( this.value === "" ) addWarning( "Setting not configured: '" + settingName + "'" );
};


// Guess the DataType of the NodeId represented by this setting.
NodeIdSetting.prototype.guessType = function() {
    this.datatype = NodeIdSetting.guessType( this.name );
};


// Static read: returns a new NodeIdSetting instance
NodeIdSetting.read = function( settingName ) {
    var nodeIdSetting = new NodeIdSetting();
    nodeIdSetting.read( settingName );
    return nodeIdSetting;
};


// Static read of an optional NodeId setting. Returns a new NodeIdSetting instance.
NodeIdSetting.readOptional = function( settingName ) {
    var nodeIdSetting = new NodeIdSetting();
    nodeIdSetting.readOptional( settingName );
    return nodeIdSetting;
};


// Static read of a required NodeId setting. Returns a new NodeIdSetting instance.
NodeIdSetting.readRequired = function( settingName ) {
    var nodeIdSetting = new NodeIdSetting();
    nodeIdSetting.readRequired( settingName );
    return nodeIdSetting;
};


NodeIdSetting.guessType = function( nodeSetting ) {
    // look for a data type string in the nodeSetting's parent/Value Data Type
    if( nodeSetting === undefined || nodeSetting === null ) {
        return( BuiltInType.Null );
    }
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