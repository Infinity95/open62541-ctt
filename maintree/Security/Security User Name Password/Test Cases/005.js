/*  Test 5; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specify a valid username; password=�� (serverNonce is appended to this field); but policyId and encryptionAlgorithm are both valid.
    Expectation: ServiceResult may vary: � Good: Server accepts an empty password. � Bad_IdentityTokenRejected if empty passwords are not accepted.
        IMPORTANT: This script uses the Login Name and Password defined in the CTT Settings. */

function username005() {
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
                // we expect this call to FAIL; setup expectations and override parameters
                var expectedResults = new ExpectedAndAcceptedResults( [ StatusCode.BadIdentityTokenRejected, StatusCode.BadUserAccessDenied, StatusCode.Good ] );
                // now activate the session
                testSuccess = ActivateSessionHelper.Execute( { 
                        Session: Test.Session, 
                        UserIdentityToken: UaUserIdentityToken.FromUserCredentials( { 
                                Session: Test.Session, 
                                UserCredentials: UaUserIdentityToken.FromUserCredentials( {
                                        Session: Test.Session,
                                        UserCredentials: new UserCredentials( {
                                            Policy: UserTokenType.UserName, 
                                            UserName: readSetting( "/Server Test/Session/LoginNameGranted1" ),
                                            Password: "" } ) } ),
                        ServiceResult: expectedResults } ) } );
                // close the session, accept errors that session is not activated 
                expectedResults = new ExpectedAndAcceptedResults( [ StatusCode.BadSessionNotActivated, StatusCode.Good ]);
                CloseSessionHelper.Execute( { Session: Test.Session, ServiceResult: expectedResults } );
            }
        }
    }//for u UserIdentityToken
    Test.Disconnect( { SkipCloseSession: true } );
    return( Assert.True( testSuccess, "The server did not respond as expected. One of two outcomes were expected: (a)connection to succeed, if username/empty-password is a match (b)rejection because empty passwords are not supported." ) );
}

Test.Execute( { Procedure: username005 } );