include( "./library/ServiceBased/SubscriptionServiceSet/SetPublishingMode/testParallelSubscriptions.js" );
include( "./library/Base/Objects/integerSet.js" );
include( "./library/Base/Objects/dictionary.js" );
include( "./library/Base/assertions.js" );
include( "./library/Base/array.js" );
include( "./library/Base/safeInvoke.js" );

include( "./library/Base/SettingsUtilities/NodeIds.js" );
include( "./library/ServiceBased/AttributeServiceSet/Write/write_attribute.js" );
include( "./library/ServiceBased/Helpers.js" );

const SUBSCRIPTIONCOUNT = 10;


// setup a default monitoredItem that we can use for the scripts within this CU.
var monitoredItem;
function InitSubscriptionMin5() {
    monitoredItem = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( monitoredItem === undefined || monitoredItem === null ) {
        addError( "Conformance unit skipped. Please check setting '" + monitoredItemSetting + "'" );
        stopCurrentUnit();
        return( false );
    }
    return( true );
}

function defaultConnection() {
    return( Test.Connect() );
}

// after each test, lets Reset the PublishHelper
function clearPublish() {
    PublishHelper.Clear();
}

if( !( InitSubscriptionMin5() && defaultConnection() ) ) stopCurrentUnit();
else Test.PostTestFunctions.push( clearPublish );