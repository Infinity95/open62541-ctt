/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Creates more sessions than the server is capable of handling. */

function createSession561008() {
    var result = true, sessions = [];
    // max out our sessions first..
    for( var i=0; i<( MAX_SESSIONS - 1 ); i++ ) {                                               // one-less than the max because the initialize opened a session.
        var session = new CreateSessionService( { Channel: Test.Channel } );                    // define the session object
        if( session.Execute() ) {                                                               // create the session
            sessions.push( session );                                                           // store the session for later closure
            if( !ActivateSessionHelper.Execute( { Session: session } ) ) result = false;        // activate the session
        }// create session
    }//for i...
    // now to add more, which should fail
    for( var i=0; i<10; i++ ) {
        var session = new CreateSessionService( { Channel: Test.Channel } );                                                               // define the session object
        if( session.Execute( { ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadTooManySessions ] ) } ) ) { // create the session
            if( session.Response.ResponseHeader.ServiceResult.isGood() ) {                                                                 // session was allowed?
                sessions.push( session );                                                                                                  // store the session for later closure
                if( !ActivateSessionHelper.Execute( { Session: session } ) ) result = false;                                               // activate the session
            }
        }// create session
    }
    if( !Assert.GreaterThan( 48, sessions.length, "Unable to create the minimum # of Sessions. Successfully created sessions = " + sessions.length ) ) result = false;
    // now to close
    for( var i=0; i<sessions.length; i++ ) CloseSessionHelper.Execute( { Session: sessions[i] } ); // loop thru each session, closing them
    return( result );

}

Test.Execute( { Procedure: createSession561008 } );