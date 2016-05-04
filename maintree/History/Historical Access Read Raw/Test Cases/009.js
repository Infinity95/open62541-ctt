/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: ContinuationPoint maintained throughout process. Date order is descending. */

function readraw009() {
    var result = true;

    var haparams = { 
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].LastValueInHistory.SourceTimestamp,
                                    EndTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    NumValuesPerNode: 1, 
                                    ReturnBounds: false } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };

    // we have a set of data cached; now read through our database one record at a time forcing the use
    // of a continuation point. We will automate this via a loop, which will iterate one-less than it should
    // as the last iteration requires different analysis and verification.
    var testLength = CUVariables.Items[0].RawValues.length;
    for( var i=1; i<testLength; i++ ) {
        if( CUVariables.Debug ) print( "\nTEST " + i + " of " + testLength + "\n" );
        if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #" + i + "] success expected." ) ) {
            if( !Assert.Equal( 1, CUVariables.Items[0].Value.length, "Wrong # of records returned.", "Correct # records returned." ) ) result = false;
            if( !Assert.Equal( CUVariables.Items[0].RawValues[testLength-i].SourceTimestamp, CUVariables.Items[0].Value[0].SourceTimestamp, "Wrong record received." ) ) result = false;
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.Results[0].StatusCode, "Wrong operation status code.", "Correct operation status code" ) ) result = false;
            if( !Assert.NotEqual(0,  HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "ContinuationPoint not received.", "Correct, ContinuationPoint received." ) ) result = false;
            if( !Assert.True( OPCF.HA.Analysis.Date.FlowsBackward( { RawData: CUVariables.Items[0].Value } ), "Expected date order to be descendending (newest first). StartTime=" + haparams.HistoryReadDetails.StartTime + "; EndTime=" + haparams.HistoryReadDetails.EndTime + ".", "Data flows backwards, as expected." ) ) result = false;
        }// test 1
        else result = false;
    }//for i...


    // Last read, to close-out the read; not expecting a CP.
    if( CUVariables.Debug ) print( "\nTEST " + CUVariables.Items[0].RawValues.length + " of " + testLength + "\n" );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #" + CUVariables.Items[0].RawValues.length + "] success expected." ) ) {
        if( !Assert.Equal( 1, CUVariables.Items[0].Value.length, "Wrong # of records returned.", "Correct # records returned." ) ) result = false;
        if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.Results[0].StatusCode, "Wrong operation status code.", "Correct operation status code" ) ) result = false;
        if( !Assert.Equal(0,  HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "ContinuationPoint received.", "Correct, ContinuationPoint not received." ) ) result = false;
    }// test 1
    else result = false;
    

    // release the continuationPoint.
    if( HistoryReadHelper.Response.Results[0].ContinuationPoint.length > 0 ) {
        if( CUVariables.Debug ) print( "\nCLEAN UP: Release ContinuationPoint\n" );
        haparams.ReleaseContinuationPoints = true;
        if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [release CP] success expected." ) ) {
            if( !Assert.Equal( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "ContinuationPoint received.", "Correct, ContinuationPoint not received." ) ) result = false;    
            if( !Assert.Equal( 0, HistoryReadHelper.Response.Results.length, "No results expected", "No results received; correct!" ) ) result = false;
        }
        else result = false;
    }
    else if( CUVariables.Debug ) print( "\nNo ContinuationPoint to clear." );


    return( result );
}// function readraw009()

Test.Execute( { Procedure: readraw009 } );