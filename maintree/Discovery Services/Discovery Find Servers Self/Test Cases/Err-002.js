/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:Include authenticationToken in requestHeader.
    Expected results:Bad_InvalidArgument, or Good and contains default Url */

function fsErr002() {
    FindServersHelper.Request.RequestHeader.AuthenticationToken = UaNodeId.fromString( "ns=0;s=dontExist" );
}

function findServers551Err002()
{
    FindServersHelper.Execute( {
            EndpointUrl: readSetting( "/Server Test/Server URL" ),
            PreHook: fsErr002,
            ExpectedResults: new ExpectedAndAcceptedResults( [ StatusCode.BadInvalidArgument, StatusCode.Good ] )
        } );

    // so the call succeeded, but did we receive StatusCode.Good? if so then check for a default Url
    if( FindServersHelper.Response.ResponseHeader.ServiceResult.StatusCode === StatusCode.Good ) {
        if( Assert.GreaterThan( 0, FindServersHelper.Response.Servers.length, "Expected to receive a default endpointUrl, but FindServers.Response.Servers was empty." ) ) {
            Assert.GreaterThan( 0, FindServersHelper.Response.Servers[0].DiscoveryUrls.length, "Expected to receive a default endpointUrl, but FindServers.Response.Servers[0].DiscoveryUrls is empty." );
        }//assert
    }//good?
    return( true );
}

Test.Execute( { Procedure: findServers551Err002 } );