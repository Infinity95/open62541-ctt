/*  Test prepared by Nathan Pocock (nathan.pocock@opcfoundation.org)
    Description: Walks through the address space checking the TypeDefinitions */

function test000_09() {
// Define our functional variables
var uaobjects = [];
var uadatatypes = [];
var uareferencetypes = [];
var uaobjecttypes = [];
var uavariabletypes = [];
var uavariables = [];
var uamethods = [];

 
  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=8995",
                          "BrowseName": "TwoStateVariableType",
                          "ValueRank": "",
                          "DisplayName": "TwoStateVariableType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=8996" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9000" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9001" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11110" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11111" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2755" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8996",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=8995",
		                  "DataType": "Boolean",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=8995" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9000",
		                  "BrowseName": "TransitionTime",
		                  "ParentNodeId": "i=8995",
		                  "DataType": "i=294",
		                  "DisplayName": "TransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=8995" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9001",
		                  "BrowseName": "EffectiveTransitionTime",
		                  "ParentNodeId": "i=8995",
		                  "DataType": "i=294",
		                  "DisplayName": "EffectiveTransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=8995" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11110",
		                  "BrowseName": "TrueState",
		                  "ParentNodeId": "i=8995",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "TrueState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=8995" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11111",
		                  "BrowseName": "FalseState",
		                  "ParentNodeId": "i=8995",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "FalseState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=8995" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=9002",
                          "BrowseName": "ConditionVariableType",
                          "ValueRank": "-2",
                          "DisplayName": "ConditionVariableType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9003" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9003",
		                  "BrowseName": "SourceTimestamp",
		                  "ParentNodeId": "i=9002",
		                  "DataType": "i=294",
		                  "DisplayName": "SourceTimestamp",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9002" } ]
	} );

  uareferencetypes.push( {"Type": "UAReferenceType",
                          "NodeId": "i=9004",
                          "BrowseName": "HasTrueSubState",
                          "IsAbstract": "",
                          "DisplayName": "HasTrueSubState",
                          "Description": "",
                          "InverseName": "IsTrueSubStateOf",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=32" } ]
	} );

  uareferencetypes.push( {"Type": "UAReferenceType",
                          "NodeId": "i=9005",
                          "BrowseName": "HasFalseSubState",
                          "IsAbstract": "",
                          "DisplayName": "HasFalseSubState",
                          "Description": "",
                          "InverseName": "IsFalseSubStateOf",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=32" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2782",
                        "BrowseName": "ConditionType",
                        "DisplayName": "ConditionType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11112" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11113" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9009" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9010" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3874" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9011" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9020" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9022" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9024" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9026" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9028" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9027" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9029" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3875" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2041" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11112",
		                  "BrowseName": "ConditionClassId",
		                  "ParentNodeId": "i=2782",
		                  "DataType": "NodeId",
		                  "DisplayName": "ConditionClassId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2782" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11113",
		                  "BrowseName": "ConditionClassName",
		                  "ParentNodeId": "i=2782",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "ConditionClassName",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2782" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9009",
		                  "BrowseName": "ConditionName",
		                  "ParentNodeId": "i=2782",
		                  "DataType": "String",
		                  "DisplayName": "ConditionName",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2782" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9010",
		                  "BrowseName": "BranchId",
		                  "ParentNodeId": "i=2782",
		                  "DataType": "NodeId",
		                  "DisplayName": "BranchId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2782" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3874",
		                  "BrowseName": "Retain",
		                  "ParentNodeId": "i=2782",
		                  "DataType": "Boolean",
		                  "DisplayName": "Retain",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2782" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9011",
		                  "BrowseName": "EnabledState",
		                  "ParentNodeId": "i=2782",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "EnabledState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9012" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9015" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9016" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9017" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=8995" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2782" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9012",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=9011",
		                  "DataType": "Boolean",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9011" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9015",
		                  "BrowseName": "EffectiveDisplayName",
		                  "ParentNodeId": "i=9011",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "EffectiveDisplayName",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9011" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9016",
		                  "BrowseName": "TransitionTime",
		                  "ParentNodeId": "i=9011",
		                  "DataType": "i=294",
		                  "DisplayName": "TransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9011" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9017",
		                  "BrowseName": "EffectiveTransitionTime",
		                  "ParentNodeId": "i=9011",
		                  "DataType": "i=294",
		                  "DisplayName": "EffectiveTransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9011" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9020",
		                  "BrowseName": "Quality",
		                  "ParentNodeId": "i=2782",
		                  "DataType": "StatusCode",
		                  "DisplayName": "Quality",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9021" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=9002" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2782" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9021",
		                  "BrowseName": "SourceTimestamp",
		                  "ParentNodeId": "i=9020",
		                  "DataType": "i=294",
		                  "DisplayName": "SourceTimestamp",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9020" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9022",
		                  "BrowseName": "LastSeverity",
		                  "ParentNodeId": "i=2782",
		                  "DataType": "UInt16",
		                  "DisplayName": "LastSeverity",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9023" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=9002" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2782" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9023",
		                  "BrowseName": "SourceTimestamp",
		                  "ParentNodeId": "i=9022",
		                  "DataType": "i=294",
		                  "DisplayName": "SourceTimestamp",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9022" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9024",
		                  "BrowseName": "Comment",
		                  "ParentNodeId": "i=2782",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "Comment",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9025" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=9002" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2782" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9025",
		                  "BrowseName": "SourceTimestamp",
		                  "ParentNodeId": "i=9024",
		                  "DataType": "i=294",
		                  "DisplayName": "SourceTimestamp",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9024" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9026",
		                  "BrowseName": "ClientUserId",
		                  "ParentNodeId": "i=2782",
		                  "DataType": "String",
		                  "DisplayName": "ClientUserId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2782" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=9028",
		                "BrowseName": "Disable",
		                "ParentNodeId": "i=2782",
		                "DisplayName": "Disable",
		
                      "References": [ 
                          { "ReferenceTypeId": "i=3065", "NodeId": "i=2803" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2782" } ]
		} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=9027",
		                "BrowseName": "Enable",
		                "ParentNodeId": "i=2782",
		                "DisplayName": "Enable",
		
                      "References": [ 
                          { "ReferenceTypeId": "i=3065", "NodeId": "i=2803" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2782" } ]
		} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=9029",
		                "BrowseName": "AddComment",
		                "ParentNodeId": "i=2782",
		                "DisplayName": "AddComment",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9030" },
                          { "ReferenceTypeId": "i=3065", "NodeId": "i=2829" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2782" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9030",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=9029",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9029" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=3875",
		                "BrowseName": "ConditionRefresh",
		                "ParentNodeId": "i=2782",
		                "DisplayName": "ConditionRefresh",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3876" },
                          { "ReferenceTypeId": "i=3065", "NodeId": "i=2787" },
                          { "ReferenceTypeId": "i=3065", "NodeId": "i=2788" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2782" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3876",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=3875",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3875" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2830",
                        "BrowseName": "DialogConditionType",
                        "DisplayName": "DialogConditionType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9035" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9055" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2831" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9064" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9065" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9066" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9067" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9068" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9069" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2782" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9035",
		                  "BrowseName": "EnabledState",
		                  "ParentNodeId": "i=2830",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "EnabledState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9036" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=9055" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=8995" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2830" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9036",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=9035",
		                  "DataType": "Boolean",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9035" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9055",
		                  "BrowseName": "DialogState",
		                  "ParentNodeId": "i=2830",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "DialogState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9056" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9060" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=9035" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=8995" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2830" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9056",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=9055",
		                  "DataType": "Boolean",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9055" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9060",
		                  "BrowseName": "TransitionTime",
		                  "ParentNodeId": "i=9055",
		                  "DataType": "i=294",
		                  "DisplayName": "TransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9055" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2831",
		                  "BrowseName": "Prompt",
		                  "ParentNodeId": "i=2830",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "Prompt",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2830" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9064",
		                  "BrowseName": "ResponseOptionSet",
		                  "ParentNodeId": "i=2830",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "ResponseOptionSet",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2830" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9065",
		                  "BrowseName": "DefaultResponse",
		                  "ParentNodeId": "i=2830",
		                  "DataType": "Int32",
		                  "DisplayName": "DefaultResponse",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2830" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9066",
		                  "BrowseName": "OkResponse",
		                  "ParentNodeId": "i=2830",
		                  "DataType": "Int32",
		                  "DisplayName": "OkResponse",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2830" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9067",
		                  "BrowseName": "CancelResponse",
		                  "ParentNodeId": "i=2830",
		                  "DataType": "Int32",
		                  "DisplayName": "CancelResponse",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2830" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9068",
		                  "BrowseName": "LastResponse",
		                  "ParentNodeId": "i=2830",
		                  "DataType": "Int32",
		                  "DisplayName": "LastResponse",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2830" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=9069",
		                "BrowseName": "Respond",
		                "ParentNodeId": "i=2830",
		                "DisplayName": "Respond",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9070" },
                          { "ReferenceTypeId": "i=3065", "NodeId": "i=8927" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2830" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9070",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=9069",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9069" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2881",
                        "BrowseName": "AcknowledgeableConditionType",
                        "DisplayName": "AcknowledgeableConditionType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9073" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9093" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9102" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9111" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9113" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2782" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9073",
		                  "BrowseName": "EnabledState",
		                  "ParentNodeId": "i=2881",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "EnabledState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9074" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=9093" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=9102" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=8995" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2881" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9074",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=9073",
		                  "DataType": "Boolean",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9073" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9093",
		                  "BrowseName": "AckedState",
		                  "ParentNodeId": "i=2881",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "AckedState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9094" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9098" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=9073" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=8995" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2881" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9094",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=9093",
		                  "DataType": "Boolean",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9093" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9098",
		                  "BrowseName": "TransitionTime",
		                  "ParentNodeId": "i=9093",
		                  "DataType": "i=294",
		                  "DisplayName": "TransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9093" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9102",
		                  "BrowseName": "ConfirmedState",
		                  "ParentNodeId": "i=2881",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "ConfirmedState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9103" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9107" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=9073" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=8995" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2881" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9103",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=9102",
		                  "DataType": "Boolean",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9102" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9107",
		                  "BrowseName": "TransitionTime",
		                  "ParentNodeId": "i=9102",
		                  "DataType": "i=294",
		                  "DisplayName": "TransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9102" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=9111",
		                "BrowseName": "Acknowledge",
		                "ParentNodeId": "i=2881",
		                "DisplayName": "Acknowledge",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9112" },
                          { "ReferenceTypeId": "i=3065", "NodeId": "i=8944" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2881" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9112",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=9111",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9111" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=9113",
		                "BrowseName": "Confirm",
		                "ParentNodeId": "i=2881",
		                "DisplayName": "Confirm",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9114" },
                          { "ReferenceTypeId": "i=3065", "NodeId": "i=8961" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2881" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9114",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=9113",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9113" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2915",
                        "BrowseName": "AlarmConditionType",
                        "DisplayName": "AlarmConditionType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9118" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9160" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11120" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9169" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9178" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9215" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9216" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2881" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9118",
		                  "BrowseName": "EnabledState",
		                  "ParentNodeId": "i=2915",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "EnabledState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9119" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=9160" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=9169" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=9178" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=8995" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2915" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9119",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=9118",
		                  "DataType": "Boolean",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9118" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9160",
		                  "BrowseName": "ActiveState",
		                  "ParentNodeId": "i=2915",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "ActiveState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9161" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9164" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9165" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9166" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=9118" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=8995" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2915" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9161",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=9160",
		                  "DataType": "Boolean",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9160" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9164",
		                  "BrowseName": "EffectiveDisplayName",
		                  "ParentNodeId": "i=9160",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "EffectiveDisplayName",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9160" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9165",
		                  "BrowseName": "TransitionTime",
		                  "ParentNodeId": "i=9160",
		                  "DataType": "i=294",
		                  "DisplayName": "TransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9160" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9166",
		                  "BrowseName": "EffectiveTransitionTime",
		                  "ParentNodeId": "i=9160",
		                  "DataType": "i=294",
		                  "DisplayName": "EffectiveTransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9160" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11120",
		                  "BrowseName": "InputNode",
		                  "ParentNodeId": "i=2915",
		                  "DataType": "NodeId",
		                  "DisplayName": "InputNode",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2915" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9169",
		                  "BrowseName": "SuppressedState",
		                  "ParentNodeId": "i=2915",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "SuppressedState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9170" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9174" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=9118" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=8995" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2915" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9170",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=9169",
		                  "DataType": "Boolean",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9169" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9174",
		                  "BrowseName": "TransitionTime",
		                  "ParentNodeId": "i=9169",
		                  "DataType": "i=294",
		                  "DisplayName": "TransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9169" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "ShelvingState", 
                    "NodeId": "i=9178", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9179" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9184" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9189" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9211" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9212" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9213" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=9118" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2929" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2915" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9179",
		                  "BrowseName": "CurrentState",
		                  "ParentNodeId": "i=9178",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "CurrentState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9180" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2760" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9178" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9180",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=9179",
		                  "DataType": "NodeId",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9179" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9184",
		                  "BrowseName": "LastTransition",
		                  "ParentNodeId": "i=9178",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "LastTransition",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9185" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9188" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2767" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9178" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9185",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=9184",
		                  "DataType": "NodeId",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9184" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9188",
		                  "BrowseName": "TransitionTime",
		                  "ParentNodeId": "i=9184",
		                  "DataType": "i=294",
		                  "DisplayName": "TransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9184" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9189",
		                  "BrowseName": "UnshelveTime",
		                  "ParentNodeId": "i=9178",
		                  "DataType": "i=290",
		                  "DisplayName": "UnshelveTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9178" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=9211",
		                "BrowseName": "Unshelve",
		                "ParentNodeId": "i=9178",
		                "DisplayName": "Unshelve",
		
                      "References": [ 
                          { "ReferenceTypeId": "i=3065", "NodeId": "i=11093" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9178" } ]
		} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=9212",
		                "BrowseName": "OneShotShelve",
		                "ParentNodeId": "i=9178",
		                "DisplayName": "OneShotShelve",
		
                      "References": [ 
                          { "ReferenceTypeId": "i=3065", "NodeId": "i=11093" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9178" } ]
		} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=9213",
		                "BrowseName": "TimedShelve",
		                "ParentNodeId": "i=9178",
		                "DisplayName": "TimedShelve",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9214" },
                          { "ReferenceTypeId": "i=3065", "NodeId": "i=11093" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9178" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9214",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=9213",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9213" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9215",
		                  "BrowseName": "SuppressedOrShelved",
		                  "ParentNodeId": "i=2915",
		                  "DataType": "Boolean",
		                  "DisplayName": "SuppressedOrShelved",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2915" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9216",
		                  "BrowseName": "MaxTimeShelved",
		                  "ParentNodeId": "i=2915",
		                  "DataType": "i=290",
		                  "DisplayName": "MaxTimeShelved",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2915" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2929",
                        "BrowseName": "ShelvedStateMachineType",
                        "DisplayName": "ShelvedStateMachineType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9115" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2930" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2932" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2933" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2935" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2936" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2940" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2942" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2943" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2945" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2947" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2948" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2949" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2771" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9115",
		                  "BrowseName": "UnshelveTime",
		                  "ParentNodeId": "i=2929",
		                  "DataType": "i=290",
		                  "DisplayName": "UnshelveTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2929" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Unshelved", 
                    "NodeId": "i=2930", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=6098" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2935" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2936" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2940" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2943" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2307" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2929" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=6098",
		                  "BrowseName": "StateNumber",
		                  "ParentNodeId": "i=2930",
		                  "DataType": "UInt32",
		                  "DisplayName": "StateNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2930" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "TimedShelved", 
                    "NodeId": "i=2932", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=6100" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2935" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2940" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2942" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2945" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2307" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2929" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=6100",
		                  "BrowseName": "StateNumber",
		                  "ParentNodeId": "i=2932",
		                  "DataType": "UInt32",
		                  "DisplayName": "StateNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2932" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "OneShotShelved", 
                    "NodeId": "i=2933", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=6101" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2936" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2942" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2943" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2945" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2307" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2929" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=6101",
		                  "BrowseName": "StateNumber",
		                  "ParentNodeId": "i=2933",
		                  "DataType": "UInt32",
		                  "DisplayName": "StateNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2933" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "UnshelvedToTimedShelved", 
                    "NodeId": "i=2935", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11322" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2930" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2932" },
                          { "ReferenceTypeId": "i=54", "NodeId": "i=2915" },
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2949" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2310" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2929" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11322",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=2935",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2935" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "UnshelvedToOneShotShelved", 
                    "NodeId": "i=2936", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11323" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2930" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2933" },
                          { "ReferenceTypeId": "i=54", "NodeId": "i=2915" },
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2948" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2310" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2929" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11323",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=2936",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2936" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "TimedShelvedToUnshelved", 
                    "NodeId": "i=2940", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11324" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2932" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2930" },
                          { "ReferenceTypeId": "i=54", "NodeId": "i=2915" },
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2947" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2310" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2929" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11324",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=2940",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2940" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "TimedShelvedToOneShotShelved", 
                    "NodeId": "i=2942", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11325" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2932" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2933" },
                          { "ReferenceTypeId": "i=54", "NodeId": "i=2915" },
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2948" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2310" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2929" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11325",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=2942",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2942" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "OneShotShelvedToUnshelved", 
                    "NodeId": "i=2943", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11326" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2933" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2930" },
                          { "ReferenceTypeId": "i=54", "NodeId": "i=2915" },
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2947" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2310" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2929" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11326",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=2943",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2943" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "OneShotShelvedToTimedShelved", 
                    "NodeId": "i=2945", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11327" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2933" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2932" },
                          { "ReferenceTypeId": "i=54", "NodeId": "i=2915" },
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2949" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2310" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2929" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11327",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=2945",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2945" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=2947",
		                "BrowseName": "Unshelve",
		                "ParentNodeId": "i=2929",
		                "DisplayName": "Unshelve",
		
                      "References": [ 
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2940" },
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2943" },
                          { "ReferenceTypeId": "i=3065", "NodeId": "i=11093" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2929" } ]
		} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=2948",
		                "BrowseName": "OneShotShelve",
		                "ParentNodeId": "i=2929",
		                "DisplayName": "OneShotShelve",
		
                      "References": [ 
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2936" },
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2942" },
                          { "ReferenceTypeId": "i=3065", "NodeId": "i=11093" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2929" } ]
		} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=2949",
		                "BrowseName": "TimedShelve",
		                "ParentNodeId": "i=2929",
		                "DisplayName": "TimedShelve",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2991" },
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2935" },
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2945" },
                          { "ReferenceTypeId": "i=3065", "NodeId": "i=11093" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2929" } ]
		} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2991",
		                  "BrowseName": "InputArguments",
		                  "ParentNodeId": "i=2949",
		                  "DataType": "i=296",
		                  "DisplayName": "InputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2949" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2955",
                        "BrowseName": "LimitAlarmType",
                        "DisplayName": "LimitAlarmType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11124" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11125" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11126" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11127" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2915" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11124",
		                  "BrowseName": "HighHighLimit",
		                  "ParentNodeId": "i=2955",
		                  "DataType": "Double",
		                  "DisplayName": "HighHighLimit",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2955" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11125",
		                  "BrowseName": "HighLimit",
		                  "ParentNodeId": "i=2955",
		                  "DataType": "Double",
		                  "DisplayName": "HighLimit",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2955" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11126",
		                  "BrowseName": "LowLimit",
		                  "ParentNodeId": "i=2955",
		                  "DataType": "Double",
		                  "DisplayName": "LowLimit",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2955" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11127",
		                  "BrowseName": "LowLowLimit",
		                  "ParentNodeId": "i=2955",
		                  "DataType": "Double",
		                  "DisplayName": "LowLowLimit",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2955" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=9318",
                        "BrowseName": "ExclusiveLimitStateMachineType",
                        "DisplayName": "ExclusiveLimitStateMachineType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9329" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9331" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9333" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9335" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9337" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9338" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9339" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9340" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2771" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "HighHigh", 
                    "NodeId": "i=9329", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9330" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=9339" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=9340" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2307" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9318" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9330",
		                  "BrowseName": "StateNumber",
		                  "ParentNodeId": "i=9329",
		                  "DataType": "UInt32",
		                  "DisplayName": "StateNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9329" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "High", 
                    "NodeId": "i=9331", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9332" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=9339" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=9340" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2307" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9318" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9332",
		                  "BrowseName": "StateNumber",
		                  "ParentNodeId": "i=9331",
		                  "DataType": "UInt32",
		                  "DisplayName": "StateNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9331" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Low", 
                    "NodeId": "i=9333", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9334" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=9337" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=9338" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2307" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9318" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9334",
		                  "BrowseName": "StateNumber",
		                  "ParentNodeId": "i=9333",
		                  "DataType": "UInt32",
		                  "DisplayName": "StateNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9333" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "LowLow", 
                    "NodeId": "i=9335", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9336" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=9337" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=9338" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2307" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9318" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9336",
		                  "BrowseName": "StateNumber",
		                  "ParentNodeId": "i=9335",
		                  "DataType": "UInt32",
		                  "DisplayName": "StateNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9335" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "LowLowToLow", 
                    "NodeId": "i=9337", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11340" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=9335" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=9333" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2310" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9318" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11340",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=9337",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9337" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "LowToLowLow", 
                    "NodeId": "i=9338", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11341" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=9333" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=9335" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2310" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9318" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11341",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=9338",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9338" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "HighHighToHigh", 
                    "NodeId": "i=9339", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11342" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=9329" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=9331" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2310" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9318" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11342",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=9339",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9339" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "HighToHighHigh", 
                    "NodeId": "i=9340", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11343" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=9331" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=9329" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2310" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9318" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11343",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=9340",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9340" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=9341",
                        "BrowseName": "ExclusiveLimitAlarmType",
                        "DisplayName": "ExclusiveLimitAlarmType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9398" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9455" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2955" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9398",
		                  "BrowseName": "ActiveState",
		                  "ParentNodeId": "i=9341",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "ActiveState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9399" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=9455" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=8995" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9341" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9399",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=9398",
		                  "DataType": "Boolean",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9398" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "LimitState", 
                    "NodeId": "i=9455", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9456" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9461" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=9398" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=9318" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9341" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9456",
		                  "BrowseName": "CurrentState",
		                  "ParentNodeId": "i=9455",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "CurrentState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9457" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2760" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9455" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9457",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=9456",
		                  "DataType": "NodeId",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9456" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9461",
		                  "BrowseName": "LastTransition",
		                  "ParentNodeId": "i=9455",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "LastTransition",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9462" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9465" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2767" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9455" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9462",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=9461",
		                  "DataType": "NodeId",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9461" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9465",
		                  "BrowseName": "TransitionTime",
		                  "ParentNodeId": "i=9461",
		                  "DataType": "i=294",
		                  "DisplayName": "TransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9461" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=9906",
                        "BrowseName": "NonExclusiveLimitAlarmType",
                        "DisplayName": "NonExclusiveLimitAlarmType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9963" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=10020" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=10029" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=10038" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=10047" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2955" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9963",
		                  "BrowseName": "ActiveState",
		                  "ParentNodeId": "i=9906",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "ActiveState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9964" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=10020" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=10029" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=10038" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=10047" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=8995" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9906" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9964",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=9963",
		                  "DataType": "Boolean",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9963" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=10020",
		                  "BrowseName": "HighHighState",
		                  "ParentNodeId": "i=9906",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "HighHighState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=10021" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=10025" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=9963" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=8995" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9906" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=10021",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=10020",
		                  "DataType": "Boolean",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=10020" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=10025",
		                  "BrowseName": "TransitionTime",
		                  "ParentNodeId": "i=10020",
		                  "DataType": "i=294",
		                  "DisplayName": "TransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=10020" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=10029",
		                  "BrowseName": "HighState",
		                  "ParentNodeId": "i=9906",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "HighState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=10030" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=10034" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=9963" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=8995" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9906" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=10030",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=10029",
		                  "DataType": "Boolean",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=10029" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=10034",
		                  "BrowseName": "TransitionTime",
		                  "ParentNodeId": "i=10029",
		                  "DataType": "i=294",
		                  "DisplayName": "TransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=10029" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=10038",
		                  "BrowseName": "LowState",
		                  "ParentNodeId": "i=9906",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "LowState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=10039" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=10043" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=9963" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=8995" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9906" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=10039",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=10038",
		                  "DataType": "Boolean",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=10038" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=10043",
		                  "BrowseName": "TransitionTime",
		                  "ParentNodeId": "i=10038",
		                  "DataType": "i=294",
		                  "DisplayName": "TransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=10038" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=10047",
		                  "BrowseName": "LowLowState",
		                  "ParentNodeId": "i=9906",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "LowLowState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=10048" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=10052" },
                          { "ReferenceTypeId": "i=9004", "NodeId": "i=9963" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=8995" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=9906" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=10048",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=10047",
		                  "DataType": "Boolean",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=10047" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=10052",
		                  "BrowseName": "TransitionTime",
		                  "ParentNodeId": "i=10047",
		                  "DataType": "i=294",
		                  "DisplayName": "TransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=10047" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=10060",
                        "BrowseName": "NonExclusiveLevelAlarmType",
                        "DisplayName": "NonExclusiveLevelAlarmType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=9906" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=9482",
                        "BrowseName": "ExclusiveLevelAlarmType",
                        "DisplayName": "ExclusiveLevelAlarmType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=9341" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=10368",
                        "BrowseName": "NonExclusiveDeviationAlarmType",
                        "DisplayName": "NonExclusiveDeviationAlarmType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=10522" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=9906" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=10522",
		                  "BrowseName": "SetpointNode",
		                  "ParentNodeId": "i=10368",
		                  "DataType": "NodeId",
		                  "DisplayName": "SetpointNode",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=10368" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=9764",
                        "BrowseName": "ExclusiveDeviationAlarmType",
                        "DisplayName": "ExclusiveDeviationAlarmType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9905" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=9341" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=9905",
		                  "BrowseName": "SetpointNode",
		                  "ParentNodeId": "i=9764",
		                  "DataType": "NodeId",
		                  "DisplayName": "SetpointNode",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=9764" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=10214",
                        "BrowseName": "NonExclusiveRateOfChangeAlarmType",
                        "DisplayName": "NonExclusiveRateOfChangeAlarmType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=9906" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=9623",
                        "BrowseName": "ExclusiveRateOfChangeAlarmType",
                        "DisplayName": "ExclusiveRateOfChangeAlarmType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=9341" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=10523",
                        "BrowseName": "DiscreteAlarmType",
                        "DisplayName": "DiscreteAlarmType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2915" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=10637",
                        "BrowseName": "OffNormalAlarmType",
                        "DisplayName": "OffNormalAlarmType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11158" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=10523" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11158",
		                  "BrowseName": "NormalState",
		                  "ParentNodeId": "i=10637",
		                  "DataType": "NodeId",
		                  "DisplayName": "NormalState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=10637" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=11753",
                        "BrowseName": "SystemOffNormalAlarmType",
                        "DisplayName": "SystemOffNormalAlarmType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=10637" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=10751",
                        "BrowseName": "TripAlarmType",
                        "DisplayName": "TripAlarmType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=10637" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=11163",
                        "BrowseName": "BaseConditionClassType",
                        "DisplayName": "BaseConditionClassType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=11164",
                        "BrowseName": "ProcessConditionClassType",
                        "DisplayName": "ProcessConditionClassType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=11163" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=11165",
                        "BrowseName": "MaintenanceConditionClassType",
                        "DisplayName": "MaintenanceConditionClassType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=11163" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=11166",
                        "BrowseName": "SystemConditionClassType",
                        "DisplayName": "SystemConditionClassType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=11163" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2790",
                        "BrowseName": "AuditConditionEventType",
                        "DisplayName": "AuditConditionEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2127" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2803",
                        "BrowseName": "AuditConditionEnableEventType",
                        "DisplayName": "AuditConditionEnableEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2790" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2829",
                        "BrowseName": "AuditConditionCommentEventType",
                        "DisplayName": "AuditConditionCommentEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=4170" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11851" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2790" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=4170",
		                  "BrowseName": "EventId",
		                  "ParentNodeId": "i=2829",
		                  "DataType": "ByteString",
		                  "DisplayName": "EventId",
		                  "Description": "A globally unique identifier for the event.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2829" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11851",
		                  "BrowseName": "Comment",
		                  "ParentNodeId": "i=2829",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "Comment",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2829" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=8927",
                        "BrowseName": "AuditConditionRespondEventType",
                        "DisplayName": "AuditConditionRespondEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11852" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2790" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11852",
		                  "BrowseName": "SelectedResponse",
		                  "ParentNodeId": "i=8927",
		                  "DataType": "Int32",
		                  "DisplayName": "SelectedResponse",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=8927" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=8944",
                        "BrowseName": "AuditConditionAcknowledgeEventType",
                        "DisplayName": "AuditConditionAcknowledgeEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=8945" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11853" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2790" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8945",
		                  "BrowseName": "EventId",
		                  "ParentNodeId": "i=8944",
		                  "DataType": "ByteString",
		                  "DisplayName": "EventId",
		                  "Description": "A globally unique identifier for the event.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=8944" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11853",
		                  "BrowseName": "Comment",
		                  "ParentNodeId": "i=8944",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "Comment",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=8944" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=8961",
                        "BrowseName": "AuditConditionConfirmEventType",
                        "DisplayName": "AuditConditionConfirmEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=8962" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11854" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2790" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=8962",
		                  "BrowseName": "EventId",
		                  "ParentNodeId": "i=8961",
		                  "DataType": "ByteString",
		                  "DisplayName": "EventId",
		                  "Description": "A globally unique identifier for the event.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=8961" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11854",
		                  "BrowseName": "Comment",
		                  "ParentNodeId": "i=8961",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "Comment",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=8961" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=11093",
                        "BrowseName": "AuditConditionShelvingEventType",
                        "DisplayName": "AuditConditionShelvingEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11855" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2790" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11855",
		                  "BrowseName": "ShelvingTime",
		                  "ParentNodeId": "i=11093",
		                  "DataType": "i=290",
		                  "DisplayName": "ShelvingTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11093" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2787",
                        "BrowseName": "RefreshStartEventType",
                        "DisplayName": "RefreshStartEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2130" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2788",
                        "BrowseName": "RefreshEndEventType",
                        "DisplayName": "RefreshEndEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2130" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2789",
                        "BrowseName": "RefreshRequiredEventType",
                        "DisplayName": "RefreshRequiredEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2130" } ]
	} );

  uareferencetypes.push( {"Type": "UAReferenceType",
                          "NodeId": "i=9006",
                          "BrowseName": "HasCondition",
                          "IsAbstract": "",
                          "DisplayName": "HasCondition",
                          "Description": "",
                          "InverseName": "IsConditionOf",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=32" } ]
	} );


    

    // summary of definitions
    print( "Types defined in UA Part 09 Type Definition (Opc.Ua.Nodeset2.Part9.xml):" );
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

Test.Execute( { Procedure: this.test000_09 } );