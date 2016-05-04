/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create more sessions than the server supports. */

function createSession561008() {
    var session2 = new CreateSessionService( { Channel: Test.Channel } );
    if( session2.Execute() ) ActivateSessionHelper.Execute( { Session: session2 } );
    else return( false );

    // now to add more than the server can handle 
    var session3 = new CreateSessionService( { Channel: Test.Channel } );
    if( session3.Execute( { ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadTooManySessions ] ) } ) ) {
        if( ActivateSessionHelper.Execute( { Session: session3 } ) ) CloseSessionHelper.Execute( { Session: session3 } );
    }

    var session4 = new CreateSessionService( { Channel: Test.Channel } );
    if( session4.Execute( { ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadTooManySessions ] ) } ) ) {
        if( ActivateSessionHelper.Execute( { Session: session4 } ) ) CloseSessionHelper.Execute( { Session: session4 } );
    }

    // clean-up
    CloseSessionHelper.Execute( { Session: session2 } );
    return( true );
}

Test.Execute( { Procedure: createSession561008 } );