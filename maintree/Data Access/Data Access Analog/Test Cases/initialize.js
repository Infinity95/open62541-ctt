// General includes
include( "./library/Base/array.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );

include( "./library/Base/safeInvoke.js" );
include( "./library/Base/Objects/event.js" );
include( "./library/NodeTypeBased/AnalogItemType/EURange.js" );
include( "./library/ClassBased/UaQualifiedName/create_qualified_name.js" );
include( "./library/ClassBased/UaNodeId/create_nodeid.js" );
include( "./library/ServiceBased/Helpers.js" );

const SEMANTICCHANGE_BIT = 0x4000;
const WARNING_EURANGE_NOTWRITABLE = "Write() to EURange failed; either not supported or an access-rights violation.";
const WARNING_EUNITS_NOTWRITABLE = "Write() to EngineeringUnits failed; either not supported or an access-rights violation.";
const WARNING_INSTRANGE_NOTWRITABLE = "Write() to InstrumentRange failed; either not supported or an access-rights violation.";

// get an array of MonitoredItem objects, these will be used by all scripts in this Conformance Unit 
var AnalogItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.NumericSettings );
if( AnalogItems == null || AnalogItems.length == 0 ) {
    addSkipped( SETTING_UNDEFINED_DAANALOG );
    stopCurrentUnit();
}
else {
    if( !Test.Connect() ) stopCurrentUnit();
    else {
        // now to look at each configured AnalogItem to see if it has an EURange defined: 
        var euBrowsePaths = [];
        var translateResults = [];
        for( var i=0; i<AnalogItems.length; i++ ) {
            euBrowsePaths.push( UaBrowsePath.New( { StartingNode: AnalogItems[i], RelativePathStrings: [ "EURange" ] } ) );
            translateResults.push( new ExpectedResults( { Expected: [ StatusCode.Good, StatusCode.BadNoMatch ] } ) );
        }
        if( TranslateBrowsePathsToNodeIdsHelper.Execute( { UaBrowsePaths: euBrowsePaths, OperationResults: translateResults } ) ) {
            var euRangeItems = [];
            for( var i=0; i<TranslateBrowsePathsToNodeIdsHelper.Response.Results.length; i++ ) {
                if( TranslateBrowsePathsToNodeIdsHelper.Response.Results[i].StatusCode.isGood() ) {
                    euRangeItems.push( new MonitoredItem( TranslateBrowsePathsToNodeIdsHelper.Response.Results[i].Targets[0].TargetId.NodeId ) );
                }//is good
            }//for i...
            if( euRangeItems.length > 0 ) {
                if( ReadHelper.Execute( { NodesToRead: euRangeItems } ) ) {
                    for( var i=0; i<ReadHelper.Response.Results.length; i++ ) {
                        AnalogItems[i].EURange = ReadHelper.Response.Results[i].Value.toExtensionObject().toRange();
                    }//for i
                }
            }
        }
    }
}