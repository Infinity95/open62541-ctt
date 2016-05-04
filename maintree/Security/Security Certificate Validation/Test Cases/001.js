/*  Test 1; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Call CreateSession to obtain the Server�s Certificate and validate according to UA Part 4 Specifications Table 101 (Doc Page 95; PDF Page 111).
    Expectation: Connection is successful. Certificate validates. */

function certificateValidation001() {
    // is the global variable "epSecureChNone" null? if so then we can't run
    if( epSecureChNone === null ) {
        addSkipped( "An insecure channel is not available." );
        return( false );
    }
    var result = true;
    // establish a non-secure connection to the server, while specifying certs and nonces; also create the session
    if( !Test.Connect( { OpenSecureChannel: { RequestedSecurityPolicyUri: SecurityPolicy.None,
                                              MessageSecurityMode: MessageSecurityMode.None,
                                              ProvideCertificates: true,
                                              ProvideNonce: true },
                         SkipActivateSession: true } ) ) return( false );
    if( ActivateSessionHelper.Execute( { 
            Session: Test.Session, 
            UserIdentityToken: UaUserIdentityToken.FromUserCredentials( { 
                    Session: Test.Session,
                    UserCredentials: new UserCredentials( { policy: UserTokenType.Anonymous } ) } ), 
            ServiceResult: new ExpectedAndAcceptedResults( StatusCode.Good ) } ) ) CloseSessionHelper.Execute( { Session: Test.Session } );
    else result = false;
    Test.Disconnect( { SkipCloseSession: true } );
    return( Assert.True( result, "Unable to open an endpoint supporting an insecure channel supporting anonymous authentication." ) );
}

Test.Execute( { Procedure: certificateValidation001 } );