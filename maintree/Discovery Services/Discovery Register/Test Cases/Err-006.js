/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() default values; ServerType=CLIENT_1; expect Bad_InvalidArgument. */

function registerServer007() {
    // define invalid request
    var pseudoServer = getDefaultPseudoServer();
    pseudoServer.ServerType = ApplicationType.Client;

    var expectation = new ExpectedAndAcceptedResults( StatusCode.BadInvalidArgument );
    RegisterServerHelper.Execute( { 
                Server:pseudoServer, 
                ExpectedErrors: expectation, 
                SuppressVerification: true } );
    return( true );
}

Test.Execute( { Procedure: registerServer007 } );