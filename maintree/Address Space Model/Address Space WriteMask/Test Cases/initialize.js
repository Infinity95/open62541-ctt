include( "./library/Base/safeInvoke.js" );

include( "./library/Base/assertions.js" );
include( "./library/ServiceBased/AttributeServiceSet/Write/write_attribute.js" );
include( "./library/ServiceBased/AttributeServiceSet/Write/writeMask_writeValues.js" );

const CUNAME = "Address Space WriteMask";


// read the original values of all scalar types, because we will revert to their original values at the end of the test 
var originalArrayScalarValues = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings );
if( originalArrayScalarValues !== null && originalArrayScalarValues.length !== 0 ) {
    if( !Test.Connect() ) {
        addError( "Unable to connect to Server. Please check settings." );
        stopCurrentUnit();
    }
    else {
        if( ReadHelper.Execute( { NodesToRead: originalArrayScalarValues } ) ) {
            for( var i=0; i<originalArrayScalarValues.length; i++ ) originalArrayScalarValues[i].OriginalValue = originalArrayScalarValues[i].Value.Value.clone();
        }
    }
}

function revertToOriginalValues() {
    print( "\n\n\n\nReverting Array scalar static nodes back to their original values." );
    for( var i=0; i<originalArrayScalarValues.length; i++ ) originalArrayScalarValues[i].Value.Value = originalArrayScalarValues[i].OriginalValue.clone();
    WriteHelper.Execute( { NodesToWrite: originalArrayScalarValues } );
}


print( "****** CONFORMANCE UNIT '" + CUNAME + "' TESTING BEGINS ******" );