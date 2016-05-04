include( "./library/Base/warnOnce.js" );
include( "./library/Base/Objects/hostnames.js" );
include( "./library/Base/StringMatching.js" );


// Validates a URN. See http://www.rfc-editor.org/rfc/rfc3305.txt
function ValidateURN( urn ){
    if( urn === undefined || urn === null || urn.length === 0 ) {
        addError( "URN validation: URN not specified, is empty or null." );
        return( false );
    }
    // should start with "urn:"
    if( urn.indexOf( "urn:" ) !== 0 && urn.indexOf( "URN:" ) !== 0 ) {
        addError( "URN validation: does not start with 'URN:' or 'urn:'. Received: '" + urn + "'." );
        return( false );
    }
    // make sure excluded characters are not used
    var invalidChars = "\\&>?[]^`{|}~\"";
    for( i in invalidChars ) if( urn.indexOf( invalidChars[i] ) >= 0 ) {
        addError( "URN validation: invalid character ('" + invalidChars + "') received. Received: '" + urn + "'." );
        return( false );
    }
    // check for excluded character-codes (1-20 hex, and 127-255)
    for( c in urn ) {
        for( i=0; i<32; i++ ) if( urn.charCodeAt( urn[c] ) <= i ) {
            addError( "URN validation: invalid control-character (" + i + ") received. Received: " + urn + "'." );
            return( false );
        }
        if( urn.charCodeAt( urn[c] ) >= 127 && urn.charCodeAt( urn[c] ) <= 255 ) {
            addError( "URN validation: invalid control-character (" + i + ") received. Received: " + urn + "'." );
            return( false );
        }
    }
    return( true );
}// function ValidateURN( urn )



// Validates a URL
function ValidateURL( url, showErr ){
    if( showErr === undefined || showErr === null ) showErr = true;
    if( url === undefined || url === null || url.length === 0 ) {
        if( showErr ) addError( "URL validation: URL not specified, is empty or null." );
        return( false );
    }
    // should start with "http://" or "opc.tcp://"
    if( url.indexOf( "http://" ) !== 0 && url.indexOf( "opc.tcp://" ) !== 0 ) {
        if( showErr ) addError( "URL validation: does not start with 'opc.tcp://' or 'http://'. Received: '" + url + "'." );
        return( false );
    }
    // make sure excluded characters are not used
    var invalidChars = "\\&>?[] ^`{|}~\"";
    for( i in invalidChars ) if( url.indexOf( invalidChars[i] ) >= 0 ) {
        if( showErr ) addError( "URL validation: invalid character ('" + invalidChars + "') received. Received: '" + url + "'." );
        return( false );
    }
    return( true );
}// function ValidateURL( url, showErr )



