include( "./library/Base/Objects/integerSet.js" );
include( "./library/Base/Objects/dictionary.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );
include( "./library/Base/array.js" );
include( "./library/Base/safeInvoke.js" );

include( "./library/Base/SettingsUtilities/NodeIds.js" );
include( "./library/Base/UaVariantToSimpleType.js" );
include( "./library/ServiceBased/SubscriptionServiceSet/SetPublishingMode/testParallelSubscriptions.js" );
include( "./library/ServiceBased/AttributeServiceSet/Write/write_attribute.js" );
include( "./library/ServiceBased/Helpers.js" );

// setup a default monitoredItem that we can use for the scripts within this CU.
var defaultStaticItem = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
defaultStaticItem.DataType = UaNodeId.GuessType( defaultStaticItem.NodeSetting );
if( defaultStaticItem == undefined || defaultStaticItem == null ) {
    addSkipped( "Static Scalar (numeric)" );
    stopCurrentUnit();
}
if( !Test.Connect() ) {
    addError( "Unable to connect to Server. Please check settings." );
    stopCurrentUnit();
}