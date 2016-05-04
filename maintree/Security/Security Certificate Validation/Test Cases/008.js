/*  Test 8; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Attempt a secure Channel and send a not yet valid [trusted] certificate.
    Expectation: Returns either: Good, or BadCertificateTimeInvalid; depending upon the configured setting and/or documented behavior. */

function certificateValidation008() {
    if( epSecureEncrypt === null ) { 
        addSkipped( "A secure channel is not available." ); 
        return( false ); 
    }

    var expectedResult = new ExpectedAndAcceptedResults( StatusCode.Good );
    if( 0 === parseInt( readSetting( "/Advanced/CertificateOverrides/DisableCertificateTimeInvalid" ) ) ) expectedResult = new ExpectedAndAcceptedResults( StatusCode.BadCertificateTimeInvalid );

    if( Test.Connect( { OpenSecureChannel: { RequestedSecurityPolicyUri: SecurityPolicy.policyFromString( epSecureEncrypt.SecurityPolicyUri ),
                                             MessageSecurityMode: epSecureEncrypt.SecurityMode,
                                             ClientCertificate: readSetting( "/Advanced/Certificates/ClientCertificate_NotYetValid" ).toString(),
                                             ClientCertificatePrivateKey: readSetting( "/Advanced/Certificates/ClientCertificate_NotYetValidPrivateKey" ).toString(),
                                             ServiceResult: expectedResult } } ) ) {
        if( Test.Channel.UaStatus.isGood() ) Test.Disconnect( { SkipCloseSession: true } );
    }

    return( true );
}

Test.Execute( { Procedure: certificateValidation008 } );