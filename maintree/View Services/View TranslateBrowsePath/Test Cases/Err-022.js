/*    Test 5.4-Err-2 applied to TranslateBrowsePathsToNodeIds (5.7.3) prepared by Dale Pope dale.pope@matrikon.com
      Description: Given an empty/null authenticationToken; When TranslateBrowsePathsToNodeIds is called; Then the server returns service error Bad_SecurityChecksFailed. */

include( "./library/ClassBased/UaRequestHeader/5.4-Err-002.js" );

function Test573GenErr002Translate( request, response ) {
    return Test.Session.Session.translateBrowsePathsToNodeIds( request, response );
}

function Test573GenErr002Assert( request, response, expectedServiceResult ) {
    return( UaResponseHeader.IsValid( { Service: { Name: "TranslateBrowsePathsToNodeIds", Request: request, Response: response }, ServiceResult: expectedServiceResult } ) );
}

function Test573GenErr002() {
    var startingNodeSetting = "/Server Test/NodeIds/Paths/Starting Node 1";
    var startingNodeId = UaNodeId.fromString( readSetting( startingNodeSetting ).toString() );
    if( startingNodeId === undefined || startingNodeId === null ) {
        addSkipped( "[Configuration Issue?] Unable to conduct test. Check setting '" + startingNodeSetting + "'." );
        return( false );
    }
    var pathToBrowse = BrowseToDepth( Test.Session.Session, startingNodeId, BrowseDirection.Forward, 1, [] );
    // setup a valid request
    var request = CreateDefaultTranslateBrowsePathsToNodeIdsRequest( Test.Session.Session, [ startingNodeId ], [ pathToBrowse.browseNames ], [ pathToBrowse.referenceTypeIds ] );
    if( request == -1 ) {
        addError( "Test cannot be completed" );
        return( false );
    }
    var response = new UaTranslateBrowsePathsToNodeIdsResponse();
    TestNullAuthenticationToken( Test573GenErr002Translate, Test573GenErr002Assert, request, response );
    return( true );
}

Test.Execute( { Procedure: Test573GenErr002 } );