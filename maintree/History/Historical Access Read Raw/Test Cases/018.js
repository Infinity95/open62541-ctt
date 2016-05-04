/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Request range that has known UNCERTAIN quality data */

function readraw018() {
    var uncertainQualityTimestamp = OPCF.HA.Analysis.Find.Date.First( { Filter: "uncertain", RawData: CUVariables.Items[0].RawValues } ).SourceTimestamp;
    if( uncertainQualityTimestamp.equals( new UaDateTime() ) ) {
        addSkipped( "No UNCERTAIN Quality data detected in recordset (cached in CTT). Aborting test." );
        return( true );
    }

    var haparams = { 
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: OPCF.HA.Analysis.Find.Date.Previous( { 
                                                StartDate: uncertainQualityTimestamp,
                                                RawData: CUVariables.Items[0].RawValues } ).SourceTimestamp,
                                    EndTime: OPCF.HA.Analysis.Find.Date.Next( { 
                                                StartDate: uncertainQualityTimestamp,
                                                RawData: CUVariables.Items[0].RawValues } ).SourceTimestamp,
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: true } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };

    var result = true;

    if( CUVariables.Debug ) print( "\nTEST: request range having known UNCERTAIN quality data\n" );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() success expected." ) ) {
        if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.ResponseHeader.ServiceResult, "Service Result not Good! (TimestampsToReturn.Source)" ) ) result = false;
        if( !Assert.True( HistoryReadHelper.Response.Results[0].StatusCode.isGood(), "OperationResults[0] is not Good! (TimestampsToReturn.Source)" ) ) result = false;

        // we expect 3 values: good, bad, good
        if( !Assert.Equal( 3, CUVariables.Items[0].Value.length, "Wrong # records returned.", "Correct # records returned." ) ) result = false;
        else {
            if( !Assert.Equal( haparams.HistoryReadDetails.StartTime, CUVariables.Items[0].Value[0].SourceTimestamp, "Wrong record #1 timestamp.", "Correct record #1 timestamp." ) ) result = false;
            if( !Assert.Equal( uncertainQualityTimestamp,             CUVariables.Items[0].Value[1].SourceTimestamp, "Wrong record #2 timestamp.", "Correct record #2 timestamp." ) ) result = false;
            if( !Assert.True ( CUVariables.Items[0].Value[1].StatusCode.isUncertain(), "Not 'UNCERTAIN', record #2 StatusCode.", "Correct StatusCode (uncertain) record #2." ) ) result = false;
            if( !Assert.Equal( haparams.HistoryReadDetails.EndTime,   CUVariables.Items[0].Value[2].SourceTimestamp, "Wrong record #3 timestamp.", "Correct record #3 timestamp." ) ) result = false;
        }

    } 
    else result = false;

    return( result );
}

Test.Execute( { Procedure: readraw018 } );