/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specify invalid information so as to check the contents of the DiagnosticInfo parameter. Send a ClientNonce that is less than 32 bytes.
        Server should populate the diagnostic info with pertinent information that outlines the cause of a failure. Service result is Bad_InvalidNonce. */

function createSession561Err002() {
    if( !isDefined( epSecureEncrypt ) ) {
        addSkipped( SKIP_NOSECUREENDPOINT );
        return( false );
    }
    var result = true;
    if( !Test.Channel.IsSecure() ) {
        addLog( "Closing an insecure channel to open a SECURE channel for this test." );
        // establish a secure connection
        CloseSecureChannelHelper.Execute( { Channel: Test.Channel } );
        if( !openSecureChannel() ) {
            addSkipped( "Channel is not secure. Could not create a secure channel. Cannot perform test.\nMake sure there is no 'man-in-the-middle', e.g. UACTT monitoring UA calls etc." );
            result = false;
        }
        else if( Assert.True( Test.Channel.IsSecure(), "Expected a SECURE channel." ) ) {
            var session = new CreateSessionService( { Channel: Test.Channel } );
            if( session.Execute( { ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadNonceInvalid ), ClientNonce: "1234567890123456", ReturnDiagnostics: 0xfff } ) ) {
                // close the secure channel/session
                CloseSessionHelper.Execute( { Session: session, ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadSessionIdInvalid ) } );
            }
        }
    }
    // open a new [default] channel
    Test.Disconnect( { SkipCloseSession: true } );
    openDefaultChannel();
    return( result );
}

Test.Execute( { Procedure: createSession561Err002 } );