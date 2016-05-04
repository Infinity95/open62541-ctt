/*  Test 3; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Call GetEndpoints to identify a secure endpoint to attach that is 256; connect using 128Rsa15.
    Expectation: Connection fails and the server does not send a response. */

function basic256003() {
    const SUPPRESS_ERROR = true;
    if( epSecureEncrypt === null ) {
        addSkipped( "A secure channel is not available that supports message signing and encryption." );
        return( false );
    }
    // do not do this test if the server actually supports basic256
    for( var i=0; i<totalEndpoints; i++ ) {
        if( gServerCapabilities.Endpoints[i].SecurityPolicyUri === SECURITY_POLICYURI_BASIC128RSA15 ) { 
            addSkipped( "Server supports the Basic128Rsa15 policy which means it will accept this connection." );
            return( false );
        }
    }//for i...

    if( Test.Connect( { OpenSecureChannel: {
                                RequestedSecurityPolicyUri: SecurityPolicy.Basic128Rsa15,
                                MessageSecurityMode: epSecureEncrypt.SecurityMode,
                                ServerUrl: epSecureEncrypt.EndpointUrl } } ) ) {
        addError( "Connected a secure channel to the server, although the encryption was different to what the server was expected (used 256, server was expecting 128Rsa15)." );
        Test.Disconnect();
    }
    return( true );
}

Test.Execute( { Procedure: basic256003 } );