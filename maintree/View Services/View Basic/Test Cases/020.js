/*    Test 5.7.1-22 prepared by Dale Pope dale.pope@matrikon.com
      Description: Given one node to browse: And the node exists; And a ReferenceTypeId (that matches a reference's grandparent) is specified in the call
          And IncludeSubtypes is true; When Browse is called; Then the server returns references of type referenceTypeId's child types, recursive
          Validation is accomplished by first browsing all references on a node, storing the references of the specified type or subtypes, and comparing those 
          references to the "ReferenceTypeId = [specified type or subtypes]" references (expecting them to be equal).
          A hole in the test: if the Browse call returns only some references (i.e., requires BrowseNext), only the references returned by Browse
          are validated (because this is a Browse test, not BrowseNext). If all the returned references match the specified type, the test passes,
          even though calling BrowseNext might return references of an unspecified type. */

function TestBrowseOneNodeWithGrandparentReferenceTypeIdSubtypes( returnDiagnostics ) {
    var nodeToBrowse = UaNodeId.fromString( readSetting( "/Server Test/NodeIds/References/Has References With Different Parent Types" ).toString() );
    if( nodeToBrowse === undefined || nodeToBrowse === null ) {
        addSkipped( "[Configuration Issue?] Unable to conduct test. Check setting '/Server Test/NodeIds/References/Has References With Different Parent Types'." );
        return( false );
    }
    var referenceTypes = [];
    var allReferences = GetReferencesAndCountParentTypes( Test.Session.Session, nodeToBrowse );
    if( allReferences.length == 0 ) {
        addError( "Test cannot be completed: the node must have at least two references." );
        return( false );
    }
    var request = GetTest1BrowseRequest( Test.Session.Session, nodeToBrowse );
    var response = new UaBrowseResponse();
    
    request.RequestHeader.ReturnDiagnostics = returnDiagnostics;
    request.NodesToBrowse[0].ReferenceTypeId = GetReferenceTypeFirstParent( Test.Session.Session, GetReferenceTypeFirstParent( Test.Session.Session, allReferences[0].ReferenceTypeId ) );
    request.NodesToBrowse[0].IncludeSubtypes = true;

    uaStatus = Test.Session.Session.browse( request, response );

    // check result
    if( uaStatus.isGood() ) {
        AssertBrowseValidParameter( request, response );

        var nodeRequest = request.NodesToBrowse[0];

        // collect expected references (those matching the specified ReferenceTypeId or its subtypes, recursive)
        var expectedTypes = [ nodeRequest.ReferenceTypeId ];
        expectedTypes = expectedTypes.concat( GetReferenceTypeSubtypes( nodeRequest.ReferenceTypeId, undefined, Test.Session.Session ) );
        var expectedReferences = GetReferencesOfTypes( allReferences, expectedTypes );

        // compare expected references to returned references
        var result = response.Results[0];
        AssertResultHasExpectedReferences( expectedReferences, result, allReferences.length );

        // all returned references should be of the expected type (handy for logging, otherwise redundant)
        AssertReferencesAreOfTypes( expectedTypes, result.References );
    }
    else addError( "Browse() failed: " + uaStatus, uaStatus );
}

Test.Execute( { Procedure: function test() {
    var result = TestBrowseOneNodeWithGrandparentReferenceTypeIdSubtypes( 0 );
    if( !TestBrowseOneNodeWithGrandparentReferenceTypeIdSubtypes( 0x3ff ) ) result = false;
    return( result );
} } );