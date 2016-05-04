/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() default values; ServerNames=empty; expect Bad_ServerNameMissing. */

function registerServer003() {
    // define invalid request
    var pseudoServer = getDefaultPseudoServer();
    pseudoServer.ServerNames = [];

    var expectation = new ExpectedAndAcceptedResults( StatusCode.BadServerNameMissing );
    RegisterServerHelper.Execute( { 
                Server:pseudoServer, 
                ExpectedErrors: expectation, 
                SuppressVerification: true } );
    return( true );
}

Test.Execute( { Procedure: registerServer003 } );