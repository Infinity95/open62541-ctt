/*  Test 11; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Attempt a secure channel and send a [trusted] certificate where the hostname/IP does not match that of the client�s host.
    Expectation: ServiceResult = BadCertificateHostNameInvalid or Good (error suppressed by server).
    Hint: Server's can skip hostname checking! */

function certificateValidation011() {
    if( epSecureEncrypt === null ) { 
        addSkipped( "A secure channel is not available." ); 
        return( false ); }
    // determine the EXPECTED result
    var expectedResult = new ExpectedAndAcceptedResults( [ StatusCode.BadSecurityChecksFailed, StatusCode.BadCertificateHostNameInvalid, StatusCode.Good ]  );
    // create the channel
    if( !Test.Connect( { OpenSecureChannel: {
                                RequestedSecurityPolicyUri: SecurityPolicy.policyFromString( epSecureEncrypt.SecurityPolicyUri ),
                                MessageSecurityMode: epSecureEncrypt.SecurityMode,
                                ClientCertificate: readSetting( "/Advanced/Certificates/ClientCertificate_HostnameInvalid" ).toString(),
                                ClientCertificatePrivateKey: readSetting( "/Advanced/Certificates/ClientCertificate_HostnameInvalidPrivateKey" ).toString(),
                                ServiceResult: expectedResult },
                        SkipCreateSession: true } ) ) {
        Test.Disconnect( { SkipCloseSession: true } );
    }
    else addWarning( "Certificate was accepted; please check that Hostname suppression is enabled in the Server's configuration." );
    return( true );
}

Test.Execute( { Procedure: certificateValidation011 } );