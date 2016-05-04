/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() default values; IsOnline=FALSE. */

function registerServer002()
{
    pseudoServer = getDefaultPseudoServer();
    pseudoServer.IsOnline = false;
    RegisterServerHelper.Execute( { Server: pseudoServer } );
    return( true );
}

Test.Execute( { Procedure: registerServer002 } );