/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Test type-definition is in address-space */

include( "./library/Information/_Base/NodeContainsSubStructure.js" );


IM_TwoStateDiscreteType.prototype = new IM();
IM_TwoStateDiscreteType.constructor = IM_TwoStateDiscreteType;
function IM_TwoStateDiscreteType() { 
    this.Name = "TwoStateDiscreteType";
    this.UaPart8 = "5.3.3.2";
    this.References = [
            new IM_ReferenceDefinition( { 
                        ReferenceTypeId: Identifier.HasProperty, 
                        BrowseName: "TrueState", 
                        NodeClass: NodeClass.Variable,
                        TypeDefinition: new UaExpandedNIDHelper( Identifier.PropertyType ), 
                        DataType: BuiltInType.LocalizedText, 
                        IsArray: false,  
                        Required: true } ),
            new IM_ReferenceDefinition( { 
                        ReferenceTypeId: Identifier.HasProperty, 
                        BrowseName: "FalseState", 
                        NodeClass: NodeClass.Variable,
                        TypeDefinition: new UaExpandedNIDHelper( Identifier.PropertyType ), 
                        DataType: BuiltInType.LocalizedText, 
                        IsArray: false,  
                        Required: true } )
            ];
}//IM


function testTwoStateDiscreteTypeDefinition()
{
    // variables and objects needed for the test
    return( TBPTNI.CheckChildStructure( {
            StartingNode:  MonitoredItem.fromNodeIds( new UaNodeId( Identifier.TwoStateDiscreteType ) )[0], 
            ObjectDefinition: new IM_TwoStateDiscreteType(), 
            TranslateBrowsePathsToNodeIdsHelper: TranslateBrowsePathsToNodeIdsHelper 
            } ) );
}

Test.Execute( { Procedure: testTwoStateDiscreteTypeDefinition } );