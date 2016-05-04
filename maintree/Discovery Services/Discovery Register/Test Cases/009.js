/*  Test preapared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() default values; multiple servers, mix IsOnline=true/false. */

function registerServer009() {
    // first, disconnect the main channel
    disconnectSecureConnection();

    var registeredServers = [];
    for( var i=0; i<10; i++ ) {
        createSecureConnection();

        registeredServers[i] = getDefaultPseudoServer();
        registeredServers[i].IsOnline = ( i % 2 );
        RegisterServerHelper.Execute( { Server: registeredServers[i] } );

        disconnectSecureConnection();
    }

    // unregister all of the previously registered servers
    for( var i=0; i<registeredServers.length; i++ ) {
        createSecureConnection();

        registeredServers[i].IsOnline = false;
        RegisterServerHelper.Execute( { Server: registeredServers[i] } );

        disconnectSecureConnection();
    }//for i...

    // create a new connection
    createSecureConnection();
    return( true );
}

Test.Execute( { Procedure: registerServer009 } );