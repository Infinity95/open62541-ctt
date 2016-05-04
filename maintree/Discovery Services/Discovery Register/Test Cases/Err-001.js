/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: RegisterServer() default values; insecure channel. */

function registerServer001() {
    const SUPPRESS_ERRORS = true;

    // disconnect channel defined in 'initialize.js'
    disconnectSecureConnection();

    // make an insecure connection
    Test.Connect( { OpenSecureChannel: { 
                            EndpointUrl: readSetting( "/Discovery/Endpoint Url" ), 
                            MessageSecurityMode: MessageSecurityMode.None, 
                            RequestedSecurityPolicyUri: SecurityPolicy.None } } );

    var expectedError = new ExpectedAndAcceptedResults( StatusCode.BadSecurityPolicyRejected );

    // call RegisterServer()
    var pseudoServer = getDefaultPseudoServer();
    RegisterServerHelper.Execute( { 
                Server:pseudoServer,  
                ChannelError: expectedError,
                SuppressValidation: true } );

    // disconnect this channel and then reconnect channel defined in 'initialize.js'
    Test.Disconnect();
    createSecureConnection();
    return( true );
}

Test.Execute( { Procedure: registerServer001 } );