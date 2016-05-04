include( "./library/Base/assertions.js" );
include( "./library/Base/array.js" );
include( "./library/Base/NodeTypeAttributesMatrix.js" );
include( "./library/Base/safeInvoke.js" );
include( "./library/Base/Objects/integerSet.js" );
include( "./library/Base/Objects/event.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );

include( "./library/ServiceBased/AttributeServiceSet/Write/write_attribute.js" );
include( "./library/ServiceBased/Helpers.js" );

// make sure that we have some SCALAR nodes configured; if not then we can't continue
var MonitorBasicSubscription;
var scalarItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
if( !isDefined( scalarItems ) ) { 
    addError( "Scalar settings not configured. Please check the UACTT settings and then re-run this conformance unit. Aborting conformance unit." );
    stopCurrentUnit();
}
else {
    if( Test.Connect() ) { // create a subscription that can be used for all tests in this conformance unit
        MonitorBasicSubscription = new Subscription();
        if( !CreateSubscriptionHelper.Execute( { Subscription: MonitorBasicSubscription } ) ) {
            stopCurrentUnit();
        }
        print( "\n\n\n***** CONFORMANCE UNIT 'Monitor Basic' TEST SCRIPTS STARTING ******\n" );
    }
}

// after each test, lets Reset the PublishHelper
function clearPublish() {
    print( "\n\n** Post Test Function: clearPublish() **\n" );
    PublishHelper.Execute( { AckAllAvailableSequenceNumbers: true, ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoSubscription ] ) } );
    PublishHelper.Clear();
}

Test.PostTestFunctions.push( clearPublish );