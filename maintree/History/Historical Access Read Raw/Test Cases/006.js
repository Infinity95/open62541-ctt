/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Query history between dates where no history exists
    UA Spec References: Part 11: 6.4.3.2 Para 1 Sentence 4, Para 6 Sentence 1, Para 7 Sentence 1, Para 7 Sentence 2; 6.2.2 Table 17. */

function readraw005() { 
    var result = true;
    // first, we need some dates where we KNOW that there's no history between them.
    var startTime = OPCF.HA.Analysis.Date.GenerateNew( { RawData: CUVariables.Items[0].RawValues,
                                                         StartDate: CUVariables.Items[0].RawValues[0].SourceTimestamp,
                                                         OffsetMSEC: 105 } );
    var endTime   = OPCF.HA.Analysis.Date.GenerateNew( { RawData: CUVariables.Items[0].RawValues,
                                                         StartDate: CUVariables.Items[0].RawValues[1].SourceTimestamp,
                                                         OffsetMSEC: -105 } );

    if( CUVariables.Debug ) print( "Test: Searching for history between 2 dates where history is known to not exist.\n\tStart time: " + startTime + "\n\tEnd time: " + endTime );


    // assign the two generated dates to our HistoryRead request parameters
    var haparams = {
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: startTime,
                                    EndTime: endTime,
                                    NumValuesPerNode: 00, 
                                    ReturnBounds: false } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };


    // TEST ONE: no data between 2 timestamps; expect no results.
    if( CUVariables.Debug ) print( "\nTEST 1: no bounds\n" );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #1] success expected." ) ) {
        if( !Assert.Equal( 0, CUVariables.Items[0].Value.length, "Received history, none expected.", "0 values received, as expected." ) ) result = false;
        if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.GoodNoData ), 
                                  HistoryReadHelper.Response.Results[0].StatusCode, 
                                  "Wrong status code.", 
                                  "GoodNoData, as expected." ) ) result = false;
    }// test 1
    else result = false;


    // TEST TWO: same as before, but with bounds; 2 records expected: 1st=just before start time, 2nd=just after end time.
    if( CUVariables.Debug ) print( "\nTEST 2: with bounds\n" );
    haparams.HistoryReadDetails.ReturnBounds = true;
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #2] success expected." ) ) {
        if( Assert.Equal( 2, CUVariables.Items[0].Value.length, "Received more/less records than expected.", "2 records received, as expected." ) ) {
            if( !Assert.Equal( CUVariables.Items[0].RawValues[0].SourceTimestamp, CUVariables.Items[0].Value[0].SourceTimestamp, "First record should have been just before requested start time.", "First timestamp matches expectation." ) ) result = false;
            if( !Assert.Equal( CUVariables.Items[0].RawValues[1].SourceTimestamp, CUVariables.Items[0].Value[1].SourceTimestamp, "Second record should have been just after requested end time.", "Second timestamp matches expectation." ) ) result = false;
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), 
                                      HistoryReadHelper.Response.Results[0].StatusCode, 
                                      "Wrong status code.", 
                                      "Good, as expected." ) ) result = false;
        }
        else result = false;
    }// test 2
    else result = false;


    // TEST THREE: same as before, but without bounds; dates are reversed; expect data to flow backwards.
    if( CUVariables.Debug ) print( "\nTEST 3: without bounds, data flows backwards\n" );
    haparams.HistoryReadDetails.ReturnBounds = false;
    var tmp = haparams.HistoryReadDetails.StartTime.clone();
    haparams.HistoryReadDetails.StartTime = haparams.HistoryReadDetails.EndTime.clone();
    haparams.HistoryReadDetails.EndTime = tmp;
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #3] success expected." ) ) {
        if( Assert.Equal( 1, CUVariables.Items[0].Value.length, "Received more/less records than expected.", "1 record received, as expected." ) ) {
            if( !Assert.Equal( CUVariables.Items[0].RawValues[0].SourceTimestamp, CUVariables.Items[0].Value[0].SourceTimestamp, "First record should have been just before requested start time.", "First timestamp matches expectation." ) ) result = false;
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.GoodNoData ), 
                                      HistoryReadHelper.Response.Results[0].StatusCode, 
                                      "Wrong status code.", 
                                      "GoodNoData, as expected." ) ) result = false;
        }
        else result = false;
    }// test 3
    else result = false;


    // TEST FOUR: same as before, but with bounds.
    if( CUVariables.Debug ) print( "\nTEST 4: with bounds\n" );
    haparams.HistoryReadDetails.ReturnBounds = true;
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #4] success expected." ) ) {
        if( !Assert.Equal( 2, CUVariables.Items[0].Value.length, "2 records expected.", "2 records received, as expected." ) ) result = false;
        if( !Assert.True( OPCF.HA.Analysis.Date.FlowsBackward( { RawData: CUVariables.Items[0].Value } ), "Expected date order to be descendending (newest first). StartTime=" + haparams.HistoryReadDetails.StartTime + "; EndTime=" + haparams.HistoryReadDetails.EndTime + "." ) ) result = false;
        if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.GoodNoData ), 
                                  HistoryReadHelper.Response.Results[0].StatusCode, 
                                  "Wrong status code.", 
                                  "GoodNoData, as expected." ) ) result = false;
        if( CUVariables.Items[0].Value.length > 1 ) if( !Assert.Equal( CUVariables.Items[0].RawValues[0].SourceTimestamp, CUVariables.Items[0].Value[1].SourceTimestamp, "2nd result's source timestamp incorrect.", "2nd result's source timestamp correct." ) ) result = false;
    }// test 4
    else result = false;


    return( result );
}// function readraw005() 

Test.Execute( { Procedure: readraw005 } );