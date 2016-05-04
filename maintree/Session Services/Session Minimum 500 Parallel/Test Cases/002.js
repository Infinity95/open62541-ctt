/*  Test prepared by Nathan.Pocock@opcfoundation.org
    Description: Create more sessions than the server officially supports. */

function createSession561008() {
    var sessionCount = 600;
    var requiredMinSessions = 500;

    // Connect to the server 
    var sessions = []

    // create our sessions
    var timeoutHint = parseInt( readSetting( "/Server Test/Session/DefaultTimeoutHint" ).toString() );
    var i;
    var expErr;
    for( i=0; i<sessionCount; i++ ) {
        // define the session object
        var tmpSession = new CreateSessionService( { Channel: Test.Channel } );

        // define the expected results
        expErr = new ExpectedAndAcceptedResults( StatusCode.Good );
        if( i >= requiredMinSessions ) expErr.addExpectedResult( StatusCode.BadTooManySessions );

        // create the session
        if( tmpSession.Execute( { ServiceResult: expErr } ) ) {
            if( tmpSession.Response.ResponseHeader.ServiceResult.StatusCode == StatusCode.BadTooManySessions ) {
                addLog( "Reached the max # of sessions, which is: " + ( 1+ i ) );
                if( Assert.GreaterThan( requiredMinSessions - 1, sessions.length, "Unable to create the minimum # of sessions." ) ) result = false;
                break;
            }
            else if( !ActivateSessionHelper.Execute( { Session: tmpSession } ) ) {
                addError( "Reached the max # of sessions, which is: " + ( 1 + i ) );
                break;
            }
            sessions.push( tmpSession );
        }
    }

    // now to close all sessions
    for( i=0; i<sessions.length; i++ ) CloseSessionHelper.Execute( { Session: sessions[i], ServiceResult: expErr } );
    return( true );
}

Test.Execute( { Procedure: createSession561008 } );