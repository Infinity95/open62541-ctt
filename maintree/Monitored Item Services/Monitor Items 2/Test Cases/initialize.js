include( "./library/Base/Objects/integerSet.js" );
include( "./library/Base/Objects/event.js" );
include( "./library/Base/array.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );

include( "./library/Base/safeInvoke.js" );
include( "./library/ServiceBased/AttributeServiceSet/Write/write_attribute.js" );

const BAD_TOOMANYMONITOREDITEMS = 0x80DB0000;

var defaultSubscription = new Subscription();
var items = MonitoredItem.fromSettings(  Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings
        .concat( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings )
        .concat( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogTypeArrays.Settings )
        .concat( Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings ) );
if( !isDefined( items ) ) { 
    addError( "No items are defined. Please check your settings." ); 
    stopCurrentUnit(); 
}
else {
    if( !Test.Connect() ) stopCurrentUnit();
    else {
        if( !CreateSubscriptionHelper.Execute( { Subscription: defaultSubscription } ) ) stopCurrentUnit();
        else print( "\n\n\n***** CONFORMANCE UNIT 'Monitor Items 2' TEST SCRIPTS STARTING ******\n" );
    }
}