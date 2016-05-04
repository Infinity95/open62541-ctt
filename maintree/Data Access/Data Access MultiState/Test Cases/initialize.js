include( "./library/Base/safeInvoke.js" );
include( "./library/NodeTypeBased/AnalogItemType/MultiStateDiscreteType.js" );
include( "./library/ServiceBased/ViewServiceSet/Browse/get_references.js" );
include( "./library/ServiceBased/ViewServiceSet/Browse/direction_test.js" );
include( "./library/ClassBased/DerivesFrom.js" );

// check if we have enough settings to proceed with testing this conformance unit
var multiStateItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DiscreteType.MultiStateDiscretes );
if( !isDefined( multiStateItems ) || multiStateItems.length == 0 ) { 
    addSkipped( SETTING_UNDEFINED_DADISCRETE );
    stopCurrentUnit();
}
else {
    var multiStateValueDiscreteItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.MultiStateValueDiscreteType.Settings );
    if( !isDefined( multiStateValueDiscreteItems ) ) { 
        addSkipped( SETTING_UNDEFINED_DAMULTISTATE );
        notSupported( "MultiStateValueDiscreteItemType" );
    }

    if( !Test.Connect() ) {
        addError( "Unable to Connect to Server. Please check settings." );
        stopCurrentUnit();
    }
    Test.PostTestFunctions.push( resetStats );
}

// methods to invoke after each test
function resetStats() {
    ReadHelper.Clear();
    WriteHelper.Clear();
}