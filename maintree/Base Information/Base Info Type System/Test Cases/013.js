/*  Test prepared by Nathan Pocock (nathan.pocock@opcfoundation.org)
    Description: Walks through the address space checking the TypeDefinitions */

function test000_13() {
// Define our functional variables
var uaobjects = [];
var uadatatypes = [];
var uareferencetypes = [];
var uaobjecttypes = [];
var uavariabletypes = [];
var uavariables = [];
var uamethods = [];

uaobjecttypes.push( { "Type": "UAObjectType",
                        "NodeId": "i=11187",
                        "BrowseName": "AggregateConfigurationType",
                        "DisplayName": "AggregateConfigurationType",
                        "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11188" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11189" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11190" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11191" },
                          { "ReferenceTypeId": "HasSubtype", "NodeId": "i=58" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11188",
		                  "BrowseName": "TreatUncertainAsBad",
		                  "ParentNodeId": "i=11187",
		                  "DataType": "Boolean",
		                  "DisplayName": "TreatUncertainAsBad",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11187" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11189",
		                  "BrowseName": "PercentDataBad",
		                  "ParentNodeId": "i=11187",
		                  "DataType": "Byte",
		                  "DisplayName": "PercentDataBad",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11187" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11190",
		                  "BrowseName": "PercentDataGood",
		                  "ParentNodeId": "i=11187",
		                  "DataType": "Byte",
		                  "DisplayName": "PercentDataGood",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11187" } ]
	} );

	uavariables.push( { "Type": "UAVariable",
		                  "NodeId": "i=11191",
		                  "BrowseName": "UseSlopedExtrapolation",
		                  "ParentNodeId": "i=11187",
		                  "DataType": "Boolean",
		                  "DisplayName": "UseSlopedExtrapolation",
		                  "Description": "",
		
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=68" },
                          { "ReferenceTypeId": "HasModellingRule", "NodeId": "i=78" },
                          { "ReferenceTypeId": "HasProperty", "NodeId": "i=11187" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Interpolative", 
                    "NodeId": "i=2341", 
                    "SymbolicName": "AggregateFunction_Interpolative",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Average", 
                    "NodeId": "i=2342", 
                    "SymbolicName": "AggregateFunction_Average",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "TimeAverage", 
                    "NodeId": "i=2343", 
                    "SymbolicName": "AggregateFunction_TimeAverage",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "TimeAverage2", 
                    "NodeId": "i=11285", 
                    "SymbolicName": "AggregateFunction_TimeAverage2",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Total", 
                    "NodeId": "i=2344", 
                    "SymbolicName": "AggregateFunction_Total",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Total2", 
                    "NodeId": "i=11304", 
                    "SymbolicName": "AggregateFunction_Total2",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Minimum", 
                    "NodeId": "i=2346", 
                    "SymbolicName": "AggregateFunction_Minimum",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Maximum", 
                    "NodeId": "i=2347", 
                    "SymbolicName": "AggregateFunction_Maximum",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "MinimumActualTime", 
                    "NodeId": "i=2348", 
                    "SymbolicName": "AggregateFunction_MinimumActualTime",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "MaximumActualTime", 
                    "NodeId": "i=2349", 
                    "SymbolicName": "AggregateFunction_MaximumActualTime",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Range", 
                    "NodeId": "i=2350", 
                    "SymbolicName": "AggregateFunction_Range",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Minimum2", 
                    "NodeId": "i=11286", 
                    "SymbolicName": "AggregateFunction_Minimum2",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Maximum2", 
                    "NodeId": "i=11287", 
                    "SymbolicName": "AggregateFunction_Maximum2",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "MinimumActualTime2", 
                    "NodeId": "i=11305", 
                    "SymbolicName": "AggregateFunction_MinimumActualTime2",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "MaximumActualTime2", 
                    "NodeId": "i=11306", 
                    "SymbolicName": "AggregateFunction_MaximumActualTime2",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Range2", 
                    "NodeId": "i=11288", 
                    "SymbolicName": "AggregateFunction_Range2",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "AnnotationCount", 
                    "NodeId": "i=2351", 
                    "SymbolicName": "AggregateFunction_AnnotationCount",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Count", 
                    "NodeId": "i=2352", 
                    "SymbolicName": "AggregateFunction_Count",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "DurationInStateZero", 
                    "NodeId": "i=11307", 
                    "SymbolicName": "AggregateFunction_DurationInStateZero",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "DurationInStateNonZero", 
                    "NodeId": "i=11308", 
                    "SymbolicName": "AggregateFunction_DurationInStateNonZero",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "NumberOfTransitions", 
                    "NodeId": "i=2355", 
                    "SymbolicName": "AggregateFunction_NumberOfTransitions",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Start", 
                    "NodeId": "i=2357", 
                    "SymbolicName": "AggregateFunction_Start",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "End", 
                    "NodeId": "i=2358", 
                    "SymbolicName": "AggregateFunction_End",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "Delta", 
                    "NodeId": "i=2359", 
                    "SymbolicName": "AggregateFunction_Delta",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "StartBound", 
                    "NodeId": "i=11505", 
                    "SymbolicName": "AggregateFunction_StartBound",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "EndBound", 
                    "NodeId": "i=11506", 
                    "SymbolicName": "AggregateFunction_EndBound",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "DeltaBounds", 
                    "NodeId": "i=11507", 
                    "SymbolicName": "AggregateFunction_DeltaBounds",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "DurationGood", 
                    "NodeId": "i=2360", 
                    "SymbolicName": "AggregateFunction_DurationGood",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "DurationBad", 
                    "NodeId": "i=2361", 
                    "SymbolicName": "AggregateFunction_DurationBad",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "PercentGood", 
                    "NodeId": "i=2362", 
                    "SymbolicName": "AggregateFunction_PercentGood",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "PercentBad", 
                    "NodeId": "i=2363", 
                    "SymbolicName": "AggregateFunction_PercentBad",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "WorstQuality", 
                    "NodeId": "i=2364", 
                    "SymbolicName": "AggregateFunction_WorstQuality",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "WorstQuality2", 
                    "NodeId": "i=11292", 
                    "SymbolicName": "AggregateFunction_WorstQuality2",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "StandardDeviationSample", 
                    "NodeId": "i=11426", 
                    "SymbolicName": "AggregateFunction_StandardDeviationSample",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "StandardDeviationPopulation", 
                    "NodeId": "i=11427", 
                    "SymbolicName": "AggregateFunction_StandardDeviationPopulation",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "VarianceSample", 
                    "NodeId": "i=11428", 
                    "SymbolicName": "AggregateFunction_VarianceSample",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

  uaobjects.push( { "Type": "UAObject", "BrowseName": "VariancePopulation", 
                    "NodeId": "i=11429", 
                    "SymbolicName": "AggregateFunction_VariancePopulation",
			
                      "References": [ 
                          { "ReferenceTypeId": "HasTypeDefinition", "NodeId": "i=2340" } ]
	} );

    // summary of definitions
    print( "Types defined in UA Part 13 Type Definition (Opc.Ua.Nodeset2.Part13.xml):" );
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

Test.Execute( { Procedure: this.test000_13 } );