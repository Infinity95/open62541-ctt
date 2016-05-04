/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Send application certificate for a different application (the applicationUri in the ApplicationDescription does not match the applicationUri in the client 
        certificate).Check the diagnostic return data. Service result = �Bad_CertificateUriInvalid�. Verify the diagnostics match what was requested. */

function createSession561err003() {
    // this test needs a SECURE channel
    if( epSecureEncrypt === null ) { 
        addSkipped( "Secure channel unavailable. Skipping test." );
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
            if( session.Execute( { ApplicationUri: "urn:localhost:WrongApplicationUri", 
                                   ForceClientCertificate: true,
                                   ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadCertificateUriInvalid ) } ) ) {
                var clientCertDER = UaPkiCertificate.fromDER( session.Request.ClientCertificate );
                // check if the server returned diagnostics
                if( UaDiagnosticInfos.IsEmpty( session.Response.ResponseHeader.ServiceDiagnostics ) ) addWarning( "Server Diagnostics are empty. Diagnostics are STRONGLY recommended." );
            }
            else addError( "CreateSession() Expected to receive 'Bad_CertificateUriInvalid' because CreateSession.Request.ClientDescription.ApplicationUri is '" + session.Request.ClientDescription.ApplicationUri + "'; which does not match the ClientCertificate.ApplicationUri which is '" + clientCertDER.ApplicationUri + "'."  );
        }
    }
    // open an insecure connection
    Test.Disconnect( { SkipCloseSession: true } );
    openDefaultChannel();
    return( result );
}

Test.Execute( { Procedure: createSession561err003 } );