const CU_NAME = "Security Certificate Validation";
include( "./library/Base/safeInvoke.js" );

var epSecureChNone, epSecureEncrypt;        // endpoints to use within this CU
    
function initSecurityNone() {
    if( !Test.Connect( { SkipCreateSession: true } ) ) stopCurrentUnit();    // make sure we can connect to the server
    else Test.Disconnect( { SkipCloseSession: true } );                      // if connection success, then close the connection.

    for( var e=0; e<gServerCapabilities.Endpoints.length; e++ ) {            // iterate thru all endpoints
        var strEndpoint = gServerCapabilities.Endpoints[e].EndpointUrl;
        if( strEndpoint.substring( 0, 4 ) == "http" ) continue;              // We are not interested in the HTTP protocol, so filter those out.

        // find an endpoint with no message security
        if( gServerCapabilities.Endpoints[e].SecurityMode === MessageSecurityMode.None ) epSecureChNone = gServerCapabilities.Endpoints[e];

        // find a secure endpoint, with username/password
        if( gServerCapabilities.Endpoints[e].SecurityMode === MessageSecurityMode.SignAndEncrypt ) {
            if( gServerCapabilities.Endpoints[e].SecurityPolicyUri != SecurityPolicy.policyToString( SecurityPolicy.Basic256Sha256 ) ) {
                epSecureEncrypt = gServerCapabilities.Endpoints[e];
            }
        }
    }

    // we NEED an insecure channel capability for this conformance unit
    if( epSecureChNone === null ) {
        addSkipped( "No insecure endpoints available. Aborting test." );
        stopCurrentUnit();
    }

    // we also NEED a secure channel capability for some tests within this conformance unit
    if( epSecureEncrypt === null ) {
        addSkipped( "No secure endpoints available. Aborting test." );
        stopCurrentUnit();
    }
    print( "\n\n\n***** CONFORMANCE UNIT '" + CU_NAME + "' INITIALIZATION COMPLETE - TESTS STARTING ******\n" );
}

initSecurityNone();