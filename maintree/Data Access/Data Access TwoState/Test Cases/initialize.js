// General includes
include( "./library/Base/SettingsUtilities/NodeIds.js" );
include( "./library/Base/safeInvoke.js" );
include( "./library/NodeTypeBased/AnalogItemType/TrueStateFalseState.js" );
include( "./library/ServiceBased/ViewServiceSet/Browse/get_references.js" );
include( "./library/ServiceBased/ViewServiceSet/Browse/direction_test.js" );
include( "./library/ServiceBased/Helpers.js" );

// check we have enough settings for TwoStateDiscrete
var twoStateItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DiscreteType.TwoStateDiscretes );

// check we have enough settings for MultiStateDiscrete
var multiStateItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DiscreteType.MultiStateDiscretes );

// check we have enough settings for Discrete testing?
if( ( multiStateItems == null || multiStateItems.length == 0 )
    && ( twoStateItems == null || twoStateItems.length == 0 ) ) {
    addSkipped( SETTING_UNDEFINED_DADISCRETE );
    addSkipped( SETTING_UNDEFINED_DAMULTISTATE );
    stopCurrentUnit();
}
else {
    if( !Test.Connect() ) {
        addError( "Unable to connect to Server. Please check settings." );
        stopCurrentUnit();
    }
}

const TSDT = "TwoStateDiscreteType";