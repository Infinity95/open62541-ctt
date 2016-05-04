/*  Test prepared by <your name>: <email>; 
    Description:
        Close an already closed secure channel.
*/

function tcp128Rsa15002() {
        // Connect to the server
    var g_channel = new UaChannel();
    var Test.Session.Session = new UaSession( g_channel );

    Test.Session.Session.DefaultTimeoutHint = parseInt( readSetting( "/Server Test/Session/DefaultTimeoutHint" ) );
    if( !connect( g_channel, Test.Session.Session, {
            RequestedSecurityPolicyUri: SecurityPolicy.Basic128Rsa15,
            MessageSecurityMode: MessageSecurityMode.SignAndEncrypt 
        } ) ) {
        stopCurrentUnit();
        return( false );
    }

    if( !activateSession( Test.Session.Session ) ) {
        stopCurrentUnit();
        return( false );
    }

    disconnect( g_channel, Test.Session.Session );

    // now to close the already-closed channel
    var expectedResults = new ExpectedAndAcceptedResults( [ StatusCode.BadSecureChannelIdInvalid, StatusCode.BadInvalidState ] );
    disconnectChannel( g_channel, expectedResults );
}

safelyInvoke( tcp128Rsa15002 );