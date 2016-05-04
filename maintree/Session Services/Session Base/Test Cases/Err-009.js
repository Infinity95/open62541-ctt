/*  Test prepared by compliance@opcfoundation.org
    Description: Using a user identity token Type not recognized by the server. */

include( "./library/Base/Objects/dictionary.js" );
function activateSession562err009() {
    // now get an unsupported identity token
    var notSupportedToken = getNotSupportedIdentityToken();
    print( "Non-supported identity token types are: " + notSupportedToken.toString() );
    if( notSupportedToken.length() === 0 )  {
        addSkipped( "Aborting test. Server seems to support all 4 user identity token types: anonymous, usernamePassword, certificate, kerberos." );
        return( false );
    }

    //Create and ActivateSession
    session = new CreateSessionService( { Channel: Test.Channel } );
    if( session.Execute() ) {
        var expectedResult = new ExpectedAndAcceptedResults( StatusCode.Good );
        for( var i=0; i<notSupportedToken.length(); i++ ) {
            switch ( notSupportedToken._values[i] ) {
                case "X509":     ActivateSessionHelper.Execute( { 
                                     Session: session, 
                                     UserIdentityToken: UaUserIdentityToken.FromUserCredentials( { 
                                         Session: session,
                                         UserCredentials: UserCredentials.createFromSettings( PresetCredentials.X509, UserTokenType.Certificate ) } ),
                                     ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadIdentityTokenInvalid ) } );
                                 break;
                case "Anonymous": ActivateSessionHelper.Execute(  {
                                     Session: session, 
                                     UserIdentityToken: UaUserIdentityToken.FromUserCredentials( { 
                                         Session: session,
                                         UserCredentials: UserCredentials.createFromSettings( null, UserTokenType.Anonymous ) } ),
                                     ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadIdentityTokenInvalid ) } );
                                 break;
                case "User": ActivateSessionHelper.Execute( { 
                                    Session: Test.Session.Session, 
                                    UserIdentityToken: UaUserIdentityToken.FromUserCredentials( {
                                        Session: session,
                                        UserCredentials: UserCredentials.createFromSettings( PresetCredentials.AccessGranted1, UserTokenType.UserName ) } ),
                                    ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadIdentityTokenInvalid ) } );
                                    break;
                case "Kerberos": addSkipped( "Cannot complete test. Kerberos token is the only missing token, and is currently not supported in the CTT!" ); 
                                 break;
                default: addSkipped( "Cannot complete test. Server supports all UserIdentityToken types, therefore, we can't use one that is not supported." ); 
                                 break;
              }
        }
        CloseSessionHelper.Execute( { Session: session, ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.BadSessionNotActivated, StatusCode.Good ] ) } );
     }
    return( true );
}

function getNotSupportedIdentityToken( getEndpointsHelper ) {
    // iterate through the endpoints returned in 'initialize.js' to find a user identity token type  that is NOT listed
    var identityTypes = new Dictionary( [ "Anonymous", "User", "X509", "Kerberos" ] );
    for( var e=0; e<gServerCapabilities.Endpoints.length; e++ ) {
        for( var t=0; t<gServerCapabilities.Endpoints[e].UserIdentityTokens.length; t++ ) {
            switch( gServerCapabilities.Endpoints[e].UserIdentityTokens[t].TokenType ) {
                case UserTokenType.Anonymous: identityTypes.Remove( "Anonymous" ); break;
                case UserTokenType.UserName: identityTypes.Remove( "User" ); break;
                case UserTokenType.IssuedToken: identityTypes.Remove( "Kerberos" ); break;
                case UserTokenType.Certificate: identityTypes.Remove( "X509" ); break;
            }
        }
    }
    return identityTypes;
}

Test.Execute( { Procedure: activateSession562err009 } );