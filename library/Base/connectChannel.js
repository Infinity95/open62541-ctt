/*include( "./library/Base/safeInvoke.js" );
include( "./library/Base/serverCapabilities.js" );
include( "./library/ServiceBased/Helpers.js" );

// NP 26-May-2011: The following variable/function generate unique Session names 
//                 and are used by all test-scripts creating sessions.
var __GLOBAL_SessionNumber;
if( __GLOBAL_SessionNumber === undefined ) {
    __GLOBAL_SessionNumber = 1;
}
function getNextSessionName() {
    return( "UaCttSession_" + __GLOBAL_SessionNumber++ );
}

var connectChannelStatus;

/* Checks the identity token used in the CTT connection and then returns:
    TRUE: if secured
    FALSE: if not secured * /
function isAuthenticationSecure() {
    if( isDefined( gServerCapabilities.ConnectedIdentityToken ) ) {
        // anonymous = NO
        if( gServerCapabilities.ConnectedIdentityToken.TokenType == UserTokenType.Anonymous ) return( false );
        // username = MAYBE
        if( gServerCapabilities.ConnectedIdentityToken.TokenType === UserTokenType.UserName ) {
            // check the security policy uri
            var pUri = gServerCapabilities.ConnectedIdentityToken.SecurityPolicyUri;
            if( pUri === "" || pUri === SecurityPolicy.policyToString( SecurityPolicy.None ) ) return( false );
            else return( true );
        }
        // certificate = YES
        if( gServerCapabilities.ConnectedIdentityToken.TokenType === UserTokenType.Certificate ) return( true );
    }
    else {
        var authIsSecure = readSetting( "/Server Test/Session/UserAuthenticationPolicy" ).toString() !== "0";
        return( authIsSecure );
    }
}//function isAuthenticationSecure()


function isChannelSecure( Channel ) { 
    if( !isDefined( Channel ) ) throw( "isChannelSecure::Channel not specified." );
    var modeIsSecure = Channel.RequestedSecurityPolicyUri !== SecurityPolicy.None && Channel.MessageSecurityMode !== MessageSecurityMode.None;
    return( modeIsSecure );
}//isChannelSecure( Channel )


// NP 27-Sep-2011: The following variable/function generates a unique ClientNonce
//                 which is used when opening a new channel.
var __GLOBAL_ClientNonce;
if( __GLOBAL_ClientNonce === undefined ) {
    __GLOBAL_ClientNonce = [];
}
function getNextClientNonce( length ) {
    var s="";
    var len = ( length === undefined || length === null || length < 32 )? 32: length;
    while( true ) {
        for( var i=0; i<len; i++ ) s += parseInt( 10 * Math.random() ).toString();
        // check if the generated nonce has been used previously.
        for( var i=0; i<__GLOBAL_ClientNonce.length; i++ ) {
            // if we have a match, generate a new nonce
            if( __GLOBAL_ClientNonce[i] === s ) {
                print( "Nonce found... generating a new one!" );
                continue;
            }
        }
        // if unused, then exit, we have our number!
        __GLOBAL_ClientNonce.push( s );
        break;
    }//while true
    return( s );
}

/*  NP 27-Sep-2011
    The following object contains parameters to override in the OpenSecureChannel
    call. * /
function SecureChannelOverrides( args  ) {
    this.SecurityPolicyUri   = ( args !== undefined && args !== null && args.SecurityPolicyUri !== undefined && args.SecurityPolicyUri !== null )? args.SecurityPolicyUri : null;
    this.MessageSecurityMode = ( args !== undefined && args !== null && args.MessageSecurityMode !== undefined && args.MessageSecurityMode !== null )? args.MessageSecurityMode : null;
    this.ProvideCertificates = ( args !== undefined && args !== null && args.ProvideCertificates !== undefined && args.ProvideCertificates !== null )? args.ProvideCertificates : true;
    this.ProvideNonce        = ( args !== undefined && args !== null && args.ProvideNonce !== undefined && args.ProvideNonce !== null )? args.ProvideNonce : true;
    this.CustomNonce         = ( args !== undefined && args !== null && args.CustomNonce !== undefined && args.CustomNonce !== null )? args.CustomNonce : null;
    this.ServerCertificate = ( isDefined( args ) && args.ServerCertificate !== undefined && args.ServerCertificate !== null )? args.ServerCertificate : null;
    this.ServerCertificateOverride = ( isDefined( args ) && args.ServerCertificateOverride !== undefined && args.ServerCertificateOverride !== null ) ? args.ServerCertificateOverride : null;
    this.ServerUrl = ( isDefined( args ) && isDefined( args.ServerUrl ) )? args.ServerUrl : null;

    this.toString = function() {
        return( "SecurityPolicyUri=" + this.SecurityPolicyUri + "\nMessageSecurityMode=" + this.MessageSecurityMode +
            "\nProvideCertificates=" + this.ProvideCertificates + "\nProvideNonce=" + this.ProvideNonce +
            "\nCustomNonce=" + this.CustomNonce + "\nServerCertificate=" + this.ServerCertificate +
            "\nServerUrl=" + this.ServerUrl );
    }// this.toString = function()
}// function SecureChannelOverrides( args  )


/* Searches through the specified endpoints looking for the user authentication token information
   that matches the CTT setting: /Server Test/Session/UserAuthenticationPolicy * /
function findConfiguredEndpoint( endpoints, overrides ) {
    if( !isDefined( endpoints ) ) throw( "findConfiguredEndpoint::endpoints not specified." );
    var msgSecurityMode = parseInt( readSetting( "/Server Test/Secure Channel/MessageSecurityMode" ).toString() );
    var securityPolicy = SecurityPolicy.policyToString( parseInt( readSetting( "/Server Test/Secure Channel/RequestedSecurityPolicyUri" ).toString() ) );
    var endpointUrl = readSetting( "/Server Test/Server URL" ).toString();
    if( isDefined( overrides ) ) {
        if( isDefined( overrides.SecurityPolicyUri ) ) {
            if( parseInt( overrides.SecurityPolicyUri ) >= 0 ) securityPolicy = SecurityPolicy.policyToString( overrides.SecurityPolicyUri );
            else securityPolicy = overrides.SecurityPolicyUri;
        }
        if( isDefined( overrides.MessageSecurityMode ) ) msgSecurityMode = overrides.MessageSecurityMode;
    }
    for( var i=0; i<endpoints.length; i++ ) {
        var currEP = endpoints[i];
        if( currEP.SecurityMode === msgSecurityMode &&
            currEP.SecurityPolicyUri === securityPolicy &&
            currEP.EndpointUrl === endpointUrl ) {
            return( currEP );
        }// if
    }// for i
    return( null );
}


/* Searches through the specified UserIdentityTokens for the user authentication token 
   information that matches the CTT setting: /Server Test/Session/UserAuthenticationPolicy * /
function findUserAuthenticationTokenInfo( userTokens ) {
    if( !isDefined( userTokens ) ) throw( "findUserAuthenticationTokenInfo::userTokens not specified." );
    var settingPolicy = parseInt( readSetting( "/Server Test/Session/UserAuthenticationPolicy" ).toString() );
    for( var i=0; i<userTokens.length; i++ ) {
        if( userTokens[i].TokenType === settingPolicy ) return( userTokens[i] );
    }// for i
    return( null );
}


/* Responsible for connecting to a UA Server.
   This function also calls GetEndpoints to try and find the connection credentials 
   that the CTT will use; stored in the gServerCapabilities global structure. * /
function connectChannel( Channel, ServerUrl, overrides, suppressErrors, serviceResult ) {
    var uaStatus;
    var url;
    var discoveryUrl;
    if( !isDefined( Channel ) ) {
        addError( "function connectChannel(): Channel not specified!" );
        return false;
    }
    if( !isDefined( ServerUrl ) ) discoveryUrl = readSetting( "/Server Test/Server URL" );
    else discoveryUrl = ServerUrl;

    // call GetEndpoints to obtain the server's certificate; but ONLY if we haven't already cached it!
    if( gServerCapabilities.Endpoints.length === 0 ) {
        var channel = new UaChannel();
        var discovery = new UaDiscovery( channel );
        connectChannelNoSecurity( channel, discoveryUrl ); 
        // gather intel about the servers capabilities, and cache other useful info like endpoints etc.
        GetEndpointsHelper = new GetEndpointsService( discovery );
        GetEndpointsHelper.Execute2();
        // cache teh endpoints in the gServerCapabilities object, but do this only once
        for( var e=0; e<GetEndpointsHelper.Response.Endpoints.length; e++ ) gServerCapabilities.Endpoints.push( GetEndpointsHelper.Response.Endpoints[e].clone() );

        // now to search thru the endpoints to find the one that we will connect to...
        gServerCapabilities.ConnectedEndpoint = findConfiguredEndpoint( GetEndpointsHelper.Response.Endpoints, overrides );
        if( isDefined( gServerCapabilities.ConnectedEndpoint ) ) gServerCapabilities.ConnectedIdentityToken = findUserAuthenticationTokenInfo( gServerCapabilities.ConnectedEndpoint.UserIdentityTokens );

        // store the certificate in the gServerCapabilities global object
        gServerCapabilities.ServerCertificate = UaPkiCertificate.fromDER( GetEndpointsHelper.Response.Endpoints[0].ServerCertificate );
        // save the certificate to the trust list, using the thumbprint as the filename
        print( "****ServerCertificate.Thumbprint: " + gServerCapabilities.ServerCertificate.Thumbprint.toString() );
        var serverCertFilename = readSetting( "/Advanced/Certificates/CertificateTrustListLocation" ).toString() + "/" +
                gServerCapabilities.ServerCertificate.Thumbprint.toString().substring(  
                    gServerCapabilities.ServerCertificate.Thumbprint.toString().indexOf( "=", 6 ) + 3 ) + ".der";
        print( "Save to file: " + serverCertFilename + "; result: " + gServerCapabilities.ServerCertificate.toDERFile( serverCertFilename ) );
    }// server endpoints not cached

    if( isDefined( overrides ) && isDefined( overrides.ServerUrl ) ) url = overrides.ServerUrl;
    else if( isDefined( ServerUrl ) ) url = ServerUrl;
    else {
        if( isDefined( gServerCapabilities.ConnectedEndpoint ) ) url = gServerCapabilities.ConnectedEndpoint.EndpointUrl; //readSetting( "/Server Test/Server URL" );
        else url = readSetting( "/Server Test/Server URL" ).toString();
    }
    
    // read security settings, or force our own overrides (from parameters)
    if( overrides == undefined || overrides.SecurityPolicyUri == null ) Channel.RequestedSecurityPolicyUri = readSetting( "/Server Test/Secure Channel/RequestedSecurityPolicyUri" );
    else {
        // is securityPolicyUri an int or string?
        var isInt = parseInt( overrides.SecurityPolicyUri );
        if( isInt >= 0 ) Channel.RequestedSecurityPolicyUri = overrides.SecurityPolicyUri;
        else Channel.RequestedSecurityPolicyUri = SecurityPolicy.policyFromString( overrides.SecurityPolicyUri );
        print( "\tOverriding the SecureChannel PolicyUri to: " + overrides.SecurityPolicyUri + " (" + Channel.RequestedSecurityPolicyUri + ").");
    }
    if( overrides == undefined || overrides.MessageSecurityMode == null ) Channel.MessageSecurityMode = readSetting( "/Server Test/Secure Channel/MessageSecurityMode" );
    else {
        Channel.MessageSecurityMode = overrides.MessageSecurityMode;
        print( "\tOverriding the MessageSecurityMode to: " + MessageSecurityMode.toString( Channel.MessageSecurityMode ) + " (" + Channel.MessageSecurityMode + ")." );
    }

    // create and configure PkiProvider    
    var pkiProvider = new UaPkiUtility();
    pkiProvider.CertificateTrustListLocation = readSetting( "/Advanced/Certificates/CertificateTrustListLocation" );
    pkiProvider.CertificateRevocationListLocation = readSetting( "/Advanced/Certificates/CertificateRevocationListLocation" );
    pkiProvider.PkiType = PkiType.OpenSSL;

    var clientCertificate = new UaByteString();
    var clientPrivateKey  = new UaByteString();
    var serverCertificate = new UaByteString();
    
    // load client certificate
    var clientCertificateSetting = readSetting( "/Advanced/Certificates/ClientCertificate" );
    if( isDefined( overrides ) && isDefined( overrides.ClientCertificate ) ) clientCertificateSetting = overrides.ClientCertificate;
    var uaStatus = pkiProvider.loadCertificateFromFile( clientCertificateSetting, clientCertificate );
    print( "load clientCertificate returned " + uaStatus );
    if( uaStatus.isBad() ) {
        addError( "Unable to load client certificate defined in setting '/Advanced/Certificates/ClientCertificate'; Current value: '" + readSetting( clientCertificateSetting ).toString() + "'. Please check settings." );
        return( false );
    }
    
    // load client private key
    var clientCertificatePrivKeySetting = readSetting( "/Advanced/Certificates/ClientPrivateKey" );
    if( isDefined( overrides ) && isDefined( overrides.ClientCertificatePrivateKey ) ) clientCertificatePrivKeySetting = overrides.ClientCertificatePrivateKey;
    uaStatus = pkiProvider.loadPrivateKeyFromFile( clientCertificatePrivKeySetting, clientPrivateKey );
    print( "Load clientPrivateKey returned " + uaStatus );
    if( uaStatus.isBad() ) {
        addError( "Unable to load client private key '" + clientCertificatePrivKeySetting + "'. Please check settings." );
        return( false );
    }
    
    // load server certificate from the gServerCapabilities global object
   // const SERVER_CERT_SETTING = "/Advanced/Certificates/ServerCertificate";
    if( isDefined( overrides ) && overrides.ServerCertificateOverride !== undefined && overrides.ServerCertificateOverride !== null ) serverCertificate = overrides.ServerCertificateOverride;
    else {
        serverCertificate =  gServerCapabilities.ServerCertificate.toDER();
        if( isDefined( overrides ) && overrides.ServerCertificate !== undefined && overrides.ServerCertificate !== null ) {
            uaStatus = pkiProvider.loadCertificateFromFile( overrides.ServerCertificate, serverCertificate );
            if( uaStatus.isBad() ) {
                addError( "Unable to load server certificate; current value: '" + overrides.ServerCertificate + "'. Please check settings." );
                return( false );
            }
        }
    }

    Channel.PkiType = PkiType.OpenSSL;
    Channel.CertificateTrustListLocation = readSetting( "/Advanced/Certificates/CertificateTrustListLocation" );
    Channel.CertificateRevocationListLocation = readSetting( "/Advanced/Certificates/CertificateRevocationListLocation" );
    // send certificates?
    if( !isDefined( overrides ) || !isDefined( overrides.ProvideCertificates ) || overrides.ProvideCertificates === true ) {
        Channel.ClientCertificate = clientCertificate;
        Channel.ClientPrivateKey = clientPrivateKey;
    }
    Channel.ServerCertificate = serverCertificate;

    // client Nonce
    if( overrides !== undefined && overrides.ProvideNonce !== null && overrides.ProvideNonce === false ) Channel.ClientNonce = null;
    else {
        // determine the key length, this will determine the length of the nonce
        if( overrides !== undefined && overrides.CustomNonce !== undefined && overrides.CustomNonce !== null ) Channel.ClientNonce = UaByteString.fromStringData( overrides.CustomNonce );
        else {
            var keyLen = SecurityAlgorithms.getKeyLength( Channel.RequestedSecurityPolicyUri );
            var s = getNextClientNonce( keyLen );
            // if we don't have a nonce, then dont add it!
            if( s !== null && s.length > 0 ) Channel.ClientNonce = UaByteString.fromStringData( s );
        }
    }

    // timeout
    Channel.NetworkTimeout = parseInt( readSetting( "/Server Test/Secure Channel/NetworkTimeout" ).toString() );

    connectChannelStatus = Channel.connect( url );
    addLog( "OpenSecureChannel() called. Result: " + connectChannelStatus.toString() 
                + "\n\tRequestedSecurityPolicyUri: " + SecurityPolicy.policyToString( Channel.RequestedSecurityPolicyUri ) + " (" + Channel.RequestedSecurityPolicyUri + ")" 
                + "\n\tMessageSecurityMode: " + MessageSecurityMode.toString( Channel.MessageSecurityMode ) + " (" + Channel.MessageSecurityMode + ")."
                + "\n\tServerUrl: " + Channel.ServerUrl, connectChannelStatus );
    if( isDefined( serviceResult ) ) return( Assert.StatusCodeIsOneOf( serviceResult, connectChannelStatus, "OpenSecureChannel" ) );
    else {
        if( connectChannelStatus.isGood() ) return( true );
        else {
            if( suppressErrors === undefined || suppressErrors !== true ){ addError( "Connect() status: " + connectChannelStatus + ".\nPlease check the UACTT Certificate (Setting: '/Advanced/Certificates/ClientCertificate') is trusted.\n", connectChannelStatus ); }
            return( false );
        }
    }
}// function connectChannel( Channel, ServerUrl, overrides, suppressErrors )

// helper function to connect to an unsecure endpoint (used for discovery)
function connectChannelNoSecurity( Channel, ServerUrl ) {
    var uaStatus;
    var url;

    if( arguments.length < 1 ) {
        addError( "function connectChannelNoSecurity(): Number of arguments must be 1 or 2!" );
        return false;
    }
    
    if( isDefined( ServerUrl ) && ServerUrl.toString().length > 0 ) url = ServerUrl;
    else url = readSetting( "/Server Test/Server URL" );

    uaStatus = Channel.connect( url );
    addLog( "OpenSecureChannel() called, insecure. Result: " + uaStatus.toString()
                + "\n\tRequestedSecurityPolicyUri=" + SecurityPolicy.policyToString( Channel.RequestedSecurityPolicyUri ) + " (" + Channel.RequestedSecurityPolicyUri.toString() + ")"
                + "\n\tMessageSecurityMode=" + MessageSecurityMode.toString( Channel.MessageSecurityMode ) + " (" + Channel.MessageSecurityMode.toString() + ")"
                + "\n\tServerUrl: " + Channel.ServerUrl, uaStatus );
    if( uaStatus.isGood() ) return true;
    else {
        addError( "Connect() [NoSecurity] status: " + uaStatus, uaStatus );
        return false;
    }    
}// function connectChannelNoSecurity( Channel, ServerUrl )
*/