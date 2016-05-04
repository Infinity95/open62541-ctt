/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() default values; multiple times; IsOnline=False */

function registerServer009() {
    for( var i=0; i<10; i++ ) {
        var pseudoServer = getDefaultPseudoServer();
        pseudoServer.IsOnline = false;
        pseudoServer.SemaphoreFilePath =  readSetting( "/Discovery/SemaphoreFilePath" ).toString();

        RegisterServerHelper.Execute( { Server: pseudoServer } );
    }
}

// safelyInvoke( registerServer009 );
addSkipped( "Awaiting new feature to be added to CTT binary for File I/O." );