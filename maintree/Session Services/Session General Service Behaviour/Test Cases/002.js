/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Invoke CreateSession with default parameters. Go into a loop testing the RequestedSessionTimeout parameter with different 
        values to see if the Server revises them, and to what degree. */

function createSession561004() {
    // the timeout values we will test...
    var testTimeoutValue = [ 0, 752, 1927, 4330, 75000, 100200, 3333000, Constants.Int32_Max ];

    // go into a loop to test each of the above timeout values
    for( var i=0; i<testTimeoutValue.length; i++ ) {
        addLog( "Testing session timeout of: " + testTimeoutValue[i] + " ms." );
        // create our header objects and then establish a session
        var session = new CreateSessionService( { Channel: Test.Channel } );
        session.RequestedSessionTimeout = testTimeoutValue[i];
        if( session.Execute() ) {
            if( !ActivateSessionHelper.Execute( { Session: session } ) ) break;

            // check the revised timeout setting and log any differences found.
            // This is not a test that can fail as such.
            if( session.Request.RequestedSessionTimeout !== session.Response.RevisedSessionTimeout ) {
                addLog( "Session Timeout Difference detected!!!!!" +
                    "  RequestedSessionTimeout=" + session.Request.RequestedSessionTimeout +
                    "; RevisedSessionTimeout=" + session.Response.RevisedSessionTimeout );
            }

            CloseSessionHelper.Execute( { Session: session } );
        }
    }// for i...
    return( true );
}

Test.Execute( { Procedure: createSession561004 } );