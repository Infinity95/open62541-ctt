include( "./library/Base/Objects/integerSet.js" );
include( "./library/Base/array.js" );
include( "./library/Base/safeInvoke.js" );

include( "./library/Base/SettingsUtilities/NodeIds.js" );
include( "./library/ServiceBased/AttributeServiceSet/Write/write_attribute.js" );
include( "./library/ServiceBased/MonitoredItemServiceSet/CreateMonitoredItems/writeToDeadbandAndCheckWithPublish.js" );
include( "./library/ServiceBased/Helpers.js" );

var __republishNotSupported = false;

function initialize() {
    return( Test.Connect() );
}// function initialize()

function setInitialLargeFiletypeValues( items ) { 
    if( !isDefined( items ) ) return( false );
    for( var i=0; i<items.length; i++ ) {
        items[i].OriginalValues = items[i].Value.Value.clone();
        if( items[i].Value.Value.DataType === BuiltInType.Int64 ) {
            items[i].Value.Value.setInt64( 0 );
            WriteHelper.Execute( { NodesToWrite: items[i] } );
        }
        else if( items[i].Value.Value.DataType === BuiltInType.UInt64 ) { 
            items[i].Value.Value.setUInt64( 0 );
            WriteHelper.Execute( { NodesToWrite: items[i] } );
        }
        else if( items[i].Value.Value.DataType === BuiltInType.Double ) { 
            items[i].Value.Value.setDouble( 0 );
            WriteHelper.Execute( { NodesToWrite: items[i] } );
        }
        else if( items[i].Value.Value.DataType === BuiltInType.Float ) { 
            items[i].Value.Value.setFloat( 0 );
            WriteHelper.Execute( { NodesToWrite: items[i] } );
        }
    }
}// function captureOriginalValues( items )

// check the fastest support publishingInterval setting
var fastestPublishingIntervalSupported = gServerCapabilities.FastestPublishIntervalSupported;

var defaultStaticItem = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
if( defaultStaticItem == undefined || defaultStaticItem == null ) {
    addSkipped( "Static Scalar (numeric)" );
    stopCurrentUnit();
}
else {
    defaultStaticItem.DataType = UaNodeId.GuessType( defaultStaticItem.NodeSetting );

    if( initialize() ) {
        Test.PostTestFunctions.push( clearPublish );
        // obtain the current value of our default statis item
        ReadHelper.Execute( { NodesToRead: defaultStaticItem } );
        // clone the value
        defaultStaticItem.OriginalValue = defaultStaticItem.Value.Value.clone();
    }
    else stopCurrentUnit();
}

// after each test, lets Reset the PublishHelper
function clearPublish() {
    print( "\n\n** Post Test Function: clearPublish() **\n" );
    var serviceResults = new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoSubscription ] );
    PublishHelper.Execute( { AckAllAvailableSequenceNumbers: true, 
                             SkipValidation: true,
                             SuppressMessaging: false } );
    PublishHelper.Clear();
}