/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request BOTH timestamps; see if it works */

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
          TimestampsToReturn: TimestampsToReturn.Both,
          ReleaseContinuationPoints: false,
          ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadTimestampsToReturnInvalid ] ),
          Debug: CUVariables.Debug };

    // issue the call and check the result
    result = Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #1] success expected." );

    return( result );
}// function readrawErr001()

Test.Execute( { Procedure: readrawErr004 } );