/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Creates more sessions than the server is capable of handling. */

function createSession561008() {
const MAX = 14;
const MIN = 10;
    var result = true; sessions = []
    for( var i=0; i<MAX; i++ ) {
        var session = new CreateSessionService( { Channel: Test.Channel } );
        expErr = new ExpectedAndAcceptedResults( StatusCode.Good );
        if( i >=( MIN - 1 ) ) expErr.addExpectedResult( StatusCode.BadTooManySessions );

        // create the session
        if( !session.Execute( { ServiceResult: expErr } ) ) {
            if( i < ( requiredMinSessions - 1 ) ) Assert.GreaterThan( ( MIN - 1 ), i, "Exceeded the session count sooner than expected." );
            result = false;
            break;
        }
        if( session.Response.ResponseHeader.ServiceResult.StatusCode == StatusCode.BadTooManySessions ) {
            addLog( "Reached the max # of sessions, which is: " + ( 1 + i ) );
            result = false;
            break;
        }
        // activate the session
        if( !ActivateSessionHelper.Execute( { Session: session } ) ) {
            addError( "Reached the max # of sessions, which is: " + ( 1 + i ) );
            result = false;
            break;
        }
        sessions.push( session );
    }
    // now to close all sessions
    for( i=0; i<sessions.length; i++ ) CloseSessionHelper.Execute( { Session: sessions[i], ServiceResult: expErr } );
    return( result );
}

Test.Execute( { Procedure: createSession561008 } );