include( "./library/Base/safeInvoke.js" );
include( "./library/ServiceBased/Helpers.js" );


var ISDEBUG=true;

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
        Test.PostTestFunctions.push( __revertOriginalValues );
    }
}

function __revertOriginalValues() {
    for( var i=0; i<testItems.length; i++ ) testItems[i].Value.Value = testItems[i].OriginalValue.clone();
    WriteHelper.Execute( { NodesToWrite: testItems } );
}