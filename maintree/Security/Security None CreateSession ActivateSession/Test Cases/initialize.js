const CU_NAME = "Security None Application Certificates";

include( "./library/Base/connectChannel.js" );
include( "./library/Base/safeInvoke.js" );
include( "./library/Base/Objects/expectedResults.js" );
include( "./library/ServiceBased/Helpers.js" );

// Some functions useful to this CU
// this function searches the endpoints found in GETENDPOINTS to searches a specific response 
// entry (as defined by epIndex) for a UserIdentityToken of type UsernamePassword
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


function showCreateSessOptionalResponses( response ) {
    var s = "Upon creating the session, the return of optional parameters was:\n\tServerNonce: "
    s += ( response.ServerNonce.length >= 32 )? "Yes" : "No";
    s += "\n\tServerCertificate: ";
    s += ( response.ServerCertificate.length > 0 )? "Yes" : "No";
    addLog( s );
}

/* Step one: Get the list of Endpoints from the server.
             We need to find the identityToken for username/password that the server exposes so that 
             we may provide it to the server when we provide our credentials */


// initialize some endpoints that will be useful to scripts
var epSecureChNone  = null;    // secure channel, no security

if( gServerCapabilities.Endpoints.length === 0 ) {
    if( !Test.Connect( { SkipCreateSession: true } ) ) stopCurrentUnit();
}

for( var e=0; e<gServerCapabilities.Endpoints.length; e++ ) {
    // We are not interested in the HTTP protocol, so filter those out.
    var strEndpoint = gServerCapabilities.Endpoints[e].EndpointUrl;
    if( strEndpoint.substring( 0, 4 ) == "http" ) continue;
    // find an endpoint with no message security
    if( gServerCapabilities.Endpoints[e].SecurityMode === MessageSecurityMode.None ) epSecureChNone = findAnonymousInEndpoints( e );
}

// we NEED an insecure channel capability for this conformance unit
if( epSecureChNone.UserIdentityTokens.length === 0 ) {
    addError( "No Anonymous user identity configured on Endpoint: " + epSecureChNone.EndpointUrl + ". Aborting test." );
    stopCurrentUnit();
}

print( "\n\n\n***** CONFORMANCE UNIT '" + CU_NAME + "' INITIALIZATION COMPLETE - TESTS STARTING ******\n" );