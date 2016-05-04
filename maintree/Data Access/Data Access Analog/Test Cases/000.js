/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Test type-definition is in address-space
    Revision History
        2012-09-12 NP: Initial version. */

include( "./library/Information/_Base/NodeContainsSubStructure.js" );


IM_AnalogItemType.prototype = new IM();
IM_AnalogItemType.constructor = IM_AnalogItemType;
function IM_AnalogItemType() { 
    this.Name = "AnalogItemType";
    this.UaPart8 = "5.3.2";
    this.References = [
            new IM_ReferenceDefinition( { 
                        ReferenceTypeId: Identifier.HasProperty, 
                        BrowseName: "InstrumentRange", 
                        NodeClass: NodeClass.Variable,
                        TypeDefinition: new UaExpandedNIDHelper( Identifier.PropertyType ), 
                        DataType: "Range", 
                        IsArray: false,  
                        Required: false } ),
            new IM_ReferenceDefinition( { 
                        ReferenceTypeId: Identifier.HasProperty, 
                        BrowseName: "EURange", 
                        NodeClass: NodeClass.Variable,
                        TypeDefinition: new UaExpandedNIDHelper( Identifier.PropertyType ), 
                        DataType: "Range", 
                        IsArray: false,  
                        Required: true } ),
            new IM_ReferenceDefinition( {
                        ReferenceTypeId: Identifier.HasProperty, 
                        BrowseName: "EngineeringUnits", 
                        NodeClass: NodeClass.Variable,
                        TypeDefinition: new UaExpandedNIDHelper( Identifier.PropertyType ), 
                        DataType: "EUInformation", 
                        IsArray: false,  
                        Required: false } )
            ];
}//IM


function testAnalogItemTypeDefinition()
{
    // variables and objects needed for the test
    return( TBPTNI.CheckChildStructure( {
            StartingNode:  MonitoredItem.fromNodeIds( new UaNodeId( Identifier.AnalogItemType ) )[0], 
            ObjectDefinition: new IM_AnalogItemType(), 
            TranslateBrowsePathsToNodeIdsHelper: TranslateBrowsePathsToNodeIdsHelper 
            } ) );
}

Test.Execute( { Procedure: testAnalogItemTypeDefinition } );