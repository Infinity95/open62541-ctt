/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() default values; multiple discoveryUrls. */

function registerServer004()
{
    pseudoServer = getDefaultPseudoServer();
    pseudoServer.DiscoveryUrls = [ 
            "opc.tcp://localhost:4840/", 
            "opc.tcp://host1:4840", 
            "opc.tcp://host2:4840/" 
            ];
    RegisterServerHelper.Execute( { Server:pseudoServer } );
    return( true );
}

Test.Execute( { Procedure: registerServer004 } );