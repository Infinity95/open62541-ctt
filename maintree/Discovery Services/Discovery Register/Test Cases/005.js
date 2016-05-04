/*  Test preapred by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() default values; semaphoreFilePath exists; IsOnline=true. */

function registerServer005() {
    var pseudoServer = getDefaultPseudoServer();
    pseudoServer.SemaphoreFilePath =  readSetting( "/Discovery/SemaphoreFilePath" ).toString();
    RegisterServerHelper.Execute( { Server:pseudoServer } );
}

// safelyInvoke( registerServer005 );
addSkipped( "Awaiting new feature to be added to CTT binary for File I/O." );