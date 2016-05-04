/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() IsOnline=true; SemaphoreFilePath does not exist. */

function registerServer007() {
    var pseudoServer = getDefaultPseudoServer();
    pseudoServer.SemaphoreFilePath += "NotExist";

    RegisterServerHelper.Execute( { Server: pseudoServer, ExpectInFindServers: false } );
}

// safelyInvoke( registerServer007 );
addSkipped( "Awaiting new feature to be added to CTT binary for File I/O." );