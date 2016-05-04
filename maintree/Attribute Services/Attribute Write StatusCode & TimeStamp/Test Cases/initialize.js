include( "./library/Base/safeInvoke.js" );
include( "./library/Base/Objects/event.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );

include( "./library/ServiceBased/AttributeServiceSet/Write/writeMask_writeValues.js" );
include( "./library/ServiceBased/AttributeServiceSet/Write/write_attribute.js" );
include( "./library/ServiceBased/Helpers.js" );

const ATTRIBUTE_WRITE_STATUSCODE_TIMESTAMP_NODE_TO_WRITE = Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings;
var SKIPWRITEVERIFICATION = true;
addLog( "TESTING AN -- OPTIONAL -- CONFORMANCE UNIT" );

var VQTsupport = UaVQTSupport.None;
var WriteExpectedResult = new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadWriteNotSupported ] );

// get some items that we can use throughout this CU
var scalarNodes = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
if( scalarNodes == null || scalarNodes.length < 3 ) {
    addSkipped( SETTING_UNDEFINED_SCALARSTATIC );
    stopCurrentUnit();
}

if( !Test.Connect() ) stopCurrentUnit();

print( "\n\n\n***** CONFORMANCE UNIT 'Attribute Write StatusCode & Timestamp' TESTS STARTING ******\n" );