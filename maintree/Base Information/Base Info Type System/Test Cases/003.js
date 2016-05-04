/*  Test prepared by Nathan Pocock (nathan.pocock@opcfoundation.org)
    Description: Walks through the address space checking the TypeDefinitions */

function test000_03() {
    var uaobjects = [];
    var uadatatypes = [];
    var uareferencetypes = [];
    var uaobjecttypes = [];
    var uavariabletypes = [];
    var uavariables = [];
    var uamethods = [];

    // now to define our objects, and add them to the above arrays
	uaobjects.push( 
	{ "Type": "UAObject", "BrowseName": "Default Binary", 
		"NodeId": "i=3062", 
		"SymbolicName": "DefaultBinary"
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=58" }
			
		]
	} );

	uaobjects.push( 
	{ "Type": "UAObject", "BrowseName": "Default XML", 
		"NodeId": "i=3063", 
		"SymbolicName": "DefaultXml"
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=58" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=24",
		"BrowseName": "BaseDataType",
		"DisplayName": "BaseDataType",
		"Description": "Describes a value that can have any valid DataType."
			} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=26",
		"BrowseName": "Number",
		"DisplayName": "Number",
		"Description": "Describes a value that can have any numeric DataType."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=24" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=27",
		"BrowseName": "Integer",
		"DisplayName": "Integer",
		"Description": "Describes a value that can have any integer DataType."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=26" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=28",
		"BrowseName": "UInteger",
		"DisplayName": "UInteger",
		"Description": "Describes a value that can have any unsigned integer DataType."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=27" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=29",
		"BrowseName": "Enumeration",
		"DisplayName": "Enumeration",
		"Description": "Describes a value that is an enumerated DataType."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=24" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=1",
		"BrowseName": "Boolean",
		"DisplayName": "Boolean",
		"Description": "Describes a value that is either TRUE or FALSE."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=24" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=2",
		"BrowseName": "SByte",
		"DisplayName": "SByte",
		"Description": "Describes a value that is an integer between -128 and 127."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=27" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=3",
		"BrowseName": "Byte",
		"DisplayName": "Byte",
		"Description": "Describes a value that is an integer between 0 and 255."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=28" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=4",
		"BrowseName": "Int16",
		"DisplayName": "Int16",
		"Description": "Describes a value that is an integer between -32,768 and 32,767."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=27" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=5",
		"BrowseName": "UInt16",
		"DisplayName": "UInt16",
		"Description": "Describes a value that is an integer between 0 and 65535."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=28" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=6",
		"BrowseName": "Int32",
		"DisplayName": "Int32",
		"Description": "Describes a value that is an integer between -2,147,483,648  and 2,147,483,647."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=27" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=7",
		"BrowseName": "UInt32",
		"DisplayName": "UInt32",
		"Description": "Describes a value that is an integer between 0 and 4,294,967,295."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=28" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=8",
		"BrowseName": "Int64",
		"DisplayName": "Int64",
		"Description": "Describes a value that is an integer between -9,223,372,036,854,775,808 and 9,223,372,036,854,775,807."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=27" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=9",
		"BrowseName": "UInt64",
		"DisplayName": "UInt64",
		"Description": "Describes a value that is an integer between 0 and 18,446,744,073,709,551,615."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=28" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=10",
		"BrowseName": "Float",
		"DisplayName": "Float",
		"Description": "Describes a value that is an IEEE 754-1985 single precision floating point number."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=26" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=11",
		"BrowseName": "Double",
		"DisplayName": "Double",
		"Description": "Describes a value that is an IEEE 754-1985 double precision floating point number."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=26" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=12",
		"BrowseName": "String",
		"DisplayName": "String",
		"Description": "Describes a value that is a sequence of printable Unicode characters."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=24" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=13",
		"BrowseName": "DateTime",
		"DisplayName": "DateTime",
		"Description": "Describes a value that is a Gregorian calender date and time."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=24" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=14",
		"BrowseName": "Guid",
		"DisplayName": "Guid",
		"Description": "Describes a value that is a 128-bit globally unique identifier."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=24" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=15",
		"BrowseName": "ByteString",
		"DisplayName": "ByteString",
		"Description": "Describes a value that is a sequence of bytes."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=24" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=16",
		"BrowseName": "XmlElement",
		"DisplayName": "XmlElement",
		"Description": "Describes a value that is an XML element."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=24" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=17",
		"BrowseName": "NodeId",
		"DisplayName": "NodeId",
		"Description": "Describes a value that is an identifier for a node within a Server address space."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=24" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=20",
		"BrowseName": "QualifiedName",
		"DisplayName": "QualifiedName",
		"Description": "Describes a value that is a name qualified by a namespace."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=24" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=21",
		"BrowseName": "LocalizedText",
		"DisplayName": "LocalizedText",
		"Description": "Describes a value that is human readable Unicode text with a locale identifier."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=24" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=22",
		"BrowseName": "Structure",
		"DisplayName": "Structure",
		"Description": "Describes a value that is any type of structure that can be described with a data encoding."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=24" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=30",
		"BrowseName": "Image",
		"DisplayName": "Image",
		"Description": "Describes a value that is an image encoded as a string of bytes."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=15" }
			
		]
	} );

	uareferencetypes.push( 
	{ "Type": "UAReferenceType",
		"NodeId": "i=31",
		"BrowseName": "References",
		"IsAbstract": "true",
		"DisplayName": "References",
		"Description": "The abstract base type for all references.",
		"InverseName": "References"
			} );

	uareferencetypes.push( 
	{ "Type": "UAReferenceType",
		"NodeId": "i=32",
		"BrowseName": "NonHierarchicalReferences",
		"IsAbstract": "true",
		"DisplayName": "NonHierarchicalReferences",
		"Description": "The abstract base type for all non-hierarchical references.",
		"InverseName": "NonHierarchicalReferences"
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=31" }
			
		]
	} );

	uareferencetypes.push( 
	{ "Type": "UAReferenceType",
		"NodeId": "i=33",
		"BrowseName": "HierarchicalReferences",
		"IsAbstract": "true",
		"DisplayName": "HierarchicalReferences",
		"Description": "The abstract base type for all hierarchical references.",
		"InverseName": "HierarchicalReferences"
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=31" }
			
		]
	} );

	uareferencetypes.push( 
	{ "Type": "UAReferenceType",
		"NodeId": "i=34",
		"BrowseName": "HasChild",
		"IsAbstract": "",
		"DisplayName": "HasChild",
		"Description": "The abstract base type for all non-looping hierarchical references.",
		"InverseName": "ChildOf"
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=33" }
			
		]
	} );

	uareferencetypes.push( 
	{ "Type": "UAReferenceType",
		"NodeId": "i=35",
		"BrowseName": "Organizes",
		"IsAbstract": "",
		"DisplayName": "Organizes",
		"Description": "The type for hierarchical references that are used to organize nodes.",
		"InverseName": "OrganizedBy"
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=33" }
			
		]
	} );

	uareferencetypes.push( 
	{ "Type": "UAReferenceType",
		"NodeId": "i=36",
		"BrowseName": "HasEventSource",
		"IsAbstract": "",
		"DisplayName": "HasEventSource",
		"Description": "The type for non-looping hierarchical references that are used to organize event sources.",
		"InverseName": "EventSourceOf"
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=33" }
			
		]
	} );

	uareferencetypes.push( 
	{ "Type": "UAReferenceType",
		"NodeId": "i=37",
		"BrowseName": "HasModellingRule",
		"IsAbstract": "",
		"DisplayName": "HasModellingRule",
		"Description": "The type for references from instance declarations to modelling rule nodes.",
		"InverseName": "ModellingRuleOf"
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=32" }
			
		]
	} );

	uareferencetypes.push( 
	{ "Type": "UAReferenceType",
		"NodeId": "i=38",
		"BrowseName": "HasEncoding",
		"IsAbstract": "",
		"DisplayName": "HasEncoding",
		"Description": "The type for references from data type nodes to to data type encoding nodes.",
		"InverseName": "EncodingOf"
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=32" }
			
		]
	} );

	uareferencetypes.push( 
	{ "Type": "UAReferenceType",
		"NodeId": "i=39",
		"BrowseName": "HasDescription",
		"IsAbstract": "",
		"DisplayName": "HasDescription",
		"Description": "The type for references from data type encoding nodes to data type description nodes.",
		"InverseName": "DescriptionOf"
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=32" }
			
		]
	} );

	uareferencetypes.push( 
	{ "Type": "UAReferenceType",
		"NodeId": "i=40",
		"BrowseName": "HasTypeDefinition",
		"IsAbstract": "",
		"DisplayName": "HasTypeDefinition",
		"Description": "The type for references from a instance node its type defintion node.",
		"InverseName": "TypeDefinitionOf"
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=32" }
			
		]
	} );

	uareferencetypes.push( 
	{ "Type": "UAReferenceType",
		"NodeId": "i=41",
		"BrowseName": "GeneratesEvent",
		"IsAbstract": "",
		"DisplayName": "GeneratesEvent",
		"Description": "The type for references from a node to an event type that is raised by node.",
		"InverseName": "GeneratesEvent"
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=32" }
			
		]
	} );

	uareferencetypes.push( 
	{ "Type": "UAReferenceType",
		"NodeId": "i=3065",
		"BrowseName": "AlwaysGeneratesEvent",
		"IsAbstract": "",
		"DisplayName": "AlwaysGeneratesEvent",
		"Description": "The type for references from a node to an event type that is always raised by node.",
		"InverseName": "AlwaysGeneratesEvent"
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=32" }
			
		]
	} );

	uareferencetypes.push( 
	{ "Type": "UAReferenceType",
		"NodeId": "i=44",
		"BrowseName": "Aggregates",
		"IsAbstract": "",
		"DisplayName": "Aggregates",
		"Description": "The type for non-looping hierarchical references that are used to aggregate nodes into complex types.",
		"InverseName": "AggregatedBy"
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=34" }
			
		]
	} );

	uareferencetypes.push( 
	{ "Type": "UAReferenceType",
		"NodeId": "i=45",
		"BrowseName": "HasSubtype",
		"IsAbstract": "",
		"DisplayName": "HasSubtype",
		"Description": "The type for non-looping hierarchical references that are used to define sub types.",
		"InverseName": "HasSupertype"
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=34" }
			
		]
	} );

	uareferencetypes.push( 
	{ "Type": "UAReferenceType",
		"NodeId": "i=46",
		"BrowseName": "HasProperty",
		"IsAbstract": "",
		"DisplayName": "HasProperty",
		"Description": "The type for non-looping hierarchical reference from a node to its property.",
		"InverseName": "PropertyOf"
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=44" }
			
		]
	} );

	uareferencetypes.push( 
	{ "Type": "UAReferenceType",
		"NodeId": "i=47",
		"BrowseName": "HasComponent",
		"IsAbstract": "",
		"DisplayName": "HasComponent",
		"Description": "The type for non-looping hierarchical reference from a node to its component.",
		"InverseName": "ComponentOf"
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=44" }
			
		]
	} );

	uareferencetypes.push( 
	{ "Type": "UAReferenceType",
		"NodeId": "i=48",
		"BrowseName": "HasNotifier",
		"IsAbstract": "",
		"DisplayName": "HasNotifier",
		"Description": "The type for non-looping hierarchical references that are used to indicate how events propagate from node to node.",
		"InverseName": "NotifierOf"
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=36" }
			
		]
	} );

	uareferencetypes.push( 
	{ "Type": "UAReferenceType",
		"NodeId": "i=49",
		"BrowseName": "HasOrderedComponent",
		"IsAbstract": "",
		"DisplayName": "HasOrderedComponent",
		"Description": "The type for non-looping hierarchical reference from a node to its component when the order of references matters.",
		"InverseName": "OrderedComponentOf"
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=47" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=120",
		"BrowseName": "NamingRuleType",
		"DisplayName": "NamingRuleType",
		"Description": "Describes a value that specifies the significance of the BrowseName for an instance declaration."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasProperty",
			  "NodeId": "i=12169" }
			,
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=29" }
			
		]
	} );

	uavariables.push( 
	{ "Type": "UAVariable",
		"NodeId": "i=12169",
		"BrowseName": "EnumValues",
		"ParentNodeId": "i=120",
		"DataType": "i=7594",
		"DisplayName": "EnumValues",
		"Description": ""
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=68" }
			,
			{ "ReferenceTypeId": "HasModellingRule",
			  "NodeId": "i=78" }
			,
			{ "ReferenceTypeId": "HasProperty",
			  "NodeId": "i=120" }
			
		]
	} );

	uavariables.push( 
	{ "Type": "UAVariable",
		"NodeId": "i=3068",
		"BrowseName": "NodeVersion",
		"ParentNodeId": "",
		"DataType": "String",
		"DisplayName": "NodeVersion",
		"Description": "The version number of the node (used to indicate changes to references of the owning node)."
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=68" }
			
		]
	} );

	uavariables.push( 
	{ "Type": "UAVariable",
		"NodeId": "i=12170",
		"BrowseName": "ViewVersion",
		"ParentNodeId": "",
		"DataType": "UInt32",
		"DisplayName": "ViewVersion",
		"Description": "The version number of the view."
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=68" }
			
		]
	} );

	uavariables.push( 
	{ "Type": "UAVariable",
		"NodeId": "i=3067",
		"BrowseName": "Icon",
		"ParentNodeId": "",
		"DataType": "i=30",
		"DisplayName": "Icon",
		"Description": "A small image representing the object."
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=68" }
			
		]
	} );

	uavariables.push( 
	{ "Type": "UAVariable",
		"NodeId": "i=3069",
		"BrowseName": "LocalTime",
		"ParentNodeId": "",
		"DataType": "i=8912",
		"DisplayName": "LocalTime",
		"Description": "The local time where the owning variable value was collected."
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=68" }
			
		]
	} );

	uavariables.push( 
	{ "Type": "UAVariable",
		"NodeId": "i=3070",
		"BrowseName": "AllowNulls",
		"ParentNodeId": "",
		"DataType": "Boolean",
		"DisplayName": "AllowNulls",
		"Description": "Whether the value of the owning variable is allowed to be null."
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=68" }
			
		]
	} );

	uavariables.push( 
	{ "Type": "UAVariable",
		"NodeId": "i=11433",
		"BrowseName": "ValueAsText",
		"ParentNodeId": "",
		"DataType": "LocalizedText",
		"DisplayName": "ValueAsText",
		"Description": "The string representation of the current value for a variable with an enumerated data type."
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=68" }
			
		]
	} );

	uavariables.push( 
	{ "Type": "UAVariable",
		"NodeId": "i=11498",
		"BrowseName": "MaxStringLength",
		"ParentNodeId": "",
		"DataType": "UInt32",
		"DisplayName": "MaxStringLength",
		"Description": "The maximum length for a string that can be stored in the owning variable."
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=68" }
			
		]
	} );

	uavariables.push( 
	{ "Type": "UAVariable",
		"NodeId": "i=11512",
		"BrowseName": "MaxArrayLength",
		"ParentNodeId": "",
		"DataType": "UInt32",
		"DisplayName": "MaxArrayLength",
		"Description": "The maximum length for an array that can be stored in the owning variable."
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=68" }
			
		]
	} );

	uavariables.push( 
	{ "Type": "UAVariable",
		"NodeId": "i=11513",
		"BrowseName": "EngineeringUnits",
		"ParentNodeId": "",
		"DataType": "i=887",
		"DisplayName": "EngineeringUnits",
		"Description": "The engineering units for the value of the owning variable."
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=68" }
			
		]
	} );

	uavariables.push( 
	{ "Type": "UAVariable",
		"NodeId": "i=11432",
		"BrowseName": "EnumStrings",
		"ParentNodeId": "",
		"DataType": "LocalizedText",
		"DisplayName": "EnumStrings",
		"Description": "The human readable strings associated with the values of an enumerated value (when values are sequential)."
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=68" }
			
		]
	} );

	uavariables.push( 
	{ "Type": "UAVariable",
		"NodeId": "i=3071",
		"BrowseName": "EnumValues",
		"ParentNodeId": "",
		"DataType": "i=7594",
		"DisplayName": "EnumValues",
		"Description": "The human readable strings associated with the values of an enumerated value (when values have no sequence)."
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=68" }
			
		]
	} );

	uavariables.push( 
	{ "Type": "UAVariable",
		"NodeId": "i=3072",
		"BrowseName": "InputArguments",
		"ParentNodeId": "",
		"DataType": "i=296",
		"DisplayName": "InputArguments",
		"Description": "The input arguments for a method."
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=68" }
			
		]
	} );

	uavariables.push( 
	{ "Type": "UAVariable",
		"NodeId": "i=3073",
		"BrowseName": "OutputArguments",
		"ParentNodeId": "",
		"DataType": "i=296",
		"DisplayName": "OutputArguments",
		"Description": "The output arguments for a method."
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=68" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=2000",
		"BrowseName": "ImageBMP",
		"DisplayName": "ImageBMP",
		"Description": "An image encoded in BMP format."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=30" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=2001",
		"BrowseName": "ImageGIF",
		"DisplayName": "ImageGIF",
		"Description": "An image encoded in GIF format."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=30" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=2002",
		"BrowseName": "ImageJPG",
		"DisplayName": "ImageJPG",
		"Description": "An image encoded in JPEG format."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=30" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=2003",
		"BrowseName": "ImagePNG",
		"DisplayName": "ImagePNG",
		"Description": "An image encoded in PNG format."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=30" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=256",
		"BrowseName": "IdType",
		"DisplayName": "IdType",
		"Description": "The type of identifier used in a node id."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasProperty",
			  "NodeId": "i=7591" }
			,
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=29" }
			
		]
	} );

	uavariables.push( 
	{ "Type": "UAVariable",
		"NodeId": "i=7591",
		"BrowseName": "EnumStrings",
		"ParentNodeId": "i=256",
		"DataType": "LocalizedText",
		"DisplayName": "EnumStrings",
		"Description": ""
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=68" }
			,
			{ "ReferenceTypeId": "HasModellingRule",
			  "NodeId": "i=78" }
			,
			{ "ReferenceTypeId": "HasProperty",
			  "NodeId": "i=256" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=257",
		"BrowseName": "NodeClass",
		"DisplayName": "NodeClass",
		"Description": "A mask specifying the class of the node."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasProperty",
			  "NodeId": "i=11878" }
			,
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=29" }
			
		]
	} );

	uavariables.push( 
	{ "Type": "UAVariable",
		"NodeId": "i=11878",
		"BrowseName": "EnumValues",
		"ParentNodeId": "i=257",
		"DataType": "i=7594",
		"DisplayName": "EnumValues",
		"Description": ""
		,
		
	"References": 
		[ 
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=68" }
			,
			{ "ReferenceTypeId": "HasModellingRule",
			  "NodeId": "i=78" }
			,
			{ "ReferenceTypeId": "HasProperty",
			  "NodeId": "i=257" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=296",
		"BrowseName": "Argument",
		"DisplayName": "Argument",
		"Description": "An argument for a method."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=22" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=7594",
		"BrowseName": "EnumValueType",
		"DisplayName": "EnumValueType",
		"Description": "A mapping between a value of an enumerated type and a name and description."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=22" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=290",
		"BrowseName": "Duration",
		"DisplayName": "Duration",
		"Description": "A period of time measured in seconds."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=11" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=294",
		"BrowseName": "UtcTime",
		"DisplayName": "UtcTime",
		"Description": "A date/time value specified in Universal Coordinated Time (UTC)."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=13" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=295",
		"BrowseName": "LocaleId",
		"DisplayName": "LocaleId",
		"Description": "An identifier for a user locale."
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=12" }
			
		]
	} );

	uadatatypes.push( 
	{ "Type": "UADataType",
		"NodeId": "i=8912",
		"BrowseName": "TimeZoneDataType",
		"DisplayName": "TimeZoneDataType",
		"Description": ""
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasSubtype",
			  "NodeId": "i=22" }
			
		]
	} );

	uaobjects.push( 
	{ "Type": "UAObject", "BrowseName": "Default XML", 
		"NodeId": "i=297", 
		"SymbolicName": "DefaultXml"
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasEncoding",
			  "NodeId": "i=296" }
			,
			{ "ReferenceTypeId": "HasDescription",
			  "NodeId": "i=8285" }
			,
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=76" }
			
		]
	} );

	uaobjects.push( 
	{ "Type": "UAObject", "BrowseName": "Default XML", 
		"NodeId": "i=7616", 
		"SymbolicName": "DefaultXml"
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasEncoding",
			  "NodeId": "i=7594" }
			,
			{ "ReferenceTypeId": "HasDescription",
			  "NodeId": "i=8291" }
			,
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=76" }
			
		]
	} );

	uaobjects.push( 
	{ "Type": "UAObject", "BrowseName": "Default XML", 
		"NodeId": "i=8913", 
		"SymbolicName": "DefaultXml"
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasEncoding",
			  "NodeId": "i=8912" }
			,
			{ "ReferenceTypeId": "HasDescription",
			  "NodeId": "i=8918" }
			,
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=76" }
			
		]
	} );

	uaobjects.push( 
	{ "Type": "UAObject", "BrowseName": "Default Binary", 
		"NodeId": "i=298", 
		"SymbolicName": "DefaultBinary"
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasEncoding",
			  "NodeId": "i=296" }
			,
			{ "ReferenceTypeId": "HasDescription",
			  "NodeId": "i=7650" }
			,
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=76" }
			
		]
	} );

	uaobjects.push( 
	{ "Type": "UAObject", "BrowseName": "Default Binary", 
		"NodeId": "i=8251", 
		"SymbolicName": "DefaultBinary"
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasEncoding",
			  "NodeId": "i=7594" }
			,
			{ "ReferenceTypeId": "HasDescription",
			  "NodeId": "i=7656" }
			,
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=76" }
			
		]
	} );

	uaobjects.push( 
	{ "Type": "UAObject", "BrowseName": "Default Binary", 
		"NodeId": "i=8917", 
		"SymbolicName": "DefaultBinary"
		,
			
	"References": 
		[ 
			{ "ReferenceTypeId": "HasEncoding",
			  "NodeId": "i=8912" }
			,
			{ "ReferenceTypeId": "HasDescription",
			  "NodeId": "i=8914" }
			,
			{ "ReferenceTypeId": "HasTypeDefinition",
			  "NodeId": "i=76" }
			
		]
	} );



    // summary of definitions
    print( "Types defined in UA Part 03 Type Definition (Opc.Ua.Nodeset2.Part3.xml):" );
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

Test.Execute( { Procedure: this.test000_03 } );