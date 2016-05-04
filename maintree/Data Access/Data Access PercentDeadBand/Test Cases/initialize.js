// utility functions
include( "./library/Base/array.js" );
include( "./library/Base/safeInvoke.js" );
include( "./library/Base/Objects/event.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );

include( "./library/NodeTypeBased/AnalogItemType/EURange.js" );
include( "./library/ServiceBased/ViewServiceSet/Browse/get_default_request.js" );
include( "./library/ServiceBased/MonitoredItemServiceSet/CreateMonitoredItems/writeToDeadbandAndCheckWithPublish.js" );

const OVERFLOWBIT = 0x480;

var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.NumericSettings )[0];
var MonitorBasicSubscription;
if( item === undefined ) {
    addSkipped( SETTING_UNDEFINED_DAANALOG );
    stopCurrentUnit();
}
else {
    if( !Test.Connect() ) {
        addError( "Unable to Connect to Server. Please check settings." );
        stopCurrentUnit();
    }
    else {
        // create a subscription that can be used for all tests in this Conformance Unit.
        MonitorBasicSubscription = new Subscription();  
        CreateSubscriptionHelper.Execute( { Subscription: MonitorBasicSubscription } );
    }
}