// Validate a certificate using the guidelines described in UA Part table 101.
function ServerCertificateIsValid( cert, currentEndpointUrl ) {
    if( cert === undefined || cert === null || currentEndpointUrl === undefined || currentEndpointUrl === null ) throw( "checkCertificateIsValid argument error. Missing 'cert' or 'currentEndpointUrl'." );
    var errMsg = "";
    var warnMsg = "";
    var logMsg = "";
    var pkiProvider = new UaPkiUtility();         // create and configure PkiProvider
    pkiProvider.CertificateTrustListLocation      = readSetting( "/Advanced/Certificates/CertificateTrustListLocation" );
    pkiProvider.CertificateRevocationListLocation = readSetting( "/Advanced/Certificates/CertificateRevocationListLocation" );
    pkiProvider.PkiType = PkiType.OpenSSL;
    // Certificate Structure
    if( true ) {
        // validate the server certificate
        var validationStatus = pkiProvider.validateCertificate( cert );
        if ( validationStatus.isBad() ) {
            addError( "Server application instance certificate does not validate (according to pkiProvider)." );
            return( false );
        }
        // go ahead and validate the certificate parameters. Useful info for programmers. Check the hostnames match in the server certificate and endpointUrls
        var serverCertificate = UaPkiCertificate.fromDER( cert );
    }
    // Signature
    if( true ) {
        // signature algorithm
        if( serverCertificate.SignatureAlgorithm == null || serverCertificate.length == 0 ) logMsg += "\n\tServer Certificate SignatureAlgorithm is empty.";
        else {
            var found = false;
            var acceptedSignatureTypes = [ "RSA-SHA1", "RSA-SHA256" ];
            for( var s=0; s<acceptedSignatureTypes.length; s++ ) {
                if( acceptedSignatureTypes[s] === serverCertificate.SignatureAlgorithm ) {
                    found = true;
                    break;
                }
            }// for s...
            if( !found ) warnMsg += "\n\tServer Certificate SignatureAlgorithm is not a recognized algorithm string: " + serverCertificate.SignatureAlgorithm;
        }
    }
    // Validity Period
    if( true ) {
        if( serverCertificate.ValidFrom == null || serverCertificate.ValidFrom.length == 0 ) errMsg += "\n\tServer Certificate ValidFrom is empty.";
        else {
            var validFromDT = Date.parse( serverCertificate.ValidFrom );
            if( validFromDT == null ) errMsg += "\n\tServer Certificate ValidFrom is not a valid date.";
            if( validFromDT > UaDateTime.utcNow() ) errMsg += "\n\tServer Certificate ValidFrom is IN THE FUTURE!??";
        }
        if( serverCertificate.ValidTo == null || serverCertificate.ValidTo.length == 0 ) errMsg += "\tServer Certificate ValidTo is empty.";
        else {
            var validToDT = Date.parse( serverCertificate.ValidTo );
            if( validToDT == null ) errMsg += "\tServer Certificate ValidTo is not a valid date.";
            if( validToDT < UaDateTime.utcNow() ) warnMsg += "\tServer Certificate ValidTo has Expired!??";
        }
    }
    // Host Name
    if( true ) {
        if( serverCertificate.Hostnames == null || serverCertificate.Hostnames.length == 0 ) errMsg += "\n\tServer Certificate DNS is empty.";
        // get hostname from endpoint url
        var serverEndpointUrlHostname = getHostnameFromUrl( currentEndpointUrl );
        // get hostname from certificate
        var serverCertificateHostName;
        if( serverCertificate.Hostnames !== null && serverCertificate.Hostnames.length > 0 ) serverCertificateHostName = serverCertificate.Hostnames[0];
        // validate these names
        // if the serverEndpoint hostname doesn't match the hostname in the certificate then we shall 
        // use the Hostnames helper to see if a match can be found there
        if( serverEndpointUrlHostname !== serverCertificateHostName ) {
            HOSTNAMES.QueryHostnames( serverCertificateHostName );
            if( Assert.True( HOSTNAMES.Contains( serverCertificateHostName ), "Expected hostname in EndpointUrl ('" + serverEndpointUrlHostname + "') to match the Endpoint in the Server's Certificate. Also, expected the hostname in the Server's Certificate ('" + serverCertificateHostName + "') to match at least one of the Hostnames assigned to the computer (check DNS)." ) ) {
                logMsg += "\tHostname in Server's Certificate is valid and matches the hostname in the EndpointURL and/or the Hostname determined by the DNS records.";
            }
        }
    }
    // URI
    if( true ) {
        if( !ValidateURL( serverCertificate.ApplicationUri, false ) ) {
            if( !ValidateURN( serverCertificate.ApplicationUri ) ) errMsg += "\tServer Certificate URI is not a valid URL or URI.";
        }
    }
    // Certificate Usage
    if( true ) {
        if( serverCertificate.KeyUsage === null || serverCertificate.KeyUsage.length === 0 ) logMsg += "\n\tKeyUsage not specified!";
        else {
            // iterate thru each key usage within the collection
            for( var k=0; k<serverCertificate.KeyUsage.length; k++ ) {
                switch( serverCertificate.KeyUsage[k] ) {
                    case "digitalSignature": break;
                    case "nonRepudiation":   break;
                    case "keyEncipherment":  break;
                    case "dataEncipherment": break;
                    default:
                        errMsg += "keyUsage unknown: '" + serverCertificate.KeyUsage[k] + "'.";
                        break;
                }
            }
        }
    }
    // Trust List Check (none)
    // Find Issuer Certificate
    if( true ) {
        var issuer = serverCertificate.Issuer;
        if( issuer.Organization == null || issuer.Organization.length == 0 ) logMsg += "\n\tServer Certificate Issuer Organization is empty.";

        if( issuer.OrganizationUnit == null || issuer.OrganizationUnit.length == 0 ) logMsg += "\n\tServer Certificate Issuer OrganizationUnit is empty.";
        else if( issuer.OrganizationUnit.length > 64 ) warnMsg += "\n\tServer Certificate issuer.Organization is too long. 64 is max length. Received length: " + issuer.OrganizationUnit.length;

        if( issuer.Locality == null || issuer.Locality.length == 0 ) logMsg += "\n\tServer Certificate Issuer Locality is empty.";
        else if( issuer.Locality.length > 128 ) warnMsg += "\n\tServer Certificate issuer.Locality is too long. 128 is max length. Received length: " + issuer.Locality.length;

        if( issuer.State == null || issuer.State.length == 0 ) logMsg += "\n\tServer Certificate Issuer State is empty.";
        else if( issuer.State.length > 128 ) warnMsg += "\n\tServer Certificate issuer.State is too long. 128 is max length. Received length: " + issuer.State.length;

        if( issuer.Country == null || issuer.Country.length == 0 ) logMsg += "\n\tServer Certificate Issuer Country is empty.";
        else if( issuer.Country.length > 2 ) warnMsg += "\n\tServer Certificate Issuer.Country is too long, it should contain a 2-digit region code. Currently: " + issuer.Country;

        if( issuer.CommonName == null || issuer.CommonName.length == 0 ) errMsg += "\n\tServer Certificate Issuer CommonName is empty.";
        else if( issuer.CommonName.length > 64 ) warnMsg += "\n\tServer Certificate issuer.CommonName is too long. 64 is max length. Received length: " + issuer.CommonName.length;

        if( issuer.DomainComponent == null || issuer.DomainComponent.length == 0 ) warnMsg += "\nServer Certificate Issuer DomainComponent is empty.";
        else if( issuer.DomainComponent.length > 128 ) warnMsg += "\nServer Certificate issuer.DomainComponent is too long. 128 is max length. Received length: " + issuer.DomainComponent.length;
    }
    // Find Recovation List (none)
    // Revocation Check (none)

    // other tests/checks
    if( true ) {
        // version number, P4 table 23 says "shall be "V3".
        Assert.Equal( "V3", serverCertificate.Version, "UA Specifications Part 4, Table 23 ApplicationInstanceCertificate, states 'shall be \"V3\"'." );

        if( serverCertificate.SerialNumber == null || serverCertificate.SerialNumber.length == 0 ) errMsg += "\n\tServer Certificate SerialNumber is empty.";

        var subject = serverCertificate.Subject;
        if( subject.Organization == null || subject.Organization.length == 0 ) logMsg += "\n\tServer Certificate Organization is empty.";

        if( subject.OrganizationUnit == null || subject.OrganizationUnit.length == 0 ) logMsg += "\n\tServer Certificate OrganizationUnit is empty.";
        else if( subject.OrganizationUnit.length > 64 ) warnMsg += "\tServer Certificate Subject.Organization is too long. 64 is max length. Received length: " + subject.OrganizationUnit.length;

        if( subject.Locality == null || subject.Locality.length == 0 ) {
            if( subject.DomainComponent.length > 0 && subject.DomainComponent.length < 128 ) logMsg += "\n\tServer Certificate Subject Locality is empty. This is allowed because the Subject.DomainComponent is populated.";
            else warnMsg += "\n\tServer Certificate Subject Locality is empty. But, so is the Subject.DomainComponent and one these must be populated.";
        }
        else if( subject.Locality.length > 128 ) warnMsg += "\n\tServer Certificate Subject.Locality is too long. 128 is max length. Received length: " + subject.Locality.length;
        else if( subject.DomainComponent.length !== 0 ) warnMsg += "\n\tServer Certificate Subject.Locality is used, but so is Subject.DomainComponent. Only one of these should be used.";

        if( subject.State == null || subject.State.length == 0 ) logMsg += "\n\tServer Certificate Subject State is empty.";
        else if( subject.State.length > 128 ) warnMsg += "\n\tServer Certificate Subject.State is too long. 128 is max length. Received length: " + subject.State.length;

        if( subject.Country == null || subject.Country.length == 0 ) logMsg += "\n\tServer Certificate Subject Country is empty.";
        else if( subject.Country.length > 2 ) warnMsg += "\n\tServer Certificate Subject.Country is too long, it should contain a 2-digit region code. Currently: " + subject.Country;

        if( subject.CommonName == null || subject.CommonName.length == 0 ) errMsg += "\n\tServer Certificate Subject CommonName is empty.";
        else if( subject.CommonName.length > 64 ) warnMsg += "\n\tServer Certificate Subject.CommonName is too long. 64 is max length. Received length: " + subject.CommonName.length;

        if( subject.DomainComponent == null || subject.DomainComponent.length == 0 ) {
            if( subject.Locality.length > 0 && subject.Locality.length < 128 ) logMsg += "\n\tServer Certificate Subject DomainComponent is empty. This is allowed because Subject.Locality is populated.";
            else warnMsg += "\nServer Certificate Subject DomainComponent is empty. But, so is the Subject.Locality. One of these must be used!";
        }
        else if( subject.DomainComponent.length > 128 ) warnMsg += "\n\tServer Certificate Subject.DomainComponent is too long. 128 is max length. Received length: " + subject.DomainComponent.length;
        else if( subject.Locality.length !== 0 ) warnMsg += "\n\tServer Certificate Subject.DomainComponent is used, but so is Subject.Locality. Only one of these should be used.";

        if( warnMsg !== "" ) _warning.store( warnMsg );
        if( errMsg  !== "" ) {
            addError( errMsg );
            return( false );
        }
    }
    return( true );
}