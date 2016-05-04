/*  Test 9; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Attempt a secure channel and send a certificate that was issued by an unknown (not trusted) CertificateAuthority.
    Expectation: ServiceResult = BadSecurityChecksFailed */

function certificateValidation009() {
    if( epSecureEncrypt === null ) { 
        addSkipped( "A secure channel is not available." ); 
        return( false ); 
    }
    if( !Test.Connect( { OpenSecureChannel: {
                                RequestedSecurityPolicyUri: SecurityPolicy.policyFromString( epSecureEncrypt.SecurityPolicyUri ),
                                MessageSecurityMode: epSecureEncrypt.SecurityMode,
                                ClientCertificate: readSetting( "/Advanced/Certificates/ClientCertificate_IssuerUnknown" ).toString(),
                                ClientCertificatePrivateKey: readSetting( "/Advanced/Certificates/ClientCertificate_IssuerUnknownPrivateKey" ).toString(),
                                ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadSecurityChecksFailed ) },
                         SkipCreateSession: true } ) ) {
        Test.Disconnect( { SkipCloseSession: true } );
    }
    return( true );
}

Test.Execute( { Procedure: certificateValidation009 } );