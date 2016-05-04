/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Invoke CreateSession specifying a RequestedSessionTimeout of 0. We expect the RevisedSessionTimeout != 0. */

function createSession5610003() {
    var session = new CreateSessionService( { Channel: Test.Channel } );
    session.RequestedSessionTimeout = 0;
    if( session.Execute() ) {
        if( ActivateSessionHelper.Execute( { Session: session } ) ) {
            Assert.NotEqual( 0, session.Response.RevisedSessionTimeout, "Expected Server to revise RequestedSessionTimeout=0, to something else." );
            CloseSessionHelper.Execute( { Session: session } );
        }
    }
    return( true );
}

Test.Execute( { Procedure: createSession5610003 } );