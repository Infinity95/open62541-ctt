/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Request both timestamps */

function servertstamp001() {
    var haparams = { 
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].LastValueInHistory.SourceTimestamp,
                                    EndTime: UaDateTime.utcNow(),
                                    NumValuesPerNode: 1, 
                                    ReturnBounds: false } ),
          TimestampsToReturn: TimestampsToReturn.Both,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };

    var result = true;

    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() success expected." ) ) {
        if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.ResponseHeader.ServiceResult, "Service Result not Good! (TimestampsToReturn.Source)" ) ) result = false;
        if( !Assert.True( HistoryReadHelper.Response.Results[0].StatusCode.isGood(), "OperationResults[0] is not Good! (TimestampsToReturn.Source)" ) ) result = false;
        if( !Assert.Equal( 1, CUVariables.Items[0].Value.length, "Wrong # of results returned." ) ) result = false;
        if( !Assert.NotEqual( new UaDateTime(), CUVariables.Items[0].Value[0].ServerTimestamp, "ServerTimestamp not provided." ) ) result = false;
    } 
    else result = false;

    return( result );
}

Test.Execute( { Procedure: servertstamp001 } );