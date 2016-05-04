/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() default values; gatewayServerUri is specified. */

function registerServer003()
{
    pseudoServer = getDefaultPseudoServer();
    pseudoServer.GatewayServerUri = "opc.tcp://gateway:4840/";
    RegisterServerHelper.Execute( { Server: pseudoServer } );
    return( true );
}

Test.Execute( { Procedure: registerServer003 } );