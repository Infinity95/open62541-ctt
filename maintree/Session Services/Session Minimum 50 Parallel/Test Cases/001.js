/*  Test prepared by Nathan Pocock nathan.pocock@opcfoundation.org
    Description: Creates 50 concurrent unnamed session. */

function createSession561007() {
    var result = true, sessions = [];
    for( var i=0; i<( MAX_SESSIONS - 1 ); i++ ) {                                               // one-less than the max because the initialize opened a session.
        var session = new CreateSessionService( { Channel: Test.Channel } );                    // define the session object
        if( session.Execute() ) {                                                               // create the session
            sessions.push( session );                                                           // store the session for later closure
            if( !ActivateSessionHelper.Execute( { Session: session } ) ) result = false;        // activate the session
        }// create session
    }//for ii...
    if( !Assert.Equal( 49, sessions.length, "Unable to create the minimum # of Sessions. Successfully created sessions = " + sessions.length ) ) result = false;
    // now to close
    for( var i=0; i<sessions.length; i++ ) CloseSessionHelper.Execute( { Session: sessions[i] } ); // loop thru each session, closing them
    return( result );
}

Test.Execute( { Procedure: createSession561007 } );