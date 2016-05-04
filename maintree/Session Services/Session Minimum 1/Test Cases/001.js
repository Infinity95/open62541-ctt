/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create two sessions, activate them, and then close them (one must succeed). */

function createSession561008() {
    var session1 = new CreateSessionService( { Channel: Test.Channel } );
    if( session1.Execute() ) {
        if( ActivateSessionHelper.Execute( { Session: session1 } ) ) {
            var result = true;
            // now to another session, which could be more than the server can handle 
            var expectedResult = new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadTooManySessions ] );
            var csExpectation = new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadSessionNotActivated ] );
            var session2 = new CreateSessionService( { Channel: Test.Channel } );
            if( session2.Execute( { ServiceResult: expectedResult } ) ) {
                if( session2.Response.ResponseHeader.ServiceResult.StatusCode === StatusCode.Good ) {
                    CloseSessionHelper.Execute( { Session: session2, ServiceResult: csExpectation } );
                }
            }
            else result = false;

            // clean-up
            CloseSessionHelper.Execute( { Session: session1 } );
            return( result );
        }
        else return( false );
    }
    else return( false );
}

Test.Execute( { Procedure: createSession561008 } )