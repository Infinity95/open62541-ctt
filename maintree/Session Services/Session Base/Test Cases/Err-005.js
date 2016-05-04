/*  Test prepared by Development; compliance@opcfoundation.org
    Description: Send an invalid (too short) client nonce. Receiving a Bad_NonceIdInvlalid. */

function createSession561Err005() {
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
            session.Execute( { ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadNonceInvalid ), ClientNonce: UaCryptoProvider.createRandomData( 8 ) } );
            if( session.Response.ResponseHeader.ServiceResult.StatusCode !== StatusCode.BadNonceInvalid ) addError( "CreateSession.Response.ResponseHeader.ServiceResult SHOULD be BadNonceInvalid because we specified a Nonce that is not 32-characters long. Nonce used in test: " + session.Request.ClientNonce );
        }
    }
    else result = false;
    // open a new [default] channel
    Test.Disconnect( { SkipCloseSession: true } );
    openDefaultChannel();
    return( result );
}

Test.Execute( { Procedure: createSession561Err005 } );