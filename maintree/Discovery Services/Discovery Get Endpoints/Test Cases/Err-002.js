/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Include authenticationToken in requestHeader.
    Expected results: Bad_InvalidArgument, or Good and contains default Url */

function geErr002() {
    addLog( "Overriding GetEndpoints.Request.RequestHeader.AuthenticationToken to have a value!" );
    GetEndpointsHelper.Request.RequestHeader.AuthenticationToken = UaNodeId.fromString( "ns=0;s=dontExist" );
}

function getEndpointsErr002() {
    if( OpenSecureChannelHelper.IsSecure() ) {
        addSkipped( "The channel is secure. An insecure channel is needed for this test." );
        return( false );
    }

    GetEndpointsHelper.Execute2( { EndpointUrl: readSetting( "/Server Test/Server URL" ), PreHook: geErr002, ExpectedResults: new ExpectedAndAcceptedResults( StatusCode.Good ) } );

    // so the call succeeded, but did we receive StatusCode.Good? if so then check for a default Url
    if( Assert.GreaterThan( 0, GetEndpointsHelper.Response.Endpoints.length, "With an authenticationToken provided when it should not be, expected a default endpoint but did not receive any!" ) ) {
        addLog( "FindServers() correctly returned a default endpointUrl even when an authenticationToken was incorrectly specified by the client." );
    }
    return( true );
}

Test.Execute( { Procedure: getEndpointsErr002 } );