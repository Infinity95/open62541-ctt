include( "./library/Base/safeInvoke.js" );
include( "./library/Base/array.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );
include( "./library/ServiceBased/Helpers.js" );

const SKIP_NOSECUREENDPOINT = "No secure endpoints available. Skipping test.";

// global endpoint objects for secure and insecure channels
var epSecureChNone, epSecureEncrypt;


function openDefaultChannel() {
    return( Test.Connect( { SkipCreateSession: true } ) );
}

function openSecureChannel() {
    return( Test.Connect( { SkipCreateSession: true, OpenSecureChannel: { RequestedSecurityPolicyUri:epSecureEncrypt.SecurityPolicyUri, MessageSecurityMode:epSecureEncrypt.SecurityMode } } ) );
}


if( openDefaultChannel() ) {
    // find a secure endpoint and an insecure endpoint; store them variables for easy access by our test-scripts
    for( var e=0; e<gServerCapabilities.Endpoints.length; e++ ) {
        // We are not interested in the HTTP protocol, so filter those out.
        var strEndpoint = gServerCapabilities.Endpoints[e].EndpointUrl;
        if( strEndpoint.substring( 0, 4 ) == "http" ) continue;
        // find a secure endpoint, with username/password
        if( gServerCapabilities.Endpoints[e].SecurityMode === MessageSecurityMode.SignAndEncrypt ) {
            if( gServerCapabilities.Endpoints[e].SecurityPolicyUri != SecurityPolicy.policyToString( SecurityPolicy.Basic256Sha256 ) ) epSecureEncrypt = gServerCapabilities.Endpoints[e];
        }
        // find an endpoint with no message security
        if( gServerCapabilities.Endpoints[e].SecurityMode === MessageSecurityMode.None ) epSecureChNone = gServerCapabilities.Endpoints[e];
    }
}