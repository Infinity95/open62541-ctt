/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Test type-definition is in address-space */

include( "./library/Information/_Base/NodeContainsSubStructure.js" );

IM_MultiStateDiscreteType.prototype = new IM();
IM_MultiStateDiscreteType.constructor = IM_MultiStateDiscreteType;
function IM_MultiStateDiscreteType() { 
    this.Name = "MultiStateDiscreteType";
    this.UaPart8 = "5.3.3.3";
    this.References = [
            new IM_ReferenceDefinition( { 
                        ReferenceTypeId: Identifier.HasProperty, 
                        BrowseName: "EnumStrings", 
                        NodeClass: NodeClass.Variable,
                        TypeDefinition: new UaExpandedNIDHelper( Identifier.PropertyType ), 
                        DataType: BuiltInType.LocalizedText, 
                        IsArray: true,  
                        Required: true } )
            ];
}//IM


function testMultiStateDiscreteTypeDefinition()
{
    // variables and objects needed for the test
    TBPTNI.CheckChildStructure( {
            StartingNode:  MonitoredItem.fromNodeIds( new UaNodeId( Identifier.MultiStateDiscreteType ) )[0], 
            ObjectDefinition: new IM_MultiStateDiscreteType(), 
            TranslateBrowsePathsToNodeIdsHelper: TranslateBrowsePathsToNodeIdsHelper 
            } );
    return( true );
}

Test.Execute( { Procedure: testMultiStateDiscreteTypeDefinition } );