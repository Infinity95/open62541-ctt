/*  Test 10; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Attempt a secure channel and send a [untrusted] certificate which has an invalid signature, e.g. signed with wrong certificate.
    Expectation: ServiceResult = BadSecurityChecksFailed */

function certificateValidation010() {
    if( epSecureEncrypt === null ) { 
        addSkipped( "A secure channel is not available." ); 
        return( false ); 
    }
    if( !Test.Connect( { OpenSecureChannel: {
                                RequestedSecurityPolicyUri: SecurityPolicy.policyFromString( epSecureEncrypt.SecurityPolicyUri ),
                                MessageSecurityMode: epSecureEncrypt.SecurityMode,
                                ClientCertificate: readSetting( "/Advanced/Certificates/IncorrectlySignedClientCertificate" ).toString(),
                                ClientCertificatePrivateKey: readSetting( "/Advanced/Certificates/IncorrectlySignedClientPrivateKey" ).toString(),
                                ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadSecurityChecksFailed ) },
                        SkipCreateSession: true } ) ) Test.Disconnect( { SkipCloseSession: true } );
    else addWarning( "Please check the Server's log for BadCertificateInvalid" );
    return( true );
}

Test.Execute( { Procedure: certificateValidation010 } );