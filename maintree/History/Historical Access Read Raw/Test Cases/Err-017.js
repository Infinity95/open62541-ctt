/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request Bounds when reading Modified values (bounds not allowed)
    See: UA Part 11 section 6.4.3.3 paragraph 2 */

function readrawErr017() {
    var startTime = CUVariables.Items[0].FirstValueInHistory.SourceTimestamp;
    var haparams = {
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: true,
                                    StartTime: startTime,
                                    EndTime: OPCF.HA.Analysis.Find.Date.Next( { RawData: CUVariables.Items[0].RawValues, 
                                                                                StartDate: startTime,
                                                                                Skip: 1 } ).SourceTimestamp,
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: true } ),
          TimestampsToReturn: TimestampsToReturn.Both,
          ReleaseContinuationPoints: false,
          OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadInvalidArgument ),
          Debug: CUVariables.Debug };

    // issue the call and check the result
    var result = Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #1] success expected." );

    return( result );
}// function readrawErr017()

Test.Execute( { Procedure: readrawErr017 } );