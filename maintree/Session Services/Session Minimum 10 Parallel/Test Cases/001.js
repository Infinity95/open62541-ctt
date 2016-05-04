/* Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Creates 10 concurrent sessions. */

function createSession561002() {
const MAX=9;
    var sessions = [];
    // create the session objects
    for( var i=0; i<MAX; i++ ) {
        var session = new CreateSessionService( { Channel: Test.Channel } );
        if( session.Execute() ) {
            sessions.push( session );
            ActivateSessionHelper.Execute( { Session: session, SkipCheckSessionId: true } );
        }
    }

    // now to close
    for( var i=0; i<MAX; i++ ) { 
        if( sessions[i].Session.Connected ) CloseSessionHelper.Execute( { Session: sessions[i] } );
    }//for i...
    return( true );
}

Test.Execute( { Procedure: createSession561002 } );