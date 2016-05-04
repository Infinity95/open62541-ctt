/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: activate a session that has been transferred to another channel. */
    
function activateSession562005() {
    // check the Max # of channels first.
    if( gServerCapabilities.MaxSecureChannels === 1 ) {
        addSkipped( "Only one channel supported (see setting /Server Test/Capabilities/Max SecureChannels) therefore skipping test." );
        return( false );
    }
    // activate a session on the first channel
    var session1 = new CreateSessionService( { Channel: Test.Channel } );
    if( session1.Execute() ) {
        if( ActivateSessionHelper.Execute( { Session: session1 } ) ) {
            // create the new channel
            var channel2 = new OpenSecureChannelService();
            if ( channel2.Execute() ) {
                var session2 = new CreateSessionService( { Channel: channel2 } );
                session2.Session.AuthenticationToken = session1.Session.AuthenticationToken;
                session2.Session.ServerNonce.append( session1.Session.ServerNonce );
                session2.Session.SessionId = session1.Session.SessionId;

                // transfer the session to the new channel
                if ( ActivateSessionHelper.Execute( { Session: session2 } ) ) {
                    // invoke a browse call to test the server
                    var browseHelper = new BrowseService( { Session: session1 } )
                    var rootFolder = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.RootFolder ) )[0];
                    browseHelper.Execute( { NodesToBrowse: rootFolder, ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadSecureChannelIdInvalid ) } );
                    // close the session using the new channel
                    CloseSessionHelper.Execute( { Session: session2 } );
                }
                else CloseSessionHelper.Execute( { Session: session1 } );
                CloseSecureChannelHelper.Execute( { Channel: channel2 } );
            }
        }
    }
    return( true );
}

Test.Execute( { Procedure: activateSession562005 } );