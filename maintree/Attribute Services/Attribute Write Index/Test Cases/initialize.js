include( "./library/Base/assertions.js" );
include( "./library/Base/Objects/expectedResults.js" );
include( "./library/Base/Objects/monitoredItem.js" );
include( "./library/Base/safeInvoke.js" );
include( "./library/Base/indexRangeRelatedUtilities.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );
// include all library scripts specific to write tests
include( "./library/ServiceBased/AttributeServiceSet/Write/write_attribute.js" );
include( "./library/ServiceBased/AttributeServiceSet/Write/writeMask_writeValues.js" );
include( "./library/ServiceBased/Helpers.js" );

var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings, 0, Attribute.Value );
if( items === null || items.length === 0 ) {
    _dataTypeUnavailable.store( SETTING_UNDEFINED_SCALARARRAYS );
    stopCurrentUnit();
}
else {
    if( Test.Connect() ) {
        if( ReadHelper.Execute( { NodesToRead: items } ) ) {
            for( var i=0; i<items.length; i++ ) items[i].OriginalValue = items[i].Value.Value.clone();
            // now check the results and make sure that we have a sufficient number of elements within each
            // array. Remove any items that can't be used in testing
            var failSafe=0;
            var i=0;
            while( true ) {
                if( failSafe++ > 50 ){ break; }
                if( i >= items.length ) break;
                if( items[i].Value.Value.getArraySize() < 5 ) {
                    // remove the item from the collection
                    items.splice( i, 1 );
                    continue;
                }
                i++;
            }
        }
        Test.PostTestFunctions.push( revertToOriginalValues );
    }
}

function revertToOriginalValues() {
    print( "\n\n\n\nReverting Array scalar static nodes back to their original values." );
    var expectedResults = [];
    for( var i=0; i<items.length; i++ ) {
        // overwrite current value using the cloned original value
        items[i].Value.Value = items[i].OriginalValue.clone();
        // specify the element number that we want to write to 
        items[i].IndexRange = "";
        // set the expected results
        expectedResults[i] = new ExpectedAndAcceptedResults( StatusCode.Good );
        expectedResults[i].addExpectedResult( StatusCode.BadWriteNotSupported );
    }
    WriteHelper.Execute( { NodesToWrite:items, OperationResults:expectedResults, CheckNotSupported:true } );
}