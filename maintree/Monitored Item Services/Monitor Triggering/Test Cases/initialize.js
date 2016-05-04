include( "./library/Base/safeInvoke.js" );
include( "./library/Base/array.js" );
include( "./library/Base/Objects/integerSet.js" );
include( "./library/Base/Objects/event.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );


const SAMPLING_RATE_FASTEST = 0;

var scalarItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
if( !isDefined( scalarItems ) ) { 
    addError( "Scalar settings not configured. Please check the UACTT settings and then re-run this conformance unit. Aborting conformance unit." );
    stopCurrentUnit();
}
var MonitorTriggeringSubscription = new Subscription();
if( !Test.Connect() ) stopCurrentUnit();
else {
    MonitorTriggeringSubscription.RevisedLifetimeCount = 100; // long timeout needed for this CU
    if( !CreateSubscriptionHelper.Execute( { Subscription: MonitorTriggeringSubscription } ) ) stopCurrentUnit();
}

print( "\n\n\n***** CONFORMANCE UNIT 'Monitor Triggering' TEST SCRIPTS STARTING ******\n" );