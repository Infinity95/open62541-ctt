/*  RESOURCE TESTING;
    prepared by Nathan Pocock; nathan.pocock@opcfoundation.org

    Description:
        Creates a session and immediately removes it.

    Revision History
        09-Jun-2011 NP: Initial version.
*/

include( "./library/ResourceTesting/repetitiveCall.js" );

// this is the function that will be called repetitvely
function createSessionForImmediateTermination()
{
    var Test.Session.Session = new UaSession( g_channel );
    Test.Session.Session.DefaultTimeoutHint = parseInt( readSetting( "/Server Test/Session/DefaultTimeoutHint" ) );
    if( createSession( Test.Session.Session ) )
    {
        if( activateSession( Test.Session.Session ) )
        {
            closeSession( Test.Session.Session );
        }
    }
    // clean-up
    Test.Session.Session = null;
}

// Get a list of items to read from settings
var g_pkiProvider = new UaPkiUtility();
g_pkiProvider.CertificateTrustListLocation = readSetting( "/Advanced/Certificates/CertificateTrustListLocation" );
g_pkiProvider.CertificateRevocationListLocation = readSetting( "/Advanced/Certificates/CertificateRevocationListLocation" );
g_pkiProvider.PkiType = PkiType.OpenSSL;

// Get the test control parameters from the settings
var loopCount = parseInt( readSetting( "/Advanced/ResourceTesting/SessionServiceSetCallCount" ).toString() );

// Perform the iterative call loop
repetitivelyInvoke( undefined, createSessionForImmediateTermination, loopCount );

// clean-up
g_pkiProvider = null;