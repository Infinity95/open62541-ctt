/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Start/end bound received when requested */

function readraw014() {
    const DATESKIP = 6;
    var haparams = { 
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    EndTime: CUVariables.Items[0].RawValues[DATESKIP].SourceTimestamp, 
                                    NumValuesPerNode: 1, 
                                    ReturnBounds: true } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };

    var result = true;

    // TEST 1: start/end bounds are valid, one node per response, request bounds; read until EOF
    if( CUVariables.Debug ) print( "\nTEST 1: valid bounds requested, one node per response\n" );
    for( var i=0; i<DATESKIP; i++ ) {
        if( CUVariables.Debug ) print( "\tIteration " + ( 1 + i ) + " of " + DATESKIP );
        if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() success expected." ) ) {
            if( !Assert.Equal( 1, HistoryReadHelper.Response.Results.length, "Wrong # of results returned.", "Correct # of results returned." ) ) result = false;
            if( !Assert.Equal( 1, CUVariables.Items[0].Value.length, "Wrong # of records returned.", "Correct # of records returned." ) ) result = false;
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.ResponseHeader.ServiceResult, "Service Result not Good! (TimestampsToReturn.Source)" ) ) result = false;
            if( !Assert.True( HistoryReadHelper.Response.Results[0].StatusCode.isGood(), "OperationResults[0] is not Good! (TimestampsToReturn.Source)" ) ) result = false;
            if( i < DATESKIP ) if( !Assert.GreaterThan( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "Wrong, no continuationPoint received.", "Correct, continuationPoint received." ) ) {
                result = false;
                break;
            }
        } else result = false;
    }
    if( !Assert.Equal( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "Wrong, ContinuationPoint received when it should be the end of the record.", "Correct, ContinuationPoint not received." ) ) result = false;


    // TEST 2: same, but now 2 values per response
    if( CUVariables.Debug ) print( "\nTEST 2: 2 values per response\n" );
    haparams.HistoryReadDetails.NumValuesPerNode = 2;
    for( var i=0; i<(DATESKIP/2); i++ ) {
        if( CUVariables.Debug ) print( "\tIteration " + ( 1 + i ) + " of " + (DATESKIP/2) );
        if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() success expected." ) ) {
            if( !Assert.Equal( 1, HistoryReadHelper.Response.Results.length, "Wrong # of results returned.", "Correct # of results returned." ) ) result = false;
            if( !Assert.Equal( 2, CUVariables.Items[0].Value.length, "Wrong # of records returned.", "Correct # of records returned." ) ) result = false;
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.ResponseHeader.ServiceResult, "Service Result not Good! (TimestampsToReturn.Source)" ) ) result = false;
            if( !Assert.True( HistoryReadHelper.Response.Results[0].StatusCode.isGood(), "OperationResults[0] is not Good! (TimestampsToReturn.Source)" ) ) result = false;
            if( i < (DATESKIP/2) ) if( !Assert.GreaterThan( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "Wrong, no continuationPoint received.", "Correct, continuationPoint received." ) ) {
                result = false;
                break;
            }
        } else result = false;
    }
    if( !Assert.Equal( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "Wrong, ContinuationPoint received when it should be the end of the record.", "Correct, ContinuationPoint not received." ) ) result = false;


    // TEST 3: no startTime, but now 1 values per response
    if( CUVariables.Debug ) print( "\nTEST 3: no startTime and 1 value per response\n" );
    haparams.HistoryReadDetails.StartTime = new UaDateTime();
    haparams.HistoryReadDetails.NumValuesPerNode = 1;
    for( var i=0; i<DATESKIP; i++ ) {
        if( CUVariables.Debug ) print( "\tIteration " + ( 1 + i ) + " of " + DATESKIP );
        if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() success expected." ) ) {
            if( !Assert.Equal( 1, HistoryReadHelper.Response.Results.length, "Wrong # of results returned.", "Correct # of results returned." ) ) result = false;
            if( !Assert.Equal( 1, CUVariables.Items[0].Value.length, "Wrong # of records returned.", "Correct # of records returned." ) ) result = false;
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.ResponseHeader.ServiceResult, "Service Result not Good! (TimestampsToReturn.Source)" ) ) result = false;
            if( !Assert.True( HistoryReadHelper.Response.Results[0].StatusCode.isGood(), "OperationResults[0] is not Good! (TimestampsToReturn.Source)" ) ) result = false;
            if( i < DATESKIP ) if( !Assert.GreaterThan( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "Wrong, no continuationPoint received.", "Correct, continuationPoint received." ) ) {
                result = false;
                break;
            }
        } else result = false;
    }
    

    // TEST 4: no startTime, but now 2 values per response
    if( CUVariables.Debug ) print( "\nTEST 4: no startTime and 2 values per response\n" );
    haparams.HistoryReadDetails.NumValuesPerNode = 2;
    for( var i=0; i<(DATESKIP/2); i++ ) {
        if( CUVariables.Debug ) print( "\tIteration " + ( 1 + i ) + " of " + (DATESKIP/2) );
        if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() success expected." ) ) {
            if( !Assert.Equal( 1, HistoryReadHelper.Response.Results.length, "Wrong # of results returned.", "Correct # of results returned." ) ) result = false;
            if( !Assert.Equal( 2, CUVariables.Items[0].Value.length, "Wrong # of records returned.", "Correct # of records returned." ) ) result = false;
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.ResponseHeader.ServiceResult, "Service Result not Good! (TimestampsToReturn.Source)" ) ) result = false;
            if( !Assert.True( HistoryReadHelper.Response.Results[0].StatusCode.isGood(), "OperationResults[0] is not Good! (TimestampsToReturn.Source)" ) ) result = false;
            if( i < (DATESKIP/2) ) if( !Assert.GreaterThan( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "Wrong, no continuationPoint received.", "Correct, continuationPoint received." ) ) {
                result = false;
                break;
            }
        } else result = false;
    }


    // TEST 5: no endTime, but now 1 value per response; expect data to flow backwards
    if( CUVariables.Debug ) print( "\nTEST 5: no endTime and 1 value per response\n" );
    haparams.HistoryReadDetails.EndTime = new UaDateTime();
    haparams.HistoryReadDetails.StartTime = CUVariables.Items[0].FirstValueInHistory.SourceTimestamp;
    haparams.HistoryReadDetails.NumValuesPerNode = 1;
    for( var i=0; i<DATESKIP; i++ ) {
        if( CUVariables.Debug ) print( "\tIteration " + ( 1 + i ) + " of " + DATESKIP );
        if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() success expected." ) ) {
            if( !Assert.Equal( 1, HistoryReadHelper.Response.Results.length, "Wrong # of results returned.", "Correct # of results returned." ) ) result = false;
            if( !Assert.Equal( 1, CUVariables.Items[0].Value.length, "Wrong # of records returned.", "Correct # of records returned." ) ) result = false;
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.ResponseHeader.ServiceResult, "Service Result not Good! (TimestampsToReturn.Source)" ) ) result = false;
            if( !Assert.True( HistoryReadHelper.Response.Results[0].StatusCode.isGood(), "OperationResults[0] is not Good! (TimestampsToReturn.Source)" ) ) result = false;
            if( i < DATESKIP ) if( !Assert.GreaterThan( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "Wrong, no continuationPoint received.", "Correct, continuationPoint received." ) ) {
                result = false;
                break;
            }
        } else result = false;
    }


    // TEST 6: same as before, 2 items per response
    if( CUVariables.Debug ) print( "\nTEST 6: no endTime and 2 values per response\n" );
    haparams.HistoryReadDetails.NumValuesPerNode = 2;
    for( var i=0; i<DATESKIP; i++ ) {
        if( CUVariables.Debug ) print( "\tIteration " + ( 1 + i ) + " of " + DATESKIP );
        if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() success expected." ) ) {
            if( !Assert.Equal( 1, HistoryReadHelper.Response.Results.length, "Wrong # of results returned.", "Correct # of results returned." ) ) result = false;
            if( !Assert.Equal( 2, CUVariables.Items[0].Value.length, "Wrong # of records returned.", "Correct # of records returned." ) ) result = false;
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.ResponseHeader.ServiceResult, "Service Result not Good! (TimestampsToReturn.Source)" ) ) result = false;
            if( !Assert.True( HistoryReadHelper.Response.Results[0].StatusCode.isGood(), "OperationResults[0] is not Good! (TimestampsToReturn.Source)" ) ) result = false;
            if( i < DATESKIP ) if( !Assert.GreaterThan( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "Wrong, no continuationPoint received.", "Correct, continuationPoint received." ) ) {
                result = false;
                break;
            }
        } else result = false;
    }


    // TEST 7: same as before, dates are reversed and numItemsToReturn is 1
    if( CUVariables.Debug ) print( "\nTEST 7: valid timestamps, in reverse, and 1 value per response\n" );
    haparams.HistoryReadDetails.NumValuesPerNode = 1;
    haparams.HistoryReadDetails.StartTime = CUVariables.Items[0].RawValues[DATESKIP].SourceTimestamp;
    haparams.HistoryReadDetails.EndTime = CUVariables.Items[0].RawValues[0].SourceTimestamp;
    for( var i=0; i<DATESKIP; i++ ) {
        if( CUVariables.Debug ) print( "\tIteration " + ( 1 + i ) + " of " + DATESKIP );
        if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() success expected." ) ) {
            if( !Assert.Equal( 1, HistoryReadHelper.Response.Results.length, "Wrong # of results returned.", "Correct # of results returned." ) ) result = false;
            if( !Assert.Equal( 1, CUVariables.Items[0].Value.length, "Wrong # of records returned.", "Correct # of records returned." ) ) result = false;
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.ResponseHeader.ServiceResult, "Service Result not Good! (TimestampsToReturn.Source)" ) ) result = false;
            if( !Assert.True( HistoryReadHelper.Response.Results[0].StatusCode.isGood(), "OperationResults[0] is not Good! (TimestampsToReturn.Source)" ) ) result = false;
            if( i < DATESKIP ) if( !Assert.GreaterThan( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "Wrong, no continuationPoint received.", "Correct, continuationPoint received." ) ) {
                result = false;
                break;
            }
        } else result = false;
    }


    // TEST 8: same as before, numItemsToReturn is 2
    if( CUVariables.Debug ) print( "\nTEST 8: valid timestamps, in reverse, and 2 values per response\n" );
    haparams.HistoryReadDetails.NumValuesPerNode = 2;
    for( var i=0; i<(DATESKIP/2); i++ ) {
        if( CUVariables.Debug ) print( "\tIteration " + ( 1 + i ) + " of " + (DATESKIP/2) );
        if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() success expected." ) ) {
            if( !Assert.Equal( 1, HistoryReadHelper.Response.Results.length, "Wrong # of results returned.", "Correct # of results returned." ) ) result = false;
            if( !Assert.Equal( 2, CUVariables.Items[0].Value.length, "Wrong # of records returned.", "Correct # of records returned." ) ) result = false;
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.ResponseHeader.ServiceResult, "Service Result not Good! (TimestampsToReturn.Source)" ) ) result = false;
            if( !Assert.True( HistoryReadHelper.Response.Results[0].StatusCode.isGood(), "OperationResults[0] is not Good! (TimestampsToReturn.Source)" ) ) result = false;
            if( i < (DATESKIP/2) ) if( !Assert.GreaterThan( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "Wrong, no continuationPoint received.", "Correct, continuationPoint received." ) ) {
                result = false;
                break;
            }
        } else result = false;
    }


    return( result );
}// function readraw014

Test.Execute( { Procedure: readraw014 } );