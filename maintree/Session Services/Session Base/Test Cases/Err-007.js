/*  Test prepared by compliance@opcfoundation.org
    Description: Over a non-secure channel; call ActivateSession() specifying an empty ClientSignature. */

function activateSession562err007() {
    // Check whether non-secure channel exists. If not, return.
    if( epSecureChNone === null ) {
        addSkipped( "An insecure channel is not available." );
        return( false );
    }
    var result = true;
    if( Test.Channel.IsSecure() ) {
        if( CloseSecureChannelHelper.Execute( { Channel: Test.Channel } ) ) return( false );
        if( !openDefaultChannel() ) result = false;
    }
    else {
        var session = new CreateSessionService( { Channel: Test.Channel } );
        if( session.Execute() ) {
             // we expect the call to succeed
             if( ( ActivateSessionHelper.Execute( { Session: session, 
                                                    UserIdentityToken: UaUserIdentityToken.FromUserCredentials( { Session: session, 
                                                                                                                  UserCredentials: new UserCredentials( { policy: UserTokenType.Anonymous } ) } ),
                                                    ServiceResult: new ExpectedAndAcceptedResults( StatusCode.Good ) } ) ) ) {
                CloseSessionHelper.Execute( { Session: session } );
             }
        }
        else result = false;
    }
    // open a new [default] channel
    Test.Disconnect( { SkipCloseSession: true } );
    openDefaultChannel();
    return( result );
}

Test.Execute( { Procedure: activateSession562err007 } );
