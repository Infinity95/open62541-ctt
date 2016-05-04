var __SessionName = "";
var serverNonceHistory = [];
var __GLOBAL_SessionNumber = 1;

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


function CreateSessionService( args ) {
    this.Name = "CreateSession";    // Name of this service
    this.Channel = null;            // Channel; owner of this session
    this.Session = null;            // UaSession object; purely internal use only
    this.Request = null;            // CreateSession request
    this.Response = null;           // CreateSession response
    this.Result = null;             // Result of the CreateSession call

    if( !isDefined( args ) ) throw( "CreateSessionService::args not specified" );            // CTOR: exception if no channel specified
    if( !isDefined( args.Channel ) ) throw( "CreateSessionService::Channel not specified" ); // CTOR: exception if no channel specified
    else {
        if( !isDefined( args.Channel ) ) throw( "CreateSessionService::channel specified is not of type OpenSecureChannel library helper object." );
        else {
            this.Channel = args.Channel;
            this.Session = new UaSession( this.Channel.Channel );
        }
    }

    /* CreateSession.Execute() invokes the CreateSession service.
       Parameters (all are optional; if missing then defaults are assumed, which mostly come from SETTINGS): 
           ApplicatinUri: 
           ClientCertificate:
           ClientDescription:
           ClientNonce: 
           Debug (optional)        : print extra statements
           EndpointUrl: 
           ForceClientCertificate:
           MaxResponseMessageSize: 
           PreHook: 
           PostHook: 
           RequestedSessionTimeout: 
           ReturnDiagnostics: 
           ServerUri: 
           SessionName: 
           ServiceResult: */
    this.Execute = function( args ) {
        // validate all parameters first; assume the values for any parameters that are not specified
        if( !isDefined( args ) ) args = new Object();
        if( !isDefined( args.Debug ) ) args.Debug = false;
        this.Session = new UaSession( this.Channel.Channel );
        this.Request = UaCreateSessionRequest();
        this.Request.RequestHeader = UaRequestHeader.New( { Session: this.Session } );
if( isDefined( args.ProvideNonce ) || isDefined( args.CustomNonce ) ) throw( "CreateSession.Execute() OLD parameters detected. Rename 'ProvideNonce' to 'ForceNonce'. Rename 'CustomNonce' to 'ClientNonce'." );
        if( isDefined( args.ReturnDiagnostics ) ) this.Request.RequestHeader.ReturnDiagnostics = args.ReturnDiagnostics;
        if( isDefined( args.ClientDescription ) ) this.Request.ClientDescription = args.ClientDescription;
        else {
            this.Request.ClientDescription.ApplicationName.Locale = "en";    
            this.Request.ClientDescription.ApplicationName.Text   = "OPC Unified Architecture Compliance Test Tool";
            this.Request.ClientDescription.ApplicationType        = ApplicationType.Client;
            this.Request.ClientDescription.ApplicationUri         = "urn:localhost:UA:CTT";
            this.Request.ClientDescription.ProductUri             = "urn:opcfoundation.org:UA:CTT";    
        }
        this.Request.EndpointUrl             = isDefined( args.EndpointUrl )? args.EndpointUrl : readSetting( "/Server Test/Server URL" ).toString();
        this.Request.MaxResponseMessageSize  = isDefined( args.MaxResponseMessageSize )? args.MaxResponseMessageSize : parseInt( readSetting( "/Server Test/Session/MaxResponseMessageSize" ) );
        this.Request.RequestedSessionTimeout = isDefined( args.RequestedSessionTimeout )? args.RequestedSessionTimeout : parseInt( readSetting( "/Server Test/Session/RequestedSessionTimeout" ).toString() );
        this.Request.SessionName             = isDefined( args.SessionName )? args.SessionName : "UaCttSession_" + __GLOBAL_SessionNumber++;
        if( this.Channel.IsSecure() || isAuthenticationSecure() ) {      // if the channel is secure, then setup the certificates in the session...
            this.Request.ClientCertificate   = isDefined( args.ClientCertificate )? args.ClientCertificate : this.Channel.Channel.ClientCertificate;        
            this.Request.ClientNonce         = UaByteString.fromStringData( Nonce.Next() );
            if( args.ClientNonce !== undefined && args.ClientNonce !== null ) {
                if( typeof args.ClientNonce === "string" ) this.Request.ClientNonce = UaByteString.fromStringData( args.ClientNonce );
                else this.Request.ClientNonce = args.ClientNonce;
            }
            // the application uri shall match the uri in the client certificate.
            var cert = UaPkiCertificate.fromDER( this.Channel.Channel.ClientCertificate );
            if( isDefined( args.ApplicationUri ) ) this.Request.ClientDescription.ApplicationUri = args.ApplicationUri;
            else this.Request.ClientDescription.ApplicationUri = cert.ApplicationUri;
        }
        else {
            if( isDefined( args.ClientNonce ) ) this.Request.ClientNonce = UaByteString.fromStringData( args.ClientNonce );
        }
        this.Session.DefaultTimeoutHint      = isDefined( args.DefaultTimeout )? args.DefaultTimeout : parseInt( readSetting( "/Server Test/Session/DefaultTimeoutHint" ) );


        // UA 1.02 ERRATA; to send a certificate, or NOT send a certificate
        var clientCertificate = new UaByteString();
        if( this.Channel.IsSecure() || ( isDefined( args.ForceClientCertificate ) && args.ForceClientCertificate ) ){ 
            var pkiProvider = new UaPkiUtility();         // create and configure PkiProvider
            pkiProvider.CertificateTrustListLocation      = readSetting( "/Advanced/Certificates/CertificateTrustListLocation" );
            pkiProvider.CertificateRevocationListLocation = readSetting( "/Advanced/Certificates/CertificateRevocationListLocation" );
            pkiProvider.PkiType                           = PkiType.OpenSSL;
            // load client certificate
            if( isDefined( args.CertificateFile ) ) uaStatus = pkiProvider.loadCertificateFromFile( readSetting( args.CertificateFile ), clientCertificate );
            else uaStatus = pkiProvider.loadCertificateFromFile( readSetting( "/Advanced/Certificates/ClientCertificate" ), clientCertificate );
            // exit if the PKI failed to load the cert; no point continuing
            if( uaStatus.isBad() ) { addError( "Unable to load certificate. Error: '" + uaStatus.toString() + "'." ); return( false ); }
            this.Request.ClientCertificate = clientCertificate;
        }
    
    
        var success = true;
        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: "CreateSession", Available: true, Tested: true } ) } );

    
        // create the session.
        this.Response = new UaCreateSessionResponse();
        if( args.Debug ) print( this.Name + "().Request: " + this.Request.toString() );
        if( isDefined( args.PreHook ) ) args.PreHook();
        this.Result = this.Session.createSession( this.Request, this.Response );
        if( args.Debug ) print( this.Name + "().Result: " + this.Result.toString() );
        success = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessages, ServiceInfo: "EndpointUrl=" + this.Request.EndpointUrl + "; SessionName: " + this.Request.SessionName + "; RequestedSessionTimeout: " + this.Request.RequestedSessionTimeout } );
        if( args.Debug ) print( this.Name + "().UaResponseHeader.IsValid(): " + success );
        if( this.Result.isGood() && success && this.Response.ResponseHeader.ServiceResult.isGood() ) {
            success = this.ValidateHeader();
            if( args.Debug ) print( this.Name + "().ValidateHeader: " + success );
            gServerCapabilities.ServerCertificate = UaPkiCertificate.fromDER( this.Response.ServerCertificate );
        }
        // if the call failed then register that 
        if( !success ) ServiceRegister.SetFailed( { Name: "CreateSession" } )
        if( args.Debug ) print( this.Name + "() overall result: " + result );
        return( success );
    }

    this.ValidateHeader = function( args ) {
        if( !isDefined( args ) ) args = new Object();
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = true;
        var result = true;
        // Check the server nonce.
        var nonceRequired = this.Channel.IsSecure();
        if( nonceRequired && !Assert.True( Nonce.IsValid( this.Response.ServerNonce ), "CreateSession.Response.ServerNonce must be 32-characters long. Length: " + this.Response.ServerNonce.length ) ) result = false;
            if( Nonce.Contains( this.Response.ServerNonce ) ) { // Check if nonce is unique.
                addError( "CreateSession.Response.ServerNonce repeated value '" + serverNonce + "'.\nEach ServerNonce MUST be unique." );
                result = false;
            }
    
        // Check the Server Endpoints 
        if( Assert.GreaterThan( 0, this.Response.ServerEndpoints.length, "CreateSession.Response.ServerEndpoints is zero. This is not allowed. How would a Client connect?" ) ) {
            for( var e=0; e<this.Response.ServerEndpoints.length; e++ ) {
                Assert.GreaterThan( 0, this.Response.ServerEndpoints[e].UserIdentityTokens.length, "CreateSession.Response.ServerEndpoints[" + e + "].UserIdentityTokens is empty. How will a Client authenticate?" );
            }//for e...
        }// server endpoints > 0?

        /* check the software certificates are NOT provided; expect the parameter to contain an empty array, per spec P4 1.02. */
        Assert.Equal( 0, this.Response.ServerSoftwareCertificates.length, "ServerSoftwareCertificates was not empty. The parameter is deprecated and should not be used." );
    
        // Check that the server application certificate is provided and valid.
        if ( this.Response.ServerCertificate.isEmpty() || this.Response.ServerCertificate.length === 0 ) {
            if( nonceRequired ) {
                addError( "Server application instance certificate not provided.\nThis behavior breaks interoperability with UA 1.01 Clients." );
                result = false;
            }
        }
        else {
            if( Assert.True( ServerCertificateIsValid( this.Response.ServerCertificate, this.Request.EndpointUrl ), "Expected CreateSession.Response.ServerCertificate to contain valid credentials/information.", "CreateSession.Response.ServerCertificate validated successfully." ) ) {
                // check if the server certificate is the same as the one used for creating the channel
                if( !this.Channel.Channel.ServerCertificate.equals( this.Response.ServerCertificate ) ) {
                    addError( "ServerCertificate returned in CreateSessionResponse (length: " + this.Response.ServerCertificate.length + ") is different than the one used in CreateChannel (length: " + this.Channel.Channel.ServerCertificate + ")." );
                    result = false;
                }
            }
        }

        // check the servers' signature
        if( nonceRequired && this.Request.ClientNonce.length > 0 && this.Response.ServerSignature.Signature.length > 0 ) {
            var serverPublicKey = UaPkiCertificate.publicKeyFromDER( this.Response.ServerCertificate );    // the server's public key is needed to validate the signature.
            var signedData = new UaByteString();
            signedData.append( this.Request.ClientCertificate );                                           // append the client nonce to the client certificate.
            signedData.append( this.Request.ClientNonce );
            var crypto = new UaCryptoProvider( this.Session.Channel.RequestedSecurityPolicyUri );
            status = crypto.asymmetricVerify( signedData, serverPublicKey, this.Response.ServerSignature.Signature ); 
            if ( status.isBad() ) {
                addError( "Server signature is invalid. Status: " + status + ".\nIs server following Errata 1.02?\nIf so, the behavior was reverted and is no longer compliant behavior; Certificates must be provided, always, even if being ignored.", status );
                result = false;
            }
        }

        //check the sessionId is not null
        if( this.Response.SessionId == null || this.Response.SessionId.equals( new UaNodeId() ) ) {
            addError( "SessionId is null/empty. This is not allowed!" );
            result = false;
        }

        //check the authenticationToken is not null
        if( this.Response.AuthenticationToken == null || this.Response.AuthenticationToken.equals( new UaNodeId() ) ) {
            addError( "AuthenticationToken is null/empty. This is not allowed." );
            result = false;
        }
        return( result );
    }

}//CreateSession