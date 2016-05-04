/*    Test 5.7.1-16 prepared by Dale Pope dale.pope@matrikon.com
      Description: Given one node to browse; And the node exists; And the node has references of different types with different parent types;
          And a referenceTypeId (that is a parent of one of the references) is specified in the call; When Browse is called; Then the server 
          returns references of type referenceTypeId (if any)
          Validation is accomplished by first browsing all references on a node, storing the references of the specified type, and comparing those 
          references to the "ReferenceTypeId = [specified type]" references (expecting them to be equal).
          A hole in the test: if the Browse call returns only some references (i.e., requires BrowseNext), only the references returned by Browse
          are validated (because this is a Browse test, not BrowseNext). If all the returned references match the specified type, the test passes,
          even though calling BrowseNext might return references of the an unspecified type. */

function TestBrowseOneNodeWithParentReferenceTypeIdNoSubtypes( returnDiagnostics ) {
    const SETTING = "/Server Test/NodeIds/References/Has References With Different Parent Types";
    var nodeToBrowse = UaNodeId.fromString( readSetting( SETTING ).toString() );
    if( nodeToBrowse === undefined || nodeToBrowse === null ) {
        addSkipped( "[Configuration Issue?] Unable to conduct test. Check setting '/Server Test/NodeIds/References/Has References With Different Parent Types'." );
        return( false );
    }
    var allReferences = GetReferencesAndCountParentTypes( Test.Session.Session, nodeToBrowse );
    if( allReferences.length == 0 ) {
        addError( "Test cannot be completed: node must have at least two references." );
        return( false);
    }
    var request = GetTest1BrowseRequest( Test.Session.Session, nodeToBrowse );
    var response = new UaBrowseResponse();    
    request.RequestHeader.ReturnDiagnostics = returnDiagnostics;
    request.NodesToBrowse[0].ReferenceTypeId = GetReferenceTypeFirstParent( Test.Session.Session, allReferences[0].ReferenceTypeId );
    request.NodesToBrowse[0].IncludeSubtypes = false;

    uaStatus = Test.Session.Session.browse( request, response );

    if( uaStatus.isGood() ) {
        AssertBrowseValidParameter( request, response );
        var nodeRequest = request.NodesToBrowse[0];
        // collect expected references (those matching the specified ReferenceTypeId)
        var expectedReferences = GetReferencesOfType( allReferences, nodeRequest.ReferenceTypeId )
        // verify references
        var result = response.Results[0];
        AssertResultHasExpectedReferences( expectedReferences, result, allReferences.length )
        // all returned references should be of the expected type (handy for logging, otherwise redundant)
        if( result.References.length > 0 ) {
            for( var i = 0; i < result.References.length; i++ ) {
                Assert.NodeIdsEqual( nodeRequest.ReferenceTypeId, result.References[i].ReferenceTypeId, "Requested reference type does not match returned reference's type" );
            }
        }
        else addWarning( "No references returned that match the test-criteria. Please check setting '" + SETTING + "'." );
    }
    else addError( "browse() failed: " + uaStatus );
}

Test.Execute( { Procedure: function test() { 
    var result = TestBrowseOneNodeWithParentReferenceTypeIdNoSubtypes( 0 );
    if( !TestBrowseOneNodeWithParentReferenceTypeIdNoSubtypes( 0x3ff ) ) result = false;
    return( result ); } } );