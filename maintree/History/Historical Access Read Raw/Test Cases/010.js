/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Receiving bounds while checking dates, ordering, and rule 2 of 3 params specified. */

function readraw010() {
    var result = true;

    var haparams = { 
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    EndTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    NumValuesPerNode: 1, 
                                    ReturnBounds: true } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };


    // TEST 1: one timestamp
    if( CUVariables.Debug ) print( "\nTEST1 1: One timestamp, one record in response\n" );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #1 success expected." ) ) {
        if( !Assert.Equal( 1, CUVariables.Items[0].Value.length, "Wrong # of records returned.", "Correct # records returned." ) ) result = false;
        if( !Assert.Equal( CUVariables.Items[0].RawValues[0].SourceTimestamp, CUVariables.Items[0].Value[0].SourceTimestamp, "Wrong record received." ) ) result = false;
        if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.Results[0].StatusCode, "Wrong operation status code.", "Correct operation status code" ) ) result = false;
        if( !Assert.Equal( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "ContinuationPoint received by mistake.", "Correct, ContinuationPoint not received." ) ) result = false;
    }
    else result = false;


    // TEST 2: short time-span
    if( CUVariables.Debug ) print( "\nTEST 2: short timespan, 2 records in response\n" );
    haparams.HistoryReadDetails.EndTime = CUVariables.Items[0].RawValues[5].SourceTimestamp;
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #2 success expected." ) ) {
        if( !Assert.Equal( 5, CUVariables.Items[0].Value.length, "Wrong # of records returned.", "Correct # records returned." ) ) result = false;
        if( !Assert.Equal( CUVariables.Items[0].RawValues[0].SourceTimestamp, CUVariables.Items[0].Value[0].SourceTimestamp, "Wrong record received." ) ) result = false;
        if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.Results[0].StatusCode, "Wrong operation status code.", "Correct operation status code" ) ) result = false;
        if( Assert.NotEqual( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "Wrong, ContinuationPoint not received.", "Correct, ContinuationPoint received." ) ) {
            // ContinuationPoint received, read again.
            if( CUVariables.Debug ) print( "\nTEST 2 sub-test: issue continued HistoryRead using ContinuationPoint.\n" );
            for( var i=1; i<5; i++ ) {
                if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #2 continuation success expected." ) ) {
                    if( !Assert.Equal( 1, CUVariables.Items[0].Value.length, "Wrong # of records returned.", "Correct # records returned." ) ) result = false;
                    if( !Assert.NotEqual( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "ContinuationPoint received by mistake. Should be no more data given the EndTime.", "Correct, ContinuationPoint not received." ) ) result = false;
                    if( !Assert.Equal( CUVariables.Items[0].RawValues[i].SourceTimestamp, CUVariables.Items[0].Value[0].SourceTimestamp, "Wrong record received." ) ) result = false;
                }
                else result = false;
            }//for i...
        }
        else result = false;
    }
    else result = false;


    // TEST 3: reverse requested times
    if( CUVariables.Debug ) print( "\nTEST 3: reverse start/end time\n" );
    var tmp = haparams.HistoryReadDetails.StartTime.clone();
    haparams.HistoryReadDetails.StartTime = haparams.HistoryReadDetails.EndTime.clone();
    haparams.HistoryReadDetails.EndTime = tmp.clone();
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #3 success expected." ) ) {
        if( !Assert.Equal( 1, CUVariables.Items[0].Value.length, "Wrong # of records returned.", "Correct # records returned." ) ) result = false;
        if( !Assert.NotEqual( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "ContinuationPoint received by mistake. Should be no more data given the EndTime.", "Correct, ContinuationPoint not received." ) ) result = false;
        if( !Assert.Equal( haparams.HistoryReadDetails.StartTime, CUVariables.Items[0].Value[0].SourceTimestamp, "Wrong record received." ) ) result = false;
        if( Assert.NotEqual( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "Wrong, ContinuationPoint not received.", "Correct, ContinuationPoint received." ) ) {
            // ContinuationPoint received, read again.
            if( CUVariables.Debug ) print( "\nTEST 2 sub-test: issue continued HistoryRead using ContinuationPoint.\n" );
            for( var i=1; i<5; i++ ) {
                if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #2 continuation success expected." ) ) {
                    if( !Assert.Equal( 1, CUVariables.Items[0].Value.length, "Wrong # of records returned.", "Correct # records returned." ) ) result = false;
                    if( !Assert.NotEqual( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "ContinuationPoint received by mistake. Should be no more data given the EndTime.", "Correct, ContinuationPoint not received." ) ) result = false;
                    if( !Assert.Equal( CUVariables.Items[0].RawValues[i].SourceTimestamp, CUVariables.Items[0].Value[0].SourceTimestamp, "Wrong record received." ) ) result = false;
                }
                else result = false;
            }//for i...
        }
        else result = false;
    }
    else result = false;


    // TEST 4: one timestamp, now not the first timestamp!
    if( CUVariables.Debug ) print( "\nTEST 4: One timestamp, one record in response\n" );
    haparams.HistoryReadDetails.EndTime = haparams.HistoryReadDetails.StartTime.clone();
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #4 success expected." ) ) {
        if( !Assert.Equal( 1, CUVariables.Items[0].Value.length, "Wrong # of records returned.", "Correct # records returned." ) ) result = false;
        if( !Assert.Equal( haparams.HistoryReadDetails.EndTime, CUVariables.Items[0].Value[0].SourceTimestamp, "Wrong record received." ) ) result = false;
        if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.Results[0].StatusCode, "Wrong operation status code.", "Correct operation status code" ) ) result = false;
        if( !Assert.Equal( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "ContinuationPoint received by mistake.", "Correct, ContinuationPoint not received." ) ) result = false;
    }
    else result = false;


    return( result );
}// function readraw010

Test.Execute( { Procedure: readraw010 } );