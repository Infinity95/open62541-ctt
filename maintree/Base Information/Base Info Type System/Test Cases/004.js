/*  Test prepared by Nathan Pocock (nathan.pocock@opcfoundation.org)
    Description: Walks through the address space checking the TypeDefinitions */

function test000_04() {
// Define our functional variables
var uaobjects = [];
var uadatatypes = [];
var uareferencetypes = [];
var uaobjecttypes = [];
var uavariabletypes = [];
var uavariables = [];
var uamethods = [];

    // now to define our objects, and add them to the above arrays
    
  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=18",
                      "BrowseName": "ExpandedNodeId",
                      "DisplayName": "ExpandedNodeId",
                      "Description": "Describes a value that is an absolute identifier for a node.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=24" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=19",
                      "BrowseName": "StatusCode",
                      "DisplayName": "StatusCode",
                      "Description": "Describes a value that is a code representing the outcome of an operation by a Server.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=24" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=23",
                      "BrowseName": "DataValue",
                      "DisplayName": "DataValue",
                      "Description": "Describes a value that is a structure containing a value, a status code and timestamps.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=24" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=25",
                      "BrowseName": "DiagnosticInfo",
                      "DisplayName": "DiagnosticInfo",
                      "Description": "Describes a value that is a structure containing diagnostics associated with a StatusCode.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=24" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=288",
                      "BrowseName": "IntegerId",
                      "DisplayName": "IntegerId",
                      "Description": "A numeric identifier for an object.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=7" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=307",
                      "BrowseName": "ApplicationType",
                      "DisplayName": "ApplicationType",
                      "Description": "The types of applications.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=7597" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=29" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7597",
		                  "BrowseName": "EnumStrings",
		                  "ParentNodeId": "i=307",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "EnumStrings",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=307" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=308",
                      "BrowseName": "ApplicationDescription",
                      "DisplayName": "ApplicationDescription",
                      "Description": "Describes an application and how to find it.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=311",
                      "BrowseName": "ApplicationInstanceCertificate",
                      "DisplayName": "ApplicationInstanceCertificate",
                      "Description": "A certificate for an instance of an application.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=15" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=302",
                      "BrowseName": "MessageSecurityMode",
                      "DisplayName": "MessageSecurityMode",
                      "Description": "The type of security to use on a message.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=7595" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=29" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7595",
		                  "BrowseName": "EnumStrings",
		                  "ParentNodeId": "i=302",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "EnumStrings",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=302" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=303",
                      "BrowseName": "UserTokenType",
                      "DisplayName": "UserTokenType",
                      "Description": "The possible user token types.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=7596" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=29" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7596",
		                  "BrowseName": "EnumStrings",
		                  "ParentNodeId": "i=303",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "EnumStrings",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=303" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=304",
                      "BrowseName": "UserTokenPolicy",
                      "DisplayName": "UserTokenPolicy",
                      "Description": "Describes a user token that can be used with a server.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=312",
                      "BrowseName": "EndpointDescription",
                      "DisplayName": "EndpointDescription",
                      "Description": "The description of a endpoint that can be used to access a server.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=432",
                      "BrowseName": "RegisteredServer",
                      "DisplayName": "RegisteredServer",
                      "Description": "The information required to register a server with a discovery server.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=315",
                      "BrowseName": "SecurityTokenRequestType",
                      "DisplayName": "SecurityTokenRequestType",
                      "Description": "Indicates whether a token if being created or renewed.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=7598" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=29" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7598",
		                  "BrowseName": "EnumStrings",
		                  "ParentNodeId": "i=315",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "EnumStrings",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=315" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=344",
                      "BrowseName": "SignedSoftwareCertificate",
                      "DisplayName": "SignedSoftwareCertificate",
                      "Description": "A software certificate with a digital signature.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=388",
                      "BrowseName": "SessionAuthenticationToken",
                      "DisplayName": "SessionAuthenticationToken",
                      "Description": "A unique identifier for a session used to authenticate requests.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=17" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=316",
                      "BrowseName": "UserIdentityToken",
                      "DisplayName": "UserIdentityToken",
                      "Description": "A base type for a user identity token.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=319",
                      "BrowseName": "AnonymousIdentityToken",
                      "DisplayName": "AnonymousIdentityToken",
                      "Description": "A token representing an anonymous user.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=316" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=322",
                      "BrowseName": "UserNameIdentityToken",
                      "DisplayName": "UserNameIdentityToken",
                      "Description": "A token representing a user identified by a user name and password.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=316" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=325",
                      "BrowseName": "X509IdentityToken",
                      "DisplayName": "X509IdentityToken",
                      "Description": "A token representing a user identified by an X509 certificate.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=316" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=938",
                      "BrowseName": "IssuedIdentityToken",
                      "DisplayName": "IssuedIdentityToken",
                      "Description": "A token representing a user identified by a WS-Security XML token.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=316" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=348",
                      "BrowseName": "NodeAttributesMask",
                      "DisplayName": "NodeAttributesMask",
                      "Description": "The bits used to specify default attributes for a new node.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11881" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=29" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11881",
		                  "BrowseName": "EnumValues",
		                  "ParentNodeId": "i=348",
		                  "DataType": "i=7594",
		                  "DisplayName": "EnumValues",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=348" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=376",
                      "BrowseName": "AddNodesItem",
                      "DisplayName": "AddNodesItem",
                      "Description": "A request to add a node to the server address space.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=379",
                      "BrowseName": "AddReferencesItem",
                      "DisplayName": "AddReferencesItem",
                      "Description": "A request to add a reference to the server address space.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=382",
                      "BrowseName": "DeleteNodesItem",
                      "DisplayName": "DeleteNodesItem",
                      "Description": "A request to delete a node to the server address space.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=385",
                      "BrowseName": "DeleteReferencesItem",
                      "DisplayName": "DeleteReferencesItem",
                      "Description": "A request to delete a node from the server address space.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=347",
                      "BrowseName": "AttributeWriteMask",
                      "DisplayName": "AttributeWriteMask",
                      "Description": "Define bits used to indicate which attributes are writeable.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11882" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=29" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11882",
		                  "BrowseName": "EnumValues",
		                  "ParentNodeId": "i=347",
		                  "DataType": "i=7594",
		                  "DisplayName": "EnumValues",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=347" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=521",
                      "BrowseName": "ContinuationPoint",
                      "DisplayName": "ContinuationPoint",
                      "Description": "An identifier for a suspended query or browse operation.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=15" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=289",
                      "BrowseName": "Counter",
                      "DisplayName": "Counter",
                      "Description": "A monotonically increasing value.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=7" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=291",
                      "BrowseName": "NumericRange",
                      "DisplayName": "NumericRange",
                      "Description": "Specifies a range of array indexes.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=12" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=292",
                      "BrowseName": "Time",
                      "DisplayName": "Time",
                      "Description": "A time value specified as HH:MM:SS.SSS.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=12" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=293",
                      "BrowseName": "Date",
                      "DisplayName": "Date",
                      "Description": "A date value.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=13" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=331",
                      "BrowseName": "EndpointConfiguration",
                      "DisplayName": "EndpointConfiguration",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=334",
                      "BrowseName": "ComplianceLevel",
                      "DisplayName": "ComplianceLevel",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=7599" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=29" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7599",
		                  "BrowseName": "EnumStrings",
		                  "ParentNodeId": "i=334",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "EnumStrings",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=334" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=335",
                      "BrowseName": "SupportedProfile",
                      "DisplayName": "SupportedProfile",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=341",
                      "BrowseName": "SoftwareCertificate",
                      "DisplayName": "SoftwareCertificate",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=576",
                      "BrowseName": "FilterOperator",
                      "DisplayName": "FilterOperator",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=7605" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=29" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7605",
		                  "BrowseName": "EnumStrings",
		                  "ParentNodeId": "i=576",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "EnumStrings",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=576" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=583",
                      "BrowseName": "ContentFilterElement",
                      "DisplayName": "ContentFilterElement",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=586",
                      "BrowseName": "ContentFilter",
                      "DisplayName": "ContentFilter",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=589",
                      "BrowseName": "FilterOperand",
                      "DisplayName": "FilterOperand",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=592",
                      "BrowseName": "ElementOperand",
                      "DisplayName": "ElementOperand",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=589" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=595",
                      "BrowseName": "LiteralOperand",
                      "DisplayName": "LiteralOperand",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=589" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=598",
                      "BrowseName": "AttributeOperand",
                      "DisplayName": "AttributeOperand",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=589" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=601",
                      "BrowseName": "SimpleAttributeOperand",
                      "DisplayName": "SimpleAttributeOperand",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=589" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=659",
                      "BrowseName": "HistoryEvent",
                      "DisplayName": "HistoryEvent",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=11234",
                      "BrowseName": "HistoryUpdateType",
                      "DisplayName": "HistoryUpdateType",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11884" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=29" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11884",
		                  "BrowseName": "EnumValues",
		                  "ParentNodeId": "i=11234",
		                  "DataType": "i=7594",
		                  "DisplayName": "EnumValues",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11234" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=11293",
                      "BrowseName": "PerformUpdateType",
                      "DisplayName": "PerformUpdateType",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11885" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=29" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11885",
		                  "BrowseName": "EnumValues",
		                  "ParentNodeId": "i=11293",
		                  "DataType": "i=7594",
		                  "DisplayName": "EnumValues",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11293" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=719",
                      "BrowseName": "MonitoringFilter",
                      "DisplayName": "MonitoringFilter",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=725",
                      "BrowseName": "EventFilter",
                      "DisplayName": "EventFilter",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=719" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=948",
                      "BrowseName": "AggregateConfiguration",
                      "DisplayName": "AggregateConfiguration",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=920",
                      "BrowseName": "HistoryEventFieldList",
                      "DisplayName": "HistoryEventFieldList",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=309", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=308" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8300" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=305", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=304" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8297" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=313", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=312" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8303" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=433", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=432" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8417" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=345", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=344" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8333" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=317", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=316" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8306" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=320", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=319" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8309" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=323", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=322" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8312" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=326", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=325" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8315" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=939", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=938" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8318" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=377", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=376" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8363" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=380", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=379" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8366" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=383", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=382" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8369" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=386", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=385" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8372" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=332", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=331" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8321" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=336", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=335" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8324" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=342", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=341" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8330" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=584", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=583" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8564" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=587", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=586" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8567" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=590", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=589" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8570" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=593", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=592" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8573" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=596", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=595" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8576" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=599", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=598" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8579" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=602", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=601" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8582" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=660", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=659" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8639" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=720", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=719" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8702" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=726", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=725" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8708" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=949", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=948" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8711" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=921", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=920" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8807" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=310", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=308" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7665" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=306", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=304" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7662" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=314", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=312" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7668" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=434", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=432" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7782" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=346", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=344" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7698" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=318", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=316" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7671" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=321", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=319" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7674" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=324", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=322" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7677" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=327", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=325" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7680" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=940", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=938" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7683" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=378", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=376" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7728" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=381", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=379" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7731" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=384", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=382" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7734" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=387", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=385" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7737" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=333", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=331" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7686" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=337", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=335" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7689" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=343", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=341" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7695" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=585", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=583" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7929" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=588", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=586" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7932" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=591", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=589" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7935" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=594", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=592" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7938" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=597", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=595" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7941" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=600", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=598" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7944" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=603", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=601" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7947" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=661", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=659" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8004" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=721", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=719" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8067" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=727", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=725" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8073" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=950", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=948" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8076" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=922", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=920" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8172" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

    

    // summary of definitions
    print( "Types defined in UA Part 04 Type Definition (Opc.Ua.Nodeset2.Part4.xml):" );
    print( "\tObjects: "   + uaobjects.length );
    print( "\tDataTypes: " + uadatatypes.length );
    print( "\tReferenceTypes: " + uareferencetypes.length );
    print( "\tObjectTypes: "    + uaobjecttypes.length );
    print( "\tVariableTypes: "  + uavariabletypes.length );
    print( "\tVariables: " + uavariables.length );
    print( "\tMethods: "   + uamethods.length );
    print( "TOTAL: " + ( uaobjects.length + uadatatypes.length + uareferencetypes.length + uaobjecttypes.length + uavariabletypes.length + uavariables.length + uamethods.length ) );

    // now to invoke the address-space walkthrough test:
    var result;
    for( i in uadatatypes ) result = CheckNodeDefinition( { Item: uadatatypes[i], ReadHelper: ReadHelper, BrowseHelper: BrowseHelper } );
    for( i in uaobjects )   result &= CheckNodeDefinition( { Item: uaobjects[i], ReadHelper: ReadHelper, BrowseHelper: BrowseHelper } );
    for( i in uareferencetypes ) result &= CheckNodeDefinition( { Item: uareferencetypes[i], ReadHelper: ReadHelper, BrowseHelper: BrowseHelper } );
    for( i in uaobjecttypes )    result &= CheckNodeDefinition( { Item: uaobjecttypes[i], ReadHelper: ReadHelper, BrowseHelper: BrowseHelper } );
    for( i in uavariabletypes )  result &= CheckNodeDefinition( { Item: uavariabletypes[i], ReadHelper: ReadHelper, BrowseHelper: BrowseHelper } );
    for( i in uavariables ) result &= CheckNodeDefinition( { Item: uavariables[i], ReadHelper: ReadHelper, BrowseHelper: BrowseHelper } );
    for( i in uamethods )   result &= CheckNodeDefinition( { Item: uamethods[i], ReadHelper: ReadHelper, BrowseHelper: BrowseHelper } );
 
    return( result );
}

Test.Execute( { Procedure: this.test000_04 } );