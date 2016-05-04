/*  Test prepared by Development; compliance@opcfoundation.org
    Description: specify more nodes than the server reports as supported.
    
        How this test works:
            Part 1: Add twice as many nodes to the address space, as server claims to support in a single call 
            Part 2: Try to remove ALL of the nodes in a single call. */

function deleteNodesTest() {
    var result = true;

    // is the max # of operations defined in server capabilities? if not, arbitrarily choose 100
    var maxOperations = gServerCapabilities.OperationLimits.MaxNodesPerNodeManagement;
    if( maxOperations === 0 ) maxOperations = 100;

    if( CUVariables.Debug ) print( "Preparing to add " + maxOperations + " nodes to the address space BEFORE we test deleting them..." );



    // PART ONE: ADD OUR ITEMS TO THE ADDRESS SPACE FIRST...

    var parameters = { 
        Debug: CUVariables.Debug,
        NodesToAdd: [ ],
        ServiceResult: new ExpectedAndAcceptedResults( StatusCode.Good ) };

    // add double the amount of nodes that are needed (specified as max supported)
    for( var z=0; z<2; z++ ) {
        for( var i=0; i<maxOperations; i++ ) {
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
        // invoke the call to add our items
        if( !AddNodeIdsHelper.Execute( parameters ) ) result = false;
    }//for z...




    // PART TWO: TRY TO DELETE ALL OF THE ITEMS IN THE ADDRESS SPACE
    //           This will be a two-part exercise because if the call succeeds then that's ok, but if 
    //           it fails then we need to systemmatically remove them to prevent contaminating the environment.

    // only continue if we were previously able to add the nodes.
    if( result ) { 
        // the previously added nodes should be cached in the "initialize.js" script. We can access them here to 
        // request their removal; ALL of them!
        var nodes = [];
        for( var i=0; i<CUVariables.AddedNodeIds.length; i++ ) nodes[i] = UaDeleteNodesItem.New( { NodeId: CUVariables.AddedNodeIds[i], DeleteTargetReferences: true } );
        if( !DeleteNodeIdsHelper.Execute( { NodesToDelete: nodes, ServiceResult: new ExpectedAndAcceptedResults( StatusCode.Good ), Debug: CUVariables.Debug } ) ) result = false;

        // if the call was good then log a warning that the Server should revise its OperationLimits
        if( DeleteNodeIdsHelper.Response.ResponseHeader.ServiceResult.isGood() ) {
            addWarning( "The Server accepted a call with 50% more items than it claims to support in a single call.\nThis is OK, but it is misleading.\nPerhaps consider revising ServerCapabilities.OperationLimits.MaxNodesPerNodeManagement" );
        }
        else {
            // the server didn't accept the deletion, but the items still exist in the address space. 
            // Now to remove them systemmatically, following the max # of operations defined by the Server.
            while( nodes.length > 0 ) {
                var nodesToDelete = [];
                for( var i=0; i<maxOperations; i++ ) nodesToDelete.push( nodes.shift() );
                DeleteNodeIdsHelper.Execute( { NodesToDelete: nodesToDelete, ServiceResult: new ExpectedAndAcceptedResults( StatusCode.Good ), Debug: CUVariables.Debug } );
            }//while count..
        }
    }

    return( result );
}

Test.Execute( { Procedure: deleteNodesTest } );