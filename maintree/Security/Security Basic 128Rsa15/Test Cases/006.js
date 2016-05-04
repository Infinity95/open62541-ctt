/*  Test prepared by <your name>: <email>; 
    Description:
        Create a secure channel.
*/

function tcp128Rsa15001() {
        // Connect to the server
    var g_channel = new UaChannel();
    var Test.Session.Session = new UaSession( g_channel );

    Test.Session.Session.DefaultTimeoutHint = parseInt( readSetting( "/Server Test/Session/DefaultTimeoutHint" ) );
    if( !connect( g_channel, Test.Session.Session, {
            RequestedSecurityPolicyUri: SecurityPolicy.Basic128Rsa15,
            MessageSecurityMode: MessageSecurityMode.SignAndEncrypt } ) ) {
        stopCurrentUnit();
        return( false );
    }

    if( !activateSession( Test.Session.Session ) ) {
        stopCurrentUnit();
        return( false );
    }

    disconnect( g_channel, Test.Session.Session );
}

safelyInvoke( tcp128Rsa15001 );