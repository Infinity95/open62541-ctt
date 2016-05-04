include( "./library/Base/safeInvoke.js" );

Test.Connect();
Test.Disconnect();

var endpointBas128, endpointBas256;
if( gServerCapabilities.Endpoints !== null && gServerCapabilities.Endpoints.length > 0 ) {
    for( var e=0; e<gServerCapabilities.Endpoints.length; e++ ) { // iterate thru all endpoints
        var currentEP = gServerCapabilities.Endpoints[e];
        if( currentEP.SecurityMode == MessageSecurityMode.SignAndEncrypt ) {
            if( currentEP.SecurityPolicyUri == SecurityPolicy.policyToString( SecurityPolicy.Basic128Rsa15 ) ) {
                endpointBas128 = currentEP;
            }
            else if( currentEP.SecurityPolicyUri = SecurityPolicy.policyToString( SecurityPolicy.Basic256 ) ) {
                endpointBas256 = currentEP;
            }
        }
    }//for e...
}
else {
    addError( "No secure endpoints available. Aborting tests." );
    stopCurrentUnit();
}

print( "\n\n\n***** CONFORMANCE UNIT 'Protocol TCP Binary UA Security' TEST SCRIPTS STARTING ******\n" );

print( "Endpoint endpointBas128: " + endpointBas128 );
print( "Endpoint endpointBas256: " + endpointBas256 );