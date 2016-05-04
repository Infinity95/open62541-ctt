/*  Test preapared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() default values; multiple times, all SemaphorefilePath=null, except 1. */

function registerServer010() {
    var registeredServers = [];

    for( var i=0; i<10; i++ ) {
        var pseudoServer = getDefaultPseudoServer();
        pseudoServer.SemaphoreFilePath = "c://folder//file" + i + ".txt";
        RegisterServerHelper.Execute( { Server:pseudoServer } );
        registeredServers.push( pseudoServer );
    }

    // now to delete one of the semaphore files 
    //DeleteFile( registeredServers[0].SemaphoreFilePath );

    // now to call FindServers
    //TODO
}

addSkipped( "Awaiting new feature to be added to CTT binary for File I/O." );