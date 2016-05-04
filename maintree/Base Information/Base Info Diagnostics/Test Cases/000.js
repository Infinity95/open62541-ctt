/*  Test 1 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Tests the SERVER object in the Servers address space. */

function testServerObject() {
    var serverDefinition = {
        "Name": "ServerType",
        "UaPart5": "6.3.1 ServerType",
        "References": [
            { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "ServerDiagnostics",  "NodeClass": NodeClass.Object, "TypeDefinition": new UaExpandedNIDHelper( Identifier.ServerDiagnosticsType ),  "Required": false, "TypeInstance": 
                    { "Name": "ServerDiagnosticsType", "UaPart5": "6.3.3 ServerDiagnosticsType", "References": [
                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "ServerDiagnosticsSummary",         "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.ServerDiagnosticsSummaryType ),        "DataType": "ServerDiagnosticsSummaryDataType",     "Required": true },
                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "SamplingIntervalDiagnosticsArray", "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.SamplingIntervalDiagnosticsDataType ), "DataType": "SamplingIntervalDiagnosticsArrayType", "IsArray": true },
                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "SubscriptionDiagnosticsArray",     "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.SubscriptionDiagnosticsDataType ),     "DataType": "SubscriptionDiagnosticsArrayType",     "IsArray": true, "Required": true },
                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "SessionsDiagnosticsSummary",       "NodeClass": NodeClass.Object,   "TypeDefinition": new UaExpandedNIDHelper( Identifier.SessionsDiagnosticsSummaryType ),      "Required": true },
                        { "ReferenceTypeId": Identifier.HasProperty,  "BrowseName": "EnabledFlag",                      "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType": BuiltInType.Boolean, "Required": true } ] } },
            ]//ServerType.References
    };

    // variables and objects needed for the test
    return( TBPTNI.CheckChildStructure( {
            StartingNode:  MonitoredItem.fromNodeIds( new UaNodeId( Identifier.Server ) )[0], 
            ObjectDefinition: serverDefinition, 
            TranslateBrowsePathsToNodeIdsHelper: TranslateBrowsePathsToNodeIdsHelper 
            } ) );
}

Test.Execute( { Procedure: testServerObject } );