include( "./library/Base/connectChannel.js" );
include( "./library/Base/Objects/securityalgorithms.js" );

var PresetCredentials = { 
    "AccessGranted1":0,
    "AccessGranted2":1,
    "AccessDenied":2,
    "X509":3 };

function UserCredentials( params ) {
    var tmpPolicy;
    if( isDefined( params.Policy ) ) tmpPolicy = params.Policy;
    else if( isDefined( params.policy ) ) tmpPolicy = params.policy;
    this.Policy = tmpPolicy || UserTokenType.Anonymous;
    if ( this.Policy == UserTokenType.UserName) {
        this.UserName = isDefined( params.UserName )? params.UserName : params.username || "";
        this.Password = isDefined( params.Password )? params.Password : params.password || "";
    }
}; //function UserCredentials( params )

// presetCredentials -> PresetCredentials enum
UserCredentials.createFromSettings = function( presetCredentials, typeOverride ) {
    var params = {};
    var type = ( typeOverride === undefined || typeOverride === null)? parseInt( readSetting( "/Server Test/Session/UserAuthenticationPolicy" ) ) : typeOverride;
    switch ( type ) {
        case UserTokenType.Anonymous:
            break;
        case UserTokenType.UserName:
            switch ( presetCredentials ) {
                case PresetCredentials.AccessGranted1:
                    usernameSetting = "/Server Test/Session/LoginNameGranted1";
                    passwordSetting = "/Server Test/Session/LoginPasswordGranted1"
                    break;
                case PresetCredentials.AccessGranted2:
                    usernameSetting = "/Server Test/Session/LoginNameGranted2";
                    passwordSetting = "/Server Test/Session/LoginPasswordGranted2"
                    break;
                case PresetCredentials.AccessDenied:
                    usernameSetting = "/Server Test/Session/LoginNameAccessDenied";
                    passwordSetting = "/Server Test/Session/LoginPasswordAccessDenied"
                    break;
                default: throw( "UserCredentials.createFromSettings() invalid 'presetCredential' specified. Choose 'AccessGranted1', 'AccessGranted2', or 'AccessDenied'." );
            }
            var username = readSetting( usernameSetting );
            if ( username == null || username == undefined ) {
                addWarning( "UserCredentials.createFromSettings() - username not set!" );
                username = "";
            }
            else username = username.toString();
            var password = readSetting( passwordSetting );
            if ( password == null || password == undefined ) {
                addWarning( "UserCredentials.createFromSettings() - password not set!" );
                password = "";
            }
            else password = password.toString();
            params = { policy:type, username:username, password:password };
            break;
        case UserTokenType.Certificate:
            params = { policy:2 };
            break;
        case UserTokenType.IssuedToken:
            params = { policy:3 };
            break;
    }
    return new UserCredentials( params );
}; // UserCredentials.createFromSettings = function( presetCredentials, typeOverride )

function needAnonymousToken( securityPolicyUri, session ) {
    // This function checks if the server requires an anonymous identity token for 
    // anonymous access. It is needed because the server may not require one when
    // the only access policy is anonymous. In these cases the client can't reply with
    // any token.
    // securityPolicyUri - the URI of the security policy
    const TCPSECURITYPROFILEURI = "http://opcfoundation.org/UA-Profile/Transport/uatcp-uasc-uabinary";
    for( var i=0; i<gServerCapabilities.Endpoints.length; i++ ) { // iterate thru each endpoint
        var description = gServerCapabilities.Endpoints[i];
        if ( description.SecurityPolicyUri == securityPolicyUri ) return ( description.UserIdentityTokens.length != 0 );
    } // for i
    return true;
}; // function needAnonymousToken( securityPolicyUri )

