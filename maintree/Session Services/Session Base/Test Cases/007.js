/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: activate an already active session while specifying different user login credentials. */

function activateSession562004() {
    // check the Max # of channels first.
    if( gServerCapabilities.MaxSecureChannels === 1 ) {
        addSkipped( "Only one channel supported (see setting /Server Test/Capabilities/Max SecureChannels) therefore skipping test." );
        return( false );
    }
    // check multiple usernames are supported
    if( readSetting( "/Server Test/Session/LoginNameGranted2" ).toString().toLowerCase() === "n/a"
        || readSetting( "/Server Test/Session/LoginNameGranted2" ).toString().toLowerCase() === "" ) {
        addSkipped( "Server does not support multiple usernames, therefore skipping test." );
        return( false );
    }
    // find a username identity token in the endpoints
    for( var e=0; e<gServerCapabilities.Endpoints.length; e++ ) {
        var strEndpoint = gServerCapabilities.Endpoints[e].EndpointUrl;
        if( strEndpoint.substring( 0, 4 ) == "http" ) continue;
        //var endpointUsername = findUsernameInEndpoints( e );
        var endpointUsername = UaEndpointDescription.FindTokenType( { Endpoint: gServerCapabilities.Endpoints[e], TokenType: UserTokenType.UserName } );
        if( isDefined( endpointUsername ) )  break;
    }
    if( !isDefined( endpointUsername ) ) {
        addSkipped( "No endpoints found that support username/password authentication." );
        return( false );
    }
    if( readSetting( "/Server Test/Session/LoginNameGranted1" ).toString().length == 0 &&
        readSetting( "/Server Test/Session/LoginNameGranted2" ).toString().length == 0 ) {
        addError( "No usernames are configured in Settings: /Server Test/Session. The Server indicates support for Username/Password UserIdentityToken's in the EndpointDescription(s)." );
        return( false );
    }
    var session = new CreateSessionService( { Channel: Test.Channel } );
    if( session.Execute() ) {
        if( ActivateSessionHelper.Execute( { Session: session, UserIdentityToken: UaUserIdentityToken.FromUserCredentials( { Session: session, UserCredentials: UserCredentials.createFromSettings( PresetCredentials.AccessGranted1, UserTokenType.UserName ) } ) } ) ) {
            // activate the session again with another user credential.
            var results = new ExpectedAndAcceptedResults( StatusCode.Good, StatusCode.BadIdentityChangeNotSupported );
            ActivateSessionHelper.Execute( { Session: session, UserIdentityToken: UaUserIdentityToken.FromUserCredentials( { Session: session, UserCredentials: UserCredentials.createFromSettings( PresetCredentials.AccessGranted2, UserTokenType.UserName ) } ), ServiceResult: results } );
        }
        CloseSessionHelper.Execute( { Session: session } );
    }
    // its possible that our channel has timed out too; so kill it and create a new one
    Test.Disconnect( { SkipCloseSession: true } );
    openDefaultChannel();
    return( true );
}

Test.Execute( { Procedure: activateSession562004 } );