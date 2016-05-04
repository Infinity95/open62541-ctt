/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Invoke CreateSession with default parameters. Do this for 5 sessions, which will cause the session name to be the same for each session. */

function createSession561006() {
const MAX = 5;
    var result = true, sessions = [];
    for( var i=0; i<MAX; i++ ) {
    var session = new CreateSessionService( { Channel: Test.Channel } );                      // create a new session object
        if( session.Execute( { SessionName: "SessionNameAlwaysTheSame" } ) ) {                // force the session name to be the same every time
            sessions.push( session );                                                         // store this session in an array
            if( !ActivateSessionHelper.Execute( { Session: session } ) ) result = false;      // activate the session
        }
        else result = false;
    }//for i...
    // clean up
    for( var i=0; i<sessions.length; i++ ) CloseSessionHelper.Execute( { Session: sessions[i] } );
    return( result );
}

Test.Execute( { Procedure: createSession561006 } );