function getUserTokenPolicy( securityPolicyUri, tokenType, session ) {
    // This function returns the user token policy, given the security policy of the
    // endpoint and the authentication token type. It only considers UA-TCP endpoints (the ones
    // used by the CTT). If a token policy cannot be found for the given token type, null
    // is returned.
    // securityPolicyUri - the URI of the security policy
    // tokenType - UserTokenType
    if( !isDefined( session ) ) throw( "identity.js::getUserTokenPolicy: no Session defined. Back-track and find out why." );
    for( var i=0; i<gServerCapabilities.Endpoints.length; i++ ) {
        var description = gServerCapabilities.Endpoints[i];
        if( description.TransportProfileUri === "http://opcfoundation.org/UA-Profile/Transport/uatcp-uasc-uabinary" && description.SecurityPolicyUri == securityPolicyUri ) {
            // store a copy of the endpoint in the "ServerCapabilities" global object/variable.
            gServerCapabilities.ConnectedEndpoint = description;
            // now iterate thru all user endpoint tokens and search for the matching type
            for( var j=0; j<description.UserIdentityTokens.length; j++) {
                var token = description.UserIdentityTokens[j];
                if ( token.TokenType == tokenType ) {
                    // also store a copy of this in the ServerCapabilities global object/variabl.
                    gServerCapabilities.ConnectedIdentityToken = token;
                    return token;
                }// if token...
            }// for j=
        }// if description...
    }// for i=
    return null;
}; // function getUserTokenPolicy( securityPolicyUri, tokenType )

/* Overrides arguments:
    - PolicyId
*/
function buildAnonymousIdentityToken( session, overrides ) {
    var obj = new UaExtensionObject();
    var policy = parseInt( readSetting( "/Server Test/Secure Channel/RequestedSecurityPolicyUri" ) );
    var securityPolicyUri = SecurityPolicy.policyToString( policy );

    // Does the server require an anonymous token or does it accept an empty one?
    if( isDefined( overrides ) && isDefined( overrides.PolicyId ) ) {
        var token = new UaAnonymousIdentityToken();
        token.PolicyId = overrides.PolicyId;
        obj.setAnonymousIdentityToken( token );
    }
    else if ( needAnonymousToken( securityPolicyUri, session ) ) {
        // Get the anonymous policy description.
        var policy = getUserTokenPolicy( securityPolicyUri, UserTokenType.Anonymous, session );
        if ( policy == null ) {
            addWarning( "buildAnonymousIdentityToken - anonymous token policy unavailable" );
            var token = new UaAnonymousIdentityToken();
            token.PolicyId = "Anonymous";
            obj.setAnonymousIdentityToken( token );            
        }
        else {
            var token = new UaAnonymousIdentityToken();
            token.PolicyId = policy.PolicyId;
            obj.setAnonymousIdentityToken( token );
        }
    }
    return obj;
}// function buildAnonymousIdentityToken( overrides )



/* Creates a UserIdentityToken of type X509.
   Revision History:
       2/2/2012 NP: Initial version. */
function buildUserX509IdentityToken( session ) {
    var obj = new UaExtensionObject();
    var channelSecurityPolicy = SecurityPolicy.policyToString( session.Channel.RequestedSecurityPolicyUri );
    
    // get the x509 certificate loaded and validated
    // begin with a PKI provider
    var pkiProvider = new UaPkiUtility();
    pkiProvider.CertificateTrustListLocation = readSetting( "/Advanced/Certificates/CertificateTrustListLocation" );
    pkiProvider.CertificateRevocationListLocation = readSetting( "/Advanced/Certificates/CertificateRevocationListLocation" );
    pkiProvider.PkiType = PkiType.OpenSSL;
    // load the certificate
    var tokenpolicy = getUserTokenPolicy( channelSecurityPolicy, UserTokenType.Certificate, session );
    if ( tokenpolicy == null ) {
        addWarning( "buildUserX509IdentityToken - X509 token policy unavailable" );
        var token = new UaX509IdentityToken();
        token.PolicyId = "Certificate";
        obj.setX509IdentityToken( token );       
    }
    else {
        var userCertificate = new UaByteString();
        var uaStatus = pkiProvider.loadCertificateFromFile( readSetting( "/Advanced/Certificates/UserCertificate" ), userCertificate );
        var token = new UaX509IdentityToken();
        token.PolicyId = tokenpolicy.PolicyId;
        obj.setX509IdentityToken( token );
    }

    return obj; 
}// function buildUserX509IdentityToken( session )



