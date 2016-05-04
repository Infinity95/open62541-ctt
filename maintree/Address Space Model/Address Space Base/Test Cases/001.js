/*  Test 2 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Script walks through the Servers' address space checking each node
        complies with the Base NodeClass, as defined in UA Specifications
        PART 3 Clause 5.2.1 Table 2 (Base NodeClass) which defines the following
        attributes:
            REQUIRED: NodeId, NodeClass, BrowseName, and DisplayName
            OPTIONAL: Description, WriteMask, UserWriteMask. */

const MAX_NODES_TO_TEST = 2000;

var baseNodeClassDefinition = { Name: "Base NodeClass - not to be used directly",
                                Attributes: [
                                                { Name: "NodeId", AttributeId: Attribute.NodeId, DataType: Identifier.NodeId, Required: true },
                                                { Name: "NodeClass", AttributeId: Attribute.NodeClass, DataType: Identifier.NodeClass, Required: true },
                                                { Name: "BrowseName", AttributeId: Attribute.BrowseName,DataType:  Identifier.QualifiedName, Required: true },
                                                { Name: "DisplayName", AttributeId: Attribute.DisplayName, DataType: Identifier.LocalizedText, Required: true },
                                                { Name: "Description", AttributeId: Attribute.Description, DataType: Identifier.LocalizedText, Required: false },
                                                { Name: "WriteMask", AttributeId: Attribute.WriteMask, DataType: Identifier.UInt32, Required: false },
                                                { Name: "UserWriteMask", AttributeId: Attribute.UserWriteMask, DataType: Identifier.UInt32, Required: false }
                                            ] };

var baseReferenceTypeDefinition = { Name: "ReferenceType NodeClass", 
                                    Attributes: [
                                                { Name: "IsAbstract", AttributeId: Attribute.IsAbstract, DataType: Identifier.Boolean, Required: true },
                                                { Name: "Symmetric", AttributeId: Attribute.Symmetric, DataType: Identifier.Boolean, Required: true },
                                                { Name: "InverseName", AttributeId: Attribute.InverseName, DataType: Identifier.LocalizedText, Required: false } 
                                            ].concat( baseNodeClassDefinition.Attributes ),
                                    References: [
                                                { BrowseName: "HasProperty", ReferenceTypeId: new UaNodeId( Identifier.HasProperty ) },
                                                { BrowseName: "HasSubType", ReferenceTypeId: new UaNodeId( Identifier.HasSubtype ) }
                                            ],
                                    Properties: [
                                                    { Name: "NodeVersion", DataType: Identifier.String, Required: false }
                                                ]
                                    };

var baseViewDefinition = { Name: "View NodeClass",
                           Attributes: [
                                            { Name: "ContainsNoLoops", AttributeId:Attribute.ContainsNoLoops, DataType:Identifier.Boolean, Required: true },
                                            { Name: "EventNotifier", AttributeId:Attribute.EventNotifier, DataType:Identifier.Byte, Required: true }
                                        ].concat( baseNodeClassDefinition.Attributes ),
                            References: [
                                            { BrowseName: "HierarchicalReferences", ReferenceTypeId: new UaNodeId( Identifier.HierarchicalReferences ) },
                                            { BrowseName: "HasProperty", ReferenceTypeId: new UaNodeId( Identifier.HasProperty ) }
                                        ],
                            Properties: [
                                            { Name: "NodeVersion", DataType: Identifier.String, Required: false },
                                            { Name: "ViewVersion", DataType: Identifier.UInt32, Required: false }
                                        ] };

var baseObjectDefinition = { Name: "Object NodeClass",
                             Attributes: [
                                            { Name: "EventNotifier", AttributeId:Attribute.EventNotifier, DataType:Identifier.Byte, Required: true }
                                         ].concat( baseNodeClassDefinition.Attributes ),
                             References: [
                                            { BrowseName: "HasComponent", ReferenceTypeId: new UaNodeId( Identifier.HasComponent ) },
                                            { BrowseName: "HasProperty", ReferenceTypeId: new UaNodeId( Identifier.HasProperty ) },
                                            { BrowseName: "HasModellingRule", ArrayMax: 1, ReferenceTypeId: new UaNodeId( Identifier.HasModellingRule ) },
                                            { BrowseName: "HasTypeDefinition", Required: true, ArrayMin: 1, ArrayMax: 1, ReferenceTypeId: new UaNodeId( Identifier.HasTypeDefinition ) },
                                            { BrowseName: "HasModelParent", ArrayMax: 1, ReferenceTypeId: new UaNodeId( Identifier.HasModelParent ) },
                                            { BrowseName: "HasEventSource", ReferenceTypeId: new UaNodeId( Identifier.HasEventSource ) },
                                            { BrowseName: "HasNotifier", ReferenceTypeId: new UaNodeId( Identifier.HasNotifier ) },
                                            { BrowseName: "Organizes", ReferenceTypeId: new UaNodeId( Identifier.Organizes ) },
                                            { BrowseName: "HasDescription", ArrayMin: 0, ArrayMax: 1, ReferenceTypeId: new UaNodeId( Identifier.HasDescription ) }
                                         ],
                             Properties: [
                                            { Name: "NodeVersion", DataType: Identifier.String, Required: false },
                                            { Name: "Icon", DataType: Identifier.Image, Required: false },
                                            { Name: "NamingRule", DataType:  Identifier.NamingRuleType, Required: false }
                                         ] };

