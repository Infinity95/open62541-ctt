/*  Test 4; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org

    Description:
        Attempt a secure  session and send an empty clientCertificate.

    Expectation: 
        ServiceResult = Bad_SecurityChecksFailed

    Revision History
        03-Oct-2011 NP: Initial version

     
         Test Lab Specifications Part 8 - UA Server.
*/

function certificateValidation004()
{
    // is the global variable "epSecureChNone" null? if so then we can't run
    if( epSecureEncrypt === null )
    {
        addSkipped( "A secure channel is not available." );
        return( false );
    }

    g_channel = new UaChannel();
    Test.Session.Session = new UaSession( g_channel );
    Test.Session.Session.DefaultTimeoutHint = parseInt( readSetting( "/Server Test/Session/DefaultTimeoutHint" ) );
    var channelOverrides = new SecureChannelOverrides( 
        {
            RequestedSecurityPolicyUri: SecurityPolicy.policyFromString( epSecureEncrypt.SecurityPolicyUri ),
            MessageSecurityMode: epSecureEncrypt.SecurityMode
        } );
    if( !connectChannel( g_channel, readSetting( "/Server Test/Server URL" ).toString(), channelOverrides ) )
    {
        addError( "Can't connect the secure channel to the server, therefore no sessions can be established. Aborting." );
        return( false );
    }
    else
    {
        // create the session
        var expectedResults = new ExpectedAndAcceptedResults( StatusCode.BadSecurityChecksFailed );
        var overrides = new CreateSessionOverrides( { ProvideCertificates:false } );
        createSession( Test.Session.Session, expectedResults, overrides );

        // close the session, we don't care if it passes/fails
        expectedResults = new ExpectedAndAcceptedResults( StatusCode.BadNothingToDo );
        expectedResults.addExpectedResult( StatusCode.BadSessionIdInvalid );
        closeSession( Test.Session.Session, expectedResults );
    }

    // clean-up
    Test.Session.Session = null;
    g_channel = null;
}

safelyInvoke( certificateValidation004 );