/* Creates a UserIdentityToken of type UserNamePassword
   Revision History:
       8/1/2009 RTD: Initial version. */
function buildUserNameIdentityToken( session, username, password, doNotAppendNonce ) {
    var obj = new UaExtensionObject();
    var channelSecurityPolicy = SecurityPolicy.policyToString( session.Channel.RequestedSecurityPolicyUri );

    // Get the username policy description.
    var tokenPolicy = getUserTokenPolicy( channelSecurityPolicy, UserTokenType.UserName, session );
    if ( tokenPolicy == null ) {
        addWarning( "buildUserNameIdentityToken - username token policy unavailable" );
        var token = new UaUserNameIdentityToken();
        var encodedPassword = new UaByteString();
        token.PolicyId = "UserName";
        token.UserName = username;
    }
    else {
        var token = new UaUserNameIdentityToken();
        var encodedPassword = new UaByteString();
        token.PolicyId = tokenPolicy.PolicyId;
        token.UserName = username;

        // Get the security policy for encrypting the password.
        var tokenSecurityPolicy = tokenPolicy.SecurityPolicyUri;
        if ( tokenSecurityPolicy.length == 0 ) {
            // No explicity security policy for encrypting the password. Use the channel's security
            // policy.
            tokenSecurityPolicy = channelSecurityPolicy;
        }
        if ( tokenSecurityPolicy == SecurityPolicy.policyToString( SecurityPolicy.None ) ) {
            print( "buildUserNameIdentityToken - password not encrypted!" );
            encodedPassword.setUtf8FromString( password );
            token.Password = encodedPassword;
        }
        else {
            var plainPassword = new UaByteString();
            var encryptedPassword = new UaByteString();
            var serverNonce = session.ServerNonce;
            var serverPublicKey = UaPkiCertificate.publicKeyFromDER( session.Channel.ServerCertificate );

            // Set the length of the encoded password.
            encodedPassword.setUInt32( password.length + serverNonce.length );

            // Encode the password.
            plainPassword.setUtf8FromString( password );
            encodedPassword.append( plainPassword );

            // Append the server nonce.
            if( doNotAppendNonce === undefined || doNotAppendNonce === null || doNotAppendNonce == false ) {
                if( serverNonce !== undefined && serverNonce !== null && serverNonce.length > 0 ) { 
                    encodedPassword.append( serverNonce );
                }
            }

            addLog( "Requesting user credentials: username='" + username + "'; password='" + password + "'; securityPolicyUri='" + tokenSecurityPolicy + "'; nonceAppended=" + (doNotAppendNonce !== undefined && doNotAppendNonce !== null && doNotAppendNonce === true ? "No": "Yes" ) );
            // Encrypt the encoded password.
            var cryptoProvider = new UaCryptoProvider( SecurityPolicy.policyFromString( tokenSecurityPolicy ) );
            var status = cryptoProvider.asymmetricEncrypt( encodedPassword, serverPublicKey, encryptedPassword );
            if ( status.isBad() ) {
                addError( "buildUserNameIdentityToken - error encrypting the password! Status: " + status, status );
            }
            else {
                var algorithms = SecurityAlgorithms.getAlgorithms( SecurityPolicy.policyFromString( tokenSecurityPolicy ) );
                token.Password = encryptedPassword;
                token.EncryptionAlgorithm = algorithms.AsymmetricEncryptionAlgorithm;
            }
        }
    }

    obj.setUserNameIdentityToken( token );
    return obj;
} // function buildUserNameIdentityToken( session, username, password, doNotAppendNonce )