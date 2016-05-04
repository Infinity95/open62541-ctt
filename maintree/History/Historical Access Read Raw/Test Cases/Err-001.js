/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Empty request header; a number of status codes could be returned */

function readrawErr001() {
    var result = true;

    var haparams = {
          NodesToRead: new MonitoredItem( new UaNodeId() ),
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: new UaDateTime(),
                                    EndTime: new UaDateTime(),
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: false } ),
          TimestampsToReturn: TimestampsToReturn.Both,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };

    result = Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #1] fail expected." );
    if( result ) { 
        if( HistoryReadHelper.Response.ResponseHeader.ServiceResult.isGood() ) 
            if( !Assert.StatusCodeIsOneOf( new ExpectedAndAcceptedResults( StatusCode.BadNodeIdInvalid ), HistoryReadHelper.Response.Results[0].StatusCode, "Results[0].StatusCode wrong.", "Results[0].StatusCode correct." ) ) result = false;
        else
            if( !Assert.StatusCodeIsOneOf( new ExpectedAndAcceptedResults( [ StatusCode.BadNothingToDo, StatusCode.BadHistoryOperationInvalid, StatusCode.BadTimestampsToReturnInvalid, StatusCode.Good ] ), HistoryReadHelper.Response.ResponseHeader.ServiceResult, "ServiceResult is wrong.", "ServiceResult is correct." ) ) result = false;
    }

    return( result );
}// function readrawErr001()

Test.Execute( { Procedure: readrawErr001 } );