/*  Test prepared by <your name>: <email>; 
    Description:
        Close a secure channel that has timed-out due to inactivity.
*/

function tcp128Rsa15003() {
    // do we have a certificate to work with? if not, skip test
    if( gServerCapabilities.ServerCertificate === null ) {
        addSkipped( "Server Certificate unavailable. Skipping test." );
        return( false );
    }

    // create and configure PkiProvider    
    var pkiProvider = new UaPkiUtility();
    pkiProvider.CertificateTrustListLocation = readSetting( "/Advanced/Certificates/CertificateTrustListLocation" );
    pkiProvider.CertificateRevocationListLocation = readSetting( "/Advanced/Certificates/CertificateRevocationListLocation" );
    pkiProvider.PkiType = PkiType.OpenSSL;

    var clientCertificate = new UaByteString();
    var clientPrivateKey  = new UaByteString();

    // load client certificate
    const CLIENT_CERT_SETTING = "/Advanced/Certificates/ClientCertificate";
    uaStatus = pkiProvider.loadCertificateFromFile( readSetting( CLIENT_CERT_SETTING ), clientCertificate );
    print( "load clientCertificate returned " + uaStatus );
    if( uaStatus.isBad() ) {
        addError( "Unable to load client certificate defined in setting '" + CLIENT_CERT_SETTING + "'; Current value: '" + readSetting( CLIENT_CERT_SETTING ).toString() + "'. Please check settings." );
        return( false );
    }

    // load client private key
    const CLIENT_PRIV_SETTING = "/Advanced/Certificates/ClientPrivateKey";
    uaStatus = pkiProvider.loadPrivateKeyFromFile( readSetting( CLIENT_PRIV_SETTING ), clientPrivateKey );
    print( "Load clientPrivateKey returned " + uaStatus );
    if( uaStatus.isBad() ) {
        addError( "Unable to load client private key defined in setting '" + CLIENT_PRIV_SETTING + "'; current value: '" + readSetting( CLIENT_PRIV_SETTING ).toString() + "'. Please check settings." );
        return( false );
    }

    // Define the channel connection
    var g_channel = new UaChannel();
    g_channel.RequestedLifetime = 3000;
    g_channel.NetworkTimeout = 1500;
    g_channel.RequestedSecurityPolicyUri = SecurityPolicy.Basic128Rsa15;
    g_channel.MessageSecurityMode = MessageSecurityMode.SignAndEncrypt;
    g_channel.PkiType = PkiType.OpenSSL;
    g_channel.CertificateTrustListLocation = readSetting( "/Advanced/Certificates/CertificateTrustListLocation" );
    g_channel.CertificateRevocationListLocation = readSetting( "/Advanced/Certificates/CertificateRevocationListLocation" );
    g_channel.ServerCertificate = gServerCapabilities.ServerCertificate.toDER();
    g_channel.ClientCertificate = clientCertificate;
    g_channel.ClientPrivateKey = clientPrivateKey;
    g_channel.ClientNonce = UaByteString.fromStringData( getNextClientNonce( 32 ) );

    try{
        // now connect
        var uaStatus = g_channel.connect( readSetting( "/Server Test/Server URL" ).toString() );
        addLog( "CreateSecureChannel() called. Result: " + uaStatus.toString() 
                    + "\n\tRequestedSecurityPolicyUri: " + SecurityPolicy.policyToString( g_channel.RequestedSecurityPolicyUri ) + " (" + g_channel.RequestedSecurityPolicyUri + ")" 
                    + "\n\tMessageSecurityMode: " + MessageSecurityMode.toString( g_channel.MessageSecurityMode ) + " (" + g_channel.MessageSecurityMode + ")."
                    + "\n\tServerUrl: " + g_channel.ServerUrl, uaStatus );
        if( !uaStatus.isGood() ) addError( "Unable to CreateSecureChannel, error: " + uaStatus, uaStatus );
        else {
            // now to wait, and let the timeout occur
            var abortAt = UaDateTime.utcNow();
            abortAt.addMilliSeconds( 10 * g_channel.RequestedLifetime );
            while( UaDateTime.utcNow() < abortAt ) {
                print( "Waiting " + UaDateTime.utcNow().secsTo( abortAt ) + " seconds before calling CloseSecureChannel() and expecting a timeout." );
                wait( 980 );
            }
            // now to close the already-closed channel
            var expectedResults = new ExpectedAndAcceptedResults( [ StatusCode.BadSecureChannelIdInvalid, StatusCode.BadInvalidState ] );
            disconnectChannel( g_channel, expectedResults );
        }
    }catch(ex){ addError( ex.toString() ); }
}

addSkipped( "Skipped, pending Mantis 2484" ); //safelyInvoke( tcp128Rsa15003 );