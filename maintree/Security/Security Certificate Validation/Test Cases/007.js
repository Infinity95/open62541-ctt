/*  Test 7; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Attempt a secure Channel and send an expired [trusted] certificate.
    Expectation: Returns either: Good, or BadCertificateTimeInvalid; depending upon the configured setting and/or documented behavior. */

function certificateValidation007() {
    if( epSecureEncrypt === null ) { 
        addSkipped( "A secure channel is not available." ); 
        return( false ); 
    }

    // check the settings to see how that should impact our expected outcome...
    var expectedResult = new ExpectedAndAcceptedResults( StatusCode.Good );
    if( 0 === parseInt( readSetting( "/Advanced/CertificateOverrides/DisableCertificateTimeInvalid" ) ) ) expectedResult = new ExpectedAndAcceptedResults( StatusCode.BadCertificateTimeInvalid );
    // create the connection...
    if( !Test.Connect( { OpenSecureChannel: {   RequestedSecurityPolicyUri: SecurityPolicy.policyFromString( epSecureEncrypt.SecurityPolicyUri ),
                                                MessageSecurityMode: epSecureEncrypt.SecurityMode, 
                                                ClientCertificate: readSetting( "/Advanced/Certificates/ExpiredClientCertificate" ).toString(),
                                                ClientCertificatePrivateKey: readSetting( "/Advanced/Certificates/ExpiredClientPrivateKey" ).toString(), 
                                                ServiceResult: expectedResult },
                         SkipCreateSession: true } ) ) return( false );
    else Test.Disconnect( { SkipCloseSession: true } );
    return( true );
}

Test.Execute( { Procedure: certificateValidation007 } );