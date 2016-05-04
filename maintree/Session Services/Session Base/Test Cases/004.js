/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: activate a session using default parameters. */

function activateSession562001() {
    var session = new CreateSessionService( { Channel: Test.Channel } );
    if( session.Execute() ) {
        ActivateSessionHelper.Execute( { Session: session } );
        CloseSessionHelper.Execute( { Session: session } );
    }
    else return( false );
    return( true );
}

Test.Execute( { Procedure: activateSession562001 } );