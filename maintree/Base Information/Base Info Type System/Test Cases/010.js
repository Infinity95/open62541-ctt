/*  Test prepared by Nathan Pocock (nathan.pocock@opcfoundation.org)
    Description: Walks through the address space checking the TypeDefinitions */

function test000_10() {
// Define our functional variables
var uaobjects = [];
var uadatatypes = [];
var uareferencetypes = [];
var uaobjecttypes = [];
var uavariabletypes = [];
var uavariables = [];
var uamethods = [];

 uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2391",
                        "BrowseName": "ProgramStateMachineType",
                        "DisplayName": "ProgramStateMachineType",
                        "Description": "A state machine for a program.",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3830" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3835" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2392" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2393" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2394" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2395" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2396" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2397" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2398" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2399" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3850" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2400" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2402" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2404" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2406" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2408" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2410" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2412" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2414" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2416" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2418" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2420" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2422" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2424" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2426" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2427" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2428" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2429" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2430" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2771" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3830",
		                  "BrowseName": "CurrentState",
		                  "ParentNodeId": "i=2391",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "CurrentState",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3831" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3833" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2760" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3831",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=3830",
		                  "DataType": "NodeId",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3830" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3833",
		                  "BrowseName": "Number",
		                  "ParentNodeId": "i=3830",
		                  "DataType": "UInt32",
		                  "DisplayName": "Number",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3830" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3835",
		                  "BrowseName": "LastTransition",
		                  "ParentNodeId": "i=2391",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "LastTransition",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3836" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3838" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3839" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2767" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3836",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=3835",
		                  "DataType": "NodeId",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3835" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3838",
		                  "BrowseName": "Number",
		                  "ParentNodeId": "i=3835",
		                  "DataType": "UInt32",
		                  "DisplayName": "Number",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3835" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3839",
		                  "BrowseName": "TransitionTime",
		                  "ParentNodeId": "i=3835",
		                  "DataType": "i=294",
		                  "DisplayName": "TransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3835" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2392",
		                  "BrowseName": "Creatable",
		                  "ParentNodeId": "i=2391",
		                  "DataType": "Boolean",
		                  "DisplayName": "Creatable",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2393",
		                  "BrowseName": "Deletable",
		                  "ParentNodeId": "i=2391",
		                  "DataType": "Boolean",
		                  "DisplayName": "Deletable",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2394",
		                  "BrowseName": "AutoDelete",
		                  "ParentNodeId": "i=2391",
		                  "DataType": "Boolean",
		                  "DisplayName": "AutoDelete",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=79" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2395",
		                  "BrowseName": "RecycleCount",
		                  "ParentNodeId": "i=2391",
		                  "DataType": "Int32",
		                  "DisplayName": "RecycleCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2396",
		                  "BrowseName": "InstanceCount",
		                  "ParentNodeId": "i=2391",
		                  "DataType": "UInt32",
		                  "DisplayName": "InstanceCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2397",
		                  "BrowseName": "MaxInstanceCount",
		                  "ParentNodeId": "i=2391",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxInstanceCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2398",
		                  "BrowseName": "MaxRecycleCount",
		                  "ParentNodeId": "i=2391",
		                  "DataType": "UInt32",
		                  "DisplayName": "MaxRecycleCount",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2399",
		                  "BrowseName": "ProgramDiagnostics",
		                  "ParentNodeId": "i=2391",
		                  "DataType": "i=894",
		                  "DisplayName": "ProgramDiagnostics",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3840" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3841" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3842" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3843" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3844" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3845" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3846" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3847" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3848" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3849" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2380" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3840",
		                  "BrowseName": "CreateSessionId",
		                  "ParentNodeId": "i=2399",
		                  "DataType": "NodeId",
		                  "DisplayName": "CreateSessionId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2399" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3841",
		                  "BrowseName": "CreateClientName",
		                  "ParentNodeId": "i=2399",
		                  "DataType": "String",
		                  "DisplayName": "CreateClientName",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2399" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3842",
		                  "BrowseName": "InvocationCreationTime",
		                  "ParentNodeId": "i=2399",
		                  "DataType": "i=294",
		                  "DisplayName": "InvocationCreationTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2399" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3843",
		                  "BrowseName": "LastTransitionTime",
		                  "ParentNodeId": "i=2399",
		                  "DataType": "i=294",
		                  "DisplayName": "LastTransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2399" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3844",
		                  "BrowseName": "LastMethodCall",
		                  "ParentNodeId": "i=2399",
		                  "DataType": "String",
		                  "DisplayName": "LastMethodCall",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2399" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3845",
		                  "BrowseName": "LastMethodSessionId",
		                  "ParentNodeId": "i=2399",
		                  "DataType": "NodeId",
		                  "DisplayName": "LastMethodSessionId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2399" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3846",
		                  "BrowseName": "LastMethodInputArguments",
		                  "ParentNodeId": "i=2399",
		                  "DataType": "i=296",
		                  "DisplayName": "LastMethodInputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2399" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3847",
		                  "BrowseName": "LastMethodOutputArguments",
		                  "ParentNodeId": "i=2399",
		                  "DataType": "i=296",
		                  "DisplayName": "LastMethodOutputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2399" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3848",
		                  "BrowseName": "LastMethodCallTime",
		                  "ParentNodeId": "i=2399",
		                  "DataType": "i=294",
		                  "DisplayName": "LastMethodCallTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2399" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3849",
		                  "BrowseName": "LastMethodReturnStatus",
		                  "ParentNodeId": "i=2399",
		                  "DataType": "i=299",
		                  "DisplayName": "LastMethodReturnStatus",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2399" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "FinalResultData", 
                    "NodeId": "i=3850", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=58" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=80" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Ready", 
                    "NodeId": "i=2400", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2401" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2408" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2410" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2414" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2422" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2424" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2307" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2401",
		                  "BrowseName": "StateNumber",
		                  "ParentNodeId": "i=2400",
		                  "DataType": "UInt32",
		                  "DisplayName": "StateNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2400" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Running", 
                    "NodeId": "i=2402", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2403" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2410" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2412" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2414" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2416" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2418" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2307" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2403",
		                  "BrowseName": "StateNumber",
		                  "ParentNodeId": "i=2402",
		                  "DataType": "UInt32",
		                  "DisplayName": "StateNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2402" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Suspended", 
                    "NodeId": "i=2404", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2405" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2416" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2418" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2420" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2422" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2307" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2405",
		                  "BrowseName": "StateNumber",
		                  "ParentNodeId": "i=2404",
		                  "DataType": "UInt32",
		                  "DisplayName": "StateNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2404" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Halted", 
                    "NodeId": "i=2406", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2407" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2408" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2412" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2420" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2424" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2307" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2407",
		                  "BrowseName": "StateNumber",
		                  "ParentNodeId": "i=2406",
		                  "DataType": "UInt32",
		                  "DisplayName": "StateNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2406" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "HaltedToReady", 
                    "NodeId": "i=2408", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2409" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2406" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2400" },
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2430" },
                          { "ReferenceTypeId": "i=54", "NodeId": "i=2378" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2310" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2409",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=2408",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2408" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "ReadyToRunning", 
                    "NodeId": "i=2410", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2411" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2400" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2402" },
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2426" },
                          { "ReferenceTypeId": "i=54", "NodeId": "i=2378" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2310" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2411",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=2410",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2410" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "RunningToHalted", 
                    "NodeId": "i=2412", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2413" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2402" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2406" },
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2429" },
                          { "ReferenceTypeId": "i=54", "NodeId": "i=2378" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2310" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2413",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=2412",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2412" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "RunningToReady", 
                    "NodeId": "i=2414", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2415" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2402" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2400" },
                          { "ReferenceTypeId": "i=54", "NodeId": "i=2378" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2310" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2415",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=2414",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2414" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "RunningToSuspended", 
                    "NodeId": "i=2416", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2417" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2402" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2404" },
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2427" },
                          { "ReferenceTypeId": "i=54", "NodeId": "i=2378" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2310" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2417",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=2416",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2416" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "SuspendedToRunning", 
                    "NodeId": "i=2418", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2419" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2404" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2402" },
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2428" },
                          { "ReferenceTypeId": "i=54", "NodeId": "i=2378" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2310" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2419",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=2418",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2418" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "SuspendedToHalted", 
                    "NodeId": "i=2420", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2421" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2404" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2406" },
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2429" },
                          { "ReferenceTypeId": "i=54", "NodeId": "i=2378" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2310" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2421",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=2420",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2420" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "SuspendedToReady", 
                    "NodeId": "i=2422", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2423" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2404" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2400" },
                          { "ReferenceTypeId": "i=54", "NodeId": "i=2378" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2310" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2423",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=2422",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2422" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "ReadyToHalted", 
                    "NodeId": "i=2424", 
                    "SymbolicName": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2425" },
                          { "ReferenceTypeId": "i=51", "NodeId": "i=2400" },
                          { "ReferenceTypeId": "i=52", "NodeId": "i=2406" },
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2429" },
                          { "ReferenceTypeId": "i=54", "NodeId": "i=2378" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2310" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2425",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=2424",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2424" } ]
	} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=2426",
		                "BrowseName": "Start",
		                "ParentNodeId": "i=2391",
		                "DisplayName": "Start",
		
                      "References": [ 
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2410" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
		} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=2427",
		                "BrowseName": "Suspend",
		                "ParentNodeId": "i=2391",
		                "DisplayName": "Suspend",
		
                      "References": [ 
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2416" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
		} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=2428",
		                "BrowseName": "Resume",
		                "ParentNodeId": "i=2391",
		                "DisplayName": "Resume",
		
                      "References": [ 
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2418" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
		} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=2429",
		                "BrowseName": "Halt",
		                "ParentNodeId": "i=2391",
		                "DisplayName": "Halt",
		
                      "References": [ 
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2412" },
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2420" },
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2424" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
		} );

	uamethods.push( { "Type": "UAMethod",
		                "NodeId": "i=2430",
		                "BrowseName": "Reset",
		                "ParentNodeId": "i=2391",
		                "DisplayName": "Reset",
		
                      "References": [ 
                          { "ReferenceTypeId": "i=53", "NodeId": "i=2408" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=2391" } ]
		} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=2378",
                        "BrowseName": "ProgramTransitionEventType",
                        "DisplayName": "ProgramTransitionEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2379" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2311" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2379",
		                  "BrowseName": "IntermediateResult",
		                  "ParentNodeId": "i=2378",
		                  "DataType": "",
		                  "DisplayName": "IntermediateResult",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2378" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=11856",
                        "BrowseName": "AuditProgramTransitionEventType",
                        "DisplayName": "AuditProgramTransitionEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11875" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2315" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11875",
		                  "BrowseName": "TransitionNumber",
		                  "ParentNodeId": "i=11856",
		                  "DataType": "UInt32",
		                  "DisplayName": "TransitionNumber",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11856" } ]
	} );

	uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=3806",
                        "BrowseName": "ProgramTransitionAuditEventType",
                        "DisplayName": "ProgramTransitionAuditEventType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3825" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=2315" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3825",
		                  "BrowseName": "Transition",
		                  "ParentNodeId": "i=3806",
		                  "DataType": "LocalizedText",
		                  "DisplayName": "Transition",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3826" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2767" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasComponent", "NodeId": "i=3806" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=3826",
		                  "BrowseName": "Id",
		                  "ParentNodeId": "i=3825",
		                  "DataType": "NodeId",
		                  "DisplayName": "Id",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=3825" } ]
	} );

  uavariabletypes.push( { "Type": "UAVariableType",
                          "NodeId": "i=2380",
                          "BrowseName": "ProgramDiagnosticType",
                          "ValueRank": "",
                          "DisplayName": "ProgramDiagnosticType",
                          "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2381" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2382" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2383" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2384" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2385" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2386" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2387" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2388" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2389" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2390" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=63" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2381",
		                  "BrowseName": "CreateSessionId",
		                  "ParentNodeId": "i=2380",
		                  "DataType": "NodeId",
		                  "DisplayName": "CreateSessionId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2380" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2382",
		                  "BrowseName": "CreateClientName",
		                  "ParentNodeId": "i=2380",
		                  "DataType": "String",
		                  "DisplayName": "CreateClientName",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2380" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2383",
		                  "BrowseName": "InvocationCreationTime",
		                  "ParentNodeId": "i=2380",
		                  "DataType": "i=294",
		                  "DisplayName": "InvocationCreationTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2380" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2384",
		                  "BrowseName": "LastTransitionTime",
		                  "ParentNodeId": "i=2380",
		                  "DataType": "i=294",
		                  "DisplayName": "LastTransitionTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2380" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2385",
		                  "BrowseName": "LastMethodCall",
		                  "ParentNodeId": "i=2380",
		                  "DataType": "String",
		                  "DisplayName": "LastMethodCall",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2380" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2386",
		                  "BrowseName": "LastMethodSessionId",
		                  "ParentNodeId": "i=2380",
		                  "DataType": "NodeId",
		                  "DisplayName": "LastMethodSessionId",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2380" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2387",
		                  "BrowseName": "LastMethodInputArguments",
		                  "ParentNodeId": "i=2380",
		                  "DataType": "i=296",
		                  "DisplayName": "LastMethodInputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2380" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2388",
		                  "BrowseName": "LastMethodOutputArguments",
		                  "ParentNodeId": "i=2380",
		                  "DataType": "i=296",
		                  "DisplayName": "LastMethodOutputArguments",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2380" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2389",
		                  "BrowseName": "LastMethodCallTime",
		                  "ParentNodeId": "i=2380",
		                  "DataType": "i=294",
		                  "DisplayName": "LastMethodCallTime",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2380" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=2390",
		                  "BrowseName": "LastMethodReturnStatus",
		                  "ParentNodeId": "i=2380",
		                  "DataType": "i=299",
		                  "DisplayName": "LastMethodReturnStatus",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=2380" } ]
	} );

  uadatatypes.push( { "Type": "UADataType",
                      "NodeId": "i=894",
                      "BrowseName": "ProgramDiagnosticDataType",
                      "DisplayName": "ProgramDiagnosticDataType",
                      "Description": "",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=22" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default XML", 
                    "NodeId": "i=895", 
                    "SymbolicName": "DefaultXml",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=894" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8882" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Default Binary", 
                    "NodeId": "i=896", 
                    "SymbolicName": "DefaultBinary",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasEncoding", "NodeId": "i=894" },
                          { "ReferenceTypeId": "HasDescription", "NodeId": "i=8247" },
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=76" } ]
	} );
    

    // summary of definitions
    print( "Types defined in UA Part 10 Type Definition (Opc.Ua.Nodeset2.Part10.xml):" );
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

Test.Execute( { Procedure: this.test000_10 } );