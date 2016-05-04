include( "./library/ServiceBased/NodeManagementServiceSet/AddReferences.js" );

function addReferencesTest() {
    // create an instance of the DeleteNodes helper object 
    var AddReferencesHelper = new AddReferencesService( Test.Session );

    // delete the specified node (expected to fail since we don't actually know a NodeId to specify 
    result = AddReferencesHelper.Execute( { 
        ReferencesToAdd: [
            UaAddReferencesItem.New( { 
                IsForward: true, 
                SourceNodeId: new UaNodeId( Identifier.RootFolder ), 
                ReferenceTypeId: new UaNodeId( Identifier.HasChild ) } ) ],
        ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadServiceUnsupported ) 
        } );

    return( result );
}

Test.Execute( { Procedure: addReferencesTest } );