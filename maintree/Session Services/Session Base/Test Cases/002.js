/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: CreateSession with default parameters, except for a small timeout of 10 seconds. Activate the session and stall (do not use) 
                 the session for a period GREATER than the timeout period. Call any service on the session to experience a Session Closed status. */

function createSession561005() {
const TIMEOUTDIVISION = 10;
    var session = new CreateSessionService( { Channel: Test.Channel } );
    if( session.Execute() && ActivateSessionHelper.Execute( { Session: session } ) ) {
        // ok, so all is well... lets record the revisedSessionTimeout and we'll use that to base our delay/wait on so as to cause a session timeout.
        var revisedTimeoutInMsec = session.Response.RevisedSessionTimeout;
        var revisedTimeoutDiv = revisedTimeoutInMsec / TIMEOUTDIVISION;
        var iterationLimit = Math.round( 1.3 * TIMEOUTDIVISION );
        // we'll divide this timeout by TIMEOUTDIVISION and loop 2 * TIMEOUTDIVISION times to cause this delay each time adding a message...
        print( "Session Timeout: " + DurationToString( revisedTimeoutInMsec )+ ". Now to wait and check if the session will actually timeout after zero activity..." );
        for( var i=0; i<iterationLimit; i++ ) {
            print( "Waiting " + DurationToString( revisedTimeoutDiv ) + ". Iteration " + (1 + i) + " of " + iterationLimit );
            wait( revisedTimeoutDiv );
        }
        // this activation should fail!
        ActivateSessionHelper.Execute( { Session: session, ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.BadSessionIdInvalid, StatusCode.BadSessionClosed ], StatusCode.BadInvalidState ) } );
        // clean-up by closing the secure channel, and reopening
        Test.Disconnect( { SkipCloseSession: true } );
        openDefaultChannel();
    }
    return( true );
}

Test.Execute( { Procedure: createSession561005 } );