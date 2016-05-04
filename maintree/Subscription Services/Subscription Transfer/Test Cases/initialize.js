include( "./library/Base/Objects/integerSet.js" );
include( "./library/Base/safeInvoke.js" );

include( "./library/Base/SettingsUtilities/NodeIds.js" );
include( "./library/ServiceBased/AttributeServiceSet/Write/write_attribute.js" );
include( "./library/ServiceBased/Helpers.js" );

var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
if( items.length === 0 || items.length < 2 ) {
    addError( "No items to test with. Please check settings." );
    stopCurrentUnit();
}
else if( !Test.Connect( { SkipCreateSession: true } ) ) {
    addError( "Unable to connect to UA Server. Unable to continue tests within this Conformance Unit. Aborting Conformance Unit testing of \"Subscription Transfer\"." );
    stopCurrentUnit();
}