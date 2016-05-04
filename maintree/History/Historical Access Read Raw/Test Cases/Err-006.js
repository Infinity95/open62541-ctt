/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Empty ReadRawModifiedDetails structure; expect BadHistoryOerationInvalid, or BadInvalidTimestampArgument. */

function readrawErr006() {
    var result = true;

    var haparams = {
          NodesToRead: CUVariables.Items[0],
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: new UaDateTime(),
                                    EndTime: new UaDateTime(),
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: false } ),
          Debug: CUVariables.Debug,
          ServiceResult: new ExpectedAndAcceptedResults( StatusCode.Good ) };

    // issue the call and check the result
    result = Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #1] ServiceResult 'Good' expected; error codes expected at the operation level." );
    if( result ) { 
        // operation result can be 1 of 2 codes: 
        if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( [ StatusCode.BadHistoryOperationInvalid, StatusCode.BadInvalidTimestampArgument ] ), 
                                  HistoryReadHelper.Response.Results[0].StatusCode, 
                                  "Results[0].StatusCode 'Good' expected.", 
                                  "Results[0].StatusCode 'Good' received, as expected." ) ) result = false;
    }

    return( result );
}// function readrawErr006()

Test.Execute( { Procedure: readrawErr006 } );