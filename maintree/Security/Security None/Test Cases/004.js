/*  Test 3; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Attempt to open an insecure channel, omitting a ClientNonce and client certificates.
    Expectation: Connection is successful.
        IMPORTANT: This script uses the Login Name and Password defined in the CTT Settings. */

function securityNone004() {
    if( epSecureChNone === null ) {
        addSkipped( "An insecure channel is not available." );
        return( false );
    }
    // establish a non-secure connection to the server, while specifying certs and nonces
    var channelOverrides = {
            RequestedSecurityPolicyUri: SecurityPolicy.None,
            MessageSecurityMode: MessageSecurityMode.None,
            ProvideCertificates: false,
            ProvideNonce: false
        };
    if( Assert.True( Test.Connect( { OpenSecureChannel: channelOverrides } ), "Expected SecureChannel." ) ) {
        Test.Disconnect();
    }
    return( true );
}

Test.Execute( { Procedure: securityNone004 } );