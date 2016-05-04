/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() default values; multiple times, all SemaphorefilePath=null, except 1. */

function registerServer012() {
    const MAX = 9;
    var registeredServers = [];
    var semaphoreFilePath = "c:\\folder\\file.txt";

    // now to register the servers
    var pseudoServer;
    for( var i=0; i<=MAX; i++ ) {
        pseudoServer = getDefaultPseudoServer();
        pseudoServer.SemaphoreFilePath = semaphoreFilePath;
        RegisterServerHelper.Execute( { Server:pseudoServer, SuppressValidation:true } );
        registeredServers.push( pseudoServer );
    }

    // now call FindServers and expect to find just the last server only
    if( Assert.True( FindServersHelper.Execute(), "Expected FindServerS() to succeed. Aborting test." ) ) {
        if( Assert.GreaterThan( 0, FindServersHelper.Response.Servers.length, "Expected 1 or more Response.Servers in FindServers() call." ) ) {
            for( var x=0; x<MAX; x++ ) Assert.False( RegisterServerHelper.serverInFindServersResponse( FindServersHelper.Response, registeredServers[x] ), "Found Server (ServerNames[0]: " + registeredServers[x].ServerNames[0].Text + ") that should not be listed since its SemaphoreFilePath was overritten by another server definition." );
            Assert.True( RegisterServerHelper.serverInFindServersResponse( FindServersHelper.Response, registeredServers[MAX] ), "Did not find last registered server although it is the last server registered that uses the same SemaphoreFilePath.", "Found Server (ServerNames[0]: " + registeredServers[9].ServerNames[0].Text + ") as expected!" );
        }
    }
    return( true );
}

// safelyInvoke( registerServer012 );
addSkipped( "Awaiting new feature to be added to CTT binary for File I/O." );