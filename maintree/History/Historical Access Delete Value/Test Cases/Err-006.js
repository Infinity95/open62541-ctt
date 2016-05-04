/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Invert the StartTime and EndTime parameters. See UA Part 11 -> 6.8.5 Para 1 Sen 3. */

function deleteValueTest() {
    var startTime = CUVariables.Items[0].RawValues.FirstRecord().SourceTimestamp;
    var endTime = OPCF.HA.Analysis.Find.Date.Next( { RawData: CUVariables.Items[0].RawValues } ).SourceTimestamp;

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