/*  Test 3; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specify an empty username and password; but policyId and encryptionAlgorithm are both valid.
    Expectation: ServiceResult = Bad_IdentityTokenInvalid.
        IMPORTANT: This script uses the Login Name and Password defined in the CTT Settings. */

function username003() {
    if( epSecureChNone === null ) {
        addSkipped( "An insecure channel is not available." );
        return( false );
    }
    // establish a non-secure connection to the server
    if( !Test.Channel.Execute( { RequestedSecurityPolicyUri: SecurityPolicy.None, MessageSecurityMode: MessageSecurityMode.None  } ) ) {
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
                var expectedResults = new ExpectedAndAcceptedResults( StatusCode.BadIdentityTokenInvalid);
                // now activate the session
                testSuccess = ActivateSessionHelper.Execute( { 
                            Session: Test.Session, 
                            UserIdentityToken: UaUserIdentityToken.FromUserCredentials( { 
                                    Session: Test.Session,
                                    UserCredentials: new UserCredentials( { 
                                            Policy: UserTokenType.UserName, 
                                            UserName: "",
                                            Password: "" } ) } ),
                            ServiceResult: expectedResults } );
                // close the session, which actually shouldn't be open!
                expectedResults = new ExpectedAndAcceptedResults( [ StatusCode.BadSessionNotActivated, StatusCode.Good ] );
                CloseSessionHelper.Execute( { Session: Test.Session, ServiceResult: expectedResults } );
            }
        }
    }//for u UserIdentityToken
    Test.Disconnect( { SkipCloseSession: true } );
    return( Assert.True( testSuccess, "The test did not complete successfully.", "The session was correctly rejected because of the invalid UsernameIdentityToken." ) );
}

Test.Execute( { Procedure: username003 } );