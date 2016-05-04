/*  Test 5; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:Attempt to open an insecure channel while providing an invalid certificate.
    Expectation: Connection is successful. */

function securityNone005() {
    // is the global variable "epSecureChNone" null? if so then we can't run
    if( epSecureChNone === null ) {
        addSkipped( "An insecure channel is not available." );
        return( false );
    }
    // session setup to use username/password? if so then skip
    if( readSetting( "/Server Test/Session/UserAuthenticationPolicy" ).toString() !== "0" ) {
        addSkipped( "Session setup to security (username/x509 etc.), skipping test. Please use Anonymous for this test (if supported)" );
        return( false );
    }
    // establish a non-secure connection to the server, while specifying certs and nonces
    var channelOverrides = {
            RequestedSecurityPolicyUri: SecurityPolicy.None,
            MessageSecurityMode: MessageSecurityMode.None,
            ClientCertificate: UaByteString.fromStringData( "hello world" ),
        };
    if( Assert.True( Test.Connect( { OpenSecureChannel: channelOverrides, SkipCreateSession: true } ), "Expected SecureChannel." ) ) {
        Test.Session = new CreateSessionService( { Channel: Test.Channel } );
        if( Assert.True( Test.Session.Execute(), "Unable to create a session" ) ) {
            Assert.True( ActivateSessionHelper.Execute( { Session: Test.Session } ), "Unable to activate a session." );
        }
        Test.Disconnect();
    }
    return( true );
}// function securityNone005()

Test.Execute( { Procedure: securityNone005 } );