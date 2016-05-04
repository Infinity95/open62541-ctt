/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Start/End times do not contain history. Vary the ordering. */

function readraw003() {
    // set the start time to be 1 minute before history; end time to be 2nd date in history
    var startTime = CUVariables.Items[0].LastValueInHistory.SourceTimestamp;
    var endTime = startTime.clone();
    endTime.addMilliSeconds( 3 );

    var haparams = { 
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: startTime,
                                    EndTime: endTime,
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: false } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };

    var result = true;

    // TEST ONE: start=valid; end=invalid.
    if( CUVariables.Debug ) print( "\n\nTEST 1\n" );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #1] success expected." ) ) {
        Assert.Equal( CUVariables.Items[0].LastValueInHistory.SourceTimestamp, CUVariables.Items[0].Value[0].SourceTimestamp, "SourceTimestamp expected to be the last in history.", "Last SourceTimestamp in history received as expected." );
        if( Assert.True( OPCF.HA.Analysis.Date.FlowsForward( { RawData: CUVariables.Items[0].Value } ), "Expected date order to be ascendending (oldest first). StartTime=" + haparams.HistoryReadDetails.StartTime + "; EndTime=" + haparams.HistoryReadDetails.EndTime + "." ) ) print( "Data flows forwards!" );
        else result = false;
    }// test 1
    else result = false;


    // TEST TWO: start=invalid; end=valid.
    if( CUVariables.Debug ) print( "\n\nTEST 2\n" );
    startTime = CUVariables.Items[0].FirstValueInHistory.SourceTimestamp.clone();
    startTime.addMilliSeconds( -3 )
    haparams.HistoryReadDetails.StartTime = startTime;
    haparams.HistoryReadDetails.EndTime = OPCF.HA.Analysis.Find.Date.Next( { Skip: 2, RawData: CUVariables.Items[0].RawValues } ).SourceTimestamp;
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #2] success expected." ) ) {
        if( !Assert.Equal( CUVariables.Items[0].FirstValueInHistory.SourceTimestamp, CUVariables.Items[0].Value[0].SourceTimestamp, "SourceTimestamp expected to be the first in history.", "First SourceTimestamp in history received as expected." ) ) result = false;
        if( Assert.True( OPCF.HA.Analysis.Date.FlowsForward( { RawData: CUVariables.Items[0].Value } ), "Expected date order to be ascendending (oldest first). StartTime=" + haparams.HistoryReadDetails.StartTime + "; EndTime=" + haparams.HistoryReadDetails.EndTime + "." ) ) print( "Data flows forwards!" );
        else result = false;
    }// test 2
    else result = false;


    // TEST THREE: start=invalid; end=invalid
    if( CUVariables.Debug ) print( "\n\nTEST 3\n" );
    haparams.HistoryReadDetails.StartTime = OPCF.HA.Analysis.Date.GenerateNew( { StartDate: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp, RawData: CUVariables.Items[0].RawValues } );
    haparams.HistoryReadDetails.EndTime   = OPCF.HA.Analysis.Date.GenerateNew( { StartDate: CUVariables.Items[0].LastValueInHistory.SourceTimestamp, RawData: CUVariables.Items[0].RawValues, OffsetMSEC: -3 } );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #3] success expected." ) ) {
        if( !Assert.GreaterThan( haparams.HistoryReadDetails.StartTime, CUVariables.Items[0].Value[0].SourceTimestamp, "SourceTimestamp expected to be newer than the start date", "SourceTimestamp is newer than the start date, as expected" ) ) result = false;
        if( !Assert.Equal( OPCF.HA.Analysis.Find.Date.Next( { StartDate: haparams.HistoryReadDetails.StartTime, RawData: CUVariables.Items[0].RawValues } ).SourceTimestamp, CUVariables.Items[0].Value[0].SourceTimestamp, "First SourceTimestamp received should be AFTER the requested (" + haparams.HistoryReadDetails.StartTime + ") timestamp", "First record SourceTimestamp correct." ) ) result = false;
        if( !Assert.LessThan( haparams.HistoryReadDetails.EndTime, CUVariables.Items[0].LastRecord().SourceTimestamp, "Last record's SourceTimestamp should be before the EndTime.", "Last record's SourceTimestamp is newer than the EndTime, as expected." ) ) result = false;
    }// test 3
    else result = false;

    return( result );
}

Test.Execute( { Procedure: readraw003 } );