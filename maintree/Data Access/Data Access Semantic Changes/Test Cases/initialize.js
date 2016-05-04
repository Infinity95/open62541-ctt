// utility functions
include( "./library/Base/array.js" );
include( "./library/Base/safeInvoke.js" );
include( "./library/Base/Objects/event.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );


const SEMANTICCHANGE_BIT = 0x4000; // 0100 0000 0000 0000

var _EngUnitsWritable;
var _InstrRangeWritable;
var _EuRangeWritable;
var _TwoStateWritable;
var _MultiStateWritable;

// do we have analog items, as needed by this CU?
var analogItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings );
if( !( isDefined( analogItems ) && isDefined( analogItems.length ) && analogItems.length !== 0 ) ) {
    analogItems = null;
}

var twoStateItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DiscreteType.TwoStateDiscretes );
if( !( isDefined( twoStateItems ) && isDefined( twoStateItems.length ) && twoStateItems.length !== 0 ) ) {
    twoStateItems = null;
}

var multiStateItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DiscreteType.MultiStateDiscretes );
if( !( isDefined( multiStateItems ) && isDefined( multiStateItems.length ) && multiStateItems.length !== 0 ) ) {
    multiStateItems = null;
}

var defaultSubscription;
if( analogItems === null && twoStateItems === null && multiStateItems === null ) { 
    addSkipped( SETTING_UNDEFINED_DAANALOG );
    addSkipped( SETTING_UNDEFINED_DADISCRETE );
    addSkipped( SETTING_UNDEFINED_DAMULTISTATE );
    stopCurrentUnit();
}
else {
    // Connect to the server
    Test.Connect();

    // get the initial values for all items 
    var allItems = analogItems;
    if( isDefined( twoStateItems ) ) allItems.concat( twoStateItems );
    if( isDefined( multiStateItems ) )allItems.concat( multiStateItems );
    if( ReadHelper.Execute( { NodesToRead: allItems } ) ) for( var i=0; i<allItems.length; i++ ) allItems[i].OriginalValue = allItems[i].Value.Value.clone();

    // create a subscription that can be used for all tests in this Conformance Unit.
    defaultSubscription = new Subscription();  
    CreateSubscriptionHelper.Execute( { Subscription: defaultSubscription } );
}