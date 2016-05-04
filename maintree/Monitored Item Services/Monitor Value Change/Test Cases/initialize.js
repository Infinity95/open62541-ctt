include( "./library/Base/safeInvoke.js" );
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

var MonitorBasicSubscription = new Subscription();
var originalScalarItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings.concat( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings ) );
if( originalScalarItems === null || originalScalarItems.length === 0 ) {
    addWarning( "Not enough Scalar Static nodes configured. Aborting conformance unit." );
    stopCurrentUnit();
}
else if( !Test.Connect() ) stopCurrentUnit();
else {
    if( !CreateSubscriptionHelper.Execute( { Subscription: MonitorBasicSubscription } ) ) {
        addError( "Skipping MONITOR VALUE CHANGE conformance unit, because createSubscription failed, which is a necessary function for testing this conformance unit." );
        stopCurrentUnit();
    }
    else {
        if( !ReadHelper.Execute( { NodesToRead: originalScalarItems } ) ) {
            addError( "Could not read the initial values of the Scalar nodes we want to test." );
            stopCurrentUnit();
        }
        else {
            for( var i=0; i<originalScalarItems.length; i++ ) originalScalarItems[i].OriginalValue = originalScalarItems[i].Value.Value.clone();
            checkInitialValuesAndInitialize();
            Test.PostTestFunctions.push( clearPublish );
            // get the max string length, if applicable
            var maxStringLen = parseInt( readSetting( "/Server Test/Capabilities/Max String Length" ) )
            if( maxStringLen === 0 || maxStringLen < 5 ) maxStringLen = 10;
            print( "\n\n\n\n\n***** START OF CONFORMANCE UNIT TESTING *****" );
        }
    }
}

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
            expectedResults[i].addAcceptedResult( StatusCode.BadNotWritable );
            numWrites++;
        }
        else {
            print( "\tCannot revert to original value on Node '" + originalScalarItems[i].NodeSetting + "' because it wasn't captured in the beginning (bad data? invalid nodes?)" );
        }
    }
    // do we have anything to revert?
    if( numWrites > 0 ) {
        WriteHelper.Execute( { 
                NodesToWrite: originalScalarItems,
                OperationResults: expectedResults,
                CheckNotSupported: true,
                ReadVerification: false } );
    }
}

function checkInitialValuesAndInitialize() {
    var doInit = false;
    for( var i=0; i<originalScalarItems.length; i++ ) {
        if( originalScalarItems[i].Value.Value.ArrayType === 1 ) {
            switch( originalScalarItems[i].Value.Value.DataType ) {
                case BuiltInType.ByteString: 
                    print( "GetArraySize(ByteString) = " + originalScalarItems[i].Value.Value.getArraySize() );
                    if( originalScalarItems[i].Value.Value.getArraySize() === 0 ) {
                        var bsa = new UaByteStrings();
                        for( var b=0; b<5; b++ ) bsa[b] = UaByteString.fromStringData( "hello world: " + b );
                        originalScalarItems[i].Value.setByteStringArray( bsa );
                        doInit = true;
                    }
                    else {
                        var bsa = originalScalarItems[i].Value.Value.toByteStringArray();
                        for( var b=0; b<bsa.length; b++ ) {
                            if( bsa[b].length == 0 ) { bsa[b] = UaByteString.fromStringData( "CTT Init[" + b +"]" ); doInit=true; }
                        }//for b
                        if( doInit ) originalScalarItems[i].Value.Value.setByteStringArray( bsa );
                    }
                    break;
                case BuiltInType.String:
                    print( "GetArraySize(String) = " + originalScalarItems[i].Value.Value.getArraySize() );
                    if( originalScalarItems[i].Value.Value.getArraySize() === 0 ) {
                        var sa = new UaStrings();
                        for( var s=0; s<5; s++ ) sa[s] = "hello world: " + s;
                        originalScalarItems[i].Value.setStringArray( sa );
                        doInit = true;
                    }
                    else {
                        var sa = originalScalarItems[i].Value.Value.toStringArray();
                        for( var s=0; s<sa.length; s++ ) {
                            if( sa[s].length == 0 ) { sa[s] = "CTT Init[" + s +"]"; doInit=true; }
                        }//for b
                        if( doInit ) originalScalarItems[i].Value.Value.setStringArray( sa );
                    }
                    break;
                default: break;
            }//switch
        }
    }
    if( doInit ) { print( "initializing values..." ); WriteHelper.Execute( { NodesToWrite: originalScalarItems, ReadVerification: false } ); }
}

function clearPublish() {
    print( "\n\n** Post Test Function: clearPublish() **\n" );
    PublishHelper.Execute( { AckAllAvailableSequenceNumbers: true, ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoSubscription ] ) } );
    PublishHelper.Clear();
}