/*  Test 1 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Tests the SERVER object in the Servers address space.

    November 2015: ServerDiagnostics are removed from the ServerObject despite being marked as Mandatory in the specifications (Part 3 Table 8), they are NOT intended to be used in 
                   embedded devices. This was discussed at length in the UA Working Group on Nov-10-2015 (CTT Release Day) with the final decision being to update Part 7 to add text
                   that says mandatory functionality can be made optional within profiles, such as with this case. An errata will be released shortly. */

function testServerObject() {
    var serverDefinition = {
        "Name": "ServerType",
        "UaPart5": "6.3.1 ServerType",
        "References": [
            { "ReferenceTypeId": Identifier.HasProperty,  "BrowseName": "ServerArray",    "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ),     "DataType": BuiltInType.String, "IsArray": true, "Required": true },
            { "ReferenceTypeId": Identifier.HasProperty,  "BrowseName": "NamespaceArray", "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ),     "DataType": BuiltInType.String, "IsArray": true, "Required": true },
            { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "ServerStatus",   "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.ServerStatusType ), "Required": true, "TypeInstance":
                   { "Name": "ServerStatusType", "UaPart5": "7.8 ServerStatusType", "References": [
                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "StartTime",   "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.BaseDataVariableType ), "DataType": BuiltInType.DateTime, "Required": true },
                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "CurrentTime", "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.BaseDataVariableType ), "DataType": BuiltInType.DateTime, "Required": true },
                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "State",       "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.ServerState ),          "DataType": "ServerState", "Required": true },
                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "BuildInfo",   "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.BuildInfoType ),        "DataType": "BuildInfo", "Required": true, "TypeInstance":
                                { "Name": "BuildInfoType", "UaPart5": "7.9 BuildInfoType", "References": [
                                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "ProductUri",       "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.BaseDataVariableType ), "DataType": BuiltInType.String, "Required": true },
                                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "ManufacturerName", "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.BaseDataVariableType ), "DataType": BuiltInType.String, "Required": true },
                                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "ProductName",      "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.BaseDataVariableType ), "DataType": BuiltInType.String, "Required": true },
                                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "SoftwareVersion",  "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.BaseDataVariableType ), "DataType": BuiltInType.String, "Required": true },
                                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "BuildNumber",      "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.BaseDataVariableType ), "DataType": BuiltInType.String, "Required": true },
                                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "BuildDate",        "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.BaseDataVariableType ), "DataType": BuiltInType.String, "Required": true } ]
                            } },
                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "SecondsTillShutdown", "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.UInt32 ),        "DataType": BuiltInType.UInt32, "Required": true },
                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "ShutdownReason",      "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.LocalizedText ), "DataType": BuiltInType.LocalizedText, "Required": true } ]
                }
            },
            { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "ServerStatus",   "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.ServerStatusType ), "Required": true, "TypeInstance":
                    { "Name": "ServerStatusType", "UaPart5": "7.8 ServerStatusType", "References": [
                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "StartTime",   "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.BaseDataVariableType ), "DataType": BuiltInType.DateTime, "Required": true },
                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "CurrentTime", "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.BaseDataVariableType ), "DataType": BuiltInType.DateTime, "Required": true },
                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "State",       "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.ServerState ),   "DataType": "ServerState", "Required": true },
                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "BuildInfo",   "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.BuildInfoType ), "DataType": "BuildInfo",   "Required": true, "TypeInstance":
                                { "Name": "BuildInfoType", "UaPart5": "7.9 BuildInfoType", "References": [
                                    { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "ProductUri",       "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.BaseDataVariableType ), "DataType": BuiltInType.String,  "Required": true },
                                    { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "ManufacturerName", "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.BaseDataVariableType ), "DataType": BuiltInType.String,  "Required": true },
                                    { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "ProductName",      "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.BaseDataVariableType ), "DataType": BuiltInType.String,  "Required": true },
                                    { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "SoftwareVersion",  "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.BaseDataVariableType ), "DataType": BuiltInType.String,  "Required": true },
                                    { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "BuildNumber",      "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.BaseDataVariableType ), "DataType": BuiltInType.String,  "Required": true },
                                    { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "BuildDate",        "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.BaseDataVariableType ), "DataType": BuiltInType.String,  "Required": true } ] } },
                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "SecondsTillShutdown", "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.UInt32 ), "DataType": BuiltInType.UInt32, "Required": true },
                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "ShutdownReason",     "NodeClass":  NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.LocalizedText ), "DataType": BuiltInType.LocalizedText, "Required": true }
                        ] } },
            { "ReferenceTypeId": Identifier.HasProperty,  "BrowseName": "ServiceLevel",   "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType":BuiltInType.Byte,     "Required": true },
            { "ReferenceTypeId": Identifier.HasProperty,  "BrowseName": "Auditing",       "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType": BuiltInType.Boolean, "Required": true },
            { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "ServerCapabilities", "NodeClass": NodeClass.Object, "TypeDefinition": new UaExpandedNIDHelper( Identifier.ServerCapabilitiesType ), "Required": true, "TypeInstance": 
                    { "Name": "ServerCapabilitiesType", "UaPart5": "6.3.2 ServerCapabilitiesType", "References": [
                        { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "ServerProfileArray", "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType": BuiltInType.String, "IsArray": true, "Required": true },
                        { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "LocaleIdArray",      "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType": "LocaleId", "IsArray": true, "Required": true },
                        { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "MinSupportedSampleRate", "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType": "Duration", "Required": true },
                        { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "MaxBrowseContinuationPoints",  "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType": BuiltInType.UInt16, "Required": true },
                        { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "MaxQueryContinuationPoints",   "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType": BuiltInType.UInt16, "Required": true },
                        { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "MaxHistoryContinuationPoints", "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType": BuiltInType.UInt16, "Required": true },
                        { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "SoftwareCertificates",         "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType": "SoftwareCertificate", "Required": true },
                        { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "MaxArrayLength",               "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType": BuiltInType.UInt32 },
                        { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "MaxStringLength",              "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType": BuiltInType.UInt32 },
                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "OperationLimits",    "NodeClass": NodeClass.Object, "TypeDefinition": new UaExpandedNIDHelper( "OperationLimitsType" ), "TypeInstance":
                                { "Name": "OperationLimitsType", "UaPart5": "6.3.10 OperationLimitsType", "References": [
                                    { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "MaxNodesPerRead",        "NodeClass": NodeClass.Variable, "TypeDefinition":  new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType":  BuiltInType.UInt32 },
                                    { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "MaxNodesPerHistoryReadData", "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType":   BuiltInType.UInt32 },
                                    { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "MaxNodesPerHistoryReadEvents", "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType":   BuiltInType.UInt32 },
                                    { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "MaxNodesPerWrite",      "NodeClass": NodeClass.Variable, "TypeDefinition":  new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType": BuiltInType.UInt32 },
                                    { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "MaxNodesPerHistoryUpdateData", "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType":  BuiltInType.UInt32 },
                                    { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "MaxNodesPerHistoryUpdateEvents", "NodeClass": NodeClass.Variable,"ypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ),"DataType":  BuiltInType.UInt32 },
                                    { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "MaxNodesPerMethodCall",    "NodeClass": NodeClass.Variable,"TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ),"DataType":  BuiltInType.UInt32 },
                                    { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "MaxNodesPerBrowse",        "NodeClass": NodeClass.Variable, "TypeDefinition":new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType": BuiltInType.UInt32 },
                                    { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "MaxNodesPerRegisterNodes", "NodeClass": NodeClass.Variable,"TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType": BuiltInType.UInt32 },
                                    { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "MaxNodesPerTranslateBrowsePathsToNodeIds", "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType": BuiltInType.UInt32 },
                                    { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "MaxNodesPerNodeManagement", "NodeClass": NodeClass.Variable,"TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType": BuiltInType.UInt32 },
                                    { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "MaxMonitoredItemsPerCall",  "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType": BuiltInType.UInt32 } ] } },
                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "ModellingRules",     "NodeClass": NodeClass.Object, "TypeDefinition": new UaExpandedNIDHelper( Identifier.FolderType ), "Required": true },
                        { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "AggregateFunctions", "NodeClass": NodeClass.Object, "TypeDefinition": new UaExpandedNIDHelper( Identifier.FolderType ), "Required": true } ] } },
            { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "VendorServerInfo",   "NodeClass": NodeClass.Object, "TypeDefinition": new UaExpandedNIDHelper( Identifier.VendorServerInfoType ), "Required": true },
            { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "ServerRedundancy",   "NodeClass": NodeClass.Object, "TypeDefinition": new UaExpandedNIDHelper( Identifier.ServerRedundancyType ), "Required": true, "TypeInstance": 
                    { "Name": "ServerRedundancyType", "UaPart5": "6.3.7 ServerRedundancyType", "References": [
                        { "ReferenceTypeId": Identifier.HasProperty, "BrowseName": "RedundancySupport", "NodeClass": NodeClass.Variable, "TypeDefinition": new UaExpandedNIDHelper( Identifier.PropertyType ), "DataType": "RedundancySupport", "Required": true } ] } },
            { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "Namespaces",         "NodeClass": NodeClass.Object, "TypeDefinition": new UaExpandedNIDHelper( "NamespacesType" ) },
            { "ReferenceTypeId": Identifier.HasComponent, "BrowseName": "GetMonitoredItems",  "NodeClass": NodeClass.Method, "TypeDefinition": new UaExpandedNIDHelper( "GetMonitoredItems" ) }
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