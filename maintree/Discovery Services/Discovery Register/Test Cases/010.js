/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org    
    Description: RegisterServer() default values; multiple times, each from a different secure channel; 
        vary semaphoreFilePath is valid/invalid. */

function registerServer008() {
    disconnectSecureConnection();

    var registeredServers = [];
    for( var i=0; i<10; i++ ) {
        createSecureConnection();

        registeredServers[i] = getDefaultPseudoServer();
        if( i % 2 ) registeredServers[i].SemaphoreFilePath += "NotExist";

        RegisterServerHelper.Execute( { Server: registeredServers[i] } );

        // disconnect the channel
        disconnectSecureConnection();
    }

    // unregister all of the previously registered servers
    for( var i=0; i<registeredServers.length; i++ ) {
        // create a new connection
        createSecureConnection();

        registeredServers[i].IsOnline = false;
        RegisterServerHelper.Execute( { Server: registeredServers[i] } );

        // disconnect the channel
        disconnectSecureConnection();
    }//for i...

    // create a new connection
    createSecureConnection();
    return( true );
}

// safelyInvoke( registerServer008 );
addSkipped( "Awaiting new feature to be added to CTT binary for File I/O." );