include( "./library/Base/Objects/event.js" );
include( "./library/Base/Objects/integerSet.js" );
include( "./library/Base/array.js" );
include( "./library/Base/safeInvoke.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );

include( "./library/ServiceBased/AttributeServiceSet/Write/write_attribute.js" );
include( "./library/ServiceBased/Helpers.js" );

const DISCARDOLDEST_TRUE = true;
const DISCARDOLDEST_FALSE = false;
const OVERFLOWBIT = 0x480;

// make sure that we have some items to work with first:
var staticItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, 0 );
if( !isDefined( staticItems ) ) { 
    addError( "No Static items are configured within the Settings. Please reconfigure the CTT correctly and then re-run this conformance unit. Aborting conformance unit." );
    stopCurrentUnit();
}
else {
    if( !Test.Connect() ) stopCurrentUnit();
    else Test.PostTestFunctions.push( clearPublish );
}

// after each test, lets Reset the PublishHelper
function clearPublish() {
    PublishHelper.Execute( { AckAllAvailableSequenceNumbers: true, ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoSubscription ] ) } );
    PublishHelper.Clear();
}