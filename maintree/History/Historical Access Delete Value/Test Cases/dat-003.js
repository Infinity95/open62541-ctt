/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: deleteAtTime with a date known to not contain history */

function deleteAtTimeTest() {
    // calculate a date where no data exists
    var startTime = CUVariables.Items[0].RawValues.FirstRecord().SourceTimestamp;
    var stopCount = 999;
    while( true && stopCount-- > 0 ) {
        startTime.addMilliSeconds( 739 );
        if( !OPCF.HA.Analysis.Exists.Date( { SourceTimestamp: startTime, RawData: CUVariables.Items[0].RawValues } ) ) break;
    }
    if( CUVariables.Debug ) print( "Found a timestamp (in cache) where no records exist: " + startTime + "." );


    CUVariables.HistoryUpdateParameters = { 
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: UaDeleteAtTimeDetails.New(
                                  { NodeId:   CUVariables.Items[0].NodeId,
                                    ReqTimes: [ startTime ] } ),
          OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.BadNoData ) ] };

    var result = true;
    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;


    return( result );
}

Test.Execute( { Procedure: deleteAtTimeTest } );