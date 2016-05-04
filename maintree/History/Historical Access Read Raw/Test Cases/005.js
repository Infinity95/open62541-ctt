/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specify Start and End dates where one or both dates go beyond the time-bounds of the data in the history database. */

function readraw005() { 
    var startTime = CUVariables.Items[0].FirstValueInHistory.SourceTimestamp.clone();
    startTime.addHours( -1 );
    var endTime = CUVariables.Items[0].FirstValueInHistory.SourceTimestamp.clone();
    endTime.addHours( 1 );

    var haparams = { 
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: startTime,
                                    EndTime: endTime,
                                    NumValuesPerNode: 10, 
                                    ReturnBounds: false } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };

    var result = true; // we assume the test will pass, all other logic below will reverse that if applicable

    // TEST ONE: initially, set the start/end times to be -1 to +1 hours at the start of history
    if( CUVariables.Debug ) print( "\nTEST 1\n" );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #1] success expected." ) ) {
        if( Assert.Equal( haparams.HistoryReadDetails.NumValuesPerNode, CUVariables.Items[0].Value.length, "Response did not return 10 value.", "10 values received, as expected." ) ) {
            if( !Assert.Equal( CUVariables.Items[0].FirstValueInHistory.SourceTimestamp, CUVariables.Items[0].Value[0].SourceTimestamp, "First record's timestamp '" + CUVariables.Items[0].Value[0].SourceTimestamp + "' does not match the requested StartDate '" + haparams.HistoryReadDetails.StartTime + "'.", "First record's timestamp '" + CUVariables.Items[0].Value[0].SourceTimestamp + "' matches the requested StartTime: " + haparams.HistoryReadDetails.StartTime ) ) result = false;
            if( !Assert.True( OPCF.HA.Analysis.Date.FlowsForward( { RawData: CUVariables.Items[0].Value } ), "Expected date order to be ascendending (oldest first). StartTime=" + haparams.HistoryReadDetails.StartTime + "; EndTime=" + haparams.HistoryReadDetails.EndTime + "." ) ) result = false;
        }
        else result = false;
    }// test 1
    else result = false;


    // TEST TWO: time-range before history
    if( CUVariables.Debug ) print( "\nTEST 2\n" );
    haparams.HistoryReadDetails.StartTime.addHours( -1 );
    haparams.HistoryReadDetails.EndTime = haparams.HistoryReadDetails.StartTime.clone();
    haparams.HistoryReadDetails.EndTime.addHours( 1 );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #2] success expected." ) ) {
        if( !Assert.Equal( 0, CUVariables.Items[0].Value.length, "No items expected.", "No items, as expected." ) ) result = false;
        if( !Assert.Equal( StatusCode.GoodNoData, HistoryReadHelper.Response.Results[0].StatusCode.StatusCode, "GoodNoData expected.", "GoodNoData, as expected." ) ) result = false;
    }// test 2
    else result = false;


    // TEST THREE: start=2h before history; end=null; #items=10.
    if( CUVariables.Debug ) print( "\nTEST 3\n" );
    haparams.HistoryReadDetails.EndTime = new UaDateTime();
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #3] success expected." ) ) {
        if( !Assert.Equal( haparams.HistoryReadDetails.NumValuesPerNode, CUVariables.Items[0].Value.length, "10 items expected.", "10 items, as expected." ) ) result = false;
        if( !Assert.True( CUVariables.Items[0].Value[0].StatusCode.isGood(), "Good expected.", "Good, as expected." ) ) result = false;
    }// test 3
    else result = false;
    

    // TEST FOUR: start=2h after oldest record; end=1h before history; #items=10
    if( CUVariables.Debug ) print( "\nTEST 4\n" );
    startTime = CUVariables.Items[0].FirstValueInHistory.SourceTimestamp.clone();
    startTime.addHours( 1 );
    endTime = CUVariables.Items[0].FirstValueInHistory.SourceTimestamp.clone();
    endTime.addHours( -1 );
    haparams.HistoryReadDetails.StartTime = startTime;
    haparams.HistoryReadDetails.EndTime = endTime;
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #4] success expected." ) ) {
        if( !Assert.Equal( haparams.HistoryReadDetails.NumValuesPerNode, CUVariables.Items[0].Value.length, "10 items expected.", "10 items, as expected." ) ) result = false;
        if( !Assert.True( OPCF.HA.Analysis.Date.FlowsBackward( { RawData: CUVariables.Items[0].Value } ), "Expected date order to be ascendending (oldest first). StartTime=" + haparams.HistoryReadDetails.StartTime + "; EndTime=" + haparams.HistoryReadDetails.EndTime + ".", "Data flows backwards, as expected." ) ) result = false;
    }// test 4
    else result = false;

    return( result ); // status of this test
}// readraw005()


Test.Execute( { Procedure: readraw005 } );