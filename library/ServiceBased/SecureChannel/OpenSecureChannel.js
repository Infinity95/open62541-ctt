include( "./library/Base/Nonce.js" );

function OpenSecureChannelService( args ) {
    this.Name = "OpenSecureChannel";
    this.Channel = null;
    this.UaStatus = null;
    this.CallCount = 0;

    if( !isDefined( args ) ) args = new Object();
    this.Channel = isDefined( args.Channel )? args.Channel : new UaChannel();

    this.Execute = function( args ) {
        // validate all of our parameters first; and configure a new channel object
        if( !isDefined( args ) ) args = new Object();
        if( !isDefined( args.SuppressErrors ) ) args.SuppressErrors = false;
        if( isDefined( args.SecurityPolicyUri ) ) throw( this.Name + "() 'SecurityPolicyUri' parameter received. Rename to 'RequestedSecurityPolicyUri'." );
        if( this.Channel === null ) this.Channel = new UaChannel();
        // setup the certificate handling
        var pkiProvider = new UaPkiUtility();    // we need this pki provider object to load PKI certificates with
        pkiProvider.PkiType = isDefined( args.PkiType )? args.PkiType : PkiType.OpenSSL;
        pkiProvider.CertificateRevocationListLocation  = isDefined( args.CertificateRevocationListLocation )? args.CertificateRevocationListLocation : readSetting( "/Advanced/Certificates/CertificateTrustListLocation" );
        pkiProvider.CertificateTrustListLocation       = isDefined( args.CertificateTrustListLocation )?      args.CertificateTrustListLocation :      readSetting( "/Advanced/Certificates/CertificateRevocationListLocation" );
        this.Channel.CertificateRevocationListLocation = pkiProvider.CertificateRevocationListLocation;
        this.Channel.CertificateTrustListLocation      = pkiProvider.CertificateTrustListLocation;
        // setup all other details
        this.Channel.MessageSecurityMode               = isDefined( args.MessageSecurityMode )?               args.MessageSecurityMode :               parseInt( readSetting( "/Server Test/Secure Channel/MessageSecurityMode" ) );
        this.Channel.NetworkTimeout                    = isDefined( args.NetworkTimeout )?                    args.NetworkTimeout :                    parseInt( readSetting( "/Server Test/Secure Channel/NetworkTimeout" ) );
        this.Channel.RequestedLifetime                 = isDefined( args.RequestedLifetime )?                 args.RequestedLifetime :                 parseInt( readSetting( "/Server Test/Secure Channel/RequestedLifetime" ) );
        this.Channel.ServerUrl                         = isDefined( args.ServerUrl )?                         args.ServerUrl :                         readSetting( "/Server Test/Server URL" );
        this.Channel.ClientNonce                       = isDefined( args.ClientNonce )?                       args.ClientNonce :                       UaByteString.fromStringData( Nonce.Next( 32 ) );
        if( isDefined( args.RequestedSecurityPolicyUri ) ) {
            if( typeof( args.RequestedSecurityPolicyUri ) === "string" ) this.Channel.RequestedSecurityPolicyUri = SecurityPolicy.policyFromString( args.RequestedSecurityPolicyUri );
            else this.Channel.RequestedSecurityPolicyUri = args.RequestedSecurityPolicyUri;
        }
        else this.Channel.RequestedSecurityPolicyUri = parseInt( readSetting( "/Server Test/Secure Channel/RequestedSecurityPolicyUri" ) );

        if( !isDefined( args.ServerCertificate ) ) {
            if( isDefined( gServerCapabilities ) && isDefined( gServerCapabilities.ServerCertificate ) ) this.Channel.ServerCertificate = gServerCapabilities.ServerCertificate.toDER();
            else { // we don't have the server certificate; let's go get it using an insecure connection
                var tmpChannel = new UaChannel();
                var discoverySession = new UaDiscovery( tmpChannel );
                var status = tmpChannel.connect( readSetting( "/Server Test/Server URL" ) );
                if( status.isGood() ) {
                    var getEndpointsHelper = new GetEndpointsService( { Session: discoverySession } );
                    getEndpointsHelper.Execute2();
                    tmpChannel.disconnect();
                    // cache the endpoints; and then locate the exact endpoint matching the CTT settings. We will use it for connecting to...
                    for( var e=0; e<getEndpointsHelper.Response.Endpoints.length; e++ ) {             // process our endpoints...
                        var currEndpoint = getEndpointsHelper.Response.Endpoints[e].clone();          // clone the endpoint
                        gServerCapabilities.Endpoints.push( currEndpoint );                           // cache the endpoints in the gServerCapabilities object, but do this only once
                        if( currEndpoint.SecurityMode         === this.Channel.MessageSecurityMode    // does *this* endpoint match our connection criteria in the settings?
                            && SecurityPolicy.policyFromString( currEndpoint.SecurityPolicyUri ) === this.Channel.RequestedSecurityPolicyUri
                            && currEndpoint.EndpointUrl       === this.Channel.ServerUrl ) gServerCapabilities.ConnectedEndpoint = currEndpoint;
                    }
                    // find the user identity token in the specified endpoint
                    if( isDefined( gServerCapabilities.ConnectedEndpoint ) ) {
                        var settingPolicy = parseInt( readSetting( "/Server Test/Session/UserAuthenticationPolicy" ).toString() );
                        for( var i=0; i<gServerCapabilities.ConnectedEndpoint.UserIdentityTokens.length; i++ ) {
                            if( gServerCapabilities.ConnectedEndpoint.UserIdentityTokens[i].TokenType === settingPolicy ) {
                                gServerCapabilities.ConnectedIdentityToken = gServerCapabilities.ConnectedEndpoint.UserIdentityTokens[i];
                                break;
                            }
                        }// for i
                    }
                    // store the certificate in the gServerCapabilities global object; and this channel object
                    gServerCapabilities.ServerCertificate = UaPkiCertificate.fromDER( getEndpointsHelper.Response.Endpoints[0].ServerCertificate );
                    this.Channel.ServerCertificate = getEndpointsHelper.Response.Endpoints[0].ServerCertificate;
                    // save the certificate to the trust list, using the thumbprint as the filename; existing file will be clobbered
                    var serverCertFilename = readSetting( "/Advanced/Certificates/CertificateTrustListLocation" ).toString() + "/" + gServerCapabilities.ServerCertificate.Thumbprint.toString().substring( gServerCapabilities.ServerCertificate.Thumbprint.toString().indexOf( "=", 6 ) + 3 ) + ".der";
                    gServerCapabilities.ServerCertificate.toDERFile( serverCertFilename );
                }
            }
        }
        // client certificate
        if( !isDefined( args.ClientCertificate ) ) this.Channel.ClientCertificate = this.LoadCertificate( readSetting( "/Advanced/Certificates/ClientCertificate" ), pkiProvider );
        else this.Channel.ClientCertificate = this.LoadCertificate( args.ClientCertificate, pkiProvider );
        // client certificate private key
        if( !isDefined( args.ClientCertificatePrivateKey ) ) this.Channel.ClientPrivateKey = this.LoadCertificatePrivateKey( readSetting( "/Advanced/Certificates/ClientPrivateKey" ), pkiProvider );
        else this.Channel.ClientPrivateKey = this.LoadCertificatePrivateKey( args.ClientCertificatePrivateKey, pkiProvider );
        // suppress messaging
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;
        // create our connection
        if( isDefined( args.PreHook ) ) args.PreHook();
        this.UaStatus = this.Channel.connect( args.ServerUrl );
        var msg = "OpenSecureChannel( MessageSecurityMode: " + MessageSecurityMode.toString( this.Channel.MessageSecurityMode ) + "; RequestedSecurityPolicyUri: " + SecurityPolicy.policyToString( this.Channel.RequestedSecurityPolicyUri ) + " ); Result = " + this.UaStatus + ( isDefined( args.ServiceResult )? " " + args.ServiceResult.toString() : "" ) ;
        var result = this.UaStatus.isGood();
        if( !args.SuppressMessaging ) print( msg );
        if( isDefined( args.ServiceResult ) ) {
            if( !Assert.True( args.ServiceResult.containsStatusCode( this.UaStatus.StatusCode ), this.Name + ".Response is not good; received '" + this.UaStatus + "'. " + args.ServiceResult.toString() ) ) result = false;
        }
        else if( this.UaStatus.isBad() && !args.SuppressErrors ) addError( msg, this.UaStatus );
        if( isDefined( args.PostHook ) ) args.PostHook();
        return( result );
    }

    /* Returns TRUE/FALSE if the Channel (specifed, or *this*) is secured
       Parameters:
           Channel: a UaChannel object (OPTIONAL) */
    this.IsSecure = function( channel ) { 
        if( isDefined( channel ) ) return( channel.RequestedSecurityPolicyUri !== SecurityPolicy.None && channel.MessageSecurityMode !== MessageSecurityMode.None );
        else return( this.Channel.RequestedSecurityPolicyUri !== SecurityPolicy.None && this.Channel.MessageSecurityMode !== MessageSecurityMode.None );
    }
    
    this.LoadCertificate = function( filename, pkiProvider ) {
        var clientCertificate = new UaByteString();
        var certResult = pkiProvider.loadCertificateFromFile( filename, clientCertificate );
        if( certResult.isGood() ) return( clientCertificate );
        else {
            addError( this.Name + "() LoadCertificate failed to load certificate from filename '" + filename + "'." );
            return( null );
        }
    }
    this.LoadCertificatePrivateKey = function( filename, pkiProvider ) {
        var clientPrivateKey  = new UaByteString();
        var certResult = pkiProvider.loadPrivateKeyFromFile( filename, clientPrivateKey );
        if( certResult.isGood() ) return( clientPrivateKey );
        else {
            addError( this.Name + "() LoadCertificatePrivateKey failed to load key from filename '" + filename + "'." );
            return( null );
        }
    }

}