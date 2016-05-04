/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Delete a range of data and invert the StartTime and EndTime parameters. See UA Part 11 -> 6.8.5 Para 1 Sen 3. */

function deleteValueTest() {
    var startTime = CUVariables.Items[0].RawValues.FirstRecord().SourceTimestamp;
    var endTime = OPCF.HA.Analysis.Find.Date.Next( { RawData: CUVariables.Items[0].RawValues, Skip: 3 } ).SourceTimestamp;

    CUVariables.HistoryUpdateParameters = {
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: UaDeleteRawModifiedDetails.New(
                                  { NodeId: CUVariables.Items[0].NodeId,
                                    IsDeleteModified: false,
                                    StartTime: startTime,
                                    EndTime: endTime } ),
          OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.BadInvalidArgument ) ] };

    var result = true;
    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;


    return( result );
}

Test.Execute( { Procedure: deleteValueTest } );