/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Read history between 2 non-existent dates: before/after history. */

function readrawErr019() {
    var result = true;
    var startTime = CUVariables.Items[0].FirstValueInHistory.SourceTimestamp;
    startTime.addHours( -( 24 * 365 * 100 ) ); // 100 years prior 
    var endTime = startTime.clone();
    endTime.addHours( 24 * 365 ); // 99 years prior 

    var haparams = {
          NodesToRead: CUVariables.Items[0],
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: startTime,
                                    EndTime: endTime,
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: false } ),
          Debug: CUVariables.Debug,
          ServiceResult: new ExpectedAndAcceptedResults( StatusCode.Good ) };

    if( CUVariables.Debug ) print( "\nTEST 1: before history\n" );
    if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #"+ (1+i) + "] ServiceResult 'Good' expected; error codes expected at the operation level." ) ) result = false;
    if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( [ StatusCode.BadBoundNotFound, StatusCode.BadBoundNotSupported ] ), 
                              HistoryReadHelper.Response.Results[0].StatusCode, 
                              "Status code is wrong.", 
                              "Status code is correct." ) ) result = false;


    if( CUVariables.Debug ) print( "\nTEST 2: after history\n" );
    startTime = UaDateTime.utcNow();
    startTime.addHours( 24 * 365 * 99 ); // 99 years ahead
    endTime = startTime.clone();
    endTime.addHours( 24 * 365 ); // 100 years ahead
    haparams.HistoryReadDetails.StartTime = startTime;
    haparams.HistoryReadDetails.EndTime = endTime;
    if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #"+ (1+i) + "] ServiceResult 'Good' expected; error codes expected at the operation level." ) ) result = false;
    if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( [ StatusCode.BadBoundNotFound, StatusCode.BadBoundNotSupported ] ), 
                              HistoryReadHelper.Response.Results[0].StatusCode, 
                              "Status code is wrong.", 
                              "Status code is correct." ) ) result = false;


    return( result );
}// function readrawErr019()

Test.Execute( { Procedure: readrawErr019 } );