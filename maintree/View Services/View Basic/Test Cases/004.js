/*    Test 5.7.1-5 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given one node to browse
            And the node exists
            And the node has references of different types
            And a referenceTypeId (that matches a reference) is specified in the call
            And includeSubtypes is false
          When Browse is called
          Then the server returns references of type referenceTypeId
          Validation is accomplished by first browsing all references on a node,
          storing the references of the specified type, and comparing those 
          references to the "ReferenceTypeId = [specified type]" references
          (expecting them to be equal).
          A hole in the test: if the Browse call returns only some references
          (i.e., requires BrowseNext), only the references returned by Browse
          are validated (because this is a Browse test, not BrowseNext). If 
          all the returned references match the specified type, the test passes,
          even though calling BrowseNext might return references of an
          unspecified type. */

function BrowseOneNodeWithReferenceTypeIdNoSubtypes( returnDiagnostics ) {
    var nodeToBrowse = UaNodeId.fromString( readSetting( "/Server Test/NodeIds/References/Has References With Different Parent Types" ).toString() );
    if( nodeToBrowse === undefined || nodeToBrowse === null ) {
        addSkipped( "[Configuration Issue?] Unable to conduct test. Check setting '/Server Test/NodeIds/References/Has References With Different Parent Types'." );
        return( false );
    }
    var referenceTypes = [];
    var allReferences = GetReferencesAndCountTypes( nodeToBrowse, referenceTypes, Test.Session.Session );
    if( allReferences.length == 0 ) {
        addSkipped( "Test cannot be completed: the node must have at least two references." );
        return( false );
    }
    addLog( "nodeToBrowse has " + allReferences.length + " references in total" );

    var request = GetTest1BrowseRequest( Test.Session.Session, nodeToBrowse );
    var response = new UaBrowseResponse();
    
    request.RequestHeader.ReturnDiagnostics = returnDiagnostics;
    request.NodesToBrowse[0].ReferenceTypeId = allReferences[0].ReferenceTypeId;
    request.NodesToBrowse[0].IncludeSubtypes = false;

    uaStatus = Test.Session.Session.browse( request, response );

    // check result
    if( uaStatus.isGood() ) {
        AssertBrowseValidParameter( request, response );
        var nodeRequest = request.NodesToBrowse[0];
        // collect expected references (those matching the specified ReferenceTypeId)
        var expectedReferences = GetReferencesOfType( allReferences, nodeRequest.ReferenceTypeId );
        addLog( "nodeToBrowse has " + expectedReferences.length + " references of the ReferenceTypeId" );
        // compare expected references to returned references
        var result = response.Results[0];
        // all returned references should be of the expected type (handy for logging, otherwise redundant)
        for( i = 0; i < result.References.length; i++ ) {
            Assert.NodeIdsEqual( nodeRequest.ReferenceTypeId, result.References[i].ReferenceTypeId, "Requested reference type does not match returned reference's type" );
        }
        AssertNodeReferencesInListNotOrdered( result.References, nodeRequest );
    }
    else {
        addError( "browse() failed: " + uaStatus );
        return( false );
    }
    return( true );
}

Test.Execute( { Procedure: function test() { 
    var result = BrowseOneNodeWithReferenceTypeIdNoSubtypes( 0 );
    if( !BrowseOneNodeWithReferenceTypeIdNoSubtypes( 0x3ff ) ) result = false; 
    return( result ); } } );