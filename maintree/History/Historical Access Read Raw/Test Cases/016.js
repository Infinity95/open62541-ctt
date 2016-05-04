/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: 5 records received when 5 are requested. StartTime specified, but not EndTime. */
    
function readraw016() {
    const NUMVALUESPERNODE = 5;
    var haparams = { 
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    EndTime: new UaDateTime(), 
                                    NumValuesPerNode: NUMVALUESPERNODE, 
                                    ReturnBounds: true } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };

    var result = true;

    // start/end bounds are valid, one node per response, request bounds; read until EOF
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() success expected." ) ) {
        if( !Assert.Equal( 1, HistoryReadHelper.Response.Results.length, "Wrong # of results returned.", "Correct # of results returned." ) ) result = false;
        if( !Assert.Equal( NUMVALUESPERNODE, CUVariables.Items[0].Value.length, "Wrong # of records returned.", "Correct # of records returned." ) ) result = false;
        if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.ResponseHeader.ServiceResult, "Service Result not Good! (TimestampsToReturn.Source)" ) ) result = false;
        if( !Assert.True( HistoryReadHelper.Response.Results[0].StatusCode.isGood(), "OperationResults[0] is not Good! (TimestampsToReturn.Source)" ) ) result = false;
    } else result = false;
    if( !Assert.Equal( 0, HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "Wrong, ContinuationPoint received when it should be the end of the record.", "Correct, ContinuationPoint not received." ) ) result = false;


    return( result );
}// function readraw016

Test.Execute( { Procedure: readraw016 } );