/*  Test 5; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Attempt a secure Channel and send an untrusted certificate.
    Expectation: ServiceResult = BadSecurityChecksFailed */

function certificateValidation005() {
    const SUPPRESSERRORS = true;
    if( epSecureEncrypt === null ) {
        addSkipped( "A secure channel is not available." );
        return( false );
    }
    if( !Test.Connect( { OpenSecureChannel: { RequestedSecurityPolicyUri: SecurityPolicy.policyFromString( epSecureEncrypt.SecurityPolicyUri ),
                                              MessageSecurityMode: epSecureEncrypt.SecurityMode,
                                              ClientCertificate: readSetting( "/Advanced/Certificates/ClientCertificate_NotTrusted" ),
                                              ClientCertificatePrivateKey: readSetting( "/Advanced/Certificates/ClientCertificate_NotTrustedPrivateKey" ),
                                              ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadSecurityChecksFailed ) },
                         SkipCreateSession: true } ) ) return( false );
    return( Test.Disconnect( { SkipCloseSession: true } ) );
}

Test.Execute( { Procedure: certificateValidation005 } );