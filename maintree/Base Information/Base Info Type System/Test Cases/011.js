/*  Test prepared by Nathan Pocock (nathan.pocock@opcfoundation.org)
    Description: Walks through the address space checking the TypeDefinitions */

function test000_11() {
// Define our functional variables
var uaobjects = [];
var uadatatypes = [];
var uareferencetypes = [];
var uaobjecttypes = [];
var uavariabletypes = [];
var uavariables = [];
var uamethods = [];

uareferencetypes.push( {"Type": "UAReferenceType",
                          "NodeId": "i=56",
                          "BrowseName": "HasHistoricalConfiguration",
                          "IsAbstract": "",
                          "DisplayName": "HasHistoricalConfiguration",
                          "Description": "The type for a reference to the historical configuration for a data variable.",
                          "InverseName": "HistoricalConfigurationOf",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=44" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "HistoryServerCapabilities", 
                    "NodeId": "i=11192", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11193" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11242" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11273" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11274" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11196" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11197" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11198" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11199" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11200" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11281" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11282" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11283" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11502" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11275" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11201" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2268" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2330" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11193",
		                  "BrowseName": "AccessHistoryDataCapability",
		                  "ParentNodeId": "i=11192",
		                  "DataType": "Boolean",
		                  "DisplayName": "AccessHistoryDataCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11192" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11242",
		                  "BrowseName": "AccessHistoryEventsCapability",
		                  "ParentNodeId": "i=11192",
		                  "DataType": "Boolean",
		                  "DisplayName": "AccessHistoryEventsCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11192" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11273",
		                  "BrowseName": "MaxReturnDataValues",
		                  "ParentNodeId": "i=11192",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxReturnDataValues",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11192" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11274",
		                  "BrowseName": "MaxReturnEventValues",
		                  "ParentNodeId": "i=11192",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxReturnEventValues",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11192" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11196",
		                  "BrowseName": "InsertDataCapability",
		                  "ParentNodeId": "i=11192",
		                  "DataType": "Boolean",
		                  "DisplayName": "InsertDataCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11192" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11197",
		                  "BrowseName": "ReplaceDataCapability",
		                  "ParentNodeId": "i=11192",
		                  "DataType": "Boolean",
		                  "DisplayName": "ReplaceDataCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11192" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11198",
		                  "BrowseName": "UpdateDataCapability",
		                  "ParentNodeId": "i=11192",
		                  "DataType": "Boolean",
		                  "DisplayName": "UpdateDataCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11192" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11199",
		                  "BrowseName": "DeleteRawCapability",
		                  "ParentNodeId": "i=11192",
		                  "DataType": "Boolean",
		                  "DisplayName": "DeleteRawCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11192" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11200",
		                  "BrowseName": "DeleteAtTimeCapability",
		                  "ParentNodeId": "i=11192",
		                  "DataType": "Boolean",
		                  "DisplayName": "DeleteAtTimeCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11192" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11281",
		                  "BrowseName": "InsertEventCapability",
		                  "ParentNodeId": "i=11192",
		                  "DataType": "Boolean",
		                  "DisplayName": "InsertEventCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11192" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11282",
		                  "BrowseName": "ReplaceEventCapability",
		                  "ParentNodeId": "i=11192",
		                  "DataType": "Boolean",
		                  "DisplayName": "ReplaceEventCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11192" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11283",
		                  "BrowseName": "UpdateEventCapability",
		                  "ParentNodeId": "i=11192",
		                  "DataType": "Boolean",
		                  "DisplayName": "UpdateEventCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11192" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11502",
		                  "BrowseName": "DeleteEventCapability",
		                  "ParentNodeId": "i=11192",
		                  "DataType": "Boolean",
		                  "DisplayName": "DeleteEventCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11192" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11275",
		                  "BrowseName": "InsertAnnotationCapability",
		                  "ParentNodeId": "i=11192",
		                  "DataType": "Boolean",
		                  "DisplayName": "InsertAnnotationCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11192" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "AggregateFunctions", 
                    "NodeId": "i=11201", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=61" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11192" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11214",
		                  "BrowseName": "Annotations",
		                  "ParentNodeId": "",
		                  "DataType": "i=891",
		                  "DisplayName": "Annotations",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2318",
                        "BrowseName": "HistoricalDataConfigurationType",
                        "DisplayName": "HistoricalDataConfigurationType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3059" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11876" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2323" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2324" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2325" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2326" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2327" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2328" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11499" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11500" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "AggregateConfiguration", 
                    "NodeId": "i=3059", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11168" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11169" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11170" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11171" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=11187" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2318" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11168",
		                  "BrowseName": "TreatUncertainAsBad",
		                  "ParentNodeId": "i=3059",
		                  "DataType": "Boolean",
		                  "DisplayName": "TreatUncertainAsBad",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3059" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11169",
		                  "BrowseName": "PercentDataBad",
		                  "ParentNodeId": "i=3059",
		                  "DataType": "Byte",
		                  "DisplayName": "PercentDataBad",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3059" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11170",
		                  "BrowseName": "PercentDataGood",
		                  "ParentNodeId": "i=3059",
		                  "DataType": "Byte",
		                  "DisplayName": "PercentDataGood",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3059" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11171",
		                  "BrowseName": "UseSlopedExtrapolation",
		                  "ParentNodeId": "i=3059",
		                  "DataType": "Boolean",
		                  "DisplayName": "UseSlopedExtrapolation",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3059" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "AggregateFunctions", 
                    "NodeId": "i=11876", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=61" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2318" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2323",
		                  "BrowseName": "Stepped",
		                  "ParentNodeId": "i=2318",
		                  "DataType": "Boolean",
		                  "DisplayName": "Stepped",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2318" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2324",
		                  "BrowseName": "Definition",
		                  "ParentNodeId": "i=2318",
		                  "DataType": "String",
		                  "DisplayName": "Definition",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2318" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2325",
		                  "BrowseName": "MaxTimeInterval",
		                  "ParentNodeId": "i=2318",
		                  "DataType": "i=290",
		                  "DisplayName": "MaxTimeInterval",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2318" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2326",
		                  "BrowseName": "MinTimeInterval",
		                  "ParentNodeId": "i=2318",
		                  "DataType": "i=290",
		                  "DisplayName": "MinTimeInterval",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2318" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2327",
		                  "BrowseName": "ExceptionDeviation",
		                  "ParentNodeId": "i=2318",
		                  "DataType": "Double",
		                  "DisplayName": "ExceptionDeviation",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2318" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2328",
		                  "BrowseName": "ExceptionDeviationFormat",
		                  "ParentNodeId": "i=2318",
		                  "DataType": "i=890",
		                  "DisplayName": "ExceptionDeviationFormat",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2318" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11499",
		                  "BrowseName": "StartOfArchive",
		                  "ParentNodeId": "i=2318",
		                  "DataType": "i=294",
		                  "DisplayName": "StartOfArchive",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2318" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11500",
		                  "BrowseName": "StartOfOnlineArchive",
		                  "ParentNodeId": "i=2318",
		                  "DataType": "i=294",
		                  "DisplayName": "StartOfOnlineArchive",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2318" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "HA Configuration", 
                    "NodeId": "i=11202", 
                    "SymbolicName": "HAConfiguration",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11203" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11208" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2318" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "AggregateConfiguration", 
                    "NodeId": "i=11203", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11204" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11205" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11206" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11207" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=11187" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11202" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11204",
		                  "BrowseName": "TreatUncertainAsBad",
		                  "ParentNodeId": "i=11203",
		                  "DataType": "Boolean",
		                  "DisplayName": "TreatUncertainAsBad",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11203" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11205",
		                  "BrowseName": "PercentDataBad",
		                  "ParentNodeId": "i=11203",
		                  "DataType": "Byte",
		                  "DisplayName": "PercentDataBad",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11203" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11206",
		                  "BrowseName": "PercentDataGood",
		                  "ParentNodeId": "i=11203",
		                  "DataType": "Byte",
		                  "DisplayName": "PercentDataGood",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11203" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11207",
		                  "BrowseName": "UseSlopedExtrapolation",
		                  "ParentNodeId": "i=11203",
		                  "DataType": "Boolean",
		                  "DisplayName": "UseSlopedExtrapolation",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11203" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11208",
		                  "BrowseName": "Stepped",
		                  "ParentNodeId": "i=11202",
		                  "DataType": "Boolean",
		                  "DisplayName": "Stepped",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11202" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11215",
		                  "BrowseName": "HistoricalEventFilter",
		                  "ParentNodeId": "",
		                  "DataType": "i=725",
		                  "DisplayName": "HistoricalEventFilter",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2330",
                        "BrowseName": "HistoryServerCapabilitiesType",
                        "DisplayName": "HistoryServerCapabilitiesType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2331" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2332" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11268" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11269" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2334" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2335" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2336" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2337" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2338" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11278" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11279" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11280" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11501" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11270" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=11172" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2331",
		                  "BrowseName": "AccessHistoryDataCapability",
		                  "ParentNodeId": "i=2330",
		                  "DataType": "Boolean",
		                  "DisplayName": "AccessHistoryDataCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2330" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2332",
		                  "BrowseName": "AccessHistoryEventsCapability",
		                  "ParentNodeId": "i=2330",
		                  "DataType": "Boolean",
		                  "DisplayName": "AccessHistoryEventsCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2330" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11268",
		                  "BrowseName": "MaxReturnDataValues",
		                  "ParentNodeId": "i=2330",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxReturnDataValues",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2330" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11269",
		                  "BrowseName": "MaxReturnEventValues",
		                  "ParentNodeId": "i=2330",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxReturnEventValues",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2330" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2334",
		                  "BrowseName": "InsertDataCapability",
		                  "ParentNodeId": "i=2330",
		                  "DataType": "Boolean",
		                  "DisplayName": "InsertDataCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2330" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2335",
		                  "BrowseName": "ReplaceDataCapability",
		                  "ParentNodeId": "i=2330",
		                  "DataType": "Boolean",
		                  "DisplayName": "ReplaceDataCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2330" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2336",
		                  "BrowseName": "UpdateDataCapability",
		                  "ParentNodeId": "i=2330",
		                  "DataType": "Boolean",
		                  "DisplayName": "UpdateDataCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2330" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2337",
		                  "BrowseName": "DeleteRawCapability",
		                  "ParentNodeId": "i=2330",
		                  "DataType": "Boolean",
		                  "DisplayName": "DeleteRawCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2330" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2338",
		                  "BrowseName": "DeleteAtTimeCapability",
		                  "ParentNodeId": "i=2330",
		                  "DataType": "Boolean",
		                  "DisplayName": "DeleteAtTimeCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2330" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11278",
		                  "BrowseName": "InsertEventCapability",
		                  "ParentNodeId": "i=2330",
		                  "DataType": "Boolean",
		                  "DisplayName": "InsertEventCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2330" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11279",
		                  "BrowseName": "ReplaceEventCapability",
		                  "ParentNodeId": "i=2330",
		                  "DataType": "Boolean",
		                  "DisplayName": "ReplaceEventCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2330" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11280",
		                  "BrowseName": "UpdateEventCapability",
		                  "ParentNodeId": "i=2330",
		                  "DataType": "Boolean",
		                  "DisplayName": "UpdateEventCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2330" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11501",
		                  "BrowseName": "DeleteEventCapability",
		                  "ParentNodeId": "i=2330",
		                  "DataType": "Boolean",
		                  "DisplayName": "DeleteEventCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2330" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11270",
		                  "BrowseName": "InsertAnnotationCapability",
		                  "ParentNodeId": "i=2330",
		                  "DataType": "Boolean",
		                  "DisplayName": "InsertAnnotationCapability",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2330" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "AggregateFunctions", 
                    "NodeId": "i=11172", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=61" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2330" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2999",
                        "BrowseName": "AuditHistoryEventUpdateEventType",
                        "DisplayName": "AuditHistoryEventUpdateEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3025" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3028" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3003" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3029" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3030" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2104" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3025",
		                  "BrowseName": "UpdatedNode",
		                  "ParentNodeId": "i=2999",
		                  "DataType": "NodeId",
		                  "DisplayName": "UpdatedNode",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2999" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3028",
		                  "BrowseName": "PerformInsertReplace",
		                  "ParentNodeId": "i=2999",
		                  "DataType": "i=11293",
		                  "DisplayName": "PerformInsertReplace",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2999" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3003",
		                  "BrowseName": "Filter",
		                  "ParentNodeId": "i=2999",
		                  "DataType": "i=725",
		                  "DisplayName": "Filter",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2999" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3029",
		                  "BrowseName": "NewValues",
		                  "ParentNodeId": "i=2999",
		                  "DataType": "i=920",
		                  "DisplayName": "NewValues",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2999" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3030",
		                  "BrowseName": "OldValues",
		                  "ParentNodeId": "i=2999",
		                  "DataType": "i=920",
		                  "DisplayName": "OldValues",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2999" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=3006",
                        "BrowseName": "AuditHistoryValueUpdateEventType",
                        "DisplayName": "AuditHistoryValueUpdateEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3026" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3031" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3032" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3033" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2104" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3026",
		                  "BrowseName": "UpdatedNode",
		                  "ParentNodeId": "i=3006",
		                  "DataType": "NodeId",
		                  "DisplayName": "UpdatedNode",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3006" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3031",
		                  "BrowseName": "PerformInsertReplace",
		                  "ParentNodeId": "i=3006",
		                  "DataType": "i=11293",
		                  "DisplayName": "PerformInsertReplace",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3006" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3032",
		                  "BrowseName": "NewValues",
		                  "ParentNodeId": "i=3006",
		                  "DataType": "i=23",
		                  "DisplayName": "NewValues",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3006" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3033",
		                  "BrowseName": "OldValues",
		                  "ParentNodeId": "i=3006",
		                  "DataType": "i=23",
		                  "DisplayName": "OldValues",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3006" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=3012",
                        "BrowseName": "AuditHistoryDeleteEventType",
                        "DisplayName": "AuditHistoryDeleteEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3027" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2104" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3027",
		                  "BrowseName": "UpdatedNode",
		                  "ParentNodeId": "i=3012",
		                  "DataType": "NodeId",
		                  "DisplayName": "UpdatedNode",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3012" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=3014",
                        "BrowseName": "AuditHistoryRawModifyDeleteEventType",
                        "DisplayName": "AuditHistoryRawModifyDeleteEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3015" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3016" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3017" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3034" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=3012" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3015",
		                  "BrowseName": "IsDeleteModified",
		                  "ParentNodeId": "i=3014",
		                  "DataType": "Boolean",
		                  "DisplayName": "IsDeleteModified",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3014" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3016",
		                  "BrowseName": "StartTime",
		                  "ParentNodeId": "i=3014",
		                  "DataType": "i=294",
		                  "DisplayName": "StartTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3014" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3017",
		                  "BrowseName": "EndTime",
		                  "ParentNodeId": "i=3014",
		                  "DataType": "i=294",
		                  "DisplayName": "EndTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3014" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3034",
		                  "BrowseName": "OldValues",
		                  "ParentNodeId": "i=3014",
		                  "DataType": "i=23",
		                  "DisplayName": "OldValues",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3014" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=3019",
                        "BrowseName": "AuditHistoryAtTimeDeleteEventType",
                        "DisplayName": "AuditHistoryAtTimeDeleteEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3020" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3021" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=3012" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3020",
		                  "BrowseName": "ReqTimes",
		                  "ParentNodeId": "i=3019",
		                  "DataType": "i=294",
		                  "DisplayName": "ReqTimes",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3019" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3021",
		                  "BrowseName": "OldValues",
		                  "ParentNodeId": "i=3019",
		                  "DataType": "i=23",
		                  "DisplayName": "OldValues",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3019" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=3022",
                        "BrowseName": "AuditHistoryEventDeleteEventType",
                        "DisplayName": "AuditHistoryEventDeleteEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3023" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3024" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=3012" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3023",
		                  "BrowseName": "EventIds",
		                  "ParentNodeId": "i=3022",
		                  "DataType": "ByteString",
		                  "DisplayName": "EventIds",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3022" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3024",
		                  "BrowseName": "OldValues",
		                  "ParentNodeId": "i=3022",
		                  "DataType": "i=920",
		                  "DisplayName": "OldValues",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3022" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=891",
                      "BrowseName": "Annotation",
                      "DisplayName": "Annotation",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=890",
                      "BrowseName": "ExceptionDeviationFormat",
                      "DisplayName": "ExceptionDeviationFormat",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=7614" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=29" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=7614",
		                  "BrowseName": "EnumStrings",
		                  "ParentNodeId": "i=890",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "EnumStrings",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=890" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=892", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=891" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8879" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=893", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=891" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8244" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );


    // summary of definitions
    print( "Types defined in UA Part 11 Type Definition (Opc.Ua.Nodeset2.Part11.xml):" );
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

Test.Execute( { Procedure: this.test000_11 } );