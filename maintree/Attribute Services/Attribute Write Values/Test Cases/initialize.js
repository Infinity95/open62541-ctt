include( "./library/Base/safeInvoke.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );

include( "./library/ServiceBased/AttributeServiceSet/Write/write_attribute.js" );
include( "./library/ServiceBased/Helpers.js" );

addLog( "TESTING AN -- OPTIONAL -- CONFORMANCE UNIT" );

// read the original values of all scalar types, because we will revert to their original values at the end of the test 
var originalScalarValues = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
if( originalScalarValues !== null && originalScalarValues.length !== 0 ) { 
    if( !Test.Connect() ) stopCurrentUnit();
    else {
        if( !ReadHelper.Execute( { NodesToRead: originalScalarValues } ) ) {
            addError( "Unable to read the initial values of the test nodes. Aborting testing." );
            stopCurrentUnit();
        }
        else {
            for( var i=0; i<originalScalarValues.length; i++ ) originalScalarValues[i].OriginalValue = originalScalarValues[i].Value.Value.clone();
            Test.PostTestFunctions.push( revertToOriginalValues );
        }
    }
}

function revertToOriginalValues() {
    print( "\n\n\n\n~~~ Reverting scalar static nodes back to their original values ~~~\n\n\n" );
    for( var i=0; i<originalScalarValues.length; i++ ) originalScalarValues[i].Value.Value = originalScalarValues[i].OriginalValue.clone();
    WriteHelper.Execute( { NodesToWrite: originalScalarValues, ReadVerification: false } );
}