/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: activate a session using login credentials that do not have access to the UA Server. */

function activateSession562004() {
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

    var endpointUsername =UaEndpointDescription.FindTokenType( { Endpoint: epSecureChNone, TokenType: UserTokenType.UserName } );
    if( !isDefined( endpointUsername ) ) {
        addSkipped( "No endpoints found that support username/password authentication." );
        return( false );
    }
    var session = new CreateSessionService( { Channel: Test.Channel } );
    if( session.Execute() ) {
        var expectedResult = new ExpectedAndAcceptedResults( [ StatusCode.BadUserAccessDenied, StatusCode.BadIdentityTokenRejected ] );
        if( ActivateSessionHelper.Execute( { Session: session, 
                                         UserIdentityToken: UaUserIdentityToken.FromUserCredentials( { 
                                             Session: session,
                                             UserCredentials: UserCredentials.createFromSettings( PresetCredentials.AccessDenied, UserTokenType.UserName ) } ),
                                         ServiceResult: expectedResult } ) ) {
            // not using the closeSession() helper here because the status from the call is not
            // important enough to cause an "addError".
            var request = new UaCloseSessionRequest();
            var response = new UaCloseSessionResponse();
            session.Session.buildRequestHeader( request.RequestHeader );
            session.Session.closeSession( request, response );
        }
    }
    return( true );
}// function activateSession562004()

Test.Execute( { Procedure: activateSession562004 } );