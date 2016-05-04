/*  Test 2; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Secure Channel with Message Encryption: Connect to the Server and then specify a known good username and password (without encryption).
    Expectation: Session established. */

function username002() {
    if( epSecureEncrypt === null ) {
        addSkipped( "A secure channel providing message security is not available." );
        return( false );
    }
    // establish a secure connection to the server
    if( !Test.Channel.Execute( { 
                RequestedSecurityPolicyUri: epSecureEncrypt.SecurityPolicyUri, 
                MessageSecurityMode: epSecureEncrypt.SecurityMode } ) ) {
        addError( "Can't connect the secure channel to the server, therefore no sessions can be established. Aborting." );
        addError( "TIP: Check the UACTT is a trusted application! The certificate is defined in setting: '/Ua Settings/Certificates/ClientCertificate'." );
        return( false );
    }
    var testSuccess = false;
    for( var u=0; u<epSecureChNone.UserIdentityTokens.length; u++ ) {
        var strUserToken = UserTokenType.toString( epSecureChNone.UserIdentityTokens[u].TokenType );
        if( epSecureChNone.UserIdentityTokens[u].TokenType === UserTokenType.UserName ) {
            // create a session.
            Test.Session = new CreateSessionService( { Channel: Test.Channel } );
            if( Test.Session.Execute() ) {
                testSuccess = ActivateSessionHelper.Execute( { Session: Test.Session, 
                                                               UserIdentityToken: UaUserIdentityToken.FromUserCredentials( { 
                                                                       Session: Test.Session,
                                                                       UserCredentials: UserCredentials.createFromSettings( PresetCredentials.AccessGranted1, UserTokenType.UserName ) } ) } );
                CloseSessionHelper.Execute( { Session: Test.Session } );
            }
        }
    }//for u UserIdentityToken
    Test.Disconnect( { SkipCloseSession: true } );
    return( Assert.True( testSuccess, "No endpoint found supporting a Secure Channel, no MessageSecurity, that can use a username/password for authentication.", ( "Successfully created a SECURE channel and logged-in as: " + USERNAME + "; password: " + PASSWORD ) ) );
}

Test.Execute( { Procedure: username002 } );