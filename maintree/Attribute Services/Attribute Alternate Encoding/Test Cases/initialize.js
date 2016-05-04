include( "./library/Base/safeInvoke.js" );
include( "./library/Base/assertions.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );

include( "./library/ServiceBased/Helpers.js" );

var scalarItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
if( !isDefined( scalarItems ) && !isDefined( scalarItems.length ) || scalarItems.length === 0 ) {
    addError( "Aborting conformance unit. No static scalar items configured. Check CTT settings." );
    stopCurrentUnit();
}
else {
    if( !Test.Connect() ) stopCurrentUnit();
}

print( "\n\n\n***** CONFORMANCE UNIT 'Attribute Read Alternate Encoding' TEST SCRIPTS STARTING ******\n" );