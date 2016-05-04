/*    Test 5.7.1-6 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given one node to browse
            And the node exists
            And the node has references of different types with different parents
            And a referenceTypeId (that matches a reference) is specified in the call
          When Browse is called
          Then the server returns references of type referenceTypeId
          Validation is accomplished by first browsing all references on a node,
          storing the references of the specified type or subtype, and comparing those 
          references to the "ReferenceTypeId = [specified type or subtype]" references
          (expecting them to be equal).
          A hole in the test: if the Browse call returns only some references
          (i.e., requires BrowseNext), only the references returned by Browse
          are validated (because this is a Browse test, not BrowseNext). If 
          all the returned references match the specified type, the test passes,
          even though calling BrowseNext might return references of an
          unspecified type. */

function TestBrowseOneNodeWithReferenceTypeIdWithSubtypes( returnDiagnostics ) {
    var nodeToBrowse = UaNodeId.fromString( readSetting( "/Server Test/NodeIds/References/Has References With Different Parent Types" ).toString() );
    if( !isDefined( nodeToBrowse ) ) {
        addSkipped( "[Configuration Issue?] Check setting '/Server Test/NodeIds/References/Has References With Different Parent Types'." );
        return( false );
    }
    var referenceTypes = [];
    var allReferences = GetReferencesAndCountTypes( nodeToBrowse, referenceTypes, Test.Session.Session );
    if( allReferences.length == 0 ) {
        addError( "Test cannot be completed: the node must have at least two references." );
        return( false );
    }
    var request = GetTest1BrowseRequest( Test.Session.Session, nodeToBrowse );
    var response = new UaBrowseResponse();    
    request.RequestHeader.ReturnDiagnostics = returnDiagnostics;
    request.NodesToBrowse[0].ReferenceTypeId = allReferences[0].ReferenceTypeId;
    request.NodesToBrowse[0].IncludeSubtypes = true;
    uaStatus = Test.Session.Session.browse( request, response );
    // check result
    if( uaStatus.isGood() ) {
        if( AssertBrowseValidParameter( request, response ) ) {
            var nodeRequest = request.NodesToBrowse[0];
            // collect expected references (those matching the specified ReferenceTypeId or its subtypes)
            var expectedTypes = [ nodeRequest.ReferenceTypeId ];
            expectedTypes = expectedTypes.concat( GetReferenceTypeSubtypes( new UaNodeId( Identifier.HasSubtype ), undefined, Test.Session.Session ) ); // nodeRequest.ReferenceTypeId ) );
            var expectedReferences = GetReferencesOfTypes( allReferences, expectedTypes );
            if( expectedReferences.length == allReferences.length ) {
                addError( "Test cannot be completed: all the node's references are the same type or are subtypes of the requested type." );
            }
            // compare expected references to returned references
            var resultRefs = response.Results[0].References;
            if( AssertNodeReferencesInListNotOrdered( expectedReferences, resultRefs ) ) {
                // all returned references should be of the expected type (handy for logging, otherwise redundant)
                var result = response.Results[0];
                AssertReferencesAreOfTypes( expectedTypes, result.References );
            }
        }
    }
    else addError( "browse() failed: " + uaStatus, uaStatus );
}// function TestBrowseOneNodeWithReferenceTypeIdWithSubtypes( returnDiagnostics )

Test.Execute( { Procedure: function test() {
    TestBrowseOneNodeWithReferenceTypeIdWithSubtypes( 0 );
    TestBrowseOneNodeWithReferenceTypeIdWithSubtypes( 0x3ff );
    return( true );
} } );