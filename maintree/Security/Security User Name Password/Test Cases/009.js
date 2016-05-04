/*  Test 9; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specify a valid known username and password, valid encryptionAlgorithm, 
        but policyId does not match what the server specified, e.g. �� or �abc123� etc.
    Expectation: ServiceResult = Bad_IdentityTokenInvalid.
    IMPORTANT: This script uses the Login Name and Password defined in the CTT Settings. */

function username009() {
    // is the global variable "epSecureChNone" null? if so then we can't run
    if( epSecureChNone === null ) {
        addSkipped( "An insecure channel is not available." );
        return( false );
    }
    var result = true;
    // establish a non-secure connection to the server
    if( !Test.Connect( { SkipCreateSession: true } ) ) return( false );
    else{
        for( var u=0; u<epSecureChNone.UserIdentityTokens.length; u++ ) { // loop thru all UserIdentityTokens defined for this endpoint
            // we only care about login based authentication in this test
            if( epSecureChNone.UserIdentityTokens[u].TokenType === UserTokenType.UserName ) {
                Test.Session = new CreateSessionService( { Channel: Test.Channel } );
                if( Test.Session.Execute( { EndpointUrl: epSecureChNone.EndpointUrl } ) ) {
                    // we expect this call to FAIL; setup expectations and override parameters. now activate the session
                    var invalidPolicy = UaUserIdentityToken.FromUserCredentials( { 
                                    Session: Test.Session,
                                    UserCredentials: UserCredentials.createFromSettings( PresetCredentials.AccessGranted1, UserTokenType.UserName ),
                                    PolicyId: BAD_POLICYID } );
                    result = ActivateSessionHelper.Execute( { 
                            Session: Test.Session, 
                            UserIdentityToken: invalidPolicy,
                            ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadIdentityTokenInvalid ) } );
                    // close the session, accept errors that session is not activated 
                    CloseSessionHelper.Execute( { Session: Test.Session, ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.BadSessionNotActivated, StatusCode.Good ] ) } );
                }
            }
        }//for u UserIdentityToken
    }
    Test.Disconnect( { SkipCloseSession: true } );
    return( Assert.True( result, "The server did not respond as expected. The PolicyId the CTT specified is garbage, so the server should've rejected it." ) );
}

Test.Execute( { Procedure: username009 } );