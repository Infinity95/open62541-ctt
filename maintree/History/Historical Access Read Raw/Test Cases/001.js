/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Request different timestamp combinations and check the server responds accordingly */

function readraw001() {
    var haparams = { 
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    EndTime: UaDateTime.utcNow(),
                                    NumValuesPerNode: 10, 
                                    ReturnBounds: false } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };

    var result = true;

    // test SOURCE timestamp first
    if( CUVariables.Debug ) print( "\nTEST 1: Source timestamp\n" );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() success expected." ) ) {
        if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.ResponseHeader.ServiceResult, "Service Result not Good! (TimestampsToReturn.Source)" ) ) result = false;
        if( !Assert.True( HistoryReadHelper.Response.Results[0].StatusCode.isGood(), "OperationResults[0] is not Good! (TimestampsToReturn.Source)" ) ) result = false;

        // now test SERVER timestamp
        if( CUVariables.Debug ) print( "\nTEST 2: Server timestamp\n" );
        haparams.TimestampsToReturn = TimestampsToReturn.Server;
        if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() success expected (TimestampsToReturn.Server)" ) ) {
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.ResponseHeader.ServiceResult, "Service Result not Good! (TimestampsToReturn.Server)" ) ) result = false;
            if( !Assert.StatusCodeIsOneOf( new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadTimestampNotSupported ] ), 
                                             HistoryReadHelper.Response.Results[0].StatusCode, 
                                             "OperationResults[0] is not Good! (TimestampsToReturn.Server)" ) ) result = false;
        }
        else result = false;
        
        // now test BOTH timestamps
        if( CUVariables.Debug ) print( "\nTEST 3: Both timestamps\n" );
        haparams.TimestampsToReturn = TimestampsToReturn.Both;
        if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() success expected (TimestampsToReturn.Both)" ) ) {
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.ResponseHeader.ServiceResult, "Service Result not Good! (TimestampsToReturn.Both)" ) ) result = false;
            if( !Assert.True( HistoryReadHelper.Response.Results[0].StatusCode.isGood(), "OperationResults[0] is not Good! (TimestampsToReturn.Both)" ) ) result = false;
        }
        else result = false;
    } else result = false;

    return( result );
}

Test.Execute( { Procedure: readraw001 } );