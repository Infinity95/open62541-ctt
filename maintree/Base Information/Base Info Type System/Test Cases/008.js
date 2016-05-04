/*  Test prepared by Nathan Pocock (nathan.pocock@opcfoundation.org)
    Description: Walks through the address space checking the TypeDefinitions */

function test000_08() {
// Define our functional variables
var uaobjects = [];
var uadatatypes = [];
var uareferencetypes = [];
var uaobjecttypes = [];
var uavariabletypes = [];
var uavariables = [];
var uamethods = [];

uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2365",
                          "BrowseName": "DataItemType",
                          "ValueRank": "-2",
                          "DisplayName": "DataItemType",
                          "Description": "A variable that contains live automation data.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2366" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2367" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2366",
		                  "BrowseName": "Definition",
		                  "ParentNodeId": "i=2365",
		                  "DataType": "String",
		                  "DisplayName": "Definition",
		                  "Description": "A vendor-specific, human readable string that specifies how the value of this DataItem is calculated.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2365" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2367",
		                  "BrowseName": "ValuePrecision",
		                  "ParentNodeId": "i=2365",
		                  "DataType": "Double",
		                  "DisplayName": "ValuePrecision",
		                  "Description": "The maximum precision that the server can maintain for the item based on restrictions in the target environment.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2365" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2368",
                          "BrowseName": "AnalogItemType",
                          "ValueRank": "-2",
                          "DisplayName": "AnalogItemType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2370" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2369" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2371" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2365" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2370",
		                  "BrowseName": "InstrumentRange",
		                  "ParentNodeId": "i=2368",
		                  "DataType": "i=884",
		                  "DisplayName": "InstrumentRange",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2368" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2369",
		                  "BrowseName": "EURange",
		                  "ParentNodeId": "i=2368",
		                  "DataType": "i=884",
		                  "DisplayName": "EURange",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2368" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2371",
		                  "BrowseName": "EngineeringUnits",
		                  "ParentNodeId": "i=2368",
		                  "DataType": "i=887",
		                  "DisplayName": "EngineeringUnits",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2368" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2372",
                          "BrowseName": "DiscreteItemType",
                          "ValueRank": "-2",
                          "DisplayName": "DiscreteItemType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2365" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2373",
                          "BrowseName": "TwoStateDiscreteType",
                          "ValueRank": "-2",
                          "DisplayName": "TwoStateDiscreteType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2374" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2375" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2372" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2374",
		                  "BrowseName": "FalseState",
		                  "ParentNodeId": "i=2373",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "FalseState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2373" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2375",
		                  "BrowseName": "TrueState",
		                  "ParentNodeId": "i=2373",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "TrueState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2373" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2376",
                          "BrowseName": "MultiStateDiscreteType",
                          "ValueRank": "-2",
                          "DisplayName": "MultiStateDiscreteType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2377" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2372" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2377",
		                  "BrowseName": "EnumStrings",
		                  "ParentNodeId": "i=2376",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "EnumStrings",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2376" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=11238",
                          "BrowseName": "MultiStateValueDiscreteType",
                          "ValueRank": "-2",
                          "DisplayName": "MultiStateValueDiscreteType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11241" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11461" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2372" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11241",
		                  "BrowseName": "EnumValues",
		                  "ParentNodeId": "i=11238",
		                  "DataType": "i=7594",
		                  "DisplayName": "EnumValues",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11238" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11461",
		                  "BrowseName": "ValueAsText",
		                  "ParentNodeId": "i=11238",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "ValueAsText",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11238" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=12021",
                          "BrowseName": "ArrayItemType",
                          "ValueRank": "0",
                          "DisplayName": "ArrayItemType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12024" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12025" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12026" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12027" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12028" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2365" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12024",
		                  "BrowseName": "InstrumentRange",
		                  "ParentNodeId": "i=12021",
		                  "DataType": "i=884",
		                  "DisplayName": "InstrumentRange",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12025",
		                  "BrowseName": "EURange",
		                  "ParentNodeId": "i=12021",
		                  "DataType": "i=884",
		                  "DisplayName": "EURange",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12026",
		                  "BrowseName": "EngineeringUnits",
		                  "ParentNodeId": "i=12021",
		                  "DataType": "i=887",
		                  "DisplayName": "EngineeringUnits",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12027",
		                  "BrowseName": "Title",
		                  "ParentNodeId": "i=12021",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "Title",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12028",
		                  "BrowseName": "AxisScaleType",
		                  "ParentNodeId": "i=12021",
		                  "DataType": "i=12077",
		                  "DisplayName": "AxisScaleType",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12021" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=12029",
                          "BrowseName": "YArrayItemType",
                          "ValueRank": "1",
                          "DisplayName": "YArrayItemType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12037" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=12021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12037",
		                  "BrowseName": "XAxisDefinition",
		                  "ParentNodeId": "i=12029",
		                  "DataType": "i=12079",
		                  "DisplayName": "XAxisDefinition",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12029" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=12038",
                          "BrowseName": "XYArrayItemType",
                          "ValueRank": "1",
                          "DisplayName": "XYArrayItemType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12046" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=12021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12046",
		                  "BrowseName": "XAxisDefinition",
		                  "ParentNodeId": "i=12038",
		                  "DataType": "i=12079",
		                  "DisplayName": "XAxisDefinition",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12038" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=12047",
                          "BrowseName": "ImageItemType",
                          "ValueRank": "2",
                          "DisplayName": "ImageItemType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12055" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12056" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=12021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12055",
		                  "BrowseName": "XAxisDefinition",
		                  "ParentNodeId": "i=12047",
		                  "DataType": "i=12079",
		                  "DisplayName": "XAxisDefinition",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12047" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12056",
		                  "BrowseName": "YAxisDefinition",
		                  "ParentNodeId": "i=12047",
		                  "DataType": "i=12079",
		                  "DisplayName": "YAxisDefinition",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12047" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=12057",
                          "BrowseName": "CubeItemType",
                          "ValueRank": "3",
                          "DisplayName": "CubeItemType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12065" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12066" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12067" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=12021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12065",
		                  "BrowseName": "XAxisDefinition",
		                  "ParentNodeId": "i=12057",
		                  "DataType": "i=12079",
		                  "DisplayName": "XAxisDefinition",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12057" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12066",
		                  "BrowseName": "YAxisDefinition",
		                  "ParentNodeId": "i=12057",
		                  "DataType": "i=12079",
		                  "DisplayName": "YAxisDefinition",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12057" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12067",
		                  "BrowseName": "ZAxisDefinition",
		                  "ParentNodeId": "i=12057",
		                  "DataType": "i=12079",
		                  "DisplayName": "ZAxisDefinition",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12057" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=12068",
                          "BrowseName": "NDimensionArrayItemType",
                          "ValueRank": "0",
                          "DisplayName": "NDimensionArrayItemType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12076" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=12021" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12076",
		                  "BrowseName": "AxisDefinition",
		                  "ParentNodeId": "i=12068",
		                  "DataType": "i=12079",
		                  "DisplayName": "AxisDefinition",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12068" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=884",
                      "BrowseName": "Range",
                      "DisplayName": "Range",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=887",
                      "BrowseName": "EUInformation",
                      "DisplayName": "EUInformation",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=12077",
                      "BrowseName": "AxisScaleEnumeration",
                      "DisplayName": "AxisScaleEnumeration",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12078" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=29" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=12078",
		                  "BrowseName": "EnumStrings",
		                  "ParentNodeId": "i=12077",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "EnumStrings",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=12077" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=12171",
                      "BrowseName": "ComplexNumberType",
                      "DisplayName": "ComplexNumberType",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=12172",
                      "BrowseName": "DoubleComplexNumberType",
                      "DisplayName": "DoubleComplexNumberType",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=12079",
                      "BrowseName": "AxisInformation",
                      "DisplayName": "AxisInformation",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=12080",
                      "BrowseName": "XVType",
                      "DisplayName": "XVType",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=885", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=884" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8873" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=888", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=887" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8876" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=12173", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=12171" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=12175" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=12174", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=12172" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=12178" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=12081", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=12079" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=12083" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=12082", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=12080" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=12086" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=886", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=884" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8238" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=889", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=887" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8241" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=12181", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=12171" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=12183" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=12182", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=12172" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=12186" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=12089", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=12079" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=12091" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=12090", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=12080" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=12094" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );


    

    // summary of definitions
    print( "Types defined in UA Part 08 Type Definition (Opc.Ua.Nodeset2.Part8.xml):" );
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

Test.Execute( { Procedure: this.test000_08 } );