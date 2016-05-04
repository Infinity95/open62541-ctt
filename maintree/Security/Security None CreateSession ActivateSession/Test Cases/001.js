/*  Test 1; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Initiate an insecure channel and then invoke a CreateSession/ActivateSession while providing certificates and nonces. Disconnect.
    Expectation: Connection permitted.
        IMPORTANT: This script uses the Login Name and Password defined in the CTT Settings. */

function applicationCertificates001() {
    if( epSecureChNone === null ) {
        addSkipped( "An insecure channel is not available." );
        return( false );
    }
    // establish a non-secure connection to the server
    if( !Test.Connect( { OpenSecureChannel: { RequestedSecurityPolicyUri: SecurityPolicy.None, MessageSecurityMode: MessageSecurityMode.None },
                         SkipCreateSession: true } ) ) {
         return( false );
    }

    // simple flag used to determine if test succeeds
    var result = true;

    // create the session, while specifying some overriding values
    Test.Session = new CreateSessionService( { Channel: Test.Channel } );
    if( Test.Session.Execute( { ProvideCertificates: true, 
                                ForceNonce: true, 
                                EndpointUrl: epSecureChNone.EndpointUrl } ) ) {
        if( ActivateSessionHelper.Execute( { Session: Test.Session, 
                                             UserIdentityToken: UaUserIdentityToken.FromUserCredentials( {
                                                      Session: Test.Session,
                                                      UserCredentials: new UserCredentials( { policy:UserTokenType.Anonymous } ) } ) } ) ) {
              CloseSessionHelper.Execute( { Session: Test.Session } );
        }
        else result = false;
    }
    return( Assert.True( result, "No endpoint found supporting an inecure channel supporting anonymous authentication.", "Successfully created a NON-SECURE channel and logged-in anonymously while passing a clientCertificate and nonce." ) );
}

Test.Execute( { Procedure: applicationCertificates001 } );