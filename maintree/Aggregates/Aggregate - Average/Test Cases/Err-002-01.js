/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Test #001: Vary the number of items in the response. Do not validate data, just the # of records returned.
                            PercentDataGood=10; PercentDataBad=10. */

function aggregateTest() { 
    var result = true;
    var durations = [ 5000, 30000, 60000, 300000 ]; // milliseconds

    var haparams = { 
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadProcessedDetails.New( { 
                  StartTime: CUVariables.Items[0].FirstValueInHistory.ServerTimestamp, 
                  EndTime: CUVariables.Items[0].LastValueInHistory.ServerTimestamp,
                  ProcessingInterval: 0, 
                  AggregateType: CUVariables.Aggregate.Type,
                  AggregateConfiguration: UaAggregateConfiguration.New( { 
                          PercentDataGood: 10,
                          PercentDataBad:  10
                      } ) 
                  } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadAggregateInvalidInputs ),
          Debug: CUVariables.Debug };

    // loop through each "duration" test...
    for( var i=0; i<durations.length; i++ ) {
        haparams.HistoryReadDetails.ProcessingInterval = durations[i];
        if( CUVariables.Debug) print( "\nTest " + (1+i) + ": ResampleInterval is " + DurationToString( haparams.HistoryReadDetails.ProcessingInterval ) );

        // invoke the call to the Server 
        if( !Assert.True( HistoryReadHelper.Execute( haparams ), "Expected HistoryRead to fail." ) ) {
            result = false;
            break;
        }
    }//for i...


    return( result );
} // function aggregateTest()

Test.Execute( { Procedure: aggregateTest } );