/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Connect to the Server using an expired Certificate. The Certificate is NOT trusted by the Server. */

function certificateValidation() { 
    if( epSecureEncrypt === null ) { 
        addSkipped( "A secure channel is not available." ); 
        return( false ); 
    }
    var result = true;
    if( !Test.Connect( { OpenSecureChannel: {
                                RequestedSecurityPolicyUri: SecurityPolicy.policyFromString( epSecureEncrypt.SecurityPolicyUri ),
                                MessageSecurityMode: epSecureEncrypt.SecurityMode, 
                                ClientCertificate: readSetting( "/Advanced/Certificates/ClientCertificate_ExpiredNotTrusted" ).toString(),
                                ClientCertificatePrivateKey: readSetting( "/Advanced/Certificates/ClientCertificate_ExpiredNotTrustedPrivateKey" ).toString(),
                                ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadSecurityChecksFailed ) },
                         SkipCreateSession: true } ) ) {
         Test.Disconnect( { SkipCloseSession: true } );
         result = false;
    }
    return( result );
}

Test.Execute( { Procedure: certificateValidation } );