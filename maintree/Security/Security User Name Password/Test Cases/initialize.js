const CU_NAME = "Security User Name Password";

include( "./library/Base/connectChannel.js" );
include( "./library/Base/safeInvoke.js" );
include( "./library/Base/Objects/expectedResults.js" );
include( "./library/ServiceBased/Helpers.js" );

const EMPTY_PASSWORD = "";
const EMPTY_USERNAME = "";
const EMPTY_ENCRYALG = "";
const BAD_PASSWORD = "abcd1234";
const BAD_USERNAME = "barneyRubbleUACTT";
const BAD_POLICYID = "abc123";
const BAD_ENCRYALG = "abc123";

/* Validate our CTT settings first, we need to be sure that we have ALL of the information
   needed for this CU, such as:
             Username
             Password */

var USERNAME = readSetting( "/Server Test/Session/LoginNameGranted1" ).toString();
if( USERNAME === undefined || USERNAME === null || USERNAME.length === 0 ) {
    addError( "Aborting conformance unit because the login credentials are not configured within the CTT settings under 'Server Test/Session'." );
    stopCurrentUnit();
}
var PASSWORD = readSetting( "/Server Test/Session/LoginPasswordGranted1" ).toString();
if( PASSWORD === undefined || PASSWORD === null || PASSWORD.length === 0 ) {
    addWarning( "Password is not configured, or is intentionally left empty. Please verify settings in 'Server Test/Session'." );
}

var LOGINDENIEDUSERNAME = readSetting( "/Server Test/Session/LoginNameAccessDenied" ).toString();
if( LOGINDENIEDUSERNAME === undefined || LOGINDENIEDUSERNAME === null || LOGINDENIEDUSERNAME.length === 0 ) {
    addWarning( "Password for a user with no access is not configured, or is intentionally left empty. Please verify settings in 'Server Test/Session'." );
}

var LOGINDENIEDPASSWORD = readSetting( "/Server Test/Session/LoginPasswordAccessDenied" ).toString();
if( LOGINDENIEDPASSWORD === undefined || LOGINDENIEDPASSWORD === null || LOGINDENIEDPASSWORD.length === 0 ) {
    addWarning( "Password for a user with no access is not configured, or is intentionally left empty. Please verify settings in 'Server Test/Session'." );
}

// Some functions useful to this CU
//
// this function searches the endpoints found in GETENDPOINTS to searches a specific response 
// entry (as defined by epIndex) for a UserIdentityToken of type UsernamePassword
function findUsernameInEndpoints( epIndex ) {
    var s = null;
    for( var u=0; u<gServerCapabilities.Endpoints[epIndex].UserIdentityTokens.length; u++ ) {
        if( gServerCapabilities.Endpoints[epIndex].UserIdentityTokens[u].TokenType === UserTokenType.UserName ) {
            s = gServerCapabilities.Endpoints[epIndex];
            break;
        }
    }
    return( s );
}


// initialize some endpoints that will be useful to scripts
var epSecureChNone  = null;    // secure channel, no security
var epSecureEncrypt = null;    // secure channel, message encryption


/* Step one: Get the list of Endpoints from the server.
             We need to find the identityToken for username/password that the server exposes so that 
             we may provide it to the server when we provide our credentials */

// Connect to the server
if( gServerCapabilities.Endpoints.length === 0 ) {
    if( !Test.Connect( { SkipCreateSession: true } ) ) stopCurrentUnit();
    else Test.Disconnect( { SkipCloseSession: true } );
}
if( gServerCapabilities.Endpoints.length > 0 ) {
    for( var e=0; e<gServerCapabilities.Endpoints.length; e++ ) {
        // We are not interested in the HTTP protocol, so filter those out.
        var strEndpoint = gServerCapabilities.Endpoints[e].EndpointUrl;
        if( strEndpoint.substring( 0, 4 ) == "http" ) continue;
        // find an endpoint with no message security
        if( gServerCapabilities.Endpoints[e].SecurityMode === MessageSecurityMode.None ) epSecureChNone = findUsernameInEndpoints( e );
        // find a secure endpoint, with username/password
        if( gServerCapabilities.Endpoints[e].SecurityMode === MessageSecurityMode.SignAndEncrypt ) {
            if( gServerCapabilities.Endpoints[e].SecurityPolicyUri != SecurityPolicy.policyToString( SecurityPolicy.Basic256Sha256 ) ) epSecureEncrypt = findUsernameInEndpoints( e );
        }
    }

    // we NEED an insecure channel capability for this conformance unit
    if( !isDefined( epSecureChNone ) ) addWarning( "No insecure endpoints detected. Some tests will be skipped." );
    else if( epSecureChNone.UserIdentityTokens.length === 0 ) addWarning( "No UserIdentityTokens configured on (non-secure) Endpoint: " + epSecureChNone.EndpointUrl + ". Those tests will be skipped." );

    // we also NEED a secure channel capability for some tests within this conformance unit
    if( !isDefined( epSecureEncrypt ) ) addWarning( "No Secure endpoints detected. Some tests will be skipped." );
    else if( epSecureEncrypt.UserIdentityTokens.length === 0 ) addWarning( "No UserIdentityTokens configured on (secure) Endpoint: " + epSecureEncrypt.EndpointUrl + ". Those tests will be skipped." );

    if( !isDefined( epSecureChNone ) && !isDefined( epSecureEncrypt ) ) {
        var message = "UserIdentityToken 'UserName' not found in GetEndpoints.\nUserName/Password is REQUIRED behavior, even for a Nano Server (the smallest of all Servers).";
        message += "\nEndpoints received:\n";
        for( var i=0; i<gServerCapabilities.Endpoints.length; i++ ) {
            message += "\t[" + i + "] SecurityMode: " + gServerCapabilities.Endpoints[i].SecurityMode + "; UserIdentityTokens #" + gServerCapabilities.Endpoints[i].UserIdentityTokens.length;
            for( var t=0; t<gServerCapabilities.Endpoints[i].UserIdentityTokens.length; t++ ) {
                message += "\n\t\t[" + t + "] = " + gServerCapabilities.Endpoints[i].UserIdentityTokens[t];
            }//for t...
        }//for i...
        addError( message );
        stopCurrentUnit();
    }
}
else stopCurrentUnit();

print( "\n\n\n***** CONFORMANCE UNIT '" + CU_NAME + "' INITIALIZATION COMPLETE - TESTS STARTING ******\n" );