include( "./library/ServiceBased/MonitoredItemServiceSet/CreateMonitoredItems/basicCreateMonitoredItemsTest.js" );
include( "./library/ServiceBased/MonitoredItemServiceSet/CreateMonitoredItems/writeToDeadbandAndCheckWithPublish.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );
include( "./library/Base/Objects/integerSet.js" );
include( "./library/Base/Objects/event.js" );
include( "./library/Base/array.js" );
include( "./library/Base/safeInvoke.js" );
include( "./library/Base/indexRangeRelatedUtilities.js" );

include( "./library/ServiceBased/Helpers.js" );


var defaultSubscription = new Subscription();
var originalScalarItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings.concat( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings ) );
if( originalScalarItems === null || originalScalarItems.length === 0 ) {
    addWarning( "Not enough Scalar Static nodes configured. Aborting conformance unit." );
    stopCurrentUnit();
}
else {
    if( Test.Connect() ) {
        if( !ReadHelper.Execute( { NodesToRead: originalScalarItems } ) ) addError( "Could not read the initial values of the Scalar nodes we want to test." );
        else for( var i=0; i<originalScalarItems.length; i++ ) originalScalarItems[i].OriginalValue = originalScalarItems[i].Value.Value.clone();

        if( !CreateSubscriptionHelper.Execute( { Subscription: defaultSubscription } ) ) {
            addSkipped( "Skipping Monitor Alternate Encoding conformance unit, because createSubscription failed, which is a necessary function for testing this conformance unit." );
            stopCurrentUnit();
        }

        print( "\n\n\n\n\n***** START OF CONFORMANCE UNIT TESTING *****" );
    }
}