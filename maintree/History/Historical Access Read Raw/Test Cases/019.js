/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Request bounds and a max of 5 values */

function readraw019() {
    if( CUVariables.Items[0].RawValues.length < 5 ) { addSkipped( "Not enough values in history (cache). 5 records needed." ); return( false ); }

    var haparams = { 
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: new UaDateTime(),
                                    EndTime:   CUVariables.Items[0].LastValueInHistory.SourceTimestamp,
                                    NumValuesPerNode: 5,
                                    ReturnBounds: true } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };

    var result = true;

    if( CUVariables.Debug ) print( "\nTEST: request range having known BAD quality data\n" );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() success expected." ) ) {
        if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.ResponseHeader.ServiceResult, "Service Result not Good! (TimestampsToReturn.Source)" ) ) result = false;
        if( !Assert.True( HistoryReadHelper.Response.Results[0].StatusCode.isGood(), "OperationResults[0] is not Good! (TimestampsToReturn.Source)" ) ) result = false;

        // we expect 5 values: the endbound and the 4 before it
        if( !Assert.Equal( 5, CUVariables.Items[0].Value.length, "Wrong # records returned.", "Correct # records returned." ) ) result = false;
        else {
            // we expect the endbound to be received, so this simple loop will be work just fine.
            var iLen = CUVariables.Items[0].RawValues.length-1;
            for( var i=0; i<5; i++ ) {
                Assert.Equal( CUVariables.Items[0].RawValues[ iLen - i ].SourceTimestamp, CUVariables.Items[0].Value[i].SourceTimestamp, "Record #" + i + " incorrect.", "Record #" + i + " correct." );
            }//for i
        }

    } 
    else result = false;

    return( result );
}

readraw019();//Test.Execute( { Procedure: readraw019 } );