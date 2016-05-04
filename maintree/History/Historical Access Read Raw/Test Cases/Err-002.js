/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: invalid timestampsToReturn */

function readrawErr002() {
    var result = true;

    var haparams = {
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    EndTime: CUVariables.Items[0].LastValueInHistory.SourceTimestamp,
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: false } ),
          TimestampsToReturn: TimestampsToReturn.Neither,
          ReleaseContinuationPoints: false,
          ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadInvalidTimestampArgument ),
          Debug: CUVariables.Debug };

    result = Assert.True( HistoryReadHelper.Execute( haparams ) );

    return( result );
}// function readrawErr001()

Test.Execute( { Procedure: readrawErr002 } );