/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() default values; ServerType=invalid value expect Bad_InvalidArgument. */

function registerServer008() {
    // define invalid request
    var pseudoServer = getDefaultPseudoServer();
    pseudoServer.ServerType = 0xff;

    var expectation = new ExpectedAndAcceptedResults( StatusCode.BadInvalidArgument );
    RegisterServerHelper.Execute( { 
                Server:pseudoServer, 
                ExpectedErrors: expectation, 
                SuppressVerification: true } );
    return( true );
}

Test.Execute( { Procedure: registerServer008 } );