/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Bounds are received even when they do not exist. */

    // NOTE: AUG-28-2013: THIS SCRIPT IS UNTESTED

function readraw015() {
    // define our "invalid" start/end bounds and put them close to timestamps that actually exist 
    var startBoundValid   = CUVariables.Items[0].RawValues[0].SourceTimestamp;

    var haparams = { 
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: OPCF.HA.Analysis.Date.GenerateNew( { 
                                                                 StartDate:  CUVariables.Items[0].RawValues[0].SourceTimestamp,
                                                                 RawData:    CUVariables.Items[0].RawValues,
                                                                 OffsetHours: -24 } ),
                                    EndTime: CUVariables.Items[0].RawValues[4].SourceTimestamp, 
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: true } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };

    var result = true;

    // TEST 1 :start/end bounds are valid, one node per response, request bounds; read until EOF
    if( CUVariables.Debug ) print( "\nTEST ONE: startBound before history; endBound in history.\n" );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() #1 success expected." ) ) {
        if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.ResponseHeader.ServiceResult, "Service Result not Good! (TimestampsToReturn.Source)" ) ) result = false;
        if( !Assert.NotEqual( 0, HistoryReadHelper.Response.Results.length, "Wrong # of results returned.", "Correct # of results returned." ) ) result = false;
        else {
            // first record should be a bound which wasn't found 
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.BadBoundNotFound ), HistoryReadHelper.Response.Results[0].StatusCode, "Wrong Results[0].StatusCode.", "Correct Results[0].StatusCode." ) ) result = false;
            // subsequent tests on remaining records 
            for( var i=0; i<4; i++ ) if( !Assert.Equal(  CUVariables.Items[0].RawValues[i].SourceTimestamp, CUVariables.Items[0].Value[i].SourceTimestamp, "Wrong, Results[0].HistoryData[" + i + "] StatusCode.", "Correct StatusCode in Results[0].HistoryData[" + i + "]." ) ) result = false;
        }
    }
    else result = false;
    if( !Assert.Equal( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "Wrong, ContinuationPoint received when it should be the end of the record.", "Correct, ContinuationPoint not received." ) ) result = false;


    if( CUVariables.Debug ) print( "\nTEST TWO: startBound in history; endBound in future.\n" );
    haparams.HistoryReadDetails.StartDate = OPCF.HA.Analysis.Find.Date.Previous( { 
                                                             StartDate:  CUVariables.Items[0].LastValueInHistory.SourceTimestamp,
                                                             RawData:    CUVariables.Items[0].RawValues } ).SourceTimestamp,
    haparams.HistoryReadDetails.EndDate = OPCF.HA.Analysis.Date.GenerateNew( { 
                                                             StartDate:  CUVariables.Items[0].LastValueInHistory.SourceTimestamp,
                                                             RawData:    CUVariables.Items[0].RawValues,
                                                             OffsetHours: 24 } ),
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() #2 success expected." ) ) {
        if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.ResponseHeader.ServiceResult, "Service Result not Good! (TimestampsToReturn.Source)" ) ) result = false;
        if( !Assert.NotEqual( 0, HistoryReadHelper.Response.Results.length, "Wrong # of results returned.", "Correct # of results returned." ) ) result = false;
        else {
            // first record should be a bound which wasn't found 
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.BadBoundNotFound ), HistoryReadHelper.Response.Results[0].StatusCode, "Wrong Results[0].StatusCode.", "Correct Results[0].StatusCode." ) ) result = false;
            // subsequent tests on remaining records 
            var rawDataLen = CUVariables.Items[0].RawValues.length;
            for( var i=2; i>0; i-- ) if( !Assert.Equal(  CUVariables.Items[0].RawValues[rawDataLen-i].SourceTimestamp, CUVariables.Items[0].Value[i].SourceTimestamp, "Wrong, Results[0].HistoryData[" + i + "] StatusCode.", "Correct StatusCode in Results[0].HistoryData[" + i + "]." ) ) result = false;
        }
    }

    return( result );
}// function readraw015

Test.Execute( { Procedure: readraw015 } );