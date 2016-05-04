/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: A boundary value exists. A range that contains bad quality data.
                            PercentDataGood=10; PercentDataBad=10. */

function aggregateTest() { 
    var result = true;

    // do we have BAD values in our cache? if not then exit
    var item, found = null;
    for( var i=0; i<CUVariables.Items.length; i++ ) {
        item = CUVariables.Items[i];
        if( OPCF.HA.Analysis.Exists.BadQualityData( { RawData: item.RawValues } ) !== null ) { found = true; break; }
    }
    if( found == null ) { addSkipped( "No bad data exists in cache. Skipping test." ); return( true ); }

    // setup the dates that we'll use in our call(s)
    var startTime = CUVariables.Items[0].RawValues.FirstRecord().SourceTimestamp;
    var endTime = CUVariables.Items[0].RawValues.LastRecord().SourceTimestamp;

    // construct our HA request
    var haparams = { 
          NodesToRead: item,
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


    if( CUVariables.Debug ) print( "\nTEST ONE... Interval: " + haparams.HistoryReadDetails.ProcessingInterval + "\n" );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead success expected." ) ) result = false;


    return( result );
} // function aggregateTest()

Test.Execute( { Procedure: aggregateTest } );