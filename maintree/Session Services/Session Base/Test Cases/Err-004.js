/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Invoke any service call after CreateSession without previously activating the session.
        Expects �Bad_SessionNotActivated� or �Bad_SessionClosed�. */

function createSession561Err004() {
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( item == undefined || item == null ) {
        addSkipped( SETTING_UNDEFINED_SCALARSTATIC );
        return( false );
    }
    var session = new CreateSessionService( { Channel: Test.Channel } );
    if( session.Execute() ) {
        var readHelper = new ReadService( { Session: session } );
        readHelper.Execute( { NodesToRead: item, ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadSessionNotActivated ) } );
        // verify the session can no longer be used
        if( ActivateSessionHelper.Execute( { Session: session, ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.BadSessionIdInvalid, StatusCode.BadSessionClosed ] ) } ) ) {
            if( ActivateSessionHelper.Response.ResponseHeader.ServiceResult.isGood() ) {
                addError( "The server allowed the session to be created, even though an attempt was made to use without activation. It should close it and generate new Id." );
                CloseSessionHelper.Execute( { Session: session } );
            }
        }
    }
    return( true );
}

Test.Execute( { Procedure: createSession561Err004 } );