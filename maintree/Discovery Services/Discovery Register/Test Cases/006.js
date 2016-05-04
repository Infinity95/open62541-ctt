/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() default values; semaphoreFilePath exist; IsOnline=false. */

function registerServer006() {
    var pseudoServer = getDefaultPseudoServer();
    pseudoServer.SemaphoreFilePath =  readSetting( "/Discovery/SemaphoreFilePath" ).toString();
    pseudoServer.IsOnline = false;

    RegisterServerHelper.Execute( { 
            Server:pseudoServer,
            ExpectInFindServers:true
            } );
}

// safelyInvoke( registerServer006 );
addSkipped( "Awaiting new feature to be added to CTT binary for File I/O." );