var baseObjectTypeDefinition = { Name: "ObjectType NodeClass",
                                 Attributes: [
                                                 { Name: "IsAbstract", AttributeId:Attribute.IsAbstract, DataType:Identifier.Boolean, Required: true }
                                             ].concat( baseNodeClassDefinition.Attributes ),
                                 References: [
                                                { BrowseName: "HasComponent", ReferenceTypeId: new UaNodeId( Identifier.HasComponent ) },
                                                { BrowseName: "HasProperty", ReferenceTypeId: new UaNodeId( Identifier.HasProperty ) },
                                                { BrowseName: "HasSubType", ReferenceTypeId: new UaNodeId( Identifier.HasSubtype ) },
                                                { BrowseName: "GeneratesEvent", ReferenceTypeId: new UaNodeId( Identifier.GeneratesEvent ) }
                                             ],
                                 Properties: [
                                                { Name: "NodeVersion", DataType: Identifier.String },
                                                { Name: "Icon", DataType: Identifier.Image }
                                             ] };

var baseVariableDefinition = { Name: "Variable NodeClass",
                               Attributes: [
                                                { Name: "Value", AttributeId:Attribute.Value, DataType:Identifier.BaseDataType, Required: true },
                                                { Name: "DataType", AttributeId:Attribute.DataType, DataType:Identifier.NodeId, Required: true },
                                                { Name: "ValueRank", AttributeId:Attribute.ValueRank, DataType:Identifier.Int32, Required: true },
                                                { Name: "ArrayDimensions", AttributeId:Attribute.ArrayDimensions, DataType:Identifier.UInt32, IsArray: true, Required: false },
                                                { Name: "AccessLevel", AttributeId:Attribute.AccessLevel, DataType:Identifier.Byte, Required: true },
                                                { Name: "UserAccessLevel", AttributeId:Attribute.UserAccessLevel, DataType:Identifier.Byte, Required: true },
                                                { Name: "MiminumSamplingInterval", AttributeId:Attribute.MinimumSamplingInterval, DataType:Identifier.Duration, Required: false },
                                                { Name: "Historizing", AttributeId:Attribute.Historizing, DataType:Identifier.Boolean, Required: true }
                                           ].concat( baseNodeClassDefinition.Attributes ),
                               References: [
                                                { BrowseName: "HasModellingRule", ArrayMin: 0, ArrayMax: 1, ReferenceTypeId: new UaNodeId( Identifier.HasModellingRule ) },
                                                { BrowseName: "HasProperty", ReferenceTypeId: new UaNodeId( Identifier.HasProperty ) },
                                                { BrowseName: "HasComponent", ReferenceTypeId: new UaNodeId( Identifier.HasComponent ) },
                                                { BrowseName: "HasTypeDefinition", ArrayMin: 1, ArrayMax: 1, ReferenceTypeId: new UaNodeId( Identifier.HasTypeDefinition ) },
                                                { BrowseName: "HasModelParent", ReferenceTypeId: new UaNodeId( Identifier.HasModelParent ) }
                                           ],
                               Properties: [
                                                { Name: "NodeVersion", DataType: Identifier.String, Required: false },
                                                { Name: "LocalTime", DataType: Identifier.TimeZoneDataType, Required: false },
                                                { Name: "DataTypeVersion", DataType:  Identifier.String, Required: false },
                                                { Name: "DictionaryFragment", DataType:  Identifier.ByteString, Required: false },
                                                { Name: "AllowNulls", DataType: Identifier.Boolean, Required: false },
                                                { Name: "ValueAsText", DataType: Identifier.LocalizedText, Required: false },
                                                { Name: "MaxStringLength", DataType: BuiltInType.UInt32, Required: false },
                                                { Name: "MaxArrayLength", DataType: BuiltInType.UInt32, Required: false },
                                                { Name: "EngineeringUnits", DataType: typeof( UaEUInformation ), Required: false }
                                           ] };

