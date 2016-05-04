/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() default values; ServerUri=empty; expect Bad_ServerUriInvalid. */

function registerServer002() {
    // define invalid request
    var pseudoServer = getDefaultPseudoServer();
    pseudoServer.ServerUri = "";

    // define expectation, and then call RegisterServer()
    var expectation = new ExpectedAndAcceptedResults( StatusCode.BadServerUriInvalid );
    RegisterServerHelper.Execute( { Server:pseudoServer, ExpectedErrors: expectation, SuppressVerification: true } );
    return( true );
}

Test.Execute( { Procedure: registerServer002 } );