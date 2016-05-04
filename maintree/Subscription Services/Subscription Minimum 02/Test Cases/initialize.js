include( "./library/Base/Objects/integerSet.js" );
include( "./library/Base/Objects/dictionary.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );
include( "./library/Base/array.js" );
include( "./library/Base/safeInvoke.js" );

include( "./library/Base/SettingsUtilities/NodeIds.js" );
include( "./library/Base/UaVariantToSimpleType.js" );
include( "./library/ServiceBased/SubscriptionServiceSet/SetPublishingMode/testParallelSubscriptions.js" );
include( "./library/ServiceBased/AttributeServiceSet/Write/write_attribute.js" );


const DO_NOT_VERIFY_WRITE = false;
const SUBSCRIPTIONCOUNT = 2;

// setup a default monitoredItem that we can use for the scripts within this CU.
var defaultStaticItem = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
defaultStaticItem.DataType = UaNodeId.GuessType( defaultStaticItem.NodeSetting );
if( defaultStaticItem == undefined || defaultStaticItem == null ) {
    addSkipped( "Static Scalar (numeric)" );
    stopCurrentUnit();
}

// Connect to the server 
if( !Test.Connect() ) {
    addError( "Unable to connect to Server. Please check setings." );
    stopCurrentUnit();
}
else Test.PostTestFunctions.push( clearPublish );

// after each test, lets Reset the PublishHelper
function clearPublish() { PublishHelper.Clear(); }

// get the parent node of a specified node
function init_GetMethodParent( methodNodeId ) {
    var parentObject = null;
    methodNodeId.BrowseDirection = BrowseDirection.Inverse;
    var hasComponentNodeId = new UaNodeId( Identifier.HasComponent );
    if( BrowseHelper.Execute( { NodesToBrowse: methodNodeId, SuppressMessaging: true } ) ) {   // browse our method node for inverse references
        for( var i=0; i<BrowseHelper.Response.Results.length; i++ ) {                          // iterate thru all browse results
            if( BrowseHelper.Response.Results[i].StatusCode.isGood() ) {                       // we care for good results only
                for( var r=0; r<BrowseHelper.Response.Results[i].References.length; r++ ) {    // iterate thru all returned references for *this* result
                    if( BrowseHelper.Response.Results[i].References[r].ReferenceTypeId.equals( hasComponentNodeId ) ) { // HasComponent?
                        parentObject = MonitoredItem.fromNodeIds( BrowseHelper.Response.Results[i].References[r].NodeId.NodeId )[0]; // capture the parent object
                        break;                                                                       // exit this inner loop; outer loop exited next.
                    }
                }// for r...
            }// is good
            if( parentObject !== null ) break;                                                       // escape the loop if the object is defined
        }//for i...
    }// browse
    return( parentObject );
}