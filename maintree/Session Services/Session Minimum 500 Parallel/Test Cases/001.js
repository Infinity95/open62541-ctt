/* Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Creates 500 sessions. Expected to succeed. */

function createSession561008() {
    var sessions = [];

    // create the sessions
    for( var i=0; i<MAX_SESSIONS; i++ ) { 
        var session = new CreateSessionService( { Channel: Test.Channel } );
        if( session.Execute() ) {
            if( ActivateSessionHelper.Execute( { Session: session } ) ) sessions.push( session );
            else break;
        }
        else {
            result = false;
            break;
        }
    }//for i...
    if( !Assert.GreaterThan( ( MAX_SESSIONS - 1 ), sessions.length, "Unable to create the minimum number of sessions." ) ) result = false;
    // close the sessions
    for( var i=0; i<sessions.length; i++ ) CloseSessionHelper.Execute( { Session: sessions[i] } );
    return( result );
}// function createSession561008()

Test.Execute( { Procedure: createSession561008 } );