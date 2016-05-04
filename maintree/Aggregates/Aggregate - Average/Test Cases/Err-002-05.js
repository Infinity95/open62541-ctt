/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: A boundary value does not exist. Vary the processing interval.
                            PercentDataGood=10; PercentDataBad=10. */

function aggregateTest() { 
    var result = true;

    // setup the dates that we'll use in our call(s)
    var startTime = CUVariables.Items[0].RawValues.FirstRecord().SourceTimestamp;
    startTime.addHours( -5 );
    var endTime = CUVariables.Items[0].RawValues[5].SourceTimestamp;

    // construct our HA request
    var haparams = { 
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadProcessedDetails.New( { 
                  StartTime:  startTime, 
                  EndTime:    endTime,
                  ProcessingInterval: 10000, 
                  AggregateType: CUVariables.Aggregate.Type,
                  AggregateConfiguration: UaAggregateConfiguration.New( { 
                          PercentDataGood: 10,
                          PercentDataBad:  10
                      } ) 
                  } ),
          TimestampsToReturn:    TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          AggregateDefinition: CUVariables.Aggregate,
          OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadAggregateInvalidInputs ),
          Debug: CUVariables.Debug };


    // TEST 1: First interval starts before beginning boundary of history
    if( CUVariables.Debug ) print( "\nTEST ONE... Interval: " + haparams.HistoryReadDetails.ProcessingInterval + "\n" );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead (Test #1) fail expected." ) ) result = false;


    //loop through each of the intervals
    haparams.HistoryReadDetails.StartTime = CUVariables.Items[0].RawValues.LastRecord().SourceTimestamp;
    haparams.HistoryReadDetails.StartTime.addMilliSeconds( -50 );
    haparams.HistoryReadDetails.EndTime = haparams.HistoryReadDetails.StartTime.clone();
    haparams.HistoryReadDetails.EndTime.addHours( 5 );
    var intervals = [ 30000, 60000, 3000000 ];
    for( var i=0; i<intervals.length; i++ ) {

        // TEST 2: Second interval ends on the end boundary of history
        haparams.HistoryReadDetails.ProcessingInterval = intervals[i];
        if( CUVariables.Debug ) print( "\nTEST TWO...Interval: " + haparams.HistoryReadDetails.ProcessingInterval + "\n" );
        if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead (Test #2) fail expected." ) ) result = false;

    }// for i...


    return( result );
} // function aggregateTest()

Test.Execute( { Procedure: aggregateTest } );