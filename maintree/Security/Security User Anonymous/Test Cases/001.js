/*  Test 1; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Call GetEndpoints to locate an insecure endpoint that allows for anonymous logon. Establish a session via an insecure channel.
    Expectation: Connection permitted. */

Test.Execute( { Procedure: function noneAnonymous001() {
    if( epSecureChNone === null ) { addSkipped( "An insecure channel is not available for use with an Anonymous UserIdentityToken." ); return( false ); }
    var result = true;
    // establish a non-secure connection to the server
    if( Test.Connect( { OpenSecureChannel: { RequestedSecurityPolicyUri: SecurityPolicy.None, MessageSecurityMode: MessageSecurityMode.None }, SkipActivateSession: true } ) ) {
        if( !ActivateSessionHelper.Execute( { Session: Test.Session,
                                              UserIdentityToken: UaUserIdentityToken.FromUserCredentials( {
                                                 Session: Test.Session.Session,
                                                 UserCredentials: new UserCredentials( { Policy: UserTokenType.Anonymous } ) } ) } ) ) result = false;
        else Test.Disconnect();
    }
    return( result );
} } );