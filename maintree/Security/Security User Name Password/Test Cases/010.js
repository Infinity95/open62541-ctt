/*  Test 10; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specify a valid known username, password, and policyId; but encryptionAlgorithm does not match what the server specified, e.g. �� or �abc123� etc.
    Expectation: ServiceResult = Bad_IdentityTokenInvalid.
        IMPORTANT: This script uses the Login Name and Password defined in the CTT Settings. */

function username010() {
    // is the global variable "epSecureChNone" null? if so then we can't run
    if( epSecureChNone === null ) {
        addSkipped( "An insecure channel is not available." );
        return( false );
    }
    var result = true;
    // establish a non-secure connection to the server
    if( !Test.Connect( { OpenSecureChannel: { 
                                RequestedSecurityPolicyUri: SecurityPolicy.None, 
                                MessageSecurityMode: MessageSecurityMode.None },
                         SkipCreateSession: true } ) ) return( false );
    // loop thru all UserIdentityTokens defined for this endpoint
    for( var u=0; u<epSecureChNone.UserIdentityTokens.length; u++ ) {
        // we only care about login based authentication in this test
        if( epSecureChNone.UserIdentityTokens[u].TokenType === UserTokenType.UserName ) {
            // create a session.
            Test.Session = new CreateSessionService( { Channel: Test.Channel } );
            // override the default endpoint (from settings)
            if( Test.Session.Execute( { EndpointUrl: epSecureChNone.EndpointUrl } ) ) {
                // prepare our invalid user identity token
                var invalidPolicy = UaUserIdentityToken.FromUserCredentials( { 
                                    Session: Test.Session,
                                    UserCredentials: UserCredentials.createFromSettings( PresetCredentials.AccessGranted1, UserTokenType.UserName ),
                                    EncryptionAlgorithm: BAD_ENCRYALG } );
                // now activate the session; we expect this call to FAIL; setup expectations and override parameters
                result = ActivateSessionHelper.Execute( { 
                        Session: Test.Session, 
                        UserIdentityToken: invalidPolicy,
                        ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadIdentityTokenInvalid ) } );
                // close the session, which actually shouldn't be open
                CloseSessionHelper.Execute( { Session: Test.Session, ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.BadSessionNotActivated, StatusCode.Good ] ) } );
            }
        }
    }//for u UserIdentityToken
    Test.Disconnect( { SkipCloseSession: true } );
    return( Assert.True( result, "The server did not respond as expected. The EncryptionAlgorithm is garbage, invalidating the identityToken." ) );
}

Test.Execute( { Procedure: username010 } );