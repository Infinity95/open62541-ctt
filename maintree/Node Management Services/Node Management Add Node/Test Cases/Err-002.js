/*  Test prepared by Development; compliance@opcfoundation.org
    Description: add a node but do not specify any properties. */

function addNodesTest() {
    // is the max # of operations defined in server capabilities? if not, arbitrarily choose 100
    var maxOperations = gServerCapabilities.OperationLimits.MaxNodesPerNodeManagement;
    if( maxOperations === 0 ) maxOperations = 100;

    if( CUVariables.Debug ) print( "Preparing to request adding " + maxOperations + " nodes to the address space..." );

    var parameters = { 
        Debug: CUVariables.Debug,
        NodesToAdd: [ ],
        ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadTooManyOperations ] ) };

    var maxOperationsCount = maxOperations + ( maxOperations / 2 );
    for( var i=0; i<maxOperationsCount; i++ ) {
        // add the new node
        parameters.NodesToAdd.push( UaAddNodesItem.New( { 
                        BrowseName: BrowseName.New( { NodeClass: NodeClass.Variable } ),
                        RequestedNewNodeId: CUVariables.RequestedNewNodeId(),
                        NodeAttributes: UaVariableAttributes.New( {
                                AccessLevel: AccessLevel.CurrentReadOrWrite, 
                                BrowseName: BrowseName.New( { NodeClass: NodeClass.Variable } ),
                                DataType: new UaNodeId( BuiltInType.Double ),
                                Description: "My test variable",
                                DisplayName: "variable_double",
                                Historizing: false,
                                MinimumSamplingInterval: 100,
                                SpecifiedAttributes: CUVariables.SupportedAttributes.Value,
                                UserAccessLevel: AccessLevel.CurrentReadOrWrite, 
                                UserWriteMask: 0,
                                Value: UaVariant.New( { Value: 16.1234, Type: BuiltInType.Double} ),
                                ValueRank: ValueRank.Scalar,
                                WriteMask: 0,
                                ToExtensionObject: true } ), 
                        ParentNodeId: CUVariables.RootNode.NodeId, 
                        TypeDefinition:  new UaNodeId( Identifier.BaseDataVariableType ), 
                        ReferenceTypeId: new UaNodeId( Identifier.Organizes ), 
                        NodeClass: NodeClass.Variable } ) );
    }//for i...

    // invoke the call.
    var result = AddNodeIdsHelper.Execute( parameters );

    // if the call was good then log a warning that the Server should revise its OperationLimits
    if( AddNodeIdsHelper.Response.ResponseHeader.ServiceResult.isGood() ) addWarning( "The Server accepted a call with 50% more items than it claims to support in a single call.\nThis is OK, but it is misleading.\nPerhaps consider revising ServerCapabilities.OperationLimits.MaxNodesPerNodeManagement" );

    return( result );
}

Test.Execute( { Procedure: addNodesTest } );