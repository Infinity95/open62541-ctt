/*  Test prepared by Nathan Pocock (nathan.pocock@opcfoundation.org)
    Description: Walks through the address space checking the TypeDefinitions */

function test000_05() {
// Define our functional variables
var uaobjects = [];
var uadatatypes = [];
var uareferencetypes = [];
var uaobjecttypes = [];
var uavariabletypes = [];
var uavariables = [];
var uamethods = [];

uareferencetypes.push( {"Type": "UAReferenceType",
                          "NodeId": "i=51",
                          "BrowseName": "FromState",
                          "IsAbstract": "",
                          "DisplayName": "FromState",
                          "Description": "The type for a reference to the state before a transition.",
                          "InverseName": "ToTransition",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=32" } ]
	} );

  uareferencetypes.push( {"Type": "UAReferenceType",
                          "NodeId": "i=52",
                          "BrowseName": "ToState",
                          "IsAbstract": "",
                          "DisplayName": "ToState",
                          "Description": "The type for a reference to the state after a transition.",
                          "InverseName": "FromTransition",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=32" } ]
	} );

  uareferencetypes.push( {"Type": "UAReferenceType",
                          "NodeId": "i=53",
                          "BrowseName": "HasCause",
                          "IsAbstract": "",
                          "DisplayName": "HasCause",
                          "Description": "The type for a reference to a method that can cause a transition to occur.",
                          "InverseName": "MayBeCausedBy",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=32" } ]
	} );

  uareferencetypes.push( {"Type": "UAReferenceType",
                          "NodeId": "i=54",
                          "BrowseName": "HasEffect",
                          "IsAbstract": "",
                          "DisplayName": "HasEffect",
                          "Description": "The type for a reference to an event that may be raised when a transition occurs.",
                          "InverseName": "MayBeEffectedBy",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=32" } ]
	} );

  uareferencetypes.push( {"Type": "UAReferenceType",
                          "NodeId": "i=117",
                          "BrowseName": "HasSubStateMachine",
                          "IsAbstract": "",
                          "DisplayName": "HasSubStateMachine",
                          "Description": "The type for a reference to a substate for a state.",
                          "InverseName": "SubStateMachineOf",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=32" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=58",
                        "BrowseName": "BaseObjectType",
                        "DisplayName": "BaseObjectType",
                        "Description": "The base type for all object nodes."	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=61",
                        "BrowseName": "FolderType",
                        "DisplayName": "FolderType",
                        "Description": "The type for objects that organize other nodes.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=62",
                          "BrowseName": "BaseVariableType",
                          "ValueRank": "-2",
                          "DisplayName": "BaseVariableType",
                          "Description": "The abstract base type for all variable nodes."	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=63",
                          "BrowseName": "BaseDataVariableType",
                          "ValueRank": "-2",
                          "DisplayName": "BaseDataVariableType",
                          "Description": "The type for variable that represents a process value.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=62" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=68",
                          "BrowseName": "PropertyType",
                          "ValueRank": "-2",
                          "DisplayName": "PropertyType",
                          "Description": "The type for variable that represents a property of another node.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=62" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=69",
                          "BrowseName": "DataTypeDescriptionType",
                          "ValueRank": "-2",
                          "DisplayName": "DataTypeDescriptionType",
                          "Description": "The type for variable that represents the description of a data type encoding.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=104" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=105" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=104",
		                  "BrowseName": "DataTypeVersion",
		                  "ParentNodeId": "i=69",
		                  "DataType": "String",
		                  "DisplayName": "DataTypeVersion",
		                  "Description": "The version number for the data type description.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=69" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=105",
		                  "BrowseName": "DictionaryFragment",
		                  "ParentNodeId": "i=69",
		                  "DataType": "ByteString",
		                  "DisplayName": "DictionaryFragment",
		                  "Description": "A fragment of a data type dictionary that defines the data type.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=69" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=72",
                          "BrowseName": "DataTypeDictionaryType",
                          "ValueRank": "-2",
                          "DisplayName": "DataTypeDictionaryType",
                          "Description": "The type for variable that represents the collection of data type decriptions.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=106" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=107" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=106",
		                  "BrowseName": "DataTypeVersion",
		                  "ParentNodeId": "i=72",
		                  "DataType": "String",
		                  "DisplayName": "DataTypeVersion",
		                  "Description": "The version number for the data type dictionary.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=72" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=107",
		                  "BrowseName": "NamespaceUri",
		                  "ParentNodeId": "i=72",
		                  "DataType": "String",
		                  "DisplayName": "NamespaceUri",
		                  "Description": "A URI that uniquely identifies the dictionary.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=72" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=75",
                        "BrowseName": "DataTypeSystemType",
                        "DisplayName": "DataTypeSystemType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=76",
                        "BrowseName": "DataTypeEncodingType",
                        "DisplayName": "DataTypeEncodingType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=77",
                        "BrowseName": "ModellingRuleType",
                        "DisplayName": "ModellingRuleType",
                        "Description": "The type for an object that describes how an instance declaration is used when a type is instantiated.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=111" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=111",
		                  "BrowseName": "NamingRule",
		                  "ParentNodeId": "i=77",
		                  "DataType": "i=120",
		                  "DisplayName": "NamingRule",
		                  "Description": "Specified the significances of the BrowseName when a type is instantiated.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=77" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Mandatory", 
                    "NodeId": "i=78", 
                    "SymbolicName": "ModellingRule_Mandatory",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=112" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=77" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=112",
		                  "BrowseName": "NamingRule",
		                  "ParentNodeId": "i=78",
		                  "DataType": "i=120",
		                  "DisplayName": "NamingRule",
		                  "Description": "Specified the significances of the BrowseName when a type is instantiated.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=78" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Optional", 
                    "NodeId": "i=80", 
                    "SymbolicName": "ModellingRule_Optional",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=113" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=77" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=113",
		                  "BrowseName": "NamingRule",
		                  "ParentNodeId": "i=80",
		                  "DataType": "i=120",
		                  "DisplayName": "NamingRule",
		                  "Description": "Specified the significances of the BrowseName when a type is instantiated.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=80" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "ExposesItsArray", 
                    "NodeId": "i=83", 
                    "SymbolicName": "ModellingRule_ExposesItsArray",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=114" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=77" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=114",
		                  "BrowseName": "NamingRule",
		                  "ParentNodeId": "i=83",
		                  "DataType": "i=120",
		                  "DisplayName": "NamingRule",
		                  "Description": "Specified the significances of the BrowseName when a type is instantiated.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=83" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "MandatoryShared", 
                    "NodeId": "i=79", 
                    "SymbolicName": "ModellingRule_MandatoryShared",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=116" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=77" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=116",
		                  "BrowseName": "NamingRule",
		                  "ParentNodeId": "i=79",
		                  "DataType": "i=120",
		                  "DisplayName": "NamingRule",
		                  "Description": "Specified the significances of the BrowseName when a type is instantiated.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=79" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "OptionalPlaceholder", 
                    "NodeId": "i=11508", 
                    "SymbolicName": "ModellingRule_OptionalPlaceholder",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11509" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=77" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11509",
		                  "BrowseName": "NamingRule",
		                  "ParentNodeId": "i=11508",
		                  "DataType": "i=120",
		                  "DisplayName": "NamingRule",
		                  "Description": "Specified the significances of the BrowseName when a type is instantiated.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11508" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "MandatoryPlaceholder", 
                    "NodeId": "i=11510", 
                    "SymbolicName": "ModellingRule_MandatoryPlaceholder",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11511" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=77" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11511",
		                  "BrowseName": "NamingRule",
		                  "ParentNodeId": "i=11510",
		                  "DataType": "i=120",
		                  "DisplayName": "NamingRule",
		                  "Description": "Specified the significances of the BrowseName when a type is instantiated.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11510" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Root", 
                    "NodeId": "i=84", 
                    "SymbolicName": "RootFolder",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=61" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Objects", 
                    "NodeId": "i=85", 
                    "SymbolicName": "ObjectsFolder",
			
                      "References": [ 
                          { "ReferenceTypeId": "Organizes", "NodeId": "i=84" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=61" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Types", 
                    "NodeId": "i=86", 
                    "SymbolicName": "TypesFolder",
			
                      "References": [ 
                          { "ReferenceTypeId": "Organizes", "NodeId": "i=84" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=61" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Views", 
                    "NodeId": "i=87", 
                    "SymbolicName": "ViewsFolder",
			
                      "References": [ 
                          { "ReferenceTypeId": "Organizes", "NodeId": "i=84" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=61" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "ObjectTypes", 
                    "NodeId": "i=88", 
                    "SymbolicName": "ObjectTypesFolder",
			
                      "References": [ 
                          { "ReferenceTypeId": "Organizes", "NodeId": "i=86" },
                          { "ReferenceTypeId": "Organizes", "NodeId": "i=58" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=61" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "VariableTypes", 
                    "NodeId": "i=89", 
                    "SymbolicName": "VariableTypesFolder",
			
                      "References": [ 
                          { "ReferenceTypeId": "Organizes", "NodeId": "i=86" },
                          { "ReferenceTypeId": "Organizes", "NodeId": "i=62" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=61" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "DataTypes", 
                    "NodeId": "i=90", 
                    "SymbolicName": "DataTypesFolder",
			
                      "References": [ 
                          { "ReferenceTypeId": "Organizes", "NodeId": "i=86" },
                          { "ReferenceTypeId": "Organizes", "NodeId": "i=24" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=61" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "ReferenceTypes", 
                    "NodeId": "i=91", 
                    "SymbolicName": "ReferenceTypesFolder",
			
                      "References": [ 
                          { "ReferenceTypeId": "Organizes", "NodeId": "i=86" },
                          { "ReferenceTypeId": "Organizes", "NodeId": "i=31" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=61" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "XML Schema", 
                    "NodeId": "i=92", 
                    "SymbolicName": "XmlSchema_TypeSystem",
			
                      "References": [ 
                          { "ReferenceTypeId": "Organizes", "NodeId": "i=90" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=75" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "OPC Binary", 
                    "NodeId": "i=93", 
                    "SymbolicName": "OPCBinarySchema_TypeSystem",
			
                      "References": [ 
                          { "ReferenceTypeId": "Organizes", "NodeId": "i=90" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=75" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2004",
                        "BrowseName": "ServerType",
                        "DisplayName": "ServerType",
                        "Description": "Specifies the current status and capabilities of the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2005" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2006" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2007" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2008" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2742" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2009" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2010" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2011" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2012" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11527" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11489" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2005",
		                  "BrowseName": "ServerArray",
		                  "ParentNodeId": "i=2004",
		                  "DataType": "String",
		                  "DisplayName": "ServerArray",
		                  "Description": "The list of server URIs used by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2004" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2006",
		                  "BrowseName": "NamespaceArray",
		                  "ParentNodeId": "i=2004",
		                  "DataType": "String",
		                  "DisplayName": "NamespaceArray",
		                  "Description": "The list of namespace URIs used by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2004" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2007",
		                  "BrowseName": "ServerStatus",
		                  "ParentNodeId": "i=2004",
		                  "DataType": "i=862",
		                  "DisplayName": "ServerStatus",
		                  "Description": "The current status of the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3074" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3075" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3076" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3077" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3084" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3085" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2138" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2004" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3074",
		                  "BrowseName": "StartTime",
		                  "ParentNodeId": "i=2007",
		                  "DataType": "i=294",
		                  "DisplayName": "StartTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2007" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3075",
		                  "BrowseName": "CurrentTime",
		                  "ParentNodeId": "i=2007",
		                  "DataType": "i=294",
		                  "DisplayName": "CurrentTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2007" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3076",
		                  "BrowseName": "State",
		                  "ParentNodeId": "i=2007",
		                  "DataType": "i=852",
		                  "DisplayName": "State",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2007" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3077",
		                  "BrowseName": "BuildInfo",
		                  "ParentNodeId": "i=2007",
		                  "DataType": "i=338",
		                  "DisplayName": "BuildInfo",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3078" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3079" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3080" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3081" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3082" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3083" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=3051" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2007" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3078",
		                  "BrowseName": "ProductUri",
		                  "ParentNodeId": "i=3077",
		                  "DataType": "String",
		                  "DisplayName": "ProductUri",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3077" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3079",
		                  "BrowseName": "ManufacturerName",
		                  "ParentNodeId": "i=3077",
		                  "DataType": "String",
		                  "DisplayName": "ManufacturerName",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3077" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3080",
		                  "BrowseName": "ProductName",
		                  "ParentNodeId": "i=3077",
		                  "DataType": "String",
		                  "DisplayName": "ProductName",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3077" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3081",
		                  "BrowseName": "SoftwareVersion",
		                  "ParentNodeId": "i=3077",
		                  "DataType": "String",
		                  "DisplayName": "SoftwareVersion",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3077" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3082",
		                  "BrowseName": "BuildNumber",
		                  "ParentNodeId": "i=3077",
		                  "DataType": "String",
		                  "DisplayName": "BuildNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3077" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3083",
		                  "BrowseName": "BuildDate",
		                  "ParentNodeId": "i=3077",
		                  "DataType": "i=294",
		                  "DisplayName": "BuildDate",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3077" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3084",
		                  "BrowseName": "SecondsTillShutdown",
		                  "ParentNodeId": "i=2007",
		                  "DataType": "UInt32",
		                  "DisplayName": "SecondsTillShutdown",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2007" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3085",
		                  "BrowseName": "ShutdownReason",
		                  "ParentNodeId": "i=2007",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "ShutdownReason",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2007" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2008",
		                  "BrowseName": "ServiceLevel",
		                  "ParentNodeId": "i=2004",
		                  "DataType": "Byte",
		                  "DisplayName": "ServiceLevel",
		                  "Description": "A value indicating the level of service the server can provide. 255 indicates the best.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2004" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2742",
		                  "BrowseName": "Auditing",
		                  "ParentNodeId": "i=2004",
		                  "DataType": "Boolean",
		                  "DisplayName": "Auditing",
		                  "Description": "A flag indicating whether the server is currently generating audit events.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2004" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "ServerCapabilities", 
                    "NodeId": "i=2009", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3086" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3087" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3088" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3089" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3090" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3091" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3092" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3093" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3094" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2013" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2004" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3086",
		                  "BrowseName": "ServerProfileArray",
		                  "ParentNodeId": "i=2009",
		                  "DataType": "String",
		                  "DisplayName": "ServerProfileArray",
		                  "Description": "A list of profiles supported by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2009" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3087",
		                  "BrowseName": "LocaleIdArray",
		                  "ParentNodeId": "i=2009",
		                  "DataType": "i=295",
		                  "DisplayName": "LocaleIdArray",
		                  "Description": "A list of locales supported by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2009" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3088",
		                  "BrowseName": "MinSupportedSampleRate",
		                  "ParentNodeId": "i=2009",
		                  "DataType": "i=290",
		                  "DisplayName": "MinSupportedSampleRate",
		                  "Description": "The minimum sampling interval supported by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2009" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3089",
		                  "BrowseName": "MaxBrowseContinuationPoints",
		                  "ParentNodeId": "i=2009",
		                  "DataType": "UInt16",
		                  "DisplayName": "MaxBrowseContinuationPoints",
		                  "Description": "The maximum number of continuation points for Browse operations per session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2009" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3090",
		                  "BrowseName": "MaxQueryContinuationPoints",
		                  "ParentNodeId": "i=2009",
		                  "DataType": "UInt16",
		                  "DisplayName": "MaxQueryContinuationPoints",
		                  "Description": "The maximum number of continuation points for Query operations per session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2009" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3091",
		                  "BrowseName": "MaxHistoryContinuationPoints",
		                  "ParentNodeId": "i=2009",
		                  "DataType": "UInt16",
		                  "DisplayName": "MaxHistoryContinuationPoints",
		                  "Description": "The maximum number of continuation points for ReadHistory operations per session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2009" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3092",
		                  "BrowseName": "SoftwareCertificates",
		                  "ParentNodeId": "i=2009",
		                  "DataType": "i=344",
		                  "DisplayName": "SoftwareCertificates",
		                  "Description": "The software certificates owned by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2009" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "ModellingRules", 
                    "NodeId": "i=3093", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=61" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2009" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "AggregateFunctions", 
                    "NodeId": "i=3094", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=61" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2009" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "ServerDiagnostics", 
                    "NodeId": "i=2010", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3095" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3110" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3111" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3114" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2020" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2004" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3095",
		                  "BrowseName": "ServerDiagnosticsSummary",
		                  "ParentNodeId": "i=2010",
		                  "DataType": "i=859",
		                  "DisplayName": "ServerDiagnosticsSummary",
		                  "Description": "A summary of server level diagnostics.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3096" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3097" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3098" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3099" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3100" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3101" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3102" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3104" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3105" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3106" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3107" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3108" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2150" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2010" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3096",
		                  "BrowseName": "ServerViewCount",
		                  "ParentNodeId": "i=3095",
		                  "DataType": "UInt32",
		                  "DisplayName": "ServerViewCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3095" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3097",
		                  "BrowseName": "CurrentSessionCount",
		                  "ParentNodeId": "i=3095",
		                  "DataType": "UInt32",
		                  "DisplayName": "CurrentSessionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3095" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3098",
		                  "BrowseName": "CumulatedSessionCount",
		                  "ParentNodeId": "i=3095",
		                  "DataType": "UInt32",
		                  "DisplayName": "CumulatedSessionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3095" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3099",
		                  "BrowseName": "SecurityRejectedSessionCount",
		                  "ParentNodeId": "i=3095",
		                  "DataType": "UInt32",
		                  "DisplayName": "SecurityRejectedSessionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3095" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3100",
		                  "BrowseName": "RejectedSessionCount",
		                  "ParentNodeId": "i=3095",
		                  "DataType": "UInt32",
		                  "DisplayName": "RejectedSessionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3095" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3101",
		                  "BrowseName": "SessionTimeoutCount",
		                  "ParentNodeId": "i=3095",
		                  "DataType": "UInt32",
		                  "DisplayName": "SessionTimeoutCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3095" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3102",
		                  "BrowseName": "SessionAbortCount",
		                  "ParentNodeId": "i=3095",
		                  "DataType": "UInt32",
		                  "DisplayName": "SessionAbortCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3095" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3104",
		                  "BrowseName": "PublishingIntervalCount",
		                  "ParentNodeId": "i=3095",
		                  "DataType": "UInt32",
		                  "DisplayName": "PublishingIntervalCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3095" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3105",
		                  "BrowseName": "CurrentSubscriptionCount",
		                  "ParentNodeId": "i=3095",
		                  "DataType": "UInt32",
		                  "DisplayName": "CurrentSubscriptionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3095" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3106",
		                  "BrowseName": "CumulatedSubscriptionCount",
		                  "ParentNodeId": "i=3095",
		                  "DataType": "UInt32",
		                  "DisplayName": "CumulatedSubscriptionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3095" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3107",
		                  "BrowseName": "SecurityRejectedRequestsCount",
		                  "ParentNodeId": "i=3095",
		                  "DataType": "UInt32",
		                  "DisplayName": "SecurityRejectedRequestsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3095" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3108",
		                  "BrowseName": "RejectedRequestsCount",
		                  "ParentNodeId": "i=3095",
		                  "DataType": "UInt32",
		                  "DisplayName": "RejectedRequestsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3095" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3110",
		                  "BrowseName": "SubscriptionDiagnosticsArray",
		                  "ParentNodeId": "i=2010",
		                  "DataType": "i=874",
		                  "DisplayName": "SubscriptionDiagnosticsArray",
		                  "Description": "A list of diagnostics for each active subscription.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2171" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2010" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "SessionsDiagnosticsSummary", 
                    "NodeId": "i=3111", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3112" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3113" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2026" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2010" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3112",
		                  "BrowseName": "SessionDiagnosticsArray",
		                  "ParentNodeId": "i=3111",
		                  "DataType": "i=865",
		                  "DisplayName": "SessionDiagnosticsArray",
		                  "Description": "A list of diagnostics for each active session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2196" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3111" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3113",
		                  "BrowseName": "SessionSecurityDiagnosticsArray",
		                  "ParentNodeId": "i=3111",
		                  "DataType": "i=868",
		                  "DisplayName": "SessionSecurityDiagnosticsArray",
		                  "Description": "A list of security related diagnostics for each active session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2243" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3111" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3114",
		                  "BrowseName": "EnabledFlag",
		                  "ParentNodeId": "i=2010",
		                  "DataType": "Boolean",
		                  "DisplayName": "EnabledFlag",
		                  "Description": "If TRUE the diagnostics collection is enabled.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2010" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "VendorServerInfo", 
                    "NodeId": "i=2011", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2033" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2004" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "ServerRedundancy", 
                    "NodeId": "i=2012", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3115" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2034" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2004" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3115",
		                  "BrowseName": "RedundancySupport",
		                  "ParentNodeId": "i=2012",
		                  "DataType": "i=851",
		                  "DisplayName": "RedundancySupport",
		                  "Description": "Indicates what style of redundancy is supported by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2012" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Namespaces", 
                    "NodeId": "i=11527", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=11645" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2004" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11489",
		                "BrowseName": "GetMonitoredItems",
		                "ParentNodeId": "i=2004",
		                "DisplayName": "GetMonitoredItems",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11490" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11491" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2004" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11490",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11489",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11489" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11491",
		                  "BrowseName": "OutputArguments",
		                  "ParentNodeId": "i=11489",
		                  "DataType": "i=296",
		                  "DisplayName": "OutputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11489" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2013",
                        "BrowseName": "ServerCapabilitiesType",
                        "DisplayName": "ServerCapabilitiesType",
                        "Description": "Describes the capabilities supported by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2014" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2016" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2017" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2732" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2733" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2734" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3049" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11549" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11550" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11551" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2019" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2754" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11562" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2014",
		                  "BrowseName": "ServerProfileArray",
		                  "ParentNodeId": "i=2013",
		                  "DataType": "String",
		                  "DisplayName": "ServerProfileArray",
		                  "Description": "A list of profiles supported by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2013" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2016",
		                  "BrowseName": "LocaleIdArray",
		                  "ParentNodeId": "i=2013",
		                  "DataType": "i=295",
		                  "DisplayName": "LocaleIdArray",
		                  "Description": "A list of locales supported by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2013" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2017",
		                  "BrowseName": "MinSupportedSampleRate",
		                  "ParentNodeId": "i=2013",
		                  "DataType": "i=290",
		                  "DisplayName": "MinSupportedSampleRate",
		                  "Description": "The minimum sampling interval supported by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2013" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2732",
		                  "BrowseName": "MaxBrowseContinuationPoints",
		                  "ParentNodeId": "i=2013",
		                  "DataType": "UInt16",
		                  "DisplayName": "MaxBrowseContinuationPoints",
		                  "Description": "The maximum number of continuation points for Browse operations per session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2013" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2733",
		                  "BrowseName": "MaxQueryContinuationPoints",
		                  "ParentNodeId": "i=2013",
		                  "DataType": "UInt16",
		                  "DisplayName": "MaxQueryContinuationPoints",
		                  "Description": "The maximum number of continuation points for Query operations per session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2013" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2734",
		                  "BrowseName": "MaxHistoryContinuationPoints",
		                  "ParentNodeId": "i=2013",
		                  "DataType": "UInt16",
		                  "DisplayName": "MaxHistoryContinuationPoints",
		                  "Description": "The maximum number of continuation points for ReadHistory operations per session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2013" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3049",
		                  "BrowseName": "SoftwareCertificates",
		                  "ParentNodeId": "i=2013",
		                  "DataType": "i=344",
		                  "DisplayName": "SoftwareCertificates",
		                  "Description": "The software certificates owned by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2013" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11549",
		                  "BrowseName": "MaxArrayLength",
		                  "ParentNodeId": "i=2013",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxArrayLength",
		                  "Description": "The maximum length for an array value supported by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2013" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11550",
		                  "BrowseName": "MaxStringLength",
		                  "ParentNodeId": "i=2013",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxStringLength",
		                  "Description": "The maximum length for a string value supported by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2013" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "OperationLimits", 
                    "NodeId": "i=11551", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=11564" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2013" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "ModellingRules", 
                    "NodeId": "i=2019", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=61" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2013" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "AggregateFunctions", 
                    "NodeId": "i=2754", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=61" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2013" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11562",
		                  "BrowseName": "<VendorCapability>",
		                  "ParentNodeId": "i=2013",
		                  "DataType": "",
		                  "DisplayName": "<VendorCapability>",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2137" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=11508" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2013" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2020",
                        "BrowseName": "ServerDiagnosticsType",
                        "DisplayName": "ServerDiagnosticsType",
                        "Description": "The diagnostics information for a server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2021" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2022" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2023" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2744" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2025" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2021",
		                  "BrowseName": "ServerDiagnosticsSummary",
		                  "ParentNodeId": "i=2020",
		                  "DataType": "i=859",
		                  "DisplayName": "ServerDiagnosticsSummary",
		                  "Description": "A summary of server level diagnostics.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3116" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3117" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3118" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3119" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3120" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3121" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3122" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3124" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3125" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3126" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3127" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3128" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2150" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2020" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3116",
		                  "BrowseName": "ServerViewCount",
		                  "ParentNodeId": "i=2021",
		                  "DataType": "UInt32",
		                  "DisplayName": "ServerViewCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3117",
		                  "BrowseName": "CurrentSessionCount",
		                  "ParentNodeId": "i=2021",
		                  "DataType": "UInt32",
		                  "DisplayName": "CurrentSessionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3118",
		                  "BrowseName": "CumulatedSessionCount",
		                  "ParentNodeId": "i=2021",
		                  "DataType": "UInt32",
		                  "DisplayName": "CumulatedSessionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3119",
		                  "BrowseName": "SecurityRejectedSessionCount",
		                  "ParentNodeId": "i=2021",
		                  "DataType": "UInt32",
		                  "DisplayName": "SecurityRejectedSessionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3120",
		                  "BrowseName": "RejectedSessionCount",
		                  "ParentNodeId": "i=2021",
		                  "DataType": "UInt32",
		                  "DisplayName": "RejectedSessionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3121",
		                  "BrowseName": "SessionTimeoutCount",
		                  "ParentNodeId": "i=2021",
		                  "DataType": "UInt32",
		                  "DisplayName": "SessionTimeoutCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3122",
		                  "BrowseName": "SessionAbortCount",
		                  "ParentNodeId": "i=2021",
		                  "DataType": "UInt32",
		                  "DisplayName": "SessionAbortCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3124",
		                  "BrowseName": "PublishingIntervalCount",
		                  "ParentNodeId": "i=2021",
		                  "DataType": "UInt32",
		                  "DisplayName": "PublishingIntervalCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3125",
		                  "BrowseName": "CurrentSubscriptionCount",
		                  "ParentNodeId": "i=2021",
		                  "DataType": "UInt32",
		                  "DisplayName": "CurrentSubscriptionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3126",
		                  "BrowseName": "CumulatedSubscriptionCount",
		                  "ParentNodeId": "i=2021",
		                  "DataType": "UInt32",
		                  "DisplayName": "CumulatedSubscriptionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3127",
		                  "BrowseName": "SecurityRejectedRequestsCount",
		                  "ParentNodeId": "i=2021",
		                  "DataType": "UInt32",
		                  "DisplayName": "SecurityRejectedRequestsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3128",
		                  "BrowseName": "RejectedRequestsCount",
		                  "ParentNodeId": "i=2021",
		                  "DataType": "UInt32",
		                  "DisplayName": "RejectedRequestsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2022",
		                  "BrowseName": "SamplingIntervalDiagnosticsArray",
		                  "ParentNodeId": "i=2020",
		                  "DataType": "i=856",
		                  "DisplayName": "SamplingIntervalDiagnosticsArray",
		                  "Description": "A list of diagnostics for each sampling interval supported by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2164" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2020" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2023",
		                  "BrowseName": "SubscriptionDiagnosticsArray",
		                  "ParentNodeId": "i=2020",
		                  "DataType": "i=874",
		                  "DisplayName": "SubscriptionDiagnosticsArray",
		                  "Description": "A list of diagnostics for each active subscription.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2171" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2020" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "SessionsDiagnosticsSummary", 
                    "NodeId": "i=2744", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3129" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3130" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2026" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2020" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3129",
		                  "BrowseName": "SessionDiagnosticsArray",
		                  "ParentNodeId": "i=2744",
		                  "DataType": "i=865",
		                  "DisplayName": "SessionDiagnosticsArray",
		                  "Description": "A list of diagnostics for each active session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2196" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2744" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3130",
		                  "BrowseName": "SessionSecurityDiagnosticsArray",
		                  "ParentNodeId": "i=2744",
		                  "DataType": "i=868",
		                  "DisplayName": "SessionSecurityDiagnosticsArray",
		                  "Description": "A list of security related diagnostics for each active session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2243" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2744" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2025",
		                  "BrowseName": "EnabledFlag",
		                  "ParentNodeId": "i=2020",
		                  "DataType": "Boolean",
		                  "DisplayName": "EnabledFlag",
		                  "Description": "If TRUE the diagnostics collection is enabled.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2020" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2026",
                        "BrowseName": "SessionsDiagnosticsSummaryType",
                        "DisplayName": "SessionsDiagnosticsSummaryType",
                        "Description": "Provides a summary of session level diagnostics.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2027" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2028" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12097" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2027",
		                  "BrowseName": "SessionDiagnosticsArray",
		                  "ParentNodeId": "i=2026",
		                  "DataType": "i=865",
		                  "DisplayName": "SessionDiagnosticsArray",
		                  "Description": "A list of diagnostics for each active session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2196" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2026" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2028",
		                  "BrowseName": "SessionSecurityDiagnosticsArray",
		                  "ParentNodeId": "i=2026",
		                  "DataType": "i=868",
		                  "DisplayName": "SessionSecurityDiagnosticsArray",
		                  "Description": "A list of security related diagnostics for each active session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2243" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2026" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "<SessionPlaceholder>", 
                    "NodeId": "i=12097", 
                    "SymbolicName": "SessionPlaceholder",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12142" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12152" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2029" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=11508" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2026" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12098",
		                  "BrowseName": "SessionDiagnostics",
		                  "ParentNodeId": "i=12097",
		                  "DataType": "i=865",
		                  "DisplayName": "SessionDiagnostics",
		                  "Description": "Diagnostics information for an active session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12099" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12100" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12101" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12102" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12103" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12104" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12105" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12106" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12107" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12108" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12109" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12110" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12111" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12112" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12113" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12114" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12115" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12116" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12117" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12118" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12119" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12120" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12121" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12122" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12123" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12124" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12125" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12126" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12127" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12128" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12129" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12130" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12131" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12132" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12133" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12134" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12135" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12136" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12137" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12138" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12139" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12140" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12141" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2197" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12097" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12099",
		                  "BrowseName": "SessionId",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "NodeId",
		                  "DisplayName": "SessionId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12100",
		                  "BrowseName": "SessionName",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "String",
		                  "DisplayName": "SessionName",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12101",
		                  "BrowseName": "ClientDescription",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=308",
		                  "DisplayName": "ClientDescription",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12102",
		                  "BrowseName": "ServerUri",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "String",
		                  "DisplayName": "ServerUri",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12103",
		                  "BrowseName": "EndpointUrl",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "String",
		                  "DisplayName": "EndpointUrl",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12104",
		                  "BrowseName": "LocaleIds",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=295",
		                  "DisplayName": "LocaleIds",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12105",
		                  "BrowseName": "ActualSessionTimeout",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=290",
		                  "DisplayName": "ActualSessionTimeout",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12106",
		                  "BrowseName": "MaxResponseMessageSize",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxResponseMessageSize",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12107",
		                  "BrowseName": "ClientConnectionTime",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=294",
		                  "DisplayName": "ClientConnectionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12108",
		                  "BrowseName": "ClientLastContactTime",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=294",
		                  "DisplayName": "ClientLastContactTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12109",
		                  "BrowseName": "CurrentSubscriptionsCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "UInt32",
		                  "DisplayName": "CurrentSubscriptionsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12110",
		                  "BrowseName": "CurrentMonitoredItemsCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "UInt32",
		                  "DisplayName": "CurrentMonitoredItemsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12111",
		                  "BrowseName": "CurrentPublishRequestsInQueue",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "UInt32",
		                  "DisplayName": "CurrentPublishRequestsInQueue",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12112",
		                  "BrowseName": "TotalRequestCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "TotalRequestCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12113",
		                  "BrowseName": "UnauthorizedRequestCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "UInt32",
		                  "DisplayName": "UnauthorizedRequestCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12114",
		                  "BrowseName": "ReadCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "ReadCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12115",
		                  "BrowseName": "HistoryReadCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "HistoryReadCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12116",
		                  "BrowseName": "WriteCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "WriteCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12117",
		                  "BrowseName": "HistoryUpdateCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "HistoryUpdateCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12118",
		                  "BrowseName": "CallCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "CallCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12119",
		                  "BrowseName": "CreateMonitoredItemsCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "CreateMonitoredItemsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12120",
		                  "BrowseName": "ModifyMonitoredItemsCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "ModifyMonitoredItemsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12121",
		                  "BrowseName": "SetMonitoringModeCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "SetMonitoringModeCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12122",
		                  "BrowseName": "SetTriggeringCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "SetTriggeringCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12123",
		                  "BrowseName": "DeleteMonitoredItemsCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "DeleteMonitoredItemsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12124",
		                  "BrowseName": "CreateSubscriptionCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "CreateSubscriptionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12125",
		                  "BrowseName": "ModifySubscriptionCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "ModifySubscriptionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12126",
		                  "BrowseName": "SetPublishingModeCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "SetPublishingModeCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12127",
		                  "BrowseName": "PublishCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "PublishCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12128",
		                  "BrowseName": "RepublishCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "RepublishCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12129",
		                  "BrowseName": "TransferSubscriptionsCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "TransferSubscriptionsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12130",
		                  "BrowseName": "DeleteSubscriptionsCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "DeleteSubscriptionsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12131",
		                  "BrowseName": "AddNodesCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "AddNodesCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12132",
		                  "BrowseName": "AddReferencesCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "AddReferencesCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12133",
		                  "BrowseName": "DeleteNodesCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "DeleteNodesCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12134",
		                  "BrowseName": "DeleteReferencesCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "DeleteReferencesCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12135",
		                  "BrowseName": "BrowseCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "BrowseCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12136",
		                  "BrowseName": "BrowseNextCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "BrowseNextCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12137",
		                  "BrowseName": "TranslateBrowsePathsToNodeIdsCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "TranslateBrowsePathsToNodeIdsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12138",
		                  "BrowseName": "QueryFirstCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "QueryFirstCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12139",
		                  "BrowseName": "QueryNextCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "QueryNextCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12140",
		                  "BrowseName": "RegisterNodesCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "RegisterNodesCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12141",
		                  "BrowseName": "UnregisterNodesCount",
		                  "ParentNodeId": "i=12098",
		                  "DataType": "i=871",
		                  "DisplayName": "UnregisterNodesCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12098" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12142",
		                  "BrowseName": "SessionSecurityDiagnostics",
		                  "ParentNodeId": "i=12097",
		                  "DataType": "i=868",
		                  "DisplayName": "SessionSecurityDiagnostics",
		                  "Description": "Security related diagnostics information for an active session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12143" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12144" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12145" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12146" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12147" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12148" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12149" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12150" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12151" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2244" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12097" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12143",
		                  "BrowseName": "SessionId",
		                  "ParentNodeId": "i=12142",
		                  "DataType": "NodeId",
		                  "DisplayName": "SessionId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12142" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12144",
		                  "BrowseName": "ClientUserIdOfSession",
		                  "ParentNodeId": "i=12142",
		                  "DataType": "String",
		                  "DisplayName": "ClientUserIdOfSession",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12142" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12145",
		                  "BrowseName": "ClientUserIdHistory",
		                  "ParentNodeId": "i=12142",
		                  "DataType": "String",
		                  "DisplayName": "ClientUserIdHistory",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12142" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12146",
		                  "BrowseName": "AuthenticationMechanism",
		                  "ParentNodeId": "i=12142",
		                  "DataType": "String",
		                  "DisplayName": "AuthenticationMechanism",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12142" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12147",
		                  "BrowseName": "Encoding",
		                  "ParentNodeId": "i=12142",
		                  "DataType": "String",
		                  "DisplayName": "Encoding",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12142" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12148",
		                  "BrowseName": "TransportProtocol",
		                  "ParentNodeId": "i=12142",
		                  "DataType": "String",
		                  "DisplayName": "TransportProtocol",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12142" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12149",
		                  "BrowseName": "SecurityMode",
		                  "ParentNodeId": "i=12142",
		                  "DataType": "i=302",
		                  "DisplayName": "SecurityMode",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12142" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12150",
		                  "BrowseName": "SecurityPolicyUri",
		                  "ParentNodeId": "i=12142",
		                  "DataType": "String",
		                  "DisplayName": "SecurityPolicyUri",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12142" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12151",
		                  "BrowseName": "ClientCertificate",
		                  "ParentNodeId": "i=12142",
		                  "DataType": "ByteString",
		                  "DisplayName": "ClientCertificate",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12142" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12152",
		                  "BrowseName": "SubscriptionDiagnosticsArray",
		                  "ParentNodeId": "i=12097",
		                  "DataType": "i=874",
		                  "DisplayName": "SubscriptionDiagnosticsArray",
		                  "Description": "A list of diagnostics for each subscription owned by the session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2171" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12097" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2029",
                        "BrowseName": "SessionDiagnosticsObjectType",
                        "DisplayName": "SessionDiagnosticsObjectType",
                        "Description": "A container for session level diagnostics information.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2031" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2032" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2030",
		                  "BrowseName": "SessionDiagnostics",
		                  "ParentNodeId": "i=2029",
		                  "DataType": "i=865",
		                  "DisplayName": "SessionDiagnostics",
		                  "Description": "Diagnostics information for an active session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3131" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3132" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3133" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3134" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3135" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3136" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3137" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3138" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3139" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3140" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3141" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3142" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3143" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8898" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11891" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3151" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3152" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3153" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3154" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3155" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3156" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3157" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3158" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3159" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3160" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3161" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3162" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3163" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3164" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3165" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3166" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3167" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3168" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3169" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3170" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3171" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3172" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3173" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3174" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3175" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3176" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3177" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3178" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2197" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2029" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3131",
		                  "BrowseName": "SessionId",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "NodeId",
		                  "DisplayName": "SessionId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3132",
		                  "BrowseName": "SessionName",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "String",
		                  "DisplayName": "SessionName",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3133",
		                  "BrowseName": "ClientDescription",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=308",
		                  "DisplayName": "ClientDescription",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3134",
		                  "BrowseName": "ServerUri",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "String",
		                  "DisplayName": "ServerUri",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3135",
		                  "BrowseName": "EndpointUrl",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "String",
		                  "DisplayName": "EndpointUrl",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3136",
		                  "BrowseName": "LocaleIds",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=295",
		                  "DisplayName": "LocaleIds",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3137",
		                  "BrowseName": "ActualSessionTimeout",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=290",
		                  "DisplayName": "ActualSessionTimeout",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3138",
		                  "BrowseName": "MaxResponseMessageSize",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxResponseMessageSize",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3139",
		                  "BrowseName": "ClientConnectionTime",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=294",
		                  "DisplayName": "ClientConnectionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3140",
		                  "BrowseName": "ClientLastContactTime",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=294",
		                  "DisplayName": "ClientLastContactTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3141",
		                  "BrowseName": "CurrentSubscriptionsCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "UInt32",
		                  "DisplayName": "CurrentSubscriptionsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3142",
		                  "BrowseName": "CurrentMonitoredItemsCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "UInt32",
		                  "DisplayName": "CurrentMonitoredItemsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3143",
		                  "BrowseName": "CurrentPublishRequestsInQueue",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "UInt32",
		                  "DisplayName": "CurrentPublishRequestsInQueue",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8898",
		                  "BrowseName": "TotalRequestCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "TotalRequestCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11891",
		                  "BrowseName": "UnauthorizedRequestCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "UInt32",
		                  "DisplayName": "UnauthorizedRequestCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3151",
		                  "BrowseName": "ReadCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "ReadCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3152",
		                  "BrowseName": "HistoryReadCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "HistoryReadCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3153",
		                  "BrowseName": "WriteCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "WriteCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3154",
		                  "BrowseName": "HistoryUpdateCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "HistoryUpdateCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3155",
		                  "BrowseName": "CallCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "CallCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3156",
		                  "BrowseName": "CreateMonitoredItemsCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "CreateMonitoredItemsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3157",
		                  "BrowseName": "ModifyMonitoredItemsCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "ModifyMonitoredItemsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3158",
		                  "BrowseName": "SetMonitoringModeCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "SetMonitoringModeCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3159",
		                  "BrowseName": "SetTriggeringCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "SetTriggeringCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3160",
		                  "BrowseName": "DeleteMonitoredItemsCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "DeleteMonitoredItemsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3161",
		                  "BrowseName": "CreateSubscriptionCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "CreateSubscriptionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3162",
		                  "BrowseName": "ModifySubscriptionCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "ModifySubscriptionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3163",
		                  "BrowseName": "SetPublishingModeCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "SetPublishingModeCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3164",
		                  "BrowseName": "PublishCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "PublishCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3165",
		                  "BrowseName": "RepublishCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "RepublishCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3166",
		                  "BrowseName": "TransferSubscriptionsCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "TransferSubscriptionsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3167",
		                  "BrowseName": "DeleteSubscriptionsCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "DeleteSubscriptionsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3168",
		                  "BrowseName": "AddNodesCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "AddNodesCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3169",
		                  "BrowseName": "AddReferencesCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "AddReferencesCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3170",
		                  "BrowseName": "DeleteNodesCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "DeleteNodesCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3171",
		                  "BrowseName": "DeleteReferencesCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "DeleteReferencesCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3172",
		                  "BrowseName": "BrowseCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "BrowseCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3173",
		                  "BrowseName": "BrowseNextCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "BrowseNextCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3174",
		                  "BrowseName": "TranslateBrowsePathsToNodeIdsCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "TranslateBrowsePathsToNodeIdsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3175",
		                  "BrowseName": "QueryFirstCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "QueryFirstCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3176",
		                  "BrowseName": "QueryNextCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "QueryNextCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3177",
		                  "BrowseName": "RegisterNodesCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "RegisterNodesCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3178",
		                  "BrowseName": "UnregisterNodesCount",
		                  "ParentNodeId": "i=2030",
		                  "DataType": "i=871",
		                  "DisplayName": "UnregisterNodesCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2030" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2031",
		                  "BrowseName": "SessionSecurityDiagnostics",
		                  "ParentNodeId": "i=2029",
		                  "DataType": "i=868",
		                  "DisplayName": "SessionSecurityDiagnostics",
		                  "Description": "Security related diagnostics information for an active session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3179" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3180" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3181" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3182" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3183" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3184" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3185" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3186" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3187" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2244" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2029" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3179",
		                  "BrowseName": "SessionId",
		                  "ParentNodeId": "i=2031",
		                  "DataType": "NodeId",
		                  "DisplayName": "SessionId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2031" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3180",
		                  "BrowseName": "ClientUserIdOfSession",
		                  "ParentNodeId": "i=2031",
		                  "DataType": "String",
		                  "DisplayName": "ClientUserIdOfSession",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2031" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3181",
		                  "BrowseName": "ClientUserIdHistory",
		                  "ParentNodeId": "i=2031",
		                  "DataType": "String",
		                  "DisplayName": "ClientUserIdHistory",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2031" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3182",
		                  "BrowseName": "AuthenticationMechanism",
		                  "ParentNodeId": "i=2031",
		                  "DataType": "String",
		                  "DisplayName": "AuthenticationMechanism",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2031" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3183",
		                  "BrowseName": "Encoding",
		                  "ParentNodeId": "i=2031",
		                  "DataType": "String",
		                  "DisplayName": "Encoding",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2031" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3184",
		                  "BrowseName": "TransportProtocol",
		                  "ParentNodeId": "i=2031",
		                  "DataType": "String",
		                  "DisplayName": "TransportProtocol",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2031" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3185",
		                  "BrowseName": "SecurityMode",
		                  "ParentNodeId": "i=2031",
		                  "DataType": "i=302",
		                  "DisplayName": "SecurityMode",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2031" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3186",
		                  "BrowseName": "SecurityPolicyUri",
		                  "ParentNodeId": "i=2031",
		                  "DataType": "String",
		                  "DisplayName": "SecurityPolicyUri",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2031" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3187",
		                  "BrowseName": "ClientCertificate",
		                  "ParentNodeId": "i=2031",
		                  "DataType": "ByteString",
		                  "DisplayName": "ClientCertificate",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2031" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2032",
		                  "BrowseName": "SubscriptionDiagnosticsArray",
		                  "ParentNodeId": "i=2029",
		                  "DataType": "i=874",
		                  "DisplayName": "SubscriptionDiagnosticsArray",
		                  "Description": "A list of diagnostics for each subscription owned by the session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2171" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2029" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2033",
                        "BrowseName": "VendorServerInfoType",
                        "DisplayName": "VendorServerInfoType",
                        "Description": "A base type for vendor specific server information.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2034",
                        "BrowseName": "ServerRedundancyType",
                        "DisplayName": "ServerRedundancyType",
                        "Description": "A base type for an object that describe how a server supports redundancy.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2035" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2035",
		                  "BrowseName": "RedundancySupport",
		                  "ParentNodeId": "i=2034",
		                  "DataType": "i=851",
		                  "DisplayName": "RedundancySupport",
		                  "Description": "Indicates what style of redundancy is supported by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2034" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2036",
                        "BrowseName": "TransparentRedundancyType",
                        "DisplayName": "TransparentRedundancyType",
                        "Description": "Identifies the capabilties of server that supports transparent redundancy.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2037" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2038" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2034" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2037",
		                  "BrowseName": "CurrentServerId",
		                  "ParentNodeId": "i=2036",
		                  "DataType": "String",
		                  "DisplayName": "CurrentServerId",
		                  "Description": "The ID of the server that is currently in use.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2036" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2038",
		                  "BrowseName": "RedundantServerArray",
		                  "ParentNodeId": "i=2036",
		                  "DataType": "i=853",
		                  "DisplayName": "RedundantServerArray",
		                  "Description": "A list of servers in the same redundant set.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2036" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2039",
                        "BrowseName": "NonTransparentRedundancyType",
                        "DisplayName": "NonTransparentRedundancyType",
                        "Description": "Identifies the capabilties of server that supports non-transparent redundancy.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2040" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2034" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2040",
		                  "BrowseName": "ServerUriArray",
		                  "ParentNodeId": "i=2039",
		                  "DataType": "String",
		                  "DisplayName": "ServerUriArray",
		                  "Description": "A list of servers in the same redundant set.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2039" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=11945",
                        "BrowseName": "NonTransparentNetworkRedundancyType",
                        "DisplayName": "NonTransparentNetworkRedundancyType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11948" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2039" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11948",
		                  "BrowseName": "ServerNetworkGroups",
		                  "ParentNodeId": "i=11945",
		                  "DataType": "i=11944",
		                  "DisplayName": "ServerNetworkGroups",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11945" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=11564",
                        "BrowseName": "OperationLimitsType",
                        "DisplayName": "OperationLimitsType",
                        "Description": "Identifies the operation limits imposed by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11565" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12161" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12162" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11567" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12163" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12164" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11569" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11570" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11571" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11572" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11573" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11574" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11565",
		                  "BrowseName": "MaxNodesPerRead",
		                  "ParentNodeId": "i=11564",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerRead",
		                  "Description": "The maximum number of operations in a single Read request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11564" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12161",
		                  "BrowseName": "MaxNodesPerHistoryReadData",
		                  "ParentNodeId": "i=11564",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerHistoryReadData",
		                  "Description": "The maximum number of operations in a single data HistoryRead request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11564" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12162",
		                  "BrowseName": "MaxNodesPerHistoryReadEvents",
		                  "ParentNodeId": "i=11564",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerHistoryReadEvents",
		                  "Description": "The maximum number of operations in a single event HistoryRead request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11564" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11567",
		                  "BrowseName": "MaxNodesPerWrite",
		                  "ParentNodeId": "i=11564",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerWrite",
		                  "Description": "The maximum number of operations in a single Write request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11564" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12163",
		                  "BrowseName": "MaxNodesPerHistoryUpdateData",
		                  "ParentNodeId": "i=11564",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerHistoryUpdateData",
		                  "Description": "The maximum number of operations in a single data HistoryUpdate request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11564" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12164",
		                  "BrowseName": "MaxNodesPerHistoryUpdateEvents",
		                  "ParentNodeId": "i=11564",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerHistoryUpdateEvents",
		                  "Description": "The maximum number of operations in a single event HistoryUpdate request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11564" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11569",
		                  "BrowseName": "MaxNodesPerMethodCall",
		                  "ParentNodeId": "i=11564",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerMethodCall",
		                  "Description": "The maximum number of operations in a single Call request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11564" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11570",
		                  "BrowseName": "MaxNodesPerBrowse",
		                  "ParentNodeId": "i=11564",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerBrowse",
		                  "Description": "The maximum number of operations in a single Browse request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11564" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11571",
		                  "BrowseName": "MaxNodesPerRegisterNodes",
		                  "ParentNodeId": "i=11564",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerRegisterNodes",
		                  "Description": "The maximum number of operations in a single RegisterNodes request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11564" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11572",
		                  "BrowseName": "MaxNodesPerTranslateBrowsePathsToNodeIds",
		                  "ParentNodeId": "i=11564",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerTranslateBrowsePathsToNodeIds",
		                  "Description": "The maximum number of operations in a single TranslateBrowsePathsToNodeIds request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11564" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11573",
		                  "BrowseName": "MaxNodesPerNodeManagement",
		                  "ParentNodeId": "i=11564",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerNodeManagement",
		                  "Description": "The maximum number of operations in a single AddNodes, AddReferences, DeleteNodes or DeleteReferences request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11564" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11574",
		                  "BrowseName": "MaxMonitoredItemsPerCall",
		                  "ParentNodeId": "i=11564",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxMonitoredItemsPerCall",
		                  "Description": "The maximum number of operations in a single MonitoredItem related request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11564" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=11575",
                        "BrowseName": "FileType",
                        "DisplayName": "FileType",
                        "Description": "An object that represents a file that can be accessed via the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11576" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11577" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11578" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11579" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11580" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11583" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11585" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11588" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11590" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11593" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11576",
		                  "BrowseName": "Size",
		                  "ParentNodeId": "i=11575",
		                  "DataType": "UInt64",
		                  "DisplayName": "Size",
		                  "Description": "The size of the file in bytes.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11575" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11577",
		                  "BrowseName": "Writeable",
		                  "ParentNodeId": "i=11575",
		                  "DataType": "Boolean",
		                  "DisplayName": "Writeable",
		                  "Description": "Whether the file is writeable.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11575" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11578",
		                  "BrowseName": "UserWriteable",
		                  "ParentNodeId": "i=11575",
		                  "DataType": "Boolean",
		                  "DisplayName": "UserWriteable",
		                  "Description": "Whether the file is writeable by the current user.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11575" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11579",
		                  "BrowseName": "OpenCount",
		                  "ParentNodeId": "i=11575",
		                  "DataType": "UInt16",
		                  "DisplayName": "OpenCount",
		                  "Description": "The current number of open file handles.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11575" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11580",
		                "BrowseName": "Open",
		                "ParentNodeId": "i=11575",
		                "DisplayName": "Open",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11581" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11582" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11575" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11581",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11580",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11580" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11582",
		                  "BrowseName": "OutputArguments",
		                  "ParentNodeId": "i=11580",
		                  "DataType": "i=296",
		                  "DisplayName": "OutputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11580" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11583",
		                "BrowseName": "Close",
		                "ParentNodeId": "i=11575",
		                "DisplayName": "Close",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11584" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11575" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11584",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11583",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11583" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11585",
		                "BrowseName": "Read",
		                "ParentNodeId": "i=11575",
		                "DisplayName": "Read",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11586" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11587" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11575" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11586",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11585",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11585" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11587",
		                  "BrowseName": "OutputArguments",
		                  "ParentNodeId": "i=11585",
		                  "DataType": "i=296",
		                  "DisplayName": "OutputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11585" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11588",
		                "BrowseName": "Write",
		                "ParentNodeId": "i=11575",
		                "DisplayName": "Write",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11589" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11575" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11589",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11588",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11588" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11590",
		                "BrowseName": "GetPosition",
		                "ParentNodeId": "i=11575",
		                "DisplayName": "GetPosition",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11591" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11592" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11575" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11591",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11590",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11590" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11592",
		                  "BrowseName": "OutputArguments",
		                  "ParentNodeId": "i=11590",
		                  "DataType": "i=296",
		                  "DisplayName": "OutputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11590" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11593",
		                "BrowseName": "SetPosition",
		                "ParentNodeId": "i=11575",
		                "DisplayName": "SetPosition",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11594" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11575" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11594",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11593",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11593" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=11595",
                        "BrowseName": "AddressSpaceFileType",
                        "DisplayName": "AddressSpaceFileType",
                        "Description": "A file used to store a namespace exported from the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11615" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=11575" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11615",
		                "BrowseName": "ExportNamespace",
		                "ParentNodeId": "i=11595",
		                "DisplayName": "ExportNamespace",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11595" } ]
		} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=11616",
                        "BrowseName": "NamespaceMetadataType",
                        "DisplayName": "NamespaceMetadataType",
                        "Description": "Provides the metadata for a namespace used by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11617" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11618" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11619" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11620" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11621" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11622" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11623" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11624" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11617",
		                  "BrowseName": "NamespaceUri",
		                  "ParentNodeId": "i=11616",
		                  "DataType": "String",
		                  "DisplayName": "NamespaceUri",
		                  "Description": "The URI of the namespace.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11616" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11618",
		                  "BrowseName": "NamespaceVersion",
		                  "ParentNodeId": "i=11616",
		                  "DataType": "String",
		                  "DisplayName": "NamespaceVersion",
		                  "Description": "The human readable string representing version of the namespace.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11616" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11619",
		                  "BrowseName": "NamespacePublicationDate",
		                  "ParentNodeId": "i=11616",
		                  "DataType": "DateTime",
		                  "DisplayName": "NamespacePublicationDate",
		                  "Description": "The publication date for the namespace.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11616" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11620",
		                  "BrowseName": "IsNamespaceSubset",
		                  "ParentNodeId": "i=11616",
		                  "DataType": "Boolean",
		                  "DisplayName": "IsNamespaceSubset",
		                  "Description": "If TRUE then the server only supports a subset of the namespace.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11616" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11621",
		                  "BrowseName": "StaticNodeIdIdentifierTypes",
		                  "ParentNodeId": "i=11616",
		                  "DataType": "i=256",
		                  "DisplayName": "StaticNodeIdIdentifierTypes",
		                  "Description": "A list of IdTypes for nodes which are the same in every server that exposes them.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11616" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11622",
		                  "BrowseName": "StaticNumericNodeIdRange",
		                  "ParentNodeId": "i=11616",
		                  "DataType": "i=291",
		                  "DisplayName": "StaticNumericNodeIdRange",
		                  "Description": "A list of ranges for numeric node ids which are the same in every server that exposes them.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11616" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11623",
		                  "BrowseName": "StaticStringNodeIdPattern",
		                  "ParentNodeId": "i=11616",
		                  "DataType": "String",
		                  "DisplayName": "StaticStringNodeIdPattern",
		                  "Description": "A regular expression which matches string node ids are the same in every server that exposes them.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11616" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "NamespaceFile", 
                    "NodeId": "i=11624", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11625" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11626" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11627" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11628" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11629" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11632" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11634" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11637" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11639" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11642" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=11595" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11616" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11625",
		                  "BrowseName": "Size",
		                  "ParentNodeId": "i=11624",
		                  "DataType": "UInt64",
		                  "DisplayName": "Size",
		                  "Description": "The size of the file in bytes.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11624" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11626",
		                  "BrowseName": "Writeable",
		                  "ParentNodeId": "i=11624",
		                  "DataType": "Boolean",
		                  "DisplayName": "Writeable",
		                  "Description": "Whether the file is writeable.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11624" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11627",
		                  "BrowseName": "UserWriteable",
		                  "ParentNodeId": "i=11624",
		                  "DataType": "Boolean",
		                  "DisplayName": "UserWriteable",
		                  "Description": "Whether the file is writeable by the current user.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11624" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11628",
		                  "BrowseName": "OpenCount",
		                  "ParentNodeId": "i=11624",
		                  "DataType": "UInt16",
		                  "DisplayName": "OpenCount",
		                  "Description": "The current number of open file handles.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11624" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11629",
		                "BrowseName": "Open",
		                "ParentNodeId": "i=11624",
		                "DisplayName": "Open",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11630" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11631" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11624" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11630",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11629",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11629" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11631",
		                  "BrowseName": "OutputArguments",
		                  "ParentNodeId": "i=11629",
		                  "DataType": "i=296",
		                  "DisplayName": "OutputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11629" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11632",
		                "BrowseName": "Close",
		                "ParentNodeId": "i=11624",
		                "DisplayName": "Close",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11633" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11624" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11633",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11632",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11632" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11634",
		                "BrowseName": "Read",
		                "ParentNodeId": "i=11624",
		                "DisplayName": "Read",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11635" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11636" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11624" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11635",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11634",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11634" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11636",
		                  "BrowseName": "OutputArguments",
		                  "ParentNodeId": "i=11634",
		                  "DataType": "i=296",
		                  "DisplayName": "OutputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11634" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11637",
		                "BrowseName": "Write",
		                "ParentNodeId": "i=11624",
		                "DisplayName": "Write",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11638" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11624" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11638",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11637",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11637" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11639",
		                "BrowseName": "GetPosition",
		                "ParentNodeId": "i=11624",
		                "DisplayName": "GetPosition",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11640" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11641" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11624" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11640",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11639",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11639" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11641",
		                  "BrowseName": "OutputArguments",
		                  "ParentNodeId": "i=11639",
		                  "DataType": "i=296",
		                  "DisplayName": "OutputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11639" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11642",
		                "BrowseName": "SetPosition",
		                "ParentNodeId": "i=11624",
		                "DisplayName": "SetPosition",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11643" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11624" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11643",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11642",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11642" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=11645",
                        "BrowseName": "NamespacesType",
                        "DisplayName": "NamespacesType",
                        "Description": "A container for the namespace metadata provided by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11646" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11675" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "<NamespaceIdentifier>", 
                    "NodeId": "i=11646", 
                    "SymbolicName": "NamespaceIdentifier",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11647" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11648" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11649" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11650" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11651" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11652" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11653" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=11616" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=11508" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11645" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11647",
		                  "BrowseName": "NamespaceUri",
		                  "ParentNodeId": "i=11646",
		                  "DataType": "String",
		                  "DisplayName": "NamespaceUri",
		                  "Description": "The URI of the namespace.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11646" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11648",
		                  "BrowseName": "NamespaceVersion",
		                  "ParentNodeId": "i=11646",
		                  "DataType": "String",
		                  "DisplayName": "NamespaceVersion",
		                  "Description": "The human readable string representing version of the namespace.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11646" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11649",
		                  "BrowseName": "NamespacePublicationDate",
		                  "ParentNodeId": "i=11646",
		                  "DataType": "DateTime",
		                  "DisplayName": "NamespacePublicationDate",
		                  "Description": "The publication date for the namespace.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11646" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11650",
		                  "BrowseName": "IsNamespaceSubset",
		                  "ParentNodeId": "i=11646",
		                  "DataType": "Boolean",
		                  "DisplayName": "IsNamespaceSubset",
		                  "Description": "If TRUE then the server only supports a subset of the namespace.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11646" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11651",
		                  "BrowseName": "StaticNodeIdIdentifierTypes",
		                  "ParentNodeId": "i=11646",
		                  "DataType": "i=256",
		                  "DisplayName": "StaticNodeIdIdentifierTypes",
		                  "Description": "A list of IdTypes for nodes which are the same in every server that exposes them.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11646" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11652",
		                  "BrowseName": "StaticNumericNodeIdRange",
		                  "ParentNodeId": "i=11646",
		                  "DataType": "i=291",
		                  "DisplayName": "StaticNumericNodeIdRange",
		                  "Description": "A list of ranges for numeric node ids which are the same in every server that exposes them.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11646" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11653",
		                  "BrowseName": "StaticStringNodeIdPattern",
		                  "ParentNodeId": "i=11646",
		                  "DataType": "String",
		                  "DisplayName": "StaticStringNodeIdPattern",
		                  "Description": "A regular expression which matches string node ids are the same in every server that exposes them.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11646" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "AddressSpaceFile", 
                    "NodeId": "i=11675", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11676" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11677" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11678" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11679" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11680" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11683" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11685" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11688" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11690" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11693" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=11595" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11645" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11676",
		                  "BrowseName": "Size",
		                  "ParentNodeId": "i=11675",
		                  "DataType": "UInt64",
		                  "DisplayName": "Size",
		                  "Description": "The size of the file in bytes.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11675" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11677",
		                  "BrowseName": "Writeable",
		                  "ParentNodeId": "i=11675",
		                  "DataType": "Boolean",
		                  "DisplayName": "Writeable",
		                  "Description": "Whether the file is writeable.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11675" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11678",
		                  "BrowseName": "UserWriteable",
		                  "ParentNodeId": "i=11675",
		                  "DataType": "Boolean",
		                  "DisplayName": "UserWriteable",
		                  "Description": "Whether the file is writeable by the current user.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11675" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11679",
		                  "BrowseName": "OpenCount",
		                  "ParentNodeId": "i=11675",
		                  "DataType": "UInt16",
		                  "DisplayName": "OpenCount",
		                  "Description": "The current number of open file handles.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11675" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11680",
		                "BrowseName": "Open",
		                "ParentNodeId": "i=11675",
		                "DisplayName": "Open",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11681" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11682" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11675" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11681",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11680",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11680" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11682",
		                  "BrowseName": "OutputArguments",
		                  "ParentNodeId": "i=11680",
		                  "DataType": "i=296",
		                  "DisplayName": "OutputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11680" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11683",
		                "BrowseName": "Close",
		                "ParentNodeId": "i=11675",
		                "DisplayName": "Close",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11684" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11675" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11684",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11683",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11683" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11685",
		                "BrowseName": "Read",
		                "ParentNodeId": "i=11675",
		                "DisplayName": "Read",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11686" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11687" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11675" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11686",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11685",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11685" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11687",
		                  "BrowseName": "OutputArguments",
		                  "ParentNodeId": "i=11685",
		                  "DataType": "i=296",
		                  "DisplayName": "OutputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11685" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11688",
		                "BrowseName": "Write",
		                "ParentNodeId": "i=11675",
		                "DisplayName": "Write",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11689" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11675" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11689",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11688",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11688" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11690",
		                "BrowseName": "GetPosition",
		                "ParentNodeId": "i=11675",
		                "DisplayName": "GetPosition",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11691" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11692" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11675" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11691",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11690",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11690" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11692",
		                  "BrowseName": "OutputArguments",
		                  "ParentNodeId": "i=11690",
		                  "DataType": "i=296",
		                  "DisplayName": "OutputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11690" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11693",
		                "BrowseName": "SetPosition",
		                "ParentNodeId": "i=11675",
		                "DisplayName": "SetPosition",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11694" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11675" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11694",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11693",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11693" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2041",
                        "BrowseName": "BaseEventType",
                        "DisplayName": "BaseEventType",
                        "Description": "The base type for all events.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2042" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2043" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2044" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2045" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2046" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2047" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3190" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2050" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2051" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2042",
		                  "BrowseName": "EventId",
		                  "ParentNodeId": "i=2041",
		                  "DataType": "ByteString",
		                  "DisplayName": "EventId",
		                  "Description": "A globally unique identifier for the event.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2041" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2043",
		                  "BrowseName": "EventType",
		                  "ParentNodeId": "i=2041",
		                  "DataType": "NodeId",
		                  "DisplayName": "EventType",
		                  "Description": "The identifier for the event type.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2041" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2044",
		                  "BrowseName": "SourceNode",
		                  "ParentNodeId": "i=2041",
		                  "DataType": "NodeId",
		                  "DisplayName": "SourceNode",
		                  "Description": "The source of the event.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2041" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2045",
		                  "BrowseName": "SourceName",
		                  "ParentNodeId": "i=2041",
		                  "DataType": "String",
		                  "DisplayName": "SourceName",
		                  "Description": "A description of the source of the event.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2041" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2046",
		                  "BrowseName": "Time",
		                  "ParentNodeId": "i=2041",
		                  "DataType": "i=294",
		                  "DisplayName": "Time",
		                  "Description": "When the event occurred.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2041" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2047",
		                  "BrowseName": "ReceiveTime",
		                  "ParentNodeId": "i=2041",
		                  "DataType": "i=294",
		                  "DisplayName": "ReceiveTime",
		                  "Description": "When the server received the event from the underlying system.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2041" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3190",
		                  "BrowseName": "LocalTime",
		                  "ParentNodeId": "i=2041",
		                  "DataType": "i=8912",
		                  "DisplayName": "LocalTime",
		                  "Description": "Information about the local time where the event originated.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2041" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2050",
		                  "BrowseName": "Message",
		                  "ParentNodeId": "i=2041",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "Message",
		                  "Description": "A localized description of the event.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2041" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2051",
		                  "BrowseName": "Severity",
		                  "ParentNodeId": "i=2041",
		                  "DataType": "UInt16",
		                  "DisplayName": "Severity",
		                  "Description": "Indicates how urgent an event is.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2041" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2052",
                        "BrowseName": "AuditEventType",
                        "DisplayName": "AuditEventType",
                        "Description": "A base type for events used to track client initiated changes to the server state.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2053" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2054" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2055" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2056" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2057" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2041" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2053",
		                  "BrowseName": "ActionTimeStamp",
		                  "ParentNodeId": "i=2052",
		                  "DataType": "i=294",
		                  "DisplayName": "ActionTimeStamp",
		                  "Description": "When the action triggering the event occurred.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2052" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2054",
		                  "BrowseName": "Status",
		                  "ParentNodeId": "i=2052",
		                  "DataType": "Boolean",
		                  "DisplayName": "Status",
		                  "Description": "If TRUE the action was performed. If FALSE the action failed and the server state did not change.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2052" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2055",
		                  "BrowseName": "ServerId",
		                  "ParentNodeId": "i=2052",
		                  "DataType": "String",
		                  "DisplayName": "ServerId",
		                  "Description": "The unique identifier for the server generating the event.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2052" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2056",
		                  "BrowseName": "ClientAuditEntryId",
		                  "ParentNodeId": "i=2052",
		                  "DataType": "String",
		                  "DisplayName": "ClientAuditEntryId",
		                  "Description": "The log entry id provided in the request that initiated the action.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2052" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2057",
		                  "BrowseName": "ClientUserId",
		                  "ParentNodeId": "i=2052",
		                  "DataType": "String",
		                  "DisplayName": "ClientUserId",
		                  "Description": "The user identity associated with the session that initiated the action.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2052" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2058",
                        "BrowseName": "AuditSecurityEventType",
                        "DisplayName": "AuditSecurityEventType",
                        "Description": "A base type for events used to track security related changes.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2052" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2059",
                        "BrowseName": "AuditChannelEventType",
                        "DisplayName": "AuditChannelEventType",
                        "Description": "A base type for events used to track related changes to a secure channel.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2745" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2058" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2745",
		                  "BrowseName": "SecureChannelId",
		                  "ParentNodeId": "i=2059",
		                  "DataType": "String",
		                  "DisplayName": "SecureChannelId",
		                  "Description": "The identifier for the secure channel that was changed.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2059" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2060",
                        "BrowseName": "AuditOpenSecureChannelEventType",
                        "DisplayName": "AuditOpenSecureChannelEventType",
                        "Description": "An event that is raised when a secure channel is opened.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2061" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2746" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2062" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2063" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2065" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2066" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2059" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2061",
		                  "BrowseName": "ClientCertificate",
		                  "ParentNodeId": "i=2060",
		                  "DataType": "ByteString",
		                  "DisplayName": "ClientCertificate",
		                  "Description": "The certificate provided by the client.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2060" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2746",
		                  "BrowseName": "ClientCertificateThumbprint",
		                  "ParentNodeId": "i=2060",
		                  "DataType": "String",
		                  "DisplayName": "ClientCertificateThumbprint",
		                  "Description": "The thumbprint for certificate provided by the client.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2060" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2062",
		                  "BrowseName": "RequestType",
		                  "ParentNodeId": "i=2060",
		                  "DataType": "i=315",
		                  "DisplayName": "RequestType",
		                  "Description": "The type of request (NEW or RENEW).",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2060" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2063",
		                  "BrowseName": "SecurityPolicyUri",
		                  "ParentNodeId": "i=2060",
		                  "DataType": "String",
		                  "DisplayName": "SecurityPolicyUri",
		                  "Description": "The security policy used by the channel.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2060" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2065",
		                  "BrowseName": "SecurityMode",
		                  "ParentNodeId": "i=2060",
		                  "DataType": "i=302",
		                  "DisplayName": "SecurityMode",
		                  "Description": "The security mode used by the channel.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2060" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2066",
		                  "BrowseName": "RequestedLifetime",
		                  "ParentNodeId": "i=2060",
		                  "DataType": "i=290",
		                  "DisplayName": "RequestedLifetime",
		                  "Description": "The lifetime of the channel requested by the client.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2060" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2069",
                        "BrowseName": "AuditSessionEventType",
                        "DisplayName": "AuditSessionEventType",
                        "Description": "A base type for events used to track related changes to a session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2070" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2052" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2070",
		                  "BrowseName": "SessionId",
		                  "ParentNodeId": "i=2069",
		                  "DataType": "NodeId",
		                  "DisplayName": "SessionId",
		                  "Description": "The unique identifier for the session,.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2069" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2071",
                        "BrowseName": "AuditCreateSessionEventType",
                        "DisplayName": "AuditCreateSessionEventType",
                        "Description": "An event that is raised when a session is created.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2072" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2073" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2747" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2074" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2069" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2072",
		                  "BrowseName": "SecureChannelId",
		                  "ParentNodeId": "i=2071",
		                  "DataType": "String",
		                  "DisplayName": "SecureChannelId",
		                  "Description": "The secure channel associated with the session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2071" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2073",
		                  "BrowseName": "ClientCertificate",
		                  "ParentNodeId": "i=2071",
		                  "DataType": "ByteString",
		                  "DisplayName": "ClientCertificate",
		                  "Description": "The certificate provided by the client.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2071" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2747",
		                  "BrowseName": "ClientCertificateThumbprint",
		                  "ParentNodeId": "i=2071",
		                  "DataType": "String",
		                  "DisplayName": "ClientCertificateThumbprint",
		                  "Description": "The thumbprint of the certificate provided by the client.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2071" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2074",
		                  "BrowseName": "RevisedSessionTimeout",
		                  "ParentNodeId": "i=2071",
		                  "DataType": "i=290",
		                  "DisplayName": "RevisedSessionTimeout",
		                  "Description": "The timeout for the session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2071" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2748",
                        "BrowseName": "AuditUrlMismatchEventType",
                        "DisplayName": "AuditUrlMismatchEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2749" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2071" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2749",
		                  "BrowseName": "EndpointUrl",
		                  "ParentNodeId": "i=2748",
		                  "DataType": "String",
		                  "DisplayName": "EndpointUrl",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2748" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2075",
                        "BrowseName": "AuditActivateSessionEventType",
                        "DisplayName": "AuditActivateSessionEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2076" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2077" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11485" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2069" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2076",
		                  "BrowseName": "ClientSoftwareCertificates",
		                  "ParentNodeId": "i=2075",
		                  "DataType": "i=344",
		                  "DisplayName": "ClientSoftwareCertificates",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2075" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2077",
		                  "BrowseName": "UserIdentityToken",
		                  "ParentNodeId": "i=2075",
		                  "DataType": "i=316",
		                  "DisplayName": "UserIdentityToken",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2075" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11485",
		                  "BrowseName": "SecureChannelId",
		                  "ParentNodeId": "i=2075",
		                  "DataType": "String",
		                  "DisplayName": "SecureChannelId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2075" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2078",
                        "BrowseName": "AuditCancelEventType",
                        "DisplayName": "AuditCancelEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2079" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2069" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2079",
		                  "BrowseName": "RequestHandle",
		                  "ParentNodeId": "i=2078",
		                  "DataType": "UInt32",
		                  "DisplayName": "RequestHandle",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2078" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2080",
                        "BrowseName": "AuditCertificateEventType",
                        "DisplayName": "AuditCertificateEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2081" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2058" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2081",
		                  "BrowseName": "Certificate",
		                  "ParentNodeId": "i=2080",
		                  "DataType": "ByteString",
		                  "DisplayName": "Certificate",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2080" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2082",
                        "BrowseName": "AuditCertificateDataMismatchEventType",
                        "DisplayName": "AuditCertificateDataMismatchEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2083" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2084" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2080" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2083",
		                  "BrowseName": "InvalidHostname",
		                  "ParentNodeId": "i=2082",
		                  "DataType": "String",
		                  "DisplayName": "InvalidHostname",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2082" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2084",
		                  "BrowseName": "InvalidUri",
		                  "ParentNodeId": "i=2082",
		                  "DataType": "String",
		                  "DisplayName": "InvalidUri",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2082" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2085",
                        "BrowseName": "AuditCertificateExpiredEventType",
                        "DisplayName": "AuditCertificateExpiredEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2080" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2086",
                        "BrowseName": "AuditCertificateInvalidEventType",
                        "DisplayName": "AuditCertificateInvalidEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2080" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2087",
                        "BrowseName": "AuditCertificateUntrustedEventType",
                        "DisplayName": "AuditCertificateUntrustedEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2080" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2088",
                        "BrowseName": "AuditCertificateRevokedEventType",
                        "DisplayName": "AuditCertificateRevokedEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2080" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2089",
                        "BrowseName": "AuditCertificateMismatchEventType",
                        "DisplayName": "AuditCertificateMismatchEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2080" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2090",
                        "BrowseName": "AuditNodeManagementEventType",
                        "DisplayName": "AuditNodeManagementEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2052" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2091",
                        "BrowseName": "AuditAddNodesEventType",
                        "DisplayName": "AuditAddNodesEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2092" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2090" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2092",
		                  "BrowseName": "NodesToAdd",
		                  "ParentNodeId": "i=2091",
		                  "DataType": "i=376",
		                  "DisplayName": "NodesToAdd",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2091" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2093",
                        "BrowseName": "AuditDeleteNodesEventType",
                        "DisplayName": "AuditDeleteNodesEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2094" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2090" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2094",
		                  "BrowseName": "NodesToDelete",
		                  "ParentNodeId": "i=2093",
		                  "DataType": "i=382",
		                  "DisplayName": "NodesToDelete",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2093" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2095",
                        "BrowseName": "AuditAddReferencesEventType",
                        "DisplayName": "AuditAddReferencesEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2096" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2090" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2096",
		                  "BrowseName": "ReferencesToAdd",
		                  "ParentNodeId": "i=2095",
		                  "DataType": "i=379",
		                  "DisplayName": "ReferencesToAdd",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2095" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2097",
                        "BrowseName": "AuditDeleteReferencesEventType",
                        "DisplayName": "AuditDeleteReferencesEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2098" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2090" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2098",
		                  "BrowseName": "ReferencesToDelete",
		                  "ParentNodeId": "i=2097",
		                  "DataType": "i=385",
		                  "DisplayName": "ReferencesToDelete",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2097" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2099",
                        "BrowseName": "AuditUpdateEventType",
                        "DisplayName": "AuditUpdateEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2052" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2100",
                        "BrowseName": "AuditWriteUpdateEventType",
                        "DisplayName": "AuditWriteUpdateEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2750" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2101" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2102" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2103" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2099" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2750",
		                  "BrowseName": "AttributeId",
		                  "ParentNodeId": "i=2100",
		                  "DataType": "UInt32",
		                  "DisplayName": "AttributeId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2100" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2101",
		                  "BrowseName": "IndexRange",
		                  "ParentNodeId": "i=2100",
		                  "DataType": "i=291",
		                  "DisplayName": "IndexRange",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2100" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2102",
		                  "BrowseName": "OldValue",
		                  "ParentNodeId": "i=2100",
		                  "DataType": "",
		                  "DisplayName": "OldValue",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2100" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2103",
		                  "BrowseName": "NewValue",
		                  "ParentNodeId": "i=2100",
		                  "DataType": "",
		                  "DisplayName": "NewValue",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2100" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2104",
                        "BrowseName": "AuditHistoryUpdateEventType",
                        "DisplayName": "AuditHistoryUpdateEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2751" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2099" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2751",
		                  "BrowseName": "ParameterDataTypeId",
		                  "ParentNodeId": "i=2104",
		                  "DataType": "NodeId",
		                  "DisplayName": "ParameterDataTypeId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2104" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2127",
                        "BrowseName": "AuditUpdateMethodEventType",
                        "DisplayName": "AuditUpdateMethodEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2128" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2129" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2052" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2128",
		                  "BrowseName": "MethodId",
		                  "ParentNodeId": "i=2127",
		                  "DataType": "NodeId",
		                  "DisplayName": "MethodId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2127" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2129",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=2127",
		                  "DataType": "",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2127" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2130",
                        "BrowseName": "SystemEventType",
                        "DisplayName": "SystemEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2041" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2131",
                        "BrowseName": "DeviceFailureEventType",
                        "DisplayName": "DeviceFailureEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2130" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=11446",
                        "BrowseName": "SystemStatusChangeEventType",
                        "DisplayName": "SystemStatusChangeEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11696" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2130" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11696",
		                  "BrowseName": "SystemState",
		                  "ParentNodeId": "i=11446",
		                  "DataType": "i=852",
		                  "DisplayName": "SystemState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11446" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2132",
                        "BrowseName": "BaseModelChangeEventType",
                        "DisplayName": "BaseModelChangeEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2041" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2133",
                        "BrowseName": "GeneralModelChangeEventType",
                        "DisplayName": "GeneralModelChangeEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2134" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2132" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2134",
		                  "BrowseName": "Changes",
		                  "ParentNodeId": "i=2133",
		                  "DataType": "i=877",
		                  "DisplayName": "Changes",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2133" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2738",
                        "BrowseName": "SemanticChangeEventType",
                        "DisplayName": "SemanticChangeEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2739" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2132" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2739",
		                  "BrowseName": "Changes",
		                  "ParentNodeId": "i=2738",
		                  "DataType": "i=897",
		                  "DisplayName": "Changes",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2738" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=3035",
                        "BrowseName": "EventQueueOverflowEventType",
                        "DisplayName": "EventQueueOverflowEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2041" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=11436",
                        "BrowseName": "ProgressEventType",
                        "DisplayName": "ProgressEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2041" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2340",
                        "BrowseName": "AggregateFunctionType",
                        "DisplayName": "AggregateFunctionType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2137",
                          "BrowseName": "ServerVendorCapabilityType",
                          "ValueRank": "",
                          "DisplayName": "ServerVendorCapabilityType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2138",
                          "BrowseName": "ServerStatusType",
                          "ValueRank": "",
                          "DisplayName": "ServerStatusType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2139" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2140" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2141" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2142" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2752" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2753" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2139",
		                  "BrowseName": "StartTime",
		                  "ParentNodeId": "i=2138",
		                  "DataType": "i=294",
		                  "DisplayName": "StartTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2138" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2140",
		                  "BrowseName": "CurrentTime",
		                  "ParentNodeId": "i=2138",
		                  "DataType": "i=294",
		                  "DisplayName": "CurrentTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2138" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2141",
		                  "BrowseName": "State",
		                  "ParentNodeId": "i=2138",
		                  "DataType": "i=852",
		                  "DisplayName": "State",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2138" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2142",
		                  "BrowseName": "BuildInfo",
		                  "ParentNodeId": "i=2138",
		                  "DataType": "i=338",
		                  "DisplayName": "BuildInfo",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3698" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3699" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3700" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3701" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3702" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3703" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=3051" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2138" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3698",
		                  "BrowseName": "ProductUri",
		                  "ParentNodeId": "i=2142",
		                  "DataType": "String",
		                  "DisplayName": "ProductUri",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2142" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3699",
		                  "BrowseName": "ManufacturerName",
		                  "ParentNodeId": "i=2142",
		                  "DataType": "String",
		                  "DisplayName": "ManufacturerName",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2142" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3700",
		                  "BrowseName": "ProductName",
		                  "ParentNodeId": "i=2142",
		                  "DataType": "String",
		                  "DisplayName": "ProductName",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2142" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3701",
		                  "BrowseName": "SoftwareVersion",
		                  "ParentNodeId": "i=2142",
		                  "DataType": "String",
		                  "DisplayName": "SoftwareVersion",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2142" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3702",
		                  "BrowseName": "BuildNumber",
		                  "ParentNodeId": "i=2142",
		                  "DataType": "String",
		                  "DisplayName": "BuildNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2142" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3703",
		                  "BrowseName": "BuildDate",
		                  "ParentNodeId": "i=2142",
		                  "DataType": "i=294",
		                  "DisplayName": "BuildDate",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2142" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2752",
		                  "BrowseName": "SecondsTillShutdown",
		                  "ParentNodeId": "i=2138",
		                  "DataType": "UInt32",
		                  "DisplayName": "SecondsTillShutdown",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2138" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2753",
		                  "BrowseName": "ShutdownReason",
		                  "ParentNodeId": "i=2138",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "ShutdownReason",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2138" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=3051",
                          "BrowseName": "BuildInfoType",
                          "ValueRank": "",
                          "DisplayName": "BuildInfoType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3052" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3053" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3054" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3055" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3056" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3057" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3052",
		                  "BrowseName": "ProductUri",
		                  "ParentNodeId": "i=3051",
		                  "DataType": "String",
		                  "DisplayName": "ProductUri",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3051" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3053",
		                  "BrowseName": "ManufacturerName",
		                  "ParentNodeId": "i=3051",
		                  "DataType": "String",
		                  "DisplayName": "ManufacturerName",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3051" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3054",
		                  "BrowseName": "ProductName",
		                  "ParentNodeId": "i=3051",
		                  "DataType": "String",
		                  "DisplayName": "ProductName",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3051" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3055",
		                  "BrowseName": "SoftwareVersion",
		                  "ParentNodeId": "i=3051",
		                  "DataType": "String",
		                  "DisplayName": "SoftwareVersion",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3051" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3056",
		                  "BrowseName": "BuildNumber",
		                  "ParentNodeId": "i=3051",
		                  "DataType": "String",
		                  "DisplayName": "BuildNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3051" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3057",
		                  "BrowseName": "BuildDate",
		                  "ParentNodeId": "i=3051",
		                  "DataType": "i=294",
		                  "DisplayName": "BuildDate",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3051" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2150",
                          "BrowseName": "ServerDiagnosticsSummaryType",
                          "ValueRank": "",
                          "DisplayName": "ServerDiagnosticsSummaryType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2151" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2152" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2153" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2154" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2155" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2156" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2157" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2159" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2160" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2161" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2162" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2163" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2151",
		                  "BrowseName": "ServerViewCount",
		                  "ParentNodeId": "i=2150",
		                  "DataType": "UInt32",
		                  "DisplayName": "ServerViewCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2150" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2152",
		                  "BrowseName": "CurrentSessionCount",
		                  "ParentNodeId": "i=2150",
		                  "DataType": "UInt32",
		                  "DisplayName": "CurrentSessionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2150" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2153",
		                  "BrowseName": "CumulatedSessionCount",
		                  "ParentNodeId": "i=2150",
		                  "DataType": "UInt32",
		                  "DisplayName": "CumulatedSessionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2150" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2154",
		                  "BrowseName": "SecurityRejectedSessionCount",
		                  "ParentNodeId": "i=2150",
		                  "DataType": "UInt32",
		                  "DisplayName": "SecurityRejectedSessionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2150" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2155",
		                  "BrowseName": "RejectedSessionCount",
		                  "ParentNodeId": "i=2150",
		                  "DataType": "UInt32",
		                  "DisplayName": "RejectedSessionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2150" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2156",
		                  "BrowseName": "SessionTimeoutCount",
		                  "ParentNodeId": "i=2150",
		                  "DataType": "UInt32",
		                  "DisplayName": "SessionTimeoutCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2150" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2157",
		                  "BrowseName": "SessionAbortCount",
		                  "ParentNodeId": "i=2150",
		                  "DataType": "UInt32",
		                  "DisplayName": "SessionAbortCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2150" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2159",
		                  "BrowseName": "PublishingIntervalCount",
		                  "ParentNodeId": "i=2150",
		                  "DataType": "UInt32",
		                  "DisplayName": "PublishingIntervalCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2150" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2160",
		                  "BrowseName": "CurrentSubscriptionCount",
		                  "ParentNodeId": "i=2150",
		                  "DataType": "UInt32",
		                  "DisplayName": "CurrentSubscriptionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2150" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2161",
		                  "BrowseName": "CumulatedSubscriptionCount",
		                  "ParentNodeId": "i=2150",
		                  "DataType": "UInt32",
		                  "DisplayName": "CumulatedSubscriptionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2150" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2162",
		                  "BrowseName": "SecurityRejectedRequestsCount",
		                  "ParentNodeId": "i=2150",
		                  "DataType": "UInt32",
		                  "DisplayName": "SecurityRejectedRequestsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2150" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2163",
		                  "BrowseName": "RejectedRequestsCount",
		                  "ParentNodeId": "i=2150",
		                  "DataType": "UInt32",
		                  "DisplayName": "RejectedRequestsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2150" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2164",
                          "BrowseName": "SamplingIntervalDiagnosticsArrayType",
                          "ValueRank": "1",
                          "DisplayName": "SamplingIntervalDiagnosticsArrayType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2165",
                          "BrowseName": "SamplingIntervalDiagnosticsType",
                          "ValueRank": "",
                          "DisplayName": "SamplingIntervalDiagnosticsType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2166" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11697" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11698" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11699" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2166",
		                  "BrowseName": "SamplingInterval",
		                  "ParentNodeId": "i=2165",
		                  "DataType": "i=290",
		                  "DisplayName": "SamplingInterval",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2165" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11697",
		                  "BrowseName": "SampledMonitoredItemsCount",
		                  "ParentNodeId": "i=2165",
		                  "DataType": "UInt32",
		                  "DisplayName": "SampledMonitoredItemsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2165" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11698",
		                  "BrowseName": "MaxSampledMonitoredItemsCount",
		                  "ParentNodeId": "i=2165",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxSampledMonitoredItemsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2165" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11699",
		                  "BrowseName": "DisabledMonitoredItemsSamplingCount",
		                  "ParentNodeId": "i=2165",
		                  "DataType": "UInt32",
		                  "DisplayName": "DisabledMonitoredItemsSamplingCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2165" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2171",
                          "BrowseName": "SubscriptionDiagnosticsArrayType",
                          "ValueRank": "1",
                          "DisplayName": "SubscriptionDiagnosticsArrayType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2172",
                          "BrowseName": "SubscriptionDiagnosticsType",
                          "ValueRank": "",
                          "DisplayName": "SubscriptionDiagnosticsType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2173" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2174" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2175" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2176" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2177" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8888" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2179" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2180" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2181" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2182" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2183" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2184" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2185" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2186" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2187" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2188" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2189" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2190" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2191" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2998" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2193" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8889" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8890" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8891" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8892" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8893" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8894" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8895" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8896" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8897" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8902" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2173",
		                  "BrowseName": "SessionId",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "NodeId",
		                  "DisplayName": "SessionId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2174",
		                  "BrowseName": "SubscriptionId",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "SubscriptionId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2175",
		                  "BrowseName": "Priority",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "Byte",
		                  "DisplayName": "Priority",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2176",
		                  "BrowseName": "PublishingInterval",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "Double",
		                  "DisplayName": "PublishingInterval",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2177",
		                  "BrowseName": "MaxKeepAliveCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxKeepAliveCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8888",
		                  "BrowseName": "MaxLifetimeCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxLifetimeCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2179",
		                  "BrowseName": "MaxNotificationsPerPublish",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNotificationsPerPublish",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2180",
		                  "BrowseName": "PublishingEnabled",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "Boolean",
		                  "DisplayName": "PublishingEnabled",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2181",
		                  "BrowseName": "ModifyCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "ModifyCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2182",
		                  "BrowseName": "EnableCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "EnableCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2183",
		                  "BrowseName": "DisableCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "DisableCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2184",
		                  "BrowseName": "RepublishRequestCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "RepublishRequestCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2185",
		                  "BrowseName": "RepublishMessageRequestCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "RepublishMessageRequestCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2186",
		                  "BrowseName": "RepublishMessageCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "RepublishMessageCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2187",
		                  "BrowseName": "TransferRequestCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransferRequestCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2188",
		                  "BrowseName": "TransferredToAltClientCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransferredToAltClientCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2189",
		                  "BrowseName": "TransferredToSameClientCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransferredToSameClientCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2190",
		                  "BrowseName": "PublishRequestCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "PublishRequestCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2191",
		                  "BrowseName": "DataChangeNotificationsCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "DataChangeNotificationsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2998",
		                  "BrowseName": "EventNotificationsCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "EventNotificationsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2193",
		                  "BrowseName": "NotificationsCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "NotificationsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8889",
		                  "BrowseName": "LatePublishRequestCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "LatePublishRequestCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8890",
		                  "BrowseName": "CurrentKeepAliveCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "CurrentKeepAliveCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8891",
		                  "BrowseName": "CurrentLifetimeCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "CurrentLifetimeCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8892",
		                  "BrowseName": "UnacknowledgedMessageCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "UnacknowledgedMessageCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8893",
		                  "BrowseName": "DiscardedMessageCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "DiscardedMessageCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8894",
		                  "BrowseName": "MonitoredItemCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "MonitoredItemCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8895",
		                  "BrowseName": "DisabledMonitoredItemCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "DisabledMonitoredItemCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8896",
		                  "BrowseName": "MonitoringQueueOverflowCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "MonitoringQueueOverflowCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8897",
		                  "BrowseName": "NextSequenceNumber",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "NextSequenceNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8902",
		                  "BrowseName": "EventQueueOverFlowCount",
		                  "ParentNodeId": "i=2172",
		                  "DataType": "UInt32",
		                  "DisplayName": "EventQueueOverFlowCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2172" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2196",
                          "BrowseName": "SessionDiagnosticsArrayType",
                          "ValueRank": "1",
                          "DisplayName": "SessionDiagnosticsArrayType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2197",
                          "BrowseName": "SessionDiagnosticsVariableType",
                          "ValueRank": "",
                          "DisplayName": "SessionDiagnosticsVariableType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2198" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2199" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2200" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2201" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2202" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2203" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2204" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3050" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2205" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2206" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2207" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2208" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2209" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8900" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11892" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2217" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2218" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2219" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2220" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2221" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2222" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2223" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2224" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2225" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2226" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2227" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2228" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2229" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2230" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2231" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2232" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2233" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2234" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2235" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2236" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2237" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2238" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2239" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2240" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2241" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2242" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2730" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2731" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2198",
		                  "BrowseName": "SessionId",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "NodeId",
		                  "DisplayName": "SessionId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2199",
		                  "BrowseName": "SessionName",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "String",
		                  "DisplayName": "SessionName",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2200",
		                  "BrowseName": "ClientDescription",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=308",
		                  "DisplayName": "ClientDescription",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2201",
		                  "BrowseName": "ServerUri",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "String",
		                  "DisplayName": "ServerUri",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2202",
		                  "BrowseName": "EndpointUrl",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "String",
		                  "DisplayName": "EndpointUrl",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2203",
		                  "BrowseName": "LocaleIds",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=295",
		                  "DisplayName": "LocaleIds",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2204",
		                  "BrowseName": "ActualSessionTimeout",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=290",
		                  "DisplayName": "ActualSessionTimeout",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3050",
		                  "BrowseName": "MaxResponseMessageSize",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxResponseMessageSize",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2205",
		                  "BrowseName": "ClientConnectionTime",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=294",
		                  "DisplayName": "ClientConnectionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2206",
		                  "BrowseName": "ClientLastContactTime",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=294",
		                  "DisplayName": "ClientLastContactTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2207",
		                  "BrowseName": "CurrentSubscriptionsCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "UInt32",
		                  "DisplayName": "CurrentSubscriptionsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2208",
		                  "BrowseName": "CurrentMonitoredItemsCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "UInt32",
		                  "DisplayName": "CurrentMonitoredItemsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2209",
		                  "BrowseName": "CurrentPublishRequestsInQueue",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "UInt32",
		                  "DisplayName": "CurrentPublishRequestsInQueue",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8900",
		                  "BrowseName": "TotalRequestCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "TotalRequestCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11892",
		                  "BrowseName": "UnauthorizedRequestCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "UInt32",
		                  "DisplayName": "UnauthorizedRequestCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2217",
		                  "BrowseName": "ReadCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "ReadCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2218",
		                  "BrowseName": "HistoryReadCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "HistoryReadCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2219",
		                  "BrowseName": "WriteCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "WriteCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2220",
		                  "BrowseName": "HistoryUpdateCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "HistoryUpdateCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2221",
		                  "BrowseName": "CallCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "CallCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2222",
		                  "BrowseName": "CreateMonitoredItemsCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "CreateMonitoredItemsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2223",
		                  "BrowseName": "ModifyMonitoredItemsCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "ModifyMonitoredItemsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2224",
		                  "BrowseName": "SetMonitoringModeCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "SetMonitoringModeCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2225",
		                  "BrowseName": "SetTriggeringCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "SetTriggeringCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2226",
		                  "BrowseName": "DeleteMonitoredItemsCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "DeleteMonitoredItemsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2227",
		                  "BrowseName": "CreateSubscriptionCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "CreateSubscriptionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2228",
		                  "BrowseName": "ModifySubscriptionCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "ModifySubscriptionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2229",
		                  "BrowseName": "SetPublishingModeCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "SetPublishingModeCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2230",
		                  "BrowseName": "PublishCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "PublishCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2231",
		                  "BrowseName": "RepublishCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "RepublishCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2232",
		                  "BrowseName": "TransferSubscriptionsCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "TransferSubscriptionsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2233",
		                  "BrowseName": "DeleteSubscriptionsCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "DeleteSubscriptionsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2234",
		                  "BrowseName": "AddNodesCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "AddNodesCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2235",
		                  "BrowseName": "AddReferencesCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "AddReferencesCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2236",
		                  "BrowseName": "DeleteNodesCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "DeleteNodesCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2237",
		                  "BrowseName": "DeleteReferencesCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "DeleteReferencesCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2238",
		                  "BrowseName": "BrowseCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "BrowseCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2239",
		                  "BrowseName": "BrowseNextCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "BrowseNextCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2240",
		                  "BrowseName": "TranslateBrowsePathsToNodeIdsCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "TranslateBrowsePathsToNodeIdsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2241",
		                  "BrowseName": "QueryFirstCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "QueryFirstCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2242",
		                  "BrowseName": "QueryNextCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "QueryNextCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2730",
		                  "BrowseName": "RegisterNodesCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "RegisterNodesCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2731",
		                  "BrowseName": "UnregisterNodesCount",
		                  "ParentNodeId": "i=2197",
		                  "DataType": "i=871",
		                  "DisplayName": "UnregisterNodesCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2197" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2243",
                          "BrowseName": "SessionSecurityDiagnosticsArrayType",
                          "ValueRank": "1",
                          "DisplayName": "SessionSecurityDiagnosticsArrayType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2244",
                          "BrowseName": "SessionSecurityDiagnosticsType",
                          "ValueRank": "",
                          "DisplayName": "SessionSecurityDiagnosticsType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2245" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2246" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2247" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2248" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2249" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2250" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2251" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2252" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3058" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2245",
		                  "BrowseName": "SessionId",
		                  "ParentNodeId": "i=2244",
		                  "DataType": "NodeId",
		                  "DisplayName": "SessionId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2244" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2246",
		                  "BrowseName": "ClientUserIdOfSession",
		                  "ParentNodeId": "i=2244",
		                  "DataType": "String",
		                  "DisplayName": "ClientUserIdOfSession",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2244" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2247",
		                  "BrowseName": "ClientUserIdHistory",
		                  "ParentNodeId": "i=2244",
		                  "DataType": "String",
		                  "DisplayName": "ClientUserIdHistory",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2244" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2248",
		                  "BrowseName": "AuthenticationMechanism",
		                  "ParentNodeId": "i=2244",
		                  "DataType": "String",
		                  "DisplayName": "AuthenticationMechanism",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2244" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2249",
		                  "BrowseName": "Encoding",
		                  "ParentNodeId": "i=2244",
		                  "DataType": "String",
		                  "DisplayName": "Encoding",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2244" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2250",
		                  "BrowseName": "TransportProtocol",
		                  "ParentNodeId": "i=2244",
		                  "DataType": "String",
		                  "DisplayName": "TransportProtocol",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2244" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2251",
		                  "BrowseName": "SecurityMode",
		                  "ParentNodeId": "i=2244",
		                  "DataType": "i=302",
		                  "DisplayName": "SecurityMode",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2244" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2252",
		                  "BrowseName": "SecurityPolicyUri",
		                  "ParentNodeId": "i=2244",
		                  "DataType": "String",
		                  "DisplayName": "SecurityPolicyUri",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2244" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3058",
		                  "BrowseName": "ClientCertificate",
		                  "ParentNodeId": "i=2244",
		                  "DataType": "ByteString",
		                  "DisplayName": "ClientCertificate",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2244" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=11487",
                          "BrowseName": "OptionSetType",
                          "ValueRank": "",
                          "DisplayName": "OptionSetType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11488" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11701" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11488",
		                  "BrowseName": "OptionSetValues",
		                  "ParentNodeId": "i=11487",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "OptionSetValues",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11487" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11701",
		                  "BrowseName": "BitMask",
		                  "ParentNodeId": "i=11487",
		                  "DataType": "Boolean",
		                  "DisplayName": "BitMask",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11487" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "EventTypes", 
                    "NodeId": "i=3048", 
                    "SymbolicName": "EventTypesFolder",
			
                      "References": [ 
                          { "ReferenceTypeId": "Organizes", "NodeId": "i=86" },
                          { "ReferenceTypeId": "Organizes", "NodeId": "i=2041" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=61" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Server", 
                    "NodeId": "i=2253", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2254" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2255" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2256" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2267" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2994" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2268" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2274" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2295" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2296" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11715" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11492" },
                          { "ReferenceTypeId": "Organizes", "NodeId": "i=85" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2004" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2254",
		                  "BrowseName": "ServerArray",
		                  "ParentNodeId": "i=2253",
		                  "DataType": "String",
		                  "DisplayName": "ServerArray",
		                  "Description": "The list of server URIs used by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2253" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2255",
		                  "BrowseName": "NamespaceArray",
		                  "ParentNodeId": "i=2253",
		                  "DataType": "String",
		                  "DisplayName": "NamespaceArray",
		                  "Description": "The list of namespace URIs used by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2253" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2256",
		                  "BrowseName": "ServerStatus",
		                  "ParentNodeId": "i=2253",
		                  "DataType": "i=862",
		                  "DisplayName": "ServerStatus",
		                  "Description": "The current status of the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2257" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2258" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2259" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2260" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2992" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2993" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2138" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2253" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2257",
		                  "BrowseName": "StartTime",
		                  "ParentNodeId": "i=2256",
		                  "DataType": "i=294",
		                  "DisplayName": "StartTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2256" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2258",
		                  "BrowseName": "CurrentTime",
		                  "ParentNodeId": "i=2256",
		                  "DataType": "i=294",
		                  "DisplayName": "CurrentTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2256" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2259",
		                  "BrowseName": "State",
		                  "ParentNodeId": "i=2256",
		                  "DataType": "i=852",
		                  "DisplayName": "State",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2256" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2260",
		                  "BrowseName": "BuildInfo",
		                  "ParentNodeId": "i=2256",
		                  "DataType": "i=338",
		                  "DisplayName": "BuildInfo",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2262" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2263" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2261" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2264" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2265" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2266" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=3051" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2256" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2262",
		                  "BrowseName": "ProductUri",
		                  "ParentNodeId": "i=2260",
		                  "DataType": "String",
		                  "DisplayName": "ProductUri",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2260" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2263",
		                  "BrowseName": "ManufacturerName",
		                  "ParentNodeId": "i=2260",
		                  "DataType": "String",
		                  "DisplayName": "ManufacturerName",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2260" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2261",
		                  "BrowseName": "ProductName",
		                  "ParentNodeId": "i=2260",
		                  "DataType": "String",
		                  "DisplayName": "ProductName",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2260" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2264",
		                  "BrowseName": "SoftwareVersion",
		                  "ParentNodeId": "i=2260",
		                  "DataType": "String",
		                  "DisplayName": "SoftwareVersion",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2260" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2265",
		                  "BrowseName": "BuildNumber",
		                  "ParentNodeId": "i=2260",
		                  "DataType": "String",
		                  "DisplayName": "BuildNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2260" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2266",
		                  "BrowseName": "BuildDate",
		                  "ParentNodeId": "i=2260",
		                  "DataType": "i=294",
		                  "DisplayName": "BuildDate",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2260" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2992",
		                  "BrowseName": "SecondsTillShutdown",
		                  "ParentNodeId": "i=2256",
		                  "DataType": "UInt32",
		                  "DisplayName": "SecondsTillShutdown",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2256" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2993",
		                  "BrowseName": "ShutdownReason",
		                  "ParentNodeId": "i=2256",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "ShutdownReason",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2256" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2267",
		                  "BrowseName": "ServiceLevel",
		                  "ParentNodeId": "i=2253",
		                  "DataType": "Byte",
		                  "DisplayName": "ServiceLevel",
		                  "Description": "A value indicating the level of service the server can provide. 255 indicates the best.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2253" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2994",
		                  "BrowseName": "Auditing",
		                  "ParentNodeId": "i=2253",
		                  "DataType": "Boolean",
		                  "DisplayName": "Auditing",
		                  "Description": "A flag indicating whether the server is currently generating audit events.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2253" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "ServerCapabilities", 
                    "NodeId": "i=2268", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2269" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2271" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2272" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2735" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2736" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2737" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3704" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11702" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11703" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11704" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2996" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2997" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2013" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2253" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2269",
		                  "BrowseName": "ServerProfileArray",
		                  "ParentNodeId": "i=2268",
		                  "DataType": "String",
		                  "DisplayName": "ServerProfileArray",
		                  "Description": "A list of profiles supported by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2268" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2271",
		                  "BrowseName": "LocaleIdArray",
		                  "ParentNodeId": "i=2268",
		                  "DataType": "i=295",
		                  "DisplayName": "LocaleIdArray",
		                  "Description": "A list of locales supported by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2268" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2272",
		                  "BrowseName": "MinSupportedSampleRate",
		                  "ParentNodeId": "i=2268",
		                  "DataType": "i=290",
		                  "DisplayName": "MinSupportedSampleRate",
		                  "Description": "The minimum sampling interval supported by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2268" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2735",
		                  "BrowseName": "MaxBrowseContinuationPoints",
		                  "ParentNodeId": "i=2268",
		                  "DataType": "UInt16",
		                  "DisplayName": "MaxBrowseContinuationPoints",
		                  "Description": "The maximum number of continuation points for Browse operations per session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2268" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2736",
		                  "BrowseName": "MaxQueryContinuationPoints",
		                  "ParentNodeId": "i=2268",
		                  "DataType": "UInt16",
		                  "DisplayName": "MaxQueryContinuationPoints",
		                  "Description": "The maximum number of continuation points for Query operations per session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2268" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2737",
		                  "BrowseName": "MaxHistoryContinuationPoints",
		                  "ParentNodeId": "i=2268",
		                  "DataType": "UInt16",
		                  "DisplayName": "MaxHistoryContinuationPoints",
		                  "Description": "The maximum number of continuation points for ReadHistory operations per session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2268" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3704",
		                  "BrowseName": "SoftwareCertificates",
		                  "ParentNodeId": "i=2268",
		                  "DataType": "i=344",
		                  "DisplayName": "SoftwareCertificates",
		                  "Description": "The software certificates owned by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2268" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11702",
		                  "BrowseName": "MaxArrayLength",
		                  "ParentNodeId": "i=2268",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxArrayLength",
		                  "Description": "The maximum length for an array value supported by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2268" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11703",
		                  "BrowseName": "MaxStringLength",
		                  "ParentNodeId": "i=2268",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxStringLength",
		                  "Description": "The maximum length for a string value supported by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2268" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "OperationLimits", 
                    "NodeId": "i=11704", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11705" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12165" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12166" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11707" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12167" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12168" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11709" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11710" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11711" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11712" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11713" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11714" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=11564" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2268" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11705",
		                  "BrowseName": "MaxNodesPerRead",
		                  "ParentNodeId": "i=11704",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerRead",
		                  "Description": "The maximum number of operations in a single Read request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11704" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12165",
		                  "BrowseName": "MaxNodesPerHistoryReadData",
		                  "ParentNodeId": "i=11704",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerHistoryReadData",
		                  "Description": "The maximum number of operations in a single data HistoryRead request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11704" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12166",
		                  "BrowseName": "MaxNodesPerHistoryReadEvents",
		                  "ParentNodeId": "i=11704",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerHistoryReadEvents",
		                  "Description": "The maximum number of operations in a single event HistoryRead request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11704" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11707",
		                  "BrowseName": "MaxNodesPerWrite",
		                  "ParentNodeId": "i=11704",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerWrite",
		                  "Description": "The maximum number of operations in a single Write request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11704" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12167",
		                  "BrowseName": "MaxNodesPerHistoryUpdateData",
		                  "ParentNodeId": "i=11704",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerHistoryUpdateData",
		                  "Description": "The maximum number of operations in a single data HistoryUpdate request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11704" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12168",
		                  "BrowseName": "MaxNodesPerHistoryUpdateEvents",
		                  "ParentNodeId": "i=11704",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerHistoryUpdateEvents",
		                  "Description": "The maximum number of operations in a single event HistoryUpdate request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11704" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11709",
		                  "BrowseName": "MaxNodesPerMethodCall",
		                  "ParentNodeId": "i=11704",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerMethodCall",
		                  "Description": "The maximum number of operations in a single Call request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11704" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11710",
		                  "BrowseName": "MaxNodesPerBrowse",
		                  "ParentNodeId": "i=11704",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerBrowse",
		                  "Description": "The maximum number of operations in a single Browse request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11704" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11711",
		                  "BrowseName": "MaxNodesPerRegisterNodes",
		                  "ParentNodeId": "i=11704",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerRegisterNodes",
		                  "Description": "The maximum number of operations in a single RegisterNodes request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11704" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11712",
		                  "BrowseName": "MaxNodesPerTranslateBrowsePathsToNodeIds",
		                  "ParentNodeId": "i=11704",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerTranslateBrowsePathsToNodeIds",
		                  "Description": "The maximum number of operations in a single TranslateBrowsePathsToNodeIds request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11704" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11713",
		                  "BrowseName": "MaxNodesPerNodeManagement",
		                  "ParentNodeId": "i=11704",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxNodesPerNodeManagement",
		                  "Description": "The maximum number of operations in a single AddNodes, AddReferences, DeleteNodes or DeleteReferences request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11704" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11714",
		                  "BrowseName": "MaxMonitoredItemsPerCall",
		                  "ParentNodeId": "i=11704",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxMonitoredItemsPerCall",
		                  "Description": "The maximum number of operations in a single MonitoredItem related request.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11704" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "ModellingRules", 
                    "NodeId": "i=2996", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=61" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2268" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "AggregateFunctions", 
                    "NodeId": "i=2997", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=61" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2268" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "ServerDiagnostics", 
                    "NodeId": "i=2274", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2275" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2289" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2290" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3706" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2294" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2020" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2253" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2275",
		                  "BrowseName": "ServerDiagnosticsSummary",
		                  "ParentNodeId": "i=2274",
		                  "DataType": "i=859",
		                  "DisplayName": "ServerDiagnosticsSummary",
		                  "Description": "A summary of server level diagnostics.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2276" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2277" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2278" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2279" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3705" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2281" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2282" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2284" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2285" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2286" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2287" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2288" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2150" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2274" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2276",
		                  "BrowseName": "ServerViewCount",
		                  "ParentNodeId": "i=2275",
		                  "DataType": "UInt32",
		                  "DisplayName": "ServerViewCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2275" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2277",
		                  "BrowseName": "CurrentSessionCount",
		                  "ParentNodeId": "i=2275",
		                  "DataType": "UInt32",
		                  "DisplayName": "CurrentSessionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2275" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2278",
		                  "BrowseName": "CumulatedSessionCount",
		                  "ParentNodeId": "i=2275",
		                  "DataType": "UInt32",
		                  "DisplayName": "CumulatedSessionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2275" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2279",
		                  "BrowseName": "SecurityRejectedSessionCount",
		                  "ParentNodeId": "i=2275",
		                  "DataType": "UInt32",
		                  "DisplayName": "SecurityRejectedSessionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2275" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3705",
		                  "BrowseName": "RejectedSessionCount",
		                  "ParentNodeId": "i=2275",
		                  "DataType": "UInt32",
		                  "DisplayName": "RejectedSessionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2275" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2281",
		                  "BrowseName": "SessionTimeoutCount",
		                  "ParentNodeId": "i=2275",
		                  "DataType": "UInt32",
		                  "DisplayName": "SessionTimeoutCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2275" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2282",
		                  "BrowseName": "SessionAbortCount",
		                  "ParentNodeId": "i=2275",
		                  "DataType": "UInt32",
		                  "DisplayName": "SessionAbortCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2275" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2284",
		                  "BrowseName": "PublishingIntervalCount",
		                  "ParentNodeId": "i=2275",
		                  "DataType": "UInt32",
		                  "DisplayName": "PublishingIntervalCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2275" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2285",
		                  "BrowseName": "CurrentSubscriptionCount",
		                  "ParentNodeId": "i=2275",
		                  "DataType": "UInt32",
		                  "DisplayName": "CurrentSubscriptionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2275" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2286",
		                  "BrowseName": "CumulatedSubscriptionCount",
		                  "ParentNodeId": "i=2275",
		                  "DataType": "UInt32",
		                  "DisplayName": "CumulatedSubscriptionCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2275" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2287",
		                  "BrowseName": "SecurityRejectedRequestsCount",
		                  "ParentNodeId": "i=2275",
		                  "DataType": "UInt32",
		                  "DisplayName": "SecurityRejectedRequestsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2275" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2288",
		                  "BrowseName": "RejectedRequestsCount",
		                  "ParentNodeId": "i=2275",
		                  "DataType": "UInt32",
		                  "DisplayName": "RejectedRequestsCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=63" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2275" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2289",
		                  "BrowseName": "SamplingIntervalDiagnosticsArray",
		                  "ParentNodeId": "i=2274",
		                  "DataType": "i=856",
		                  "DisplayName": "SamplingIntervalDiagnosticsArray",
		                  "Description": "A list of diagnostics for each sampling interval supported by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2164" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2274" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2290",
		                  "BrowseName": "SubscriptionDiagnosticsArray",
		                  "ParentNodeId": "i=2274",
		                  "DataType": "i=874",
		                  "DisplayName": "SubscriptionDiagnosticsArray",
		                  "Description": "A list of diagnostics for each active subscription.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2171" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2274" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "SessionsDiagnosticsSummary", 
                    "NodeId": "i=3706", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3707" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3708" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2026" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2274" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3707",
		                  "BrowseName": "SessionDiagnosticsArray",
		                  "ParentNodeId": "i=3706",
		                  "DataType": "i=865",
		                  "DisplayName": "SessionDiagnosticsArray",
		                  "Description": "A list of diagnostics for each active session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2196" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3706" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3708",
		                  "BrowseName": "SessionSecurityDiagnosticsArray",
		                  "ParentNodeId": "i=3706",
		                  "DataType": "i=868",
		                  "DisplayName": "SessionSecurityDiagnosticsArray",
		                  "Description": "A list of security related diagnostics for each active session.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2243" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3706" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2294",
		                  "BrowseName": "EnabledFlag",
		                  "ParentNodeId": "i=2274",
		                  "DataType": "Boolean",
		                  "DisplayName": "EnabledFlag",
		                  "Description": "If TRUE the diagnostics collection is enabled.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2274" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "VendorServerInfo", 
                    "NodeId": "i=2295", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2033" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2253" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "ServerRedundancy", 
                    "NodeId": "i=2296", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3709" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11312" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11313" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11314" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2034" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2253" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3709",
		                  "BrowseName": "RedundancySupport",
		                  "ParentNodeId": "i=2296",
		                  "DataType": "i=851",
		                  "DisplayName": "RedundancySupport",
		                  "Description": "Indicates what style of redundancy is supported by the server.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2296" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11312",
		                  "BrowseName": "CurrentServerId",
		                  "ParentNodeId": "i=2296",
		                  "DataType": "String",
		                  "DisplayName": "CurrentServerId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2296" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11313",
		                  "BrowseName": "RedundantServerArray",
		                  "ParentNodeId": "i=2296",
		                  "DataType": "i=853",
		                  "DisplayName": "RedundantServerArray",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2296" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11314",
		                  "BrowseName": "ServerUriArray",
		                  "ParentNodeId": "i=2296",
		                  "DataType": "String",
		                  "DisplayName": "ServerUriArray",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2296" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Namespaces", 
                    "NodeId": "i=11715", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=11645" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2253" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=11492",
		                "BrowseName": "GetMonitoredItems",
		                "ParentNodeId": "i=2253",
		                "DisplayName": "GetMonitoredItems",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11493" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11494" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2253" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11493",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=11492",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11492" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11494",
		                  "BrowseName": "OutputArguments",
		                  "ParentNodeId": "i=11492",
		                  "DataType": "i=296",
		                  "DisplayName": "OutputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11492" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=11737",
                      "BrowseName": "BitFieldMaskDataType",
                      "DisplayName": "BitFieldMaskDataType",
                      "Description": "A mask of 32 bits that can be updated individually by using the top 32 bits as a mask.",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=9" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2299",
                        "BrowseName": "StateMachineType",
                        "DisplayName": "StateMachineType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2769" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2770" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2769",
		                  "BrowseName": "CurrentState",
		                  "ParentNodeId": "i=2299",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "CurrentState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3720" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2755" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2299" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3720",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=2769",
		                  "DataType": "",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2769" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2770",
		                  "BrowseName": "LastTransition",
		                  "ParentNodeId": "i=2299",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "LastTransition",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3724" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2762" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2299" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3724",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=2770",
		                  "DataType": "",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2770" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2755",
                          "BrowseName": "StateVariableType",
                          "ValueRank": "",
                          "DisplayName": "StateVariableType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2756" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2757" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2758" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2759" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2756",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=2755",
		                  "DataType": "",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2755" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2757",
		                  "BrowseName": "Name",
		                  "ParentNodeId": "i=2755",
		                  "DataType": "QualifiedName",
		                  "DisplayName": "Name",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2755" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2758",
		                  "BrowseName": "Number",
		                  "ParentNodeId": "i=2755",
		                  "DataType": "UInt32",
		                  "DisplayName": "Number",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2755" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2759",
		                  "BrowseName": "EffectiveDisplayName",
		                  "ParentNodeId": "i=2755",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "EffectiveDisplayName",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2755" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2762",
                          "BrowseName": "TransitionVariableType",
                          "ValueRank": "",
                          "DisplayName": "TransitionVariableType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2763" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2764" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2765" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2766" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11456" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2763",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=2762",
		                  "DataType": "",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2762" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2764",
		                  "BrowseName": "Name",
		                  "ParentNodeId": "i=2762",
		                  "DataType": "QualifiedName",
		                  "DisplayName": "Name",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2762" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2765",
		                  "BrowseName": "Number",
		                  "ParentNodeId": "i=2762",
		                  "DataType": "UInt32",
		                  "DisplayName": "Number",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2762" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2766",
		                  "BrowseName": "TransitionTime",
		                  "ParentNodeId": "i=2762",
		                  "DataType": "i=294",
		                  "DisplayName": "TransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2762" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11456",
		                  "BrowseName": "EffectiveTransitionTime",
		                  "ParentNodeId": "i=2762",
		                  "DataType": "i=294",
		                  "DisplayName": "EffectiveTransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2762" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2771",
                        "BrowseName": "FiniteStateMachineType",
                        "DisplayName": "FiniteStateMachineType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2772" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2773" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2299" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2772",
		                  "BrowseName": "CurrentState",
		                  "ParentNodeId": "i=2771",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "CurrentState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3728" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2760" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2771" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3728",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=2772",
		                  "DataType": "NodeId",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2772" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2773",
		                  "BrowseName": "LastTransition",
		                  "ParentNodeId": "i=2771",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "LastTransition",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3732" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2767" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2771" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3732",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=2773",
		                  "DataType": "NodeId",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2773" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2760",
                          "BrowseName": "FiniteStateVariableType",
                          "ValueRank": "",
                          "DisplayName": "FiniteStateVariableType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2761" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2755" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2761",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=2760",
		                  "DataType": "NodeId",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2760" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2767",
                          "BrowseName": "FiniteTransitionVariableType",
                          "ValueRank": "",
                          "DisplayName": "FiniteTransitionVariableType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2768" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2762" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2768",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=2767",
		                  "DataType": "NodeId",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2767" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2307",
                        "BrowseName": "StateType",
                        "DisplayName": "StateType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2308" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2308",
		                  "BrowseName": "StateNumber",
		                  "ParentNodeId": "i=2307",
		                  "DataType": "UInt32",
		                  "DisplayName": "StateNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2307" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2309",
                        "BrowseName": "InitialStateType",
                        "DisplayName": "InitialStateType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2307" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2310",
                        "BrowseName": "TransitionType",
                        "DisplayName": "TransitionType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2312" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2312",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=2310",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2310" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2311",
                        "BrowseName": "TransitionEventType",
                        "DisplayName": "TransitionEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2774" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2775" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2776" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2041" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2774",
		                  "BrowseName": "Transition",
		                  "ParentNodeId": "i=2311",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "Transition",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3754" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2762" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2311" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3754",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=2774",
		                  "DataType": "",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2774" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2775",
		                  "BrowseName": "FromState",
		                  "ParentNodeId": "i=2311",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "FromState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3746" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2755" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2311" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3746",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=2775",
		                  "DataType": "",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2775" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2776",
		                  "BrowseName": "ToState",
		                  "ParentNodeId": "i=2311",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "ToState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3750" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2755" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2311" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3750",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=2776",
		                  "DataType": "",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2776" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2315",
                        "BrowseName": "AuditUpdateStateEventType",
                        "DisplayName": "AuditUpdateStateEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2777" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2778" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2127" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2777",
		                  "BrowseName": "OldStateId",
		                  "ParentNodeId": "i=2315",
		                  "DataType": "",
		                  "DisplayName": "OldStateId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2315" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2778",
		                  "BrowseName": "NewStateId",
		                  "ParentNodeId": "i=2315",
		                  "DataType": "",
		                  "DisplayName": "NewStateId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2315" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=338",
                      "BrowseName": "BuildInfo",
                      "DisplayName": "BuildInfo",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=851",
                      "BrowseName": "RedundancySupport",
                      "DisplayName": "RedundancySupport",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=7611" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=29" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7611",
		                  "BrowseName": "EnumStrings",
		                  "ParentNodeId": "i=851",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "EnumStrings",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=851" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=852",
                      "BrowseName": "ServerState",
                      "DisplayName": "ServerState",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=7612" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=29" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7612",
		                  "BrowseName": "EnumStrings",
		                  "ParentNodeId": "i=852",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "EnumStrings",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=852" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=853",
                      "BrowseName": "RedundantServerDataType",
                      "DisplayName": "RedundantServerDataType",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=11943",
                      "BrowseName": "EndpointUrlListDataType",
                      "DisplayName": "EndpointUrlListDataType",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=11944",
                      "BrowseName": "NetworkGroupDataType",
                      "DisplayName": "NetworkGroupDataType",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=856",
                      "BrowseName": "SamplingIntervalDiagnosticsDataType",
                      "DisplayName": "SamplingIntervalDiagnosticsDataType",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=859",
                      "BrowseName": "ServerDiagnosticsSummaryDataType",
                      "DisplayName": "ServerDiagnosticsSummaryDataType",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=862",
                      "BrowseName": "ServerStatusDataType",
                      "DisplayName": "ServerStatusDataType",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=865",
                      "BrowseName": "SessionDiagnosticsDataType",
                      "DisplayName": "SessionDiagnosticsDataType",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=868",
                      "BrowseName": "SessionSecurityDiagnosticsDataType",
                      "DisplayName": "SessionSecurityDiagnosticsDataType",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=871",
                      "BrowseName": "ServiceCounterDataType",
                      "DisplayName": "ServiceCounterDataType",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=299",
                      "BrowseName": "StatusResult",
                      "DisplayName": "StatusResult",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=874",
                      "BrowseName": "SubscriptionDiagnosticsDataType",
                      "DisplayName": "SubscriptionDiagnosticsDataType",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=877",
                      "BrowseName": "ModelChangeStructureDataType",
                      "DisplayName": "ModelChangeStructureDataType",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=897",
                      "BrowseName": "SemanticChangeStructureDataType",
                      "DisplayName": "SemanticChangeStructureDataType",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=339", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=338" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8327" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=854", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=853" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8843" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=11949", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=11943" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=11951" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=11950", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=11944" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=11954" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=857", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=856" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8846" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=860", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=859" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8849" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=863", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=862" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8852" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=866", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=865" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8855" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=869", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=868" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8858" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=872", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=871" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8861" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=300", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=299" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8294" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=875", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=874" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8864" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=878", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=877" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8867" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=898", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=897" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8870" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8252",
		                  "BrowseName": "Opc.Ua",
		                  "ParentNodeId": "",
		                  "DataType": "ByteString",
		                  "DisplayName": "Opc.Ua",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=8254" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8285" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8291" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8918" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8300" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8297" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8303" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8417" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8333" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8306" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8309" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8312" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8315" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8318" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8363" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8366" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8369" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8372" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8321" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8324" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8330" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8564" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8567" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8570" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8573" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8576" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8579" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8582" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8639" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8702" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8708" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8711" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8807" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8384" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8387" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8390" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8327" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8843" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11951" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11954" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8846" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8849" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8852" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8855" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8858" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8861" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8294" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8864" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8867" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8870" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8873" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8876" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12175" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12178" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12083" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12086" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8882" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8879" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=92" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=72" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8254",
		                  "BrowseName": "NamespaceUri",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "NamespaceUri",
		                  "Description": "A URI that uniquely identifies the dictionary.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8285",
		                  "BrowseName": "Argument",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "Argument",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8291",
		                  "BrowseName": "EnumValueType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "EnumValueType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8918",
		                  "BrowseName": "TimeZoneDataType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "TimeZoneDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8300",
		                  "BrowseName": "ApplicationDescription",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "ApplicationDescription",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8297",
		                  "BrowseName": "UserTokenPolicy",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "UserTokenPolicy",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8303",
		                  "BrowseName": "EndpointDescription",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "EndpointDescription",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8417",
		                  "BrowseName": "RegisteredServer",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "RegisteredServer",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8333",
		                  "BrowseName": "SignedSoftwareCertificate",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "SignedSoftwareCertificate",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8306",
		                  "BrowseName": "UserIdentityToken",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "UserIdentityToken",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8309",
		                  "BrowseName": "AnonymousIdentityToken",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "AnonymousIdentityToken",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8312",
		                  "BrowseName": "UserNameIdentityToken",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "UserNameIdentityToken",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8315",
		                  "BrowseName": "X509IdentityToken",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "X509IdentityToken",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8318",
		                  "BrowseName": "IssuedIdentityToken",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "IssuedIdentityToken",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8363",
		                  "BrowseName": "AddNodesItem",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "AddNodesItem",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8366",
		                  "BrowseName": "AddReferencesItem",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "AddReferencesItem",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8369",
		                  "BrowseName": "DeleteNodesItem",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "DeleteNodesItem",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8372",
		                  "BrowseName": "DeleteReferencesItem",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "DeleteReferencesItem",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8321",
		                  "BrowseName": "EndpointConfiguration",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "EndpointConfiguration",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8324",
		                  "BrowseName": "SupportedProfile",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "SupportedProfile",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8330",
		                  "BrowseName": "SoftwareCertificate",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "SoftwareCertificate",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8564",
		                  "BrowseName": "ContentFilterElement",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "ContentFilterElement",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8567",
		                  "BrowseName": "ContentFilter",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "ContentFilter",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8570",
		                  "BrowseName": "FilterOperand",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "FilterOperand",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8573",
		                  "BrowseName": "ElementOperand",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "ElementOperand",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8576",
		                  "BrowseName": "LiteralOperand",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "LiteralOperand",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8579",
		                  "BrowseName": "AttributeOperand",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "AttributeOperand",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8582",
		                  "BrowseName": "SimpleAttributeOperand",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "SimpleAttributeOperand",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8639",
		                  "BrowseName": "HistoryEvent",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "HistoryEvent",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8702",
		                  "BrowseName": "MonitoringFilter",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "MonitoringFilter",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8708",
		                  "BrowseName": "EventFilter",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "EventFilter",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8711",
		                  "BrowseName": "AggregateConfiguration",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "AggregateConfiguration",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8807",
		                  "BrowseName": "HistoryEventFieldList",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "HistoryEventFieldList",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8384",
		                  "BrowseName": "ScalarTestType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "ScalarTestType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8387",
		                  "BrowseName": "ArrayTestType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "ArrayTestType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8390",
		                  "BrowseName": "CompositeTestType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "CompositeTestType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8327",
		                  "BrowseName": "BuildInfo",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "BuildInfo",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8843",
		                  "BrowseName": "RedundantServerDataType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "RedundantServerDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11951",
		                  "BrowseName": "EndpointUrlListDataType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "EndpointUrlListDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11954",
		                  "BrowseName": "NetworkGroupDataType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "NetworkGroupDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8846",
		                  "BrowseName": "SamplingIntervalDiagnosticsDataType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "SamplingIntervalDiagnosticsDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8849",
		                  "BrowseName": "ServerDiagnosticsSummaryDataType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "ServerDiagnosticsSummaryDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8852",
		                  "BrowseName": "ServerStatusDataType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "ServerStatusDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8855",
		                  "BrowseName": "SessionDiagnosticsDataType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "SessionDiagnosticsDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8858",
		                  "BrowseName": "SessionSecurityDiagnosticsDataType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "SessionSecurityDiagnosticsDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8861",
		                  "BrowseName": "ServiceCounterDataType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "ServiceCounterDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8294",
		                  "BrowseName": "StatusResult",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "StatusResult",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8864",
		                  "BrowseName": "SubscriptionDiagnosticsDataType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "SubscriptionDiagnosticsDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8867",
		                  "BrowseName": "ModelChangeStructureDataType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "ModelChangeStructureDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8870",
		                  "BrowseName": "SemanticChangeStructureDataType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "SemanticChangeStructureDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8873",
		                  "BrowseName": "Range",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "Range",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8876",
		                  "BrowseName": "EUInformation",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "EUInformation",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12175",
		                  "BrowseName": "ComplexNumberType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "ComplexNumberType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12178",
		                  "BrowseName": "DoubleComplexNumberType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "DoubleComplexNumberType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12083",
		                  "BrowseName": "AxisInformation",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "AxisInformation",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12086",
		                  "BrowseName": "XVType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "XVType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8882",
		                  "BrowseName": "ProgramDiagnosticDataType",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "ProgramDiagnosticDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8879",
		                  "BrowseName": "Annotation",
		                  "ParentNodeId": "i=8252",
		                  "DataType": "String",
		                  "DisplayName": "Annotation",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8252" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=340", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=338" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7692" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=855", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=853" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8208" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=11957", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=11943" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=11959" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=11958", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=11944" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=11962" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=858", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=856" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8211" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=861", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=859" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8214" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=864", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=862" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8217" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=867", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=865" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8220" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=870", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=868" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8223" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=873", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=871" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8226" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=301", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=299" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=7659" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=876", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=874" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8229" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=879", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=877" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8232" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=899", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=897" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8235" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7617",
		                  "BrowseName": "Opc.Ua",
		                  "ParentNodeId": "",
		                  "DataType": "ByteString",
		                  "DisplayName": "Opc.Ua",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=7619" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7650" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7656" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8914" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7665" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7662" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7668" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7782" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7698" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7671" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7674" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7677" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7680" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7683" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7728" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7731" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7734" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7737" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7686" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7689" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7695" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7929" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7932" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7935" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7938" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7941" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7944" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7947" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8004" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8067" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8073" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8076" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8172" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7749" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7752" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7755" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7692" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8208" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11959" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11962" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8211" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8214" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8217" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8220" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8223" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8226" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7659" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8229" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8232" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8235" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8238" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8241" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12183" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12186" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12091" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=12094" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8247" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=8244" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=93" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=72" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7619",
		                  "BrowseName": "NamespaceUri",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "NamespaceUri",
		                  "Description": "A URI that uniquely identifies the dictionary.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7650",
		                  "BrowseName": "Argument",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "Argument",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7656",
		                  "BrowseName": "EnumValueType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "EnumValueType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8914",
		                  "BrowseName": "TimeZoneDataType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "TimeZoneDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7665",
		                  "BrowseName": "ApplicationDescription",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "ApplicationDescription",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7662",
		                  "BrowseName": "UserTokenPolicy",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "UserTokenPolicy",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7668",
		                  "BrowseName": "EndpointDescription",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "EndpointDescription",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7782",
		                  "BrowseName": "RegisteredServer",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "RegisteredServer",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7698",
		                  "BrowseName": "SignedSoftwareCertificate",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "SignedSoftwareCertificate",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7671",
		                  "BrowseName": "UserIdentityToken",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "UserIdentityToken",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7674",
		                  "BrowseName": "AnonymousIdentityToken",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "AnonymousIdentityToken",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7677",
		                  "BrowseName": "UserNameIdentityToken",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "UserNameIdentityToken",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7680",
		                  "BrowseName": "X509IdentityToken",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "X509IdentityToken",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7683",
		                  "BrowseName": "IssuedIdentityToken",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "IssuedIdentityToken",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7728",
		                  "BrowseName": "AddNodesItem",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "AddNodesItem",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7731",
		                  "BrowseName": "AddReferencesItem",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "AddReferencesItem",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7734",
		                  "BrowseName": "DeleteNodesItem",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "DeleteNodesItem",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7737",
		                  "BrowseName": "DeleteReferencesItem",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "DeleteReferencesItem",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7686",
		                  "BrowseName": "EndpointConfiguration",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "EndpointConfiguration",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7689",
		                  "BrowseName": "SupportedProfile",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "SupportedProfile",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7695",
		                  "BrowseName": "SoftwareCertificate",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "SoftwareCertificate",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7929",
		                  "BrowseName": "ContentFilterElement",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "ContentFilterElement",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7932",
		                  "BrowseName": "ContentFilter",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "ContentFilter",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7935",
		                  "BrowseName": "FilterOperand",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "FilterOperand",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7938",
		                  "BrowseName": "ElementOperand",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "ElementOperand",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7941",
		                  "BrowseName": "LiteralOperand",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "LiteralOperand",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7944",
		                  "BrowseName": "AttributeOperand",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "AttributeOperand",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7947",
		                  "BrowseName": "SimpleAttributeOperand",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "SimpleAttributeOperand",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8004",
		                  "BrowseName": "HistoryEvent",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "HistoryEvent",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8067",
		                  "BrowseName": "MonitoringFilter",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "MonitoringFilter",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8073",
		                  "BrowseName": "EventFilter",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "EventFilter",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8076",
		                  "BrowseName": "AggregateConfiguration",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "AggregateConfiguration",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8172",
		                  "BrowseName": "HistoryEventFieldList",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "HistoryEventFieldList",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7749",
		                  "BrowseName": "ScalarTestType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "ScalarTestType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7752",
		                  "BrowseName": "ArrayTestType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "ArrayTestType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7755",
		                  "BrowseName": "CompositeTestType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "CompositeTestType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7692",
		                  "BrowseName": "BuildInfo",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "BuildInfo",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8208",
		                  "BrowseName": "RedundantServerDataType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "RedundantServerDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11959",
		                  "BrowseName": "EndpointUrlListDataType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "EndpointUrlListDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11962",
		                  "BrowseName": "NetworkGroupDataType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "NetworkGroupDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8211",
		                  "BrowseName": "SamplingIntervalDiagnosticsDataType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "SamplingIntervalDiagnosticsDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8214",
		                  "BrowseName": "ServerDiagnosticsSummaryDataType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "ServerDiagnosticsSummaryDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8217",
		                  "BrowseName": "ServerStatusDataType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "ServerStatusDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8220",
		                  "BrowseName": "SessionDiagnosticsDataType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "SessionDiagnosticsDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8223",
		                  "BrowseName": "SessionSecurityDiagnosticsDataType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "SessionSecurityDiagnosticsDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8226",
		                  "BrowseName": "ServiceCounterDataType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "ServiceCounterDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7659",
		                  "BrowseName": "StatusResult",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "StatusResult",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8229",
		                  "BrowseName": "SubscriptionDiagnosticsDataType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "SubscriptionDiagnosticsDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8232",
		                  "BrowseName": "ModelChangeStructureDataType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "ModelChangeStructureDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8235",
		                  "BrowseName": "SemanticChangeStructureDataType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "SemanticChangeStructureDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8238",
		                  "BrowseName": "Range",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "Range",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8241",
		                  "BrowseName": "EUInformation",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "EUInformation",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12183",
		                  "BrowseName": "ComplexNumberType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "ComplexNumberType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12186",
		                  "BrowseName": "DoubleComplexNumberType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "DoubleComplexNumberType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12091",
		                  "BrowseName": "AxisInformation",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "AxisInformation",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12094",
		                  "BrowseName": "XVType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "XVType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8247",
		                  "BrowseName": "ProgramDiagnosticDataType",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "ProgramDiagnosticDataType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8244",
		                  "BrowseName": "Annotation",
		                  "ParentNodeId": "i=7617",
		                  "DataType": "String",
		                  "DisplayName": "Annotation",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=69" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=7617" } ]
	} );

    

    // summary of definitions
    print( "Types defined in UA Part 05 Type Definition (Opc.Ua.Nodeset2.Part5.xml):" );
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

test000_05();//Test.Execute( { Procedure: this.test000_05 } );