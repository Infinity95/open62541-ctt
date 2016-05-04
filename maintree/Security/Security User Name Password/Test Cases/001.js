/*  Test 1; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Insecure channel created with SecurityPolicy=None: Connect to the Server and then specify a known good username and password, with 
        valid policyId and encryptionAlgorithm as provided by the server�s �SecurityPolicyUri� parameter in the UserTokenPolicy (GetEndpoints call).
        Once connected, close the session.
    Expectation: 
        Login granted and session established. Note: The SecurityPolicyUri from GetEndpoints might be empty; if so then the expectation is that the 
        value from the SecureChannel will be used.
        IMPORTANT: This script uses the Login Name and Password defined in the CTT Settings. */

function username001() {
    // is the global variable "epSecureChNone" null? if so then we can't run
    if( epSecureChNone === null ) {
        addSkipped( "An insecure channel is not available." );
        return( false );
    }
    // establish a non-secure connection to the server
    if( !Test.Channel.Execute( { RequestedSecurityPolicyUri: SecurityPolicy.None, MessageSecurityMode: MessageSecurityMode.None } ) ) {
        addError( "Can't connect the channel to the server, therefore no sessions can be established. Aborting." );
        return( false );
    }
    // simple flag used to determine if test succeeds
    var testSuccess = false;
    // loop thru all UserIdentityTokens defined for this endpoint
    for( var u=0; u<epSecureChNone.UserIdentityTokens.length; u++ ) {
        var strUserToken = UserTokenType.toString( epSecureChNone.UserIdentityTokens[u].TokenType );
        // we only care about login based authentication in this test
        if( epSecureChNone.UserIdentityTokens[u].TokenType === UserTokenType.UserName ) {
            // create a session.
            Test.Session = new CreateSessionService( { Channel: Test.Channel } );
            if( Test.Session.Execute() ) {
                testSuccess = ActivateSessionHelper.Execute( {
                        Session: Test.Session, 
                        UserIdentityToken: UaUserIdentityToken.FromUserCredentials( { 
                                Session: Test.Session,
                                UserCredentials: UserCredentials.createFromSettings( PresetCredentials.AccessGranted1, UserTokenType.UserName ) } ) } );
                CloseSessionHelper.Execute( { Session: Test.Session } );
            }
        }
    }//for u UserIdentityToken
    Test.Disconnect( { SkipCloseSession: true } );
    return( true );
}

Test.Execute( { Procedure: username001 } );