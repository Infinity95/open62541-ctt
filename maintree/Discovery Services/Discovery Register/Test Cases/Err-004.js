/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() default values; DiscoveryUrls=empty; expect Bad_DiscoveryUrlMissing */

function registerServer004() {
    // define invalid request
    var pseudoServer = getDefaultPseudoServer();
    pseudoServer.DiscoveryUrls = [];

    var expectation = new ExpectedAndAcceptedResults( StatusCode.BadDiscoveryUrlMissing );
    RegisterServerHelper.Execute( { 
                Server:pseudoServer, 
                ExpectedErrors: expectation, 
                SuppressVerification: true } );
    return( true );
}

Test.Execute( { Procedure: registerServer004 } );