include( "./library/ServiceBased/NodeManagementServiceSet/DeleteReferences.js" );

function deleteReferencesTest() {
    // create an instance of the DeleteNodes helper object 
    var DeleteReferencesHelper = new DeleteReferencesService( Test.Session );

    // delete the specified node (expected to fail since we don't actually know a NodeId to specify 
    result = DeleteReferencesHelper.Execute( { 
        ReferencesToDelete: [
            UaDeleteReferencesItem.New( { 
                IsForward: true,
                SourceNodeId: new UaNodeId( Identifier.RootFolder ),
                TargetNodeId: new UaNodeId( Identifier.ObjectNode ),
                ReferenceTypeId: new UaNodeId( Identifier.HasComponent ) } )
            ],
        ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadServiceUnsupported ) 
        } );

    return( result );
}

Test.Execute( { Procedure: deleteReferencesTest } );