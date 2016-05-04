/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: delete 1-hour of data (records known to exist) */

function deleteValueTest() {
    var startTime = CUVariables.Items[0].FirstRecord().SourceTimestamp;
    var endTime = startTime.clone();
    endTime.addHours( 1 );

    CUVariables.HistoryUpdateParameters = {
          HistoryUpdateDetails: UaDeleteRawModifiedDetails.New(
                                  { NodeId: CUVariables.Items[0],
                                    IsDeleteModified: false,
                                    StartTime: startTime,
                                    EndTime: endTime } ),
          Debug: CUVariables.Debug };

    var result = true;

    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;
    else CUVariables.ArchiveRecords( { Records: OPCF.HA.Analysis.Find.Date.Range( { RawData: CUVariables.Items[0].RawValues.parent, StartTime: CUVariables.HistoryUpdateParameters.HistoryUpdateDetails[0].StartTime, Hours: 1, Debug: CUVariables.Debug } ) } );

    return( result );
}

Test.Execute( { Procedure: deleteValueTest } );