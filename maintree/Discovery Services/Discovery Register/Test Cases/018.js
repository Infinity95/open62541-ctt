/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Register multiple Servers, each with a unique URI. Check the LDS filters on ServerUri correctly. */

function register018() {
    var registeredServers = [];
    for( var s=0; s<5; s++ ) {
        registeredServers[s] = getDefaultPseudoServer();
        registeredServers[s].ServerUri += s;
        if( !RegisterServerHelper.Execute( { Server: registeredServers[s], SuppressValidation: true } ) ) return( false );
    }

    // test #1; FindServers and specify the ServerUri of the 3rd registered server.
    if( FindServersHelper.Execute( { EndpointUrl: readSetting( "/Discovery/Endpoint Url" ), ServerUris: [ registeredServers[2].ServerUri ] } ) ) {
        if( Assert.Equal( 1, FindServersHelper.Response.Servers.length, "FindServers returned more than one server." ) ) {
            Assert.Equal( registeredServers[2].ServerUri, FindServersHelper.Response.Servers[0].ApplicationUri, "ServerUri does not match the ApplicationUri" );
        }
    }
    
    // clean-up
    for( var s=0; s<registeredServers.length; s++ ) {
        registeredServers[s].IsOnline = false;
        RegisterServerHelper.Execute( { Server: registeredServers[s], SuppressValidation: true } );
    }//for s...
    return( true );
}

Test.Execute( { Procedure: register018 } );