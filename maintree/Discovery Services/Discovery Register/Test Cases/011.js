/*  Test preapared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() default values; multiple times; IsOnline=false. */

function registerServer011() {
    for( var i=0; i<10; i++ ) {
        var pseudoServer = getDefaultPseudoServer();
        pseudoServer.IsOnline = false;

        RegisterServerHelper.Execute( { Server: pseudoServer } );
    }
    return( true );
}

Test.Execute( { Procedure: registerServer011 } );