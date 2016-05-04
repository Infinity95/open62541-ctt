/*  Test 1; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Call GetEndpoints to identify a secure endpoint to attach that is 128Rsa15: 
            � Open a secure channel, use Sign only (if available; else exit).
            � Create a session using Anonymous if available, otherwise use UserNamePassword.
            � Close the channel immediately.
    Expectation:  Connection is successful. */

function basic128rsa15001() {
    if( epSecureSign === null ) {
        addSkipped( "A secure channel is not available that supports just message signing." );
        return( false );
    }
    // establish a non-secure connection to the server, while specifying certs and nonces
    if( !Test.Connect( { OpenSecureChannel: { RequestedSecurityPolicyUri: SecurityPolicy.policyFromString( epSecureSign.SecurityPolicyUri ),
                                              MessageSecurityMode: epSecureSign.SecurityMode } } ) ) return( false );

    var overrides = null;
    if( findAnonymousInEndpoints( epSecureSign ) ) overrides = new UserCredentials( { policy:UserTokenType.Anonymous } );
    else if( findUsernameInEndpoints( epSecureSign ) ) overrides = UserCredentials.createFromSettings( PresetCredentials.AccessGranted1, UserTokenType.UserName )
    else {
        addError( "Secure endpoint located, but could not find userIdentityToken (anonymous or usernamePassword) available." );
        return( false );
    }

    // create the session
    if( overrides !== null ) {
        // now activate the session using the anonymous user identity token
        if( ActivateSessionHelper.Execute( { Session: Test.Session, 
                                             UserIdentityToken: UaUserIdentityToken.FromUserCredentials( { 
                                                     Session: Test.Session,
                                                     UserCredentials: overrides } ) } ) ) {
            Test.Disconnect();
        }
    }
    return( true );
}

Test.Execute( { Procedure: basic128rsa15001 } );