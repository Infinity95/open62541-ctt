/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create 2-sessions.
        Note: one is already created in 'initialize.js' */

function createSession561008() {
    var session2 = new CreateSessionService( { Channel: Test.Channel } );
    if( session2.Execute() ) {
        ActivateSessionHelper.Execute( { Session: session2 } );
        CloseSessionHelper.Execute( { Session: session2 } );
        return( true );
    }
    else return( false );
}

Test.Execute( { Procedure: createSession561008 } )