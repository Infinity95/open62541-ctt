/*  Test 6; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specify a valid username; password=�� (no serverNonce appended meaning the password field is empty); but policyId and encryptionAlgorithm are both valid.
    Expectation: ServiceResult = Bad_IdentityTokenRejected.
        IMPORTANT: This script uses the Login Name and Password defined in the CTT Settings. */

function username006() {
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
                var expectedResults = new ExpectedAndAcceptedResults( [ StatusCode.BadIdentityTokenRejected, StatusCode.BadUserAccessDenied ] );
                // now activate the session
                testSuccess = ActivateSessionHelper.Execute( { 
                        Session: Test.Session, 
                        UserIdentityToken: UaUserIdentityToken.FromUserCredentials( { 
                                Session: Test.Session,
                                UserCredentials: new UserCredentials( {
                                                Policy: UserTokenType.UserName, 
                                                UserName: readSetting( "/Server Test/Session/LoginNameGranted1" ),
                                                Password: "" } ) } ),
                        ServiceResult: expectedResults,
                        NoNonceAppended:true } );
                // close the session, accept errors that session is not activated 
                expectedResults = new ExpectedAndAcceptedResults( [ StatusCode.BadSessionNotActivated, StatusCode.Good ] );
                CloseSessionHelper.Execute( { Session: Test.Session, ServiceResult: expectedResults } );
            }
        }
    }//for u UserIdentityToken
    Test.Disconnect( { SkipCloseSession: true } );
    return( Assert.True( testSuccess, "The server did not respond as expected. If empty passwords are supported, and if matching the password for the defined username, then the call should've succeeded.", "Server rejected the identityToken correctly, because the serverNonce was not appended to the <empty> password." ) );
}

Test.Execute( { Procedure: username006 } );