/*  Test 11; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specify a valid known username, password, policyId, and encryptionAlgorithm; but the username is configured within the server to deny access.
    Expectation: ServiceResult = Bad_UserAccessDenied.
    Note: This script uses the Login Name and Password defined in the CTT Settings. */

function username012() {
    // is this a supported feature?
    var settings = [ "/Server Test/Session/LoginNameAccessDenied", "/Server Test/Session/LoginPasswordAccessDenied" ];
    for( var i=0; i<settings.length; i++ ) {
        var s = readSetting( settings[i] ).toString();
        if( !isDefined( s ) || s === "" ) {
            addError( "A required setting is not configured: '" + settings[i] + "'." );
            return( false );
        }
        else if( s.toLowerCase() === "n/a" ) { 
            addSkipped( "Server does not support explicitly denying user-access to the server. See setting: '" + settings[i] + "'." );
            return( false );
        }
    }
    // is the global variable "epSecureChNone" null? if so then we can't run
    if( epSecureChNone === null ) {
        addSkipped( "An insecure channel is not available." );
        return( false );
    }
    if( !Test.Connect( { OpenSecureChannel: { RequestedSecurityPolicyUri: SecurityPolicy.None, MessageSecurityMode: MessageSecurityMode.None },
                         SkipCreateSession: true } ) ) return( false );
    // simple flag used to determine if test succeeds
    var result = true;
    // loop thru all UserIdentityTokens defined for this endpoint
    for( var u=0; u<epSecureChNone.UserIdentityTokens.length; u++ ) {
        // we only care about login based authentication in this test
        if( epSecureChNone.UserIdentityTokens[u].TokenType === UserTokenType.UserName ) {
            // create a session.and override the default endpoint (from settings)
            Test.Session = new CreateSessionService( { Channel: Test.Channel } );
            if( Test.Session.Execute( { EndpointUrl: epSecureChNone.EndpointUrl } ) ) {
                // we expect this call to FAIL; setup expectations and override parameters
                // now activate the session
                result = ActivateSessionHelper.Execute( { 
                        Session: Test.Session, 
                        UserIdentityToken: UaUserIdentityToken.FromUserCredentials( {
                                Session: Test.Session,
                                UserCredentials: UserCredentials.createFromSettings( PresetCredentials.AccessDenied, UserTokenType.UserName ) } ),
                        ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadUserAccessDenied ) } );
                // close the session, which actually shouldn't be open
                CloseSessionHelper.Execute( { Session: Test.Session, ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.BadSessionNotActivated, StatusCode.Good ] ) } );
            }
        }
    }//for u UserIdentityToken
    Test.Disconnect( { SkipCloseSession: true } );
    return( Assert.True( result, "The server did not respond as expected. The user was expected to be denied access. Please check your settings." ) );
}

Test.Execute( { Procedure: username012 } );