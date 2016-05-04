/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Test #001: Vary the number of items in the response. Do not validate data, just the # of records returned.
                            PercentDataGood=50; PercentDataBad=50. */

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
                          PercentDataGood: 50,
                          PercentDataBad:  50
                      } ) 
                  } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };

    // loop through each "duration" test...
    for( var i=0; i<durations.length; i++ ) {
        haparams.HistoryReadDetails.ProcessingInterval = durations[i];
        if( CUVariables.Debug) print( "\nTest " + (1+i) + ": ResampleInterval is " + DurationToString( haparams.HistoryReadDetails.ProcessingInterval ) );

        // invoke the call to the Server 
        if( !Assert.True( HistoryReadHelper.Execute( haparams ), "Expected HistoryRead success." ) ) {
            result = false;
            break;
        }
        else {
            // check each interval matches the request
            if( CUVariables.Debug ) print( "Checking intervals in recordset... Intervals = " + CUVariables.Items[0].Value.length );
            for( var m=0; m<(CUVariables.Items[0].Value.length-1); m++ ) {
                if( !Assert.DurationEquals( { Msecs: haparams.HistoryReadDetails.ProcessingInterval, StartTime: CUVariables.Items[0].Value[m].SourceTimestamp, EndTime: CUVariables.Items[0].Value[m+1].SourceTimestamp } ) ) { addError( "Interval #" + m + " is not correct." ); result = false; } 
                else if( CUVariables.Debug ) print( "Interval #" + m + " correct @ " + haparams.HistoryReadDetails.ProcessingInterval + "ms." );
            }// for m...

            // see if the returned data matches what the CTT estimated from the RAW data
            haparams.AggregateDefinition = CUVariables.Aggregate;
            if( !Assert.True( OPCF.HA.Server.Execute( haparams ), "CTT built-in HA Server expected to succeed." ) ) result = false;
            else if( !Assert.True( OPCF.HA.Server.RecordsetsMatch( { Expected: CUVariables.Items[0].ValueCTT.DataValues, Actual: CUVariables.Items[0].Value, Debug: CUVariables.Debug } ), "Recordset mismatch. Server's response differs from the CTT's calculations based on the raw data that is currently cached." ) ) result = false;
        }
    }//for i...


    return( result );
} // function aggregateTest()

Test.Execute( { Procedure: aggregateTest } );