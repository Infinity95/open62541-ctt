/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: deleteAtTime with multiple dates, some exist */

function deleteAtTimeTest() {
    // calculate a date where no data exists
    var invalidTime = CUVariables.Items[0].RawValues.FirstRecord().SourceTimestamp;
    var stopCount = 999;
    while( true && stopCount-- > 0 ) {
        invalidTime.addMilliSeconds( 739 );
        if( !OPCF.HA.Analysis.Exists.Date( { SourceTimestamp: invalidTime, RawData: CUVariables.Items[0].RawValues } ) ) break;
    }
    if( CUVariables.Debug ) print( "Found a timestamp (in cache) where no records exist: " + invalidTime + "." );


    CUVariables.HistoryUpdateParameters = { 
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: UaDeleteAtTimeDetails.New(
                                  { NodeId:   CUVariables.Items[0].NodeId,
                                    ReqTimes: [ CUVariables.Items[0].RawValues[0].SourceTimestamp,
                                                invalidTime,
                                                CUVariables.Items[0].RawValues[1].SourceTimestamp
                                                ] } ),
          OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.Good ) ] };

    // we have specified that the update is expected to be good, but we now need to go into the detailed 
    // results of that first request (remember, multiple requests can go into a single call)
    CUVariables.HistoryUpdateParameters.OperationResults[0].TransactionResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ),
                                                                                   new ExpectedAndAcceptedResults( StatusCode.BadNoData ),
                                                                                   new ExpectedAndAcceptedResults( StatusCode.Good ) ];
    var result = true;
    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;
    else CUVariables.ArchiveRecords( { Records: [ CUVariables.Items[0].RawValues[0], CUVariables.Items[0].RawValues[1] ] } );


    return( result );
}

Test.Execute( { Procedure: deleteAtTimeTest } );