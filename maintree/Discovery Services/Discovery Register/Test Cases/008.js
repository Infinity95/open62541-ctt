/*  Test preapared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() default values; multiple times, each from a different secure channel */

function registerServer008() {
    // first, disconnect the main channel
    disconnectSecureConnection();
    var registeredServers = [];

    for( var i=0; i<10; i++ ) {
        createSecureConnection();

        registeredServers[i] = getDefaultPseudoServer();
        RegisterServerHelper.Execute( { Server:registeredServers[i] } );

        disconnectSecureConnection();
    }

    // unregister all of the previously registered servers
    for( var i=0; i<registeredServers.length; i++ ) {
        createSecureConnection();

        registeredServers[i].IsOnline = false;
        RegisterServerHelper.Execute( { Server:registeredServers[i] } );

        disconnectSecureConnection();
    }//for i...

    // create a new connection
    createSecureConnection();
    return( true );
}

Test.Execute( { Procedure: registerServer008 } );