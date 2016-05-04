/*  Test 4; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Initiate an insecure connection; CreateSession/ActivateSession, omitting a ClientNonce and client certificates.
    Expectation: Connection permitted. The Server may or may not return a nonce and/or certificate.
        IMPORTANT: This script uses the Login Name and Password defined in the CTT Settings. */

function applicationCertificates004() {
    if( epSecureChNone === null ) {
        addSkipped( "An insecure channel is not available." );
        return( false );
    }
    // establish a non-secure connection to the server
    if( !Test.Connect( { OpenSecureChannel: { RequestedSecurityPolicyUri: SecurityPolicy.None, 
                                              MessageSecurityMode: MessageSecurityMode.None },
                         SkipCreateSession: true } ) ) {
        addError( "Can't connect the channel to the server, therefore no sessions can be established. Aborting." );
        return( false );
    }
    // simple flag used to determine if test succeeds
    var result = true;
    // create the session, while specifying some overriding values
    Test.Session = new CreateSessionService( { Channel: Test.Channel } );
    if( Test.Session.Execute( { ProvideCertificates: false, ForceNonce:false, EndpointUrl: epSecureChNone.EndpointUrl } ) ) {
        // now activate the session using the anonymous user identity token
        if( ActivateSessionHelper.Execute( { 
                    Session: Test.Session, 
                    UserIdentityToken: UaUserIdentityToken.FromUserCredentials( { 
                            Session: Test.Session,
                            UserCredentials: new UserCredentials( { policy:UserTokenType.Anonymous } ) } ) } ) ) {
            CloseSessionHelper.Execute( { Session: Test.Session } );
            // check if the server returned a nonce or certificate.
            showCreateSessOptionalResponses( Test.Session.Response );
        }
    }
    return( Assert.True( result, "No endpoint found supporting an inecure channel supporting anonymous authentication.", "Successfully created a NON-SECURE channel and logged-in anonymously without sending a certificate or nonce." ) );
}

Test.Execute( { Procedure: applicationCertificates004 } );