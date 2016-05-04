include( "./library/Base/safeInvoke.js" );
include( "./library/Base/array.js" );
include( "./library/Base/Objects/integerSet.js" );
include( "./library/Base/NodeTypeAttributesMatrix.js" );
include( "./library/Base/UaVariantToSimpleType.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );

include( "./library/Base/indexRangeRelatedUtilities.js" );
include( "./library/ServiceBased/AttributeServiceSet/Write/write_attribute.js" );
include( "./library/ServiceBased/ViewServiceSet/Browse/get_references.js" );
include( "./library/ServiceBased/Helpers.js" );

// some constant definitions to help with the scripts
const ATTRIBUTE_READ_INVALIDATTRIBUTEID = 999;

originalScalarItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings.concat( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings ) );
if( originalScalarItems === null || originalScalarItems.length === 0 ) {
    _dataTypeUnavailable.store( SETTING_UNDEFINED_SCALARSTATIC );
    stopCurrentUnit();
}
else {
    if( Test.Connect() ) {
        if( !ReadHelper.Execute( { NodesToRead:originalScalarItems, SuppressMessages:true } ) ) {
            addError( "Could not read the initial values of the Scalar nodes we want to test." );
            stopCurrentUnit();
        }
        else {
            for( var i=0; i<originalScalarItems.length; i++ ) originalScalarItems[i].OriginalValue = originalScalarItems[i].Value.Value.clone();
            Test.PostTestFunctions.push( clearPublish );
            print( "\n\n\n***** CONFORMANCE UNIT 'Attribute Read' TEST SCRIPTS STARTING ******\n" );
        }
    }
    else stopCurrentUnit();
}

// after each test, lets Reset the PublishHelper
function clearPublish() {
    PublishHelper.Clear();
}

function revertOriginalValuesScalarStatic() {
    if( originalScalarItems === undefined || originalScalarItems === null || originalScalarItems.length === 0 ) {
        return( false );
    }
    // restore the original values
    addLog( "Reverting Scalar Static nodes to their original values." );
    var expectedResults = [];
    var doWrite = false;
    for( var i=0; i<originalScalarItems.length; i++ ) {
        if( originalScalarItems[i].OriginalValue !== undefined ) {
            originalScalarItems[i].Value.Value = originalScalarItems[i].OriginalValue.clone();
            doWrite = true;
        }
        expectedResults[i] = new ExpectedAndAcceptedResults( StatusCode.Good );
        expectedResults[i].addAcceptedResult( StatusCode.BadNotWritable )
    }
    if( doWrite ){ WriteHelper.Execute( { NodesToWrite: originalScalarItems, OperationResults: expectedResults, ReadVerification: false } ); }
}