/*    Test 5.7.2-9 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given one node to browse
            And the node exists
            And the node has at least three references of the same ReferenceType's subtype
            And RequestedMaxReferencesPerNode is 1
            And ReferenceTypeId is set to a ReferenceType NodeId
            And IncludeSubtypes is true
            And Browse has been called
          When BrowseNext is called
            And ReleaseContinuationPoints is false
          Then the server returns the second reference
            And ContinuationPoint is not empty
          Validation is accomplished by first browsing all references of a type
          on a node, then performing the test and comparing the second 
          reference to the reference returned by the BrowseNext call. So this
          test only validates that Browse two references is consistent with 
          Browse one reference followed by BrowseNext. */

include("./library/ServiceBased/ViewServiceSet/BrowseNext/referencetype_test.js")

Test.Execute( { Procedure: function test() {
    var nodeToBrowse = UaNodeId.fromString( readSetting( "/Server Test/NodeIds/References/Has References With Different Parent Types" ).toString() );
    if( nodeToBrowse === undefined || nodeToBrowse === null ) {
        addSkipped( "[Configuration Issue?] Unable to conduct test. Check setting '/Server Test/NodeIds/References/Has References With Different Parent Types'." );
        return( false );
    }
    var referenceTypeId = GetReferenceTypeWithThreeReferences( nodeToBrowse, Test.Session.Session );
    if( referenceTypeId == -1 ) {
        addSkipped( "Test cannot be completed: there are not three references of the same type." );
        return( false );
    }
    referenceTypeId = GetReferenceTypeFirstParent( Test.Session.Session, referenceTypeId );
    // get expected references and ensure they're of referenceTypeId or its subtypes
    expectedReferences = GetDefaultReferencesOfTypeFromNodeId( nodeToBrowse, referenceTypeId, true, Test.Session.Session );
    var matchingTypes = [ referenceTypeId ];
    matchingTypes = matchingTypes.concat( GetReferenceTypeSubtypes( referenceTypeId, undefined, Test.Session.Session ) );
    for( var i = 0; i < expectedReferences.length; i++ ) {
        var foundReference = false;
        for( var j = 0; j < matchingTypes.length; j++ ) {
            if( expectedReferences[i].ReferenceTypeId.equals( matchingTypes[j] ) ) {
                foundReference = true;
                break;
            }
        }
        if( !foundReference ) {
            addError( "Test cannot be completed: Browse returned references that did not match the ReferenceTypeId or its subtypes." );
            return( false );
        }
    }
    if( expectedReferences.length < 3 ) {
        addSkipped( "Test cannot be completed: node must have at least three references of the same type or subtype." );
        return( false );
    }
    // validate there is at least one type with a different parent
    allReferences = GetDefaultReferencesFromNodeId( Test.Session.Session, nodeToBrowse );
    if( expectedReferences.length >= allReferences.length ) {
        addSkipped( "Test cannot be completed: node must have at least one reference with a parent type that differs from the other references." );
        return( false );
    }
    // Browse for first reference
    var firstResponse = GetBrowseResponseForOneReferenceOfType( Test.Session.Session, nodeToBrowse, referenceTypeId, true );
    if( firstResponse == -1 ) {
        return( false );
    }
    // BrowseNext for second reference
    // And validate that the reference from BrowseNext is the second reference (expectedReferences[1])
    AssertBrowseNextReturnsReferences( Test.Session.Session, [ expectedReferences ], 1, firstResponse );
    return( true);
} } );