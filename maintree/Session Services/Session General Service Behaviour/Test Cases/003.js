/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RequestHeader.AuthenticationToken contains a valid NodeId. Server should ignore and accept the connection */

var session;

function injectAuthToken() {
    session.Request.RequestHeader.AuthenticationToken = new UaNodeId( Identifier.Server );
}

function createSession561010() {
    session = new CreateSessionService( { Channel: Test.Channel } );
    if( session.Execute( { PreHook: injectAuthToken } ) ) {
        if( Assert.True( ActivateSessionHelper.Execute( { Session: session } ), "ActivateSession expected to succeed." ) ) CloseSessionHelper.Execute( { Session: session } );
    }
    return( true );
}

Test.Execute( { Procedure: createSession561010 } );