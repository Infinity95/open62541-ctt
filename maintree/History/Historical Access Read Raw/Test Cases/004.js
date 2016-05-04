/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Vary the start/end times while requesting bounds */

function readraw004() {
    var haparams = { 
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    EndTime: OPCF.HA.Analysis.Date.GenerateNew( { StartDate: CUVariables.Items[0].LastValueInHistory.SourceTimestamp, RawData: CUVariables.Items[0].RawValues, OffsetMSEC: -3 } ),
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: true } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };

    var result = true;

    // TEST ONE: start=valid; end=invalid.
    if( CUVariables.Debug ) print( "\nTEST 1\n" );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #1] success expected." ) ) {
        if( !Assert.Equal( haparams.HistoryReadDetails.StartTime, CUVariables.Items[0].Value[0].SourceTimestamp, "First record's timestamp '" + CUVariables.Items[0].Value[0].SourceTimestamp + "' does not match the requested StartDate '" + haparams.HistoryReadDetails.StartTime + "'.", "First record's timestamp '" + CUVariables.Items[0].Value[0].SourceTimestamp + "' matches the requested StartTime: " + haparams.HistoryReadDetails.StartTime ) ) result = false;
        if( !Assert.Equal( CUVariables.Items[0].RawValues.LastRecord().SourceTimestamp,
                      CUVariables.Items[0].LastValueInHistory.SourceTimestamp, 
                      "Last value's SourceTimestamp does not match expected result." ) ) result = false;
    }// test 1
    else result = false;


    // TEST TWO: start=invalid; end=valid.
    if( CUVariables.Debug ) print( "\nTEST 2\n" );
    haparams.HistoryReadDetails.StartTime = CUVariables.Items[0].FirstValueInHistory.SourceTimestamp.clone();
    haparams.HistoryReadDetails.StartTime.addDays( -7 ); // timestamp 1-week before history
    haparams.HistoryReadDetails.EndTime = OPCF.HA.Analysis.Find.Date.Next( { 
            RawData: CUVariables.Items[0].RawValues,
            StartDate: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
            Skip: 1 } ).SourceTimestamp;
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #2] success expected." ) ) {
        // first record has the start time (start bound), but is not found so returns BadBoundNotFound
        if( !Assert.Equal( haparams.HistoryReadDetails.StartTime, CUVariables.Items[0].FirstRecord().SourceTimestamp, "ReadHistory.Response.Results[0].HistoryData[0].SourceTimestamp mismatch. Expected requested Start Bound.", "Requested Start Bound returned as expected" ) ) result = false;
        if( !Assert.Equal( "0x80D70000", UaStatusCode.ToHexString( CUVariables.Items[0].FirstRecord().StatusCode.StatusCode ), "ReadHistory.Response.Results[0].StatusCode did not return 'BadBoundNotFound'", "'BadBoundNotFound' returned as expected" ) ) result = false;
    }// test 2
    else result = false;


    // TEST THREE: start=invalid; end=invalid
    if( CUVariables.Debug ) print( "\nTEST 3\n" );
    haparams.HistoryReadDetails.EndTime = CUVariables.Items[0].FirstValueInHistory.SourceTimestamp.clone();
    haparams.HistoryReadDetails.EndTime.addDays( -5 ); // timestamp 5-days before history
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #3] success expected." ) ) {
        if( Assert.Equal( 2, CUVariables.Items[0].Value.length, "Expected 2 values to be returned, StartBound and EndBound.", "Both Start/End bounds received as expected." ) ) {
            // first record has the start time (start bound), but is not found so returns BadBoundNotFound
            if( !Assert.Equal( haparams.HistoryReadDetails.StartTime, CUVariables.Items[0].FirstRecord().SourceTimestamp, "ReadHistory.Response.Results[0].HistoryData[0].SourceTimestamp mismatch. Expected requested Start Bound.", "Requested Start Bound returned as expected" ) ) result = false;
            if( !Assert.Equal( "0x80D70000", UaStatusCode.ToHexString( CUVariables.Items[0].FirstRecord().StatusCode.StatusCode ), "ReadHistory.Response.Results[0].StatusCode did not return 'BadBoundNotFound'", "'BadBoundNotFound' Start Bound returned as expected" ) ) result = false;
            // last record is also available (end bound) and also BadBoundNotFound
            if( !Assert.Equal( haparams.HistoryReadDetails.EndTime, CUVariables.Items[0].LastRecord().SourceTimestamp, "ReadHistory.Response.Results[0].HistoryData[last].SourceTimestamp mismatch. Expected requested End Bound.", "Requested End Bound returned as expected" ) ) result = false;
            if( !Assert.Equal( "0x80D70000", UaStatusCode.ToHexString( CUVariables.Items[0].LastRecord().StatusCode.StatusCode ), "ReadHistory.Response.Results[0].HistoryData[last].StatusCode did not return 'BadBoundNotFound'", "'BadBoundNotFound' End Bound returned as expected" ) ) result = false;
        }
        else result = faulse;
    }// test 3
    else result = false;


    // TEST FOUR: start=invalid; end=null
    if( CUVariables.Debug ) print( "\nTEST 3\n" );
    haparams.HistoryReadDetails.EndTime = new UaDateTime();
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #3] success expected." ) ) {
        // needs review from the CMPWG because this step is flawed
    }// test 4
    else result = false;

    if( CUVariables.Debug ) print( "\n\nEND OF TEST\n" );
    return( result );
}

Test.Execute( { Procedure: readraw004 } );