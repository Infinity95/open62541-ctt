/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Test type-definition is in address-space */

include( "./library/Information/_Base/NodeContainsSubStructure.js" );

IM_DataItemType.prototype = new IM();
IM_DataItemType.constructor = IM_DataItemType;
function IM_DataItemType() { 
    this.Name = "DataItemType";
    this.UaPart8 = "5.3.1";
    this.References = [
            new IM_ReferenceDefinition( { 
                        ReferenceTypeId: Identifier.HasProperty, 
                        BrowseName: "AnalogItemType", 
                        NodeClass: NodeClass.VariableType,
                        TypeDefinition: new UaExpandedNIDHelper( Identifier.HasSubtype ) } ),
            new IM_ReferenceDefinition( { 
                        ReferenceTypeId: Identifier.HasProperty, 
                        BrowseName: "DiscreteItemType", 
                        NodeClass: NodeClass.VariableType,
                        TypeDefinition: new UaExpandedNIDHelper( Identifier.HasSubtype ) } ),
            new IM_ReferenceDefinition( { 
                        ReferenceTypeId: Identifier.HasProperty, 
                        BrowseName: "ArrayItemType", 
                        NodeClass: NodeClass.VariableType,
                        TypeDefinition: new UaExpandedNIDHelper( Identifier.HasSubtype ) } ),
            new IM_ReferenceDefinition( { 
                        ReferenceTypeId: Identifier.HasProperty, 
                        BrowseName: "Definition", 
                        NodeClass: NodeClass.Variable,
                        TypeDefinition: new UaExpandedNIDHelper( Identifier.PropertyType ), 
                        DataType: BuiltInType.String, 
                        IsArray: false,  
                        Required: false } ),
            new IM_ReferenceDefinition( { 
                        ReferenceTypeId: Identifier.HasProperty, 
                        BrowseName: "ValuePrecision", 
                        NodeClass: NodeClass.Variable,
                        TypeDefinition: new UaExpandedNIDHelper( Identifier.PropertyType ), 
                        DataType: BuiltInType.Double, 
                        IsArray: false,  
                        Required: false } )
            ];
}//IM


function testDataItemTypeDefinition() {
    // variables and objects needed for the test
    return( TBPTNI.CheckChildStructure( {
            StartingNode:  MonitoredItem.fromNodeIds( new UaNodeId( Identifier.DataItemType ) )[0], 
            ObjectDefinition: new IM_DataItemType(), 
            TranslateBrowsePathsToNodeIdsHelper: TranslateBrowsePathsToNodeIdsHelper 
            } ) );
}

Test.Execute( { Procedure: testDataItemTypeDefinition } );