/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: delete a known record */

function deleteValueTest() {
    CUVariables.HistoryUpdateParameters = { 
          HistoryUpdateDetails: UaDeleteRawModifiedDetails.New(
                                  { NodeId: CUVariables.Items[0],
                                    IsDeleteModified: false,
                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    EndTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp } ),
          Debug: CUVariables.Debug };

    var result = true;

    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;
    else CUVariables.ArchiveRecords( { Records: CUVariables.Items[0].RawValues, Number: 1 } );

    return( result );
}

Test.Execute( { Procedure: deleteValueTest } );