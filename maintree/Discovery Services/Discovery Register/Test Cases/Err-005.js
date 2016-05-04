/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() default values; ServerUri != ServerCertificate.ApplicationUri; expect Bad_ServerUriInvalid. */

function registerServer006() {
    // define invalid request
    var pseudoServer = getDefaultPseudoServer();
    pseudoServer.ServerUri = "DifferentToCertificate";

    var expectation = new ExpectedAndAcceptedResults( StatusCode.BadServerUriInvalid );
    RegisterServerHelper.Execute( { 
                Server:pseudoServer, 
                ExpectedErrors: expectation, 
                SuppressVerification: true } );
    return( true );
}

Test.Execute( { Procedure: registerServer006 } );