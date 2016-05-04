/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request an indexRange that is out of bounds, on array-based nodes */

function readraw013() {
    var result = true;
    // can we do this test?
    var array2dItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.HAProfile.Arrays.TwoDs );
    if( array2dItems === null || array2dItems.length === 0 ) {
        addSkipped( "No historical items of type Array (2-dimensions) are configured in settings. Skipping test." );
        return( result );
    }

    var haparams = { 
          NodesToRead: array2dItems,
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    EndTime: UaDateTime.utcNow(),
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: false } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };

    // iterate through each indexRange test
    var indexRangeTests = [ "1:3,1:3", "1:3,2:4", "2:4,1:3" ];
    for( var t=0; t<indexRangeTests.length; t++ ) { 
        // configure the HA Read request by specifying the indexRange for each item
        for( var i=0; i<array2dItems.length; i++ ) haparams.NodesToRead[i].IndexRange = indexRangeTests[t];
        // invoke the call; we expect success!
        if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead success expected." ) ) result = false;
    }//for t...

    return( result );
}// function readraw013

Test.Execute( { Procedure: readraw013 } );