include( "./library/ServiceBased/MonitoredItemServiceSet/CreateMonitoredItems/basicCreateMonitoredItemsTest.js" );
include( "./library/ServiceBased/MonitoredItemServiceSet/CreateMonitoredItems/writeToDeadbandAndCheckWithPublish.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );
include( "./library/Base/Objects/integerSet.js" );
include( "./library/Base/Objects/event.js" );
include( "./library/Base/array.js" );
include( "./library/Base/safeInvoke.js" );
include( "./library/Base/indexRangeRelatedUtilities.js" );

include( "./library/ServiceBased/AttributeServiceSet/Write/write_attribute.js" );
include( "./library/ServiceBased/Helpers.js" );

const DISCARDOLDEST_TRUE = true;
const DISCARDOLDEST_FALSE = false;
const OVERFLOWBIT = 0x480;

var originalScalarItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings.concat( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings ) );
var scalarItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
var MonitorBasicSubscription = new Subscription();
var maxStringLen = parseInt( readSetting( "/Server Test/Capabilities/Max String Length" ) )

if( originalScalarItems === null || originalScalarItems.length === 0 ) {
    addWarning( "Not enough Scalar Static nodes configured. Aborting conformance unit." );
    stopCurrentUnit();
}
else if( !Test.Connect() ) stopCurrentUnit();
else {
    if( !ReadHelper.Execute( { NodesToRead: originalScalarItems, SuppressMessaging: true } ) ) addError( "Could not read the initial values of the Scalar nodes we want to test." );
    else for( var i=0; i<originalScalarItems.length; i++ ) originalScalarItems[i].OriginalValue = originalScalarItems[i].Value.Value.clone();
    if( !CreateSubscriptionHelper.Execute( { Subscription: MonitorBasicSubscription } ) ) {
        addError( "Skipping MONITOR VALUE CHANGE conformance unit, because createSubscription failed, which is a necessary function for testing this conformance unit." );
        Test.Disconnect();
        stopCurrentUnit();
    }
}
// get the max string length, if applicable

print( "\n\n\n\n\n***** START OF CONFORMANCE UNIT TESTING *****" );

function revertOriginalValuesScalarStatic() {
    // restore the original values
    addLog( "Reverting Scalar Static nodes to their original values." );
    var expectedResults = [];
    var numWrites = 0;
    for( var i=0; i<originalScalarItems.length; i++ ) {
        // did we capture an initial value? if so then revert to it
        if( originalScalarItems[i].OriginalValue !== undefined && originalScalarItems[i].OriginalValue !== null ) {
            originalScalarItems[i].Value.Value = originalScalarItems[i].OriginalValue.clone();
            expectedResults[i] = new ExpectedAndAcceptedResults( StatusCode.Good );
            expectedResults[i].addAcceptedResult( StatusCode.BadNotWritable )
            numWrites++;
        }
        else print( "\tCannot revert to original value on Node '" + originalScalarItems[i].NodeSetting + "' because it wasn't captured in the beginning (bad data? invalid nodes?)" );
    }
    // do we have anything to revert?
    if( numWrites > 0 ) WriteHelper.Execute( { NodesToWrite: originalScalarItems, OperationResults: expectedResults, CheckNotSupported: true, ReadVerification: false } );
}

function captureOriginalValues( items ) { 
    if( !isDefined( items ) ) return( false );
    var writeItems = [];
    for( var i=0; i<items.length; i++ ) {
        items[i].OriginalValues = items[i].Value.Value.clone();
        if( items[i].Value.Value.DataType === BuiltInType.Int64 ) {
            var i64s = items[i].Value.Value.toInt64Array();
            for( var ii=0; ii<i64s.length; ii++ ) i64s[ii] = 0;
            writeItems.push( items[i] );
        }
        else if( items[i].Value.Value.DataType === BuiltInType.UInt64 ) { 
            var ui64s = items[i].Value.Value.toUInt64Array();
            for( var ii=0; ii<ui64s.length; ii++ ) ui64s[ii] = 0;
            writeItems.push( items[i] );
        }
        else if( items[i].Value.Value.DataType === BuiltInType.Double ) { 
            var dbls = items[i].Value.Value.toDoubleArray();
            for( var ii=0; ii<dbls.length; ii++ ) dbls[ii] = 0;
            writeItems.push( items[i] );
        }
        else if( items[i].Value.Value.DataType === BuiltInType.Float ) { 
            var flts = items[i].Value.Value.toFloatArray();
            for( var ii=0; ii<flts.length; ii++ ) flts[ii] = 0;
            writeItems.push( items[i] );
        }
    }
    if( writeItems.length > 0 ) {
        var expectedResults = [];
        for( var i=0; i<writeItems.length; i++ ) expectedResults.push( new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadWriteNotSupported ] ) );
        WriteHelper.Execute( { NodesToWrite: writeItems, ReadVerification: false, OperationResults: expectedResults } );
    }
}

function revertToOriginalValues( items ) { 
    if( !isDefined( items ) ) return( false );
    var writeItems = [];
    for( var i=0; i<items.length; i++ ) {
        if( isDefined( items[i].OriginalValues ) && ( items[i].Value.Value.DataType === BuiltInType.Int64 || items[i].Value.Value.DataType === BuiltInType.UInt64 ) ) {
            items[i].Value.Value = items[i].OriginalValues;
            print( "Reverting item '" + items[i].NodeId + " (setting: '" + items[i].NodeSetting + "') back to its original value." );
            writeItems.push( items[i] );
        }
    }// for i
    if( writeItems.length > 0 ) WriteHelper.Execute( { NodesToWrite: writeItems, ReadVerification: false } );
}