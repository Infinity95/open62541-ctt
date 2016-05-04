include( "./library/Base/safeInvoke.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );
include( "./library/ServiceBased/Helpers.js" );

const CUNAME = "Base Info Model Change";
var g_channel = new UaChannel();
var Test.Session.Session = new UaSession( g_channel );

function initialize() {
    // Connect to the server 
    Test.Session.Session.DefaultTimeoutHint = parseInt( readSetting( "/Server Test/Session/DefaultTimeoutHint" ) );
    if( !connect( g_channel, Test.Session.Session ) ) {
        stopCurrentUnit();
        return( false );
    }
    else {
        if( !activateSession( Test.Session.Session ) ) {
            addError( "Unable to activateSession" );
            stopCurrentUnit();
            return( false );
        }
    }
    return( true );
}


print( "\n\n\n***** CONFORMANCE UNIT '" + CUNAME + "' TEST SCRIPTS STARTING ******\n" );

if( initialize() ) {
    InstanciateHelpers( { Session: Test.Session.Session } );
}