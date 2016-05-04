/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: invalid timestampsToReturn value */

function readrawErr003() {
    var result = true;

    var haparams = {
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    EndTime: CUVariables.Items[0].LastValueInHistory.SourceTimestamp,
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: false } ),
          TimestampsToReturn: 0x123,
          ReleaseContinuationPoints: false,
          ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadTimestampsToReturnInvalid ),
          Debug: CUVariables.Debug };

    result = Assert.True( HistoryReadHelper.Execute( haparams ) );

    return( result );
}// function readrawErr001()

Test.Execute( { Procedure: readrawErr003 } );