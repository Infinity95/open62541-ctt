/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request SERVER timestamp; see if it works */

function readrawErr004() {
    var result = true;

    var startTime = CUVariables.Items[0].FirstValueInHistory.SourceTimestamp;
    var haparams = {
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: startTime,
                                    EndTime: OPCF.HA.Analysis.Find.Date.Next( { RawData: CUVariables.Items[0].RawValues, 
                                                                                StartDate: startTime,
                                                                                Skip: 1 } ).SourceTimestamp,
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: false } ),
          TimestampsToReturn: TimestampsToReturn.Server,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };

    // issue the call and check the result
    result = Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #1] success expected." );
    if( result ) { 
        // if service result was good, then server supports the timestamp request; we expect data!
        // else, we expect BadTimestampNotSupported.
        if( HistoryReadHelper.Response.ResponseHeader.ServiceResult.isGood() ) {
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.Results[0].StatusCode, "Wrong status-code returned.", "Results[0].StatusCode 'Good' received, as expected." ) ) result = false;
            if( Assert.Equal( 1, CUVariables.Items[0].Value.length, "One record expected.", "One record received, as expected." ) ) {
                if( !Assert.Equal( CUVariables.Items[0].FirstValueInHistory.SourceTimestamp, CUVariables.Items[0].Value[0].SourceTimestamp, "Timestamp mismatch.", "Timestamp correct." ) ) result = false;
            }
            else result = false;
        }
        else Assert.Equal( StatusCode.BadTimestampNotSupported, HistoryReadHelper.Response.Results[0].StatusCode, "Wrong status-code returned.", "Correct status-code returned." );
    }

    return( result );
}// function readrawErr001()

Test.Execute( { Procedure: readrawErr004 } );