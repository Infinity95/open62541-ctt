/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Invoke CreateSession and then check if the session appears within the server diagnostics. This script must first read 
                 the servers profile to see if diagnostics are supported and if not then the test will simply exit (not a fail!). */

function createSession561009() {
    var session = new CreateSessionService( { Channel: Test.Channel } );
    if( session.Execute() ) {
        if ( ActivateSessionHelper.Execute( { Session: session } ) ) {
            // read the 'Server Diagnostics -> EnabledFlag' node
            if( !gServerCapabilities.ServerDiagnostics_EnabledFlag ) addNotSupported( "Session Diagnostics" );
            else {
                // lets read the current Session count
                print( "Fetching the initial sessionCount value..." );
                var currentSessionCountItem = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.Server_ServerDiagnostics_ServerDiagnosticsSummary_CurrentSessionCount ) ); //ServerDiagnosticsSummaryType_CurrentSessionCount
                var readHelper = new ReadService( { Session: session } );
                if( readHelper.Execute( { NodesToRead: currentSessionCountItem } ) ) {
                    var firstSessionCount = currentSessionCountItem[0].Value.Value;
                    // now to create another session, does sessionCount increase?
                    print( "Creating another (temporary) connection to the UA Server." );
                    var tempSession = new CreateSessionService( { Channel: Test.Channel } );
                    if( tempSession.Execute() ) {
                        // activate the new session 
                        if( ActivateSessionHelper.Execute( { Session:tempSession } ) ) {
                            // read the sessionCount again
                            print( "Reading the new sessionCount value..." );
                            if( readHelper.Execute( { NodesToRead: currentSessionCountItem } ) ) {
                                var secondSessionCount = currentSessionCountItem[0].Value.Value;
                                print("Checking the sessionCount increased. Was: " + firstSessionCount + ", is now: " + secondSessionCount );
                                Assert.GreaterThan( firstSessionCount, secondSessionCount, "Expected session count to increase." );
                            }
                            // disconnect the temp session
                            CloseSessionHelper.Execute( { Session: tempSession } );
                        }
                    }
                }
            }
            // clean-up
            CloseSessionHelper.Execute( { Session: session } );
        }
    }
    else return( false );
    return( true );
}

Test.Execute( { Procedure: createSession561009 } );