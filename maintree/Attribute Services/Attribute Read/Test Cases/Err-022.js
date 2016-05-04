/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Read a Node of each basic core Array data type. Specify an IndexRange that is invalid, i.e. "2-4" (the '-' symbol is invalid).
        We expect operation level results of: Bad_IndexRangeInvalid. */

function read581Err025() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings, 0 );
    if( items === null || items.length === 0 ) {
        addSkipped( SETTING_UNDEFINED_SCALARARRAYS );
        return( false );
    }

    var expectedResults = [];
    for( var i=0; i<items.length; i++ ) {
        expectedResults[i] = new ExpectedAndAcceptedResults( StatusCode.BadIndexRangeInvalid );
        items[i].IndexRange = "2-4";
    }

    return( ReadHelper.Execute( { NodesToRead: items, OperationResults: expectedResults, } ) );
}

Test.Execute( { Procedure: read581Err025 } );