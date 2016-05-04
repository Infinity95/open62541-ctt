const CU_NAME = "Security None";

include( "./library/Base/connectChannel.js" );
include( "./library/Base/safeInvoke.js" );
include( "./library/Base/Objects/expectedResults.js" );
include( "./library/ServiceBased/Helpers.js" );


/* Step one: Get the list of Endpoints from the server. We need to find the identityToken for username/password that the server exposes so that 
             we may provide it to the server when we provide our credentials */

var g_pkiProvider;                          // security encrypter/decrypter
var GETENDPOINTS;                           // UA service call helper objects
var epSecureChNone, epSecureEncrypt;        // endpoints to use within this CU
    
function initSecurityNone() {
    if( Test.Connect( { SkipCreateSession: true } ) ) {
        Test.Disconnect( { SkipCloseSession: true } );
        for( var e=0; e<gServerCapabilities.Endpoints.length; e++ ) {
            // We are not interested in the HTTP protocol, so filter those out.
            var strEndpoint = gServerCapabilities.Endpoints[e].EndpointUrl;
            if( strEndpoint.substring( 0, 4 ) == "http" ) continue;
            // find an endpoint with no message security
            if( gServerCapabilities.Endpoints[e].SecurityMode === MessageSecurityMode.None ) epSecureChNone = gServerCapabilities.Endpoints[e];
            else if( gServerCapabilities.Endpoints[e].SecurityMode === MessageSecurityMode.Sign || gServerCapabilities.Endpoints[e].SecurityMode === MessageSecurityMode.SignAndEncrypt ) secureEndpointsExist = true;
        }

        var secureEndpointsExist = false;

        // we NEED an insecure channel capability for this conformance unit
        if( epSecureChNone === null ) {
            // we couldn't a SecurityNone endpoint; is this expected behavior given the /Server Test/Capabilities/SecurityNone_Enabled setting?
            if( gServerCapabilities.SecurityNone_Enabled ) {
                addError( "No secure endpoints available. Aborting test." );
                stopCurrentUnit();
            }
            else {
                notImplemented( "SecurityNone was not found in the GetEndpoints response.\nThis matches the CTT configuration setting /Server Test/Capabilities/SecurityNone_Enabled." );
                stopCurrentUnit();
            }
        }
        else {
            // we found a securityNone profile, but should we? this endpoint should be disabled if other security profiles exist
            if( secureEndpointsExist && !gServerCapabilities.SecurityNone_Enabled  ) {
                addError( "SecurityNone is available, but it should be disabled because other secure profiles are available (UA Part 7: SecurityNone Profile).\nSecurityNone should be an option that can be enabled via an administrator.\nIf an administrator activated SecurityNone then please set the CTT setting '/Server Test/Capabilities/SecurityNone Enabled'." );
                stopCurrentUnit();
            }
        }
        print( "\n\n\n***** CONFORMANCE UNIT '" + CU_NAME + "' INITIALIZATION COMPLETE - TESTS STARTING ******\n" );
    }
}

initSecurityNone();