/*  RESOURCE TESTING;
    prepared by Nathan Pocock; nathan.pocock@opcfoundation.org

    Description:
        Creates a session and immediately removes it.

    Revision History
        09-Jun-2011 NP: Initial version.
*/

include( "./library/ResourceTesting/repetitiveCall.js" );

// this is the function that will be called repetitvely
g_channel = new UaChannel();
Test.Session.Session = new UaSession( g_channel );
Test.Session.Session.DefaultTimeoutHint = parseInt( readSetting( "/Server Test/Session/DefaultTimeoutHint" ) );
if( connect( g_channel, Test.Session.Session ) )
{
    // Get a list of items to read from settings
    var g_pkiProvider = new UaPkiUtility();
    g_pkiProvider.CertificateTrustListLocation = readSetting( "/Advanced/Certificates/CertificateTrustListLocation" );
    g_pkiProvider.CertificateRevocationListLocation = readSetting( "/Advanced/Certificates/CertificateRevocationListLocation" );
    g_pkiProvider.PkiType = PkiType.OpenSSL;

    var g_sessions = [];
    var iSession = 0;

    var status;
    do
    {
        addLog( "CREATING SESSION " + ( 1 + iSession ) );
        g_sessions[iSession] = new UaSession( g_channel );
        g_sessions[iSession].DefaultTimeoutHint = parseInt( readSetting( "/Server Test/Session/DefaultTimeoutHint" ) );
        status = createSession( g_sessions[iSession] );
        if( status )
        {
            if( activateSession( Test.Session.Session ) )
            {
                iSession++;
            }
        }
    }while( status == true );

    addLog( iSession + " SESSIONS CREATED. NOW TO CLOSE ALL PREVIOUSLY CREATED SESSIONS..." );
    // close all created sessions.
    for( var i=0; i<g_sessions.length - 1; i++ ) // we subtract 1 because the last session FAILED! (by design)
    {
        addLog( "CLOSING SESSION " + ( 1 + i ) );
        closeSession( g_sessions[i] );
    }//for i

    // clean-up
    g_sessions = null;
    g_pkiProvider = null;
}

// clean-up
Test.Session.Session = null;
g_channel = null;
