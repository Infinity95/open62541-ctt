// General includes
include( "./library/Base/SettingsUtilities/NodeIds.js" );

include( "./library/Base/safeInvoke.js" );
include( "./library/Base/Objects/event.js" );
include( "./library/ClassBased/UaQualifiedName/create_qualified_name.js" );
include( "./library/ClassBased/UaNodeId/create_nodeid.js" );
include( "./library/NodeTypeBased/DataItemType/precision.js" );
include( "./library/ServiceBased/AttributeServiceSet/Write/write_attribute.js" );
include( "./library/ServiceBased/ViewServiceSet/Browse/get_default_request.js" );
include( "./library/ServiceBased/ViewServiceSet/TranslateBrowsePathsToNodeIds/create_request.js" );
include( "./library/ServiceBased/ViewServiceSet/TranslateBrowsePathsToNodeIds/getNodeIds.js");
include( "./library/ServiceBased/Helpers.js" );

var allDataItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings );
if( !isDefined( allDataItems ) || allDataItems.length === 0 ) {
    addSkipped( SETTING_UNDEFINED_DADATAITEM );
    stopCurrentUnit();
}
else {
    if( !Test.Connect() ) {
        addError( "Unable to Connect to the Server. Please check settings." );
        stopCurrentUnit();
    }
    else {
        // read the values and cache them so we can revert them eat the end of each test
        if( ReadHelper.Execute( { NodesToRead: allDataItems } ) ) {
            for( var i=0; i<allDataItems.length; i++ ) allDataItems[i].OriginalValue = allDataItems[i].Value.Value.clone();
        }
        // at the end of each test script, run the following function to revert the items back to their original values
        Test.PostTestFunctions.push( revertToOriginalValues );
    }
}

function revertToOriginalValues() {
    for( var i=0; i<allDataItems.length; i++ ) allDataItems[i].Value.Value = allDataItems[i].OriginalValue;
    WriteHelper.Execute( { NodesToWrite: allDataItems, SkipReadVerification: true } );
}