var baseVariableTypeDefinition = { Name: "VariableType NodeClass",
                                   Attributes: [
                                                    { Name: "Value", AttributeId:Attribute.Value, DataType:Identifier.BaseDataType, Required: false },
                                                    { Name: "DataType",AttributeId: Attribute.DataType, DataType:Identifier.NodeId, Required: true },
                                                    { Name: "ValueRank", AttributeId:Attribute.ValueRank, DataType:Identifier.Int32, Required: true },
                                                    { Name: "ArrayDimensions", AttributeId:Attribute.ArrayDimensions, DataType:Identifier.UInt32, IsArray: true },
                                                    { Name: "IsAbstract", AttributeId:Attribute.IsAbstract, DataType:Identifier.Boolean, Required: true }
                                               ].concat( baseNodeClassDefinition.Attributes ),
                                   References: [
                                                    { BrowseName: "HasProperty", ReferenceTypeId: new UaNodeId( Identifier.HasProperty ) },
                                                    { BrowseName: "HasComponent", ReferenceTypeId: new UaNodeId( Identifier.HasComponent ) },
                                                    { BrowseName: "HasSubType", ReferenceTypeId:  new UaNodeId( Identifier.HasSubtype ) },
                                                    { BrowseName: "GeneratesEvent", ReferenceTypeId: new UaNodeId( Identifier.GeneratesEvent ) }
                                               ],
                                   Properties: [
                                                    { Name: "NodeVersion", DataType: Identifier.String }
                                               ] };

var baseMethodDefinition = { Name: "Method NodeClass",
                             Attributes: [
                                            { Name: "Executable", AttributeId:Attribute.Executable, DataType:Identifier.Boolean, Required: true },
                                            { Name: "UserExecutable", AttributeId: Attribute.Executable, DataType:Identifier.Boolean, Required: true }
                                         ].concat( baseNodeClassDefinition.Attributes ),
                             References: [
                                            { BrowseName: "HasProperty", ReferenceTypeId: new UaNodeId( Identifier.HasProperty ) },
                                            { BrowseName: "HasModellingRule", ArrayMin: 0, ArrayMax: 1, ReferenceTypeId: new UaNodeId( Identifier.HasModellingRule ) },
                                            { BrowseName: "HasModelParent", ArrayMin: 0, ArrayMax: 1, ReferenceTypeId: new UaNodeId( Identifier.HasModelParent ) },
                                            { BrowseName: "GeneratesEvent", ReferenceTypeId: new UaNodeId( Identifier.GeneratesEvent ) },
                                            { BrowseName: "AlwaysGeneratesEvent", ReferenceTypeId: new UaNodeId( Identifier.AlwaysGeneratesEvent ) }
                                         ],
                             Properties: [
                                            { Name: "NodeVersion", DataType: Identifier.String },
                                            { Name: "InputArguments", DataType: Identifier.Argument, IsArray: true },
                                            { Name: "OutputArguments", DataType: Identifier.Argument, IsArray: true }
                                         ] };

var baseDataTypeDefinition = { Name: "DataType NodeClass",
                               Attributes: [
                                                { Name: "IsAbstract", AttributeId:Attribute.IsAbstract, DataType:Identifier.Boolean, Required: true }
                                           ].concat( baseNodeClassDefinition.Attributes ),
                               References: [
                                                { BrowseName: "HasProperty", ReferenceTypeId: new UaNodeId( Identifier.HasProperty ) },
                                                { BrowseName: "HasSubType", ReferenceTypeId: new UaNodeId( Identifier.HasSubtype ) },
                                                { BrowseName: "HasEncoding", ReferenceTypeId: new UaNodeId( Identifier.HasEncoding ) }
                                           ],
                               Properties: [
                                                { Name: "NodeVersion", DataType: Identifier.String },
                                                { Name: "EnumStrings", DataType: Identifier.LocalizedText, IsArray: true }
                                           ] };

/* Simple factory pattern that receives a Node for testing and will determine which form of validation 
   the node should receive based on its NodeClass value (which defines the TYPE of node). */
function factoryNodeValidator( item ) {
    var result = null;
    var val = ( isDefined( item.NodeClass )? item.NodeClass : item );
    // blanket use of one form of validation for now
    switch( val ) {
        case NodeClass.Unspecified:    addError( "NodeClass 'unspecified' is not legal!" ); break;
        case NodeClass.Object:         result = baseObjectDefinition; break;
        case NodeClass.Variable:       result = baseVariableDefinition; break;
        case NodeClass.Method:         result = baseMethodDefinition; break;
        case NodeClass.ObjectType:     result = baseObjectTypeDefinition; break;
        case NodeClass.VariableType:   result = baseVariableTypeDefinition; break;
        case NodeClass.ReferenceType:  result = baseReferenceTypeDefinition; break;
        case NodeClass.DataType:       result = baseDataTypeDefinition; break;
        case NodeClass.View:           result = baseViewDefinition; break;
    }
    if( result === null ) addError( "factoryNodeValidator couldn't return a validator for NodeClass " + NodeClass.toString( NodeClass ) + " (value: " + val + ")" );
    return( result );
}

function walkThruAddressSpace() {
    resetWalkthroughTest( MAX_NODES_TO_TEST );// called in NodeIsOfCompliantType.js; allows walkthrough to occur.
    // define the root item, that is our starting point... we know its data type too!
    var rootItem = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.RootFolder ), 1 )[0];
    rootItem.NodeClass = NodeClass.Object;
    // recursively walk through the servers address space
    var result = Assert.True( ReadNode( rootItem, factoryNodeValidator ), "Address space NodeClass compliance issues detected.", "NodeClass complies." ); 
    return ( result );
}

Test.Execute( { Procedure: walkThruAddressSpace } );