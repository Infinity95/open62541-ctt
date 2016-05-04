include( "./library/Base/Objects/integerSet.js" );
include( "./library/Base/array.js" );
include( "./library/Base/safeInvoke.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );

include( "./library/ServiceBased/MonitoredItemServiceSet/CreateMonitoredItems/basicCreateMonitoredItemsTest.js" );
include( "./library/ServiceBased/Helpers.js" );

const BAD_TOOMANYMONITOREDITEMS = 0x80DB0000;

// check we have some items to use
var items = MonitoredItem.fromSettings(  Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings
        .concat( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings )
        .concat( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogTypeArrays.Settings )
        .concat( Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings ) );
if( !isDefined( items ) || items.length === 0 ) {
    addError( "No scalar items are defined. Please check your settings." );
    stopCurrentUnit();
}

var defaultSubscription = new Subscription();

if( !Test.Connect() ) {
    addError( "Connect failed. Stopping execution of current conformance unit.");
    stopCurrentUnit();
}
else {
    if( !CreateSubscriptionHelper.Execute( { Subscription: defaultSubscription } ) ) { 
        stopCurrentUnit();
    }
}