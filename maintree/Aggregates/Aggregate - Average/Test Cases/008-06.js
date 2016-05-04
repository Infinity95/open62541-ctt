/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Test #006: A boundary value exists. A range that contains bad quality data.
                            PercentDataGood=10; PercentDataBad=90. */

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
                          PercentDataBad:  90
                      } ) 
                  } ),
          TimestampsToReturn:    TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          AggregateDefinition: CUVariables.Aggregate,
          Debug: CUVariables.Debug };


    if( CUVariables.Debug ) print( "\nTEST ONE... Interval: " + haparams.HistoryReadDetails.ProcessingInterval + "\n" );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead success expected." ) ) {
        if( !Assert.True( OPCF.HA.Server.Execute( haparams ), "CTT built-in HA Server expected to succeed." ) ) result = false;
        else if( !Assert.True( OPCF.HA.Server.RecordsetsMatch( { Expected: CUVariables.Items[0].ValueCTT.DataValues, Actual: CUVariables.Items[0].Value, Debug: CUVariables.Debug } ), "Recordset mismatch. Server's response differs from the CTT's calculations based on the raw data that is currently cached." ) ) result = false;
    }
    else result = false;


    return( result );
} // function aggregateTest()

Test.Execute( { Procedure: aggregateTest } );