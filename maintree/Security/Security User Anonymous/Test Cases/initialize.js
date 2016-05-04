const CU_NAME = "Security None Application Certificates";

include( "./library/Base/safeInvoke.js" );
include( "./library/Base/Objects/expectedResults.js" );

function findAnonymousInEndpoints( epIndex ) {
    var s;
    for( var u=0; u<gServerCapabilities.Endpoints[epIndex].UserIdentityTokens.length; u++ ) {
        if( gServerCapabilities.Endpoints[epIndex].UserIdentityTokens[u].TokenType === UserTokenType.Anonymous ) {
            s = gServerCapabilities.Endpoints[epIndex];
            break;
        }
    }
    return( s );
}


// initialize some endpoints that will be useful to scripts
var epSecureChNone  = null;    // secure channel, no security
var epSecureEncrypt = null;    // secure channel, message encryption
var epCount = 0;

if( gServerCapabilities.Endpoints.length === 0 ) {
    Test.Connect();
    gServerCapabilities.GetServerCapabilties( Test.Session );
    Test.Disconnect();
}
for( var e=0; e<gServerCapabilities.Endpoints.length; e++ ) {
    // We are not interested in the HTTP protocol, so filter those out.
    var strEndpoint = gServerCapabilities.Endpoints[e].EndpointUrl;
    if( strEndpoint.substring( 0, 4 ) == "http" ) continue;
    // find an endpoint with no message security 
    if( gServerCapabilities.Endpoints[e].SecurityMode === MessageSecurityMode.None ) {
        epSecureChNone = findAnonymousInEndpoints( e );
        if( isDefined( epSecureChNone ) ) epCount += epSecureChNone.UserIdentityTokens.length;
    }
    // find a secure endpoint, with username/password
    if( gServerCapabilities.Endpoints[e].SecurityMode === MessageSecurityMode.SignAndEncrypt ) {
        epSecureEncrypt = findAnonymousInEndpoints( e );
        if( isDefined( epSecureEncrypt ) ) epCount += epSecureEncrypt.UserIdentityTokens.length;
    }
}
// check that we have an endpoing we can use
if( epCount === 0 ) addSkipped( "No Anonymous user identity tokens found for Endpoint: " +  readSetting( "/Server Test/Server URL" ).toString()  + ". Aborting test." );

print( "\n\n\n***** CONFORMANCE UNIT '" + CU_NAME + "' INITIALIZATION COMPLETE - TESTS STARTING ******\n" );