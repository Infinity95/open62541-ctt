include( "./library/ServiceBased/SubscriptionServiceSet/SetPublishingMode/testParallelSubscriptions.js" );
include( "./library/Base/Objects/integerSet.js" );
include( "./library/Base/array.js" );
include( "./library/Base/safeInvoke.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );
include( "./library/Base/UaVariantToSimpleType.js" );
include( "./library/ServiceBased/Helpers.js" );

const ISDEBUG = false;
const SUBSCRIPTION_PUBLISH_MIN_05_PUBLISHCALLCOUNT   = 10;   // how many times to call Publish() per session
const SUBSCRIPTION_PUBLISH_MIN_05_SESSIONCREATECOUNT = 5; // how many sessions to create
const DO_NOT_VERIFY_WRITE = false;

var testItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
if( !isDefined( testItems ) || testItems.length === 0 ) {
    addError( "No items defined in settings. Please configure the CTT." );
    stopCurrentUnit();
}
else {
    if( !Test.Connect() ) {
        addError( "Unable to connect to Server. Aborting." );
        stopCurrentUnit();
    }
    else {
        // read the test-items and then store their original values
        if( ReadHelper.Execute( { NodesToRead: testItems } ) ) for( var i=0; i<testItems.length; i++ ) testItems[i].OriginalValue = testItems[i].Value.Value.clone(); // store the original value 
        // after each test, rever the values of the test-items back to their initial state
        Test.PostTestFunctions[0] = __revertOriginalValues;
    }
}

function __revertOriginalValues() {
    for( var i=0; i<testItems.length; i++ ) testItems[i].Value.Value = testItems[i].OriginalValue.clone();
    WriteHelper.Execute( { NodesToWrite: testItems } );
}