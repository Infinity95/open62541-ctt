/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Test #003: Span the boundary when history end. Vary the number of items in the response.
                            PercentDataGood=10; PercentDataBad=10. */

function aggregateTest() { 
    var result = true;

    // setup the dates that we'll use in our call(s)
    var startTime = CUVariables.Items[0].RawValues.LastRecord().SourceTimestamp;
    var endTime = OPCF.HA.Analysis.Date.GenerateNew( { StartDate:   CUVariables.Items[0].RawValues.LastRecord().SourceTimestamp, 
                                                       RawData:     CUVariables.Items[0].RawValues,
                                                       OffsetHours: 5 } );

    var intervals = [ 5000, 10000, 30000 ];

    // construct our HA request
    var haparams = { 
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadProcessedDetails.New( { 
                  StartTime:  startTime, 
                  EndTime:    endTime,
                  ProcessingInterval: intervals[0], 
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


    // TEST ONE: First interval spans the boundary of the end value 
    if( CUVariables.Debug ) print( "\nTEST ONE...\n" );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead (Test #1) fail expected." ) ) result = false;


    // TEST TWO: Vary interval
    if( CUVariables.Debug ) print( "\nTEST TWO...\n" );
    for( var i=1; i<intervals.length; i++ ) {
        haparams.HistoryReadDetails.ProcessingInterval = intervals[i];
        if( CUVariables.Debug ) print( "\tInterval: " + haparams.HistoryReadDetails.ProcessingInterval + " ms." );
        if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead (Test #2) fail expected." ) ) result = false;
    }//for i...


    // TEST THREE: Repeat test #2 but reverse the date order
    if( CUVariables.Debug ) print( "\nTEST THREE...\n" );
    var tmp = haparams.HistoryReadDetails.StartTime.clone();
    haparams.HistoryReadDetails.StartTime = haparams.HistoryReadDetails.EndTime.clone();
    haparams.HistoryReadDetails.EndTime = tmp.clone();
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead (Test #3) success expected." ) ) result = false;


    return( result );
} // function aggregateTest()

Test.Execute( { Procedure: aggregateTest } );