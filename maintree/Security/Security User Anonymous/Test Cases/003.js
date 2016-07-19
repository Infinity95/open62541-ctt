/*  Test 3; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Call GetEndpoints to locate a secure endpoint that does not allow for anonymous logon. Establish a session via an insecure channel.
    Expectation: Connection permitted.
    IMPORTANT: This script will exit gracefully if no endpoints are available that do not support anonymous. */

// This function uses the GETENDPOINTS data obtained in the initialize script
function findNoAnonymousInEndpoints( epIndex ) {
    var s = gServerCapabilities.Endpoints[epIndex];
    for( var u=0; u<gServerCapabilities.Endpoints[epIndex].UserIdentityTokens.length; u++ ) {
        if( gServerCapabilities.Endpoints[epIndex].UserIdentityTokens[u].TokenType === UserTokenType.Anonymous ) {
            s = null;
            break;
        }
    }
    return( s );
}

function noneAnonymous003() {
    // is the global variable "epSecureEncrypt" null? if so then we can't run
    if( isDefined( epSecureEncrypt ) && isDefined( epSecureChNone ) ) {
        addSkipped( "Unable to conduct the test: the anonymous user identity seems to be supported on both secure and insecure channels. This test only applies to secure connections that do not support anonymous authentication." );
        return( false );
    }
    var endpointNoAnon = null;
    var i=0;
    while( i<gServerCapabilities.Endpoints.length && endpointNoAnon === null ) endpointNoAnon = findNoAnonymousInEndpoints(i++);
    // this should not happen, but if we do not have an endpoint still then 
    // just exit and raise an error because this might indicate a problem with the script.
    if( endpointNoAnon === null ) {
        addSkipped( "No endpoints found that do NOT support anonymous user identity token. All secure endpoints seem to allow for Anonymous. Aborting test." );
        return( false );
    }    
    // Establish a connection using the endpoint located above
    g_channel = new UaChannel();
    Test.Session.Session = new UaSession( g_channel );
    Test.Session.Session.DefaultTimeoutHint = parseInt( readSetting( "/Server Test/Session/DefaultTimeoutHint" ) );
    if( !connectChannel( g_channel, readSetting( "/Server Test/Server URL" ).toString(), { SecurityPolicyUri:endpointNoAnon.SecurityPolicyUri, MessageSecurityMode:endpointNoAnon.SecurityMode } ) ) {
        addError( "Can't connect the channel to the server, therefore no sessions can be established. Aborting." );
        return( false );
    }
    // create the session
    if( Assert.True( createSession( Test.Session.Session ), "Expected the session to open." ) ) {
        // we expect the call to fail
        var expectedResults = new ExpectedAndAcceptedResults( StatusCode.BadIdentityTokenRejected );
        // now activate the session using the anonymous user identity token
        Assert.True( activateSession( Test.Session.Session, new UserCredentials( { policy:UserTokenType.Anonymous } ), expectedResults, false, { PolicyId: "0" } ), "Expected ActivateSession() to fail, with a specific error code.", "ActivateSession() failed as expected." );
        // we don't care how closeSession closes, by error not not
        expectedResults = new ExpectedAndAcceptedResults( StatusCode.BadNothingToDo );
        expectedResults.addExpectedResult( StatusCode.BadSessionNotActivated );
        expectedResults.addExpectedResult( StatusCode.BadSessionClosed );
        expectedResults.addExpectedResult( StatusCode.Good );
        closeSession( Test.Session.Session, expectedResults );
     }
    // clean-up
    Test.Session.Session = null;
    g_channel = null;
    return( true );
}

Test.Execute( { Procedure: noneAnonymous003 } );