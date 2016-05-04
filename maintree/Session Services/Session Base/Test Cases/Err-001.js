/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Create 2 Sessions with default parameters, but use the same clientNonce for both sessions.
        Expect error Bad_NonceInvalid for the 2nd session, or Good (if server doesn't monitor nonces). */

function createSession561Err001() {
    if( !isDefined( epSecureEncrypt ) ) {
        addSkipped( SKIP_NOSECUREENDPOINT );
        return( false );
    }
    var result = true;
    if( !Test.Channel.IsSecure() ) {
        // establish a secure connection
        CloseSecureChannelHelper.Execute( { Channel: Test.Channel } );
        if( !openSecureChannel() ) {
            addSkipped( "Channel is not secure. Could not create a secure channel. Cannot perform test.\nMake sure there is no 'man-in-the-middle', e.g. UACTT monitoring UA calls etc." );
            result = false;
        }
        else if( Assert.True( Test.Channel.IsSecure(), "Expected a SECURE channel." ) ) {
            var session = new CreateSessionService( { Channel: Test.Channel } );
            if( session.Execute() ) { // create session 1
                if( ActivateSessionHelper.Execute( { Session: session } ) ) {
                    var session1Nonce = session.Request.ClientNonce;
                    var session2 = new CreateSessionService( { Channel: Test.Channel } );
                    if( session2.Execute( { ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.BadNonceInvalid, StatusCode.Good ] ), ClientNonce: session1Nonce } ) ) {
                        CloseSessionHelper.Execute( { Session: session2, ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadSessionNotActivated ) } );
                    }
                    CloseSessionHelper.Execute( { Session: session } ); // close session #1
                }
            }
        }
    }
    // open a new [default] channel
    Test.Disconnect( { SkipCloseSession: true } );
    openDefaultChannel();
    return( result );
}

Test.Execute( { Procedure: createSession561Err001 } );