/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Multiple transactions in one call; specify transactions include DeleteRawModifiedDetails and DeleteAtTime.
                    [0] equivalent to test 001
                    [1] equivalent to test 006
                    [2] equivalent to test dat-001,
                    [3] equivalent to test err-001*/

function deleteAtTimeTest() {

    // timestamp where a record exists 
    var startTime = CUVariables.Items[0].RawModifiedValues[0].SourceTimestamp;
    var endTime = startTime.clone();

    // timestmap where a record DOES NOT exist
    var startTimeX = CUVariables.Items[0].RawValues.FirstRecord().SourceTimestamp;
    var stopCount = 999;
    while( true && stopCount-- > 0 ) {
        startTimeX.addSeconds( 1 );
        if( !OPCF.HA.Analysis.Exists.Date( { SourceTimestamp: startTimeX, RawData: CUVariables.Items[0].RawValues } ) ) break;
    }
    if( CUVariables.Debug ) print( "Found a timestamp (in cache) where no records exist: " + startTime + "." );


    CUVariables.HistoryUpdateParameters = { 
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: [ // delete raw modified: one valid record 
                                  UaDeleteRawModifiedDetails.New( { NodeId: CUVariables.Items[0],
                                                                    IsDeleteModified: false,
                                                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                                                    EndTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp } ),

                                  // delete a specific modified record)
                                  UaDeleteRawModifiedDetails.New( { NodeId: CUVariables.Items[0],
                                                                    IsDeleteModified: false,
                                                                    StartTime: startTime,
                                                                    EndTime: endTime } ),

                                  // deleteAtTime a known record 
                                  UaDeleteAtTimeDetails.New( { NodeId:   CUVariables.Items[0].NodeId,
                                                                                     ReqTimes: [ startTime ] } ),

                                  // delete a raw value where there is no value at the specified date
                                  UaDeleteRawModifiedDetails.New( { NodeId: CUVariables.Items[0],
                                                                    IsDeleteModified: false,
                                                                    StartTime: startTimeX,
                                                                    EndTime: startTimeX } ),
                                  
                                ],
          OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.Good ), 
                              new ExpectedAndAcceptedResults( StatusCode.Good ),
                              new ExpectedAndAcceptedResults( StatusCode.Good ),
                              new ExpectedAndAcceptedResults( StatusCode.BadNoData ) 
                            ] };

    // invoke the call
    var result = true;
    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;


    return( result );
}

Test.Execute( { Procedure: deleteAtTimeTest } );