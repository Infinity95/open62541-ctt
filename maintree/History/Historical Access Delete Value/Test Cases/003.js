/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: delete 1-day of data (records known to exist) */

function deleteValueTest() {
    var startTime = CUVariables.Items[0].FirstRecord().SourceTimestamp;
    var endTime = startTime.clone();
    endTime.addHours( 24 );
    endTime.addSeconds( -59 );

    CUVariables.HistoryUpdateParameters = {
          HistoryUpdateDetails: UaDeleteRawModifiedDetails.New(
                                  { NodeId: CUVariables.Items[0],
                                    IsDeleteModified: false,
                                    StartTime: startTime,
                                    EndTime: endTime } ),
          Debug: CUVariables.Debug };

    var result = true;
    var recordsInRange = OPCF.HA.Analysis.Find.Date.Range( { RawData: CUVariables.Items[0].RawValues.parent, StartTime: CUVariables.HistoryUpdateParameters.HistoryUpdateDetails.StartTime, Hours: 1, Debug: CUVariables.Debug } );

    if( CUVariables.Debug ) print( "BEFORE TEST:\nNode[0] (" + CUVariables.Items[0].NodeId + ") has " + CUVariables.Items[0].RawValues.length + " raw values." );
    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;
    else CUVariables.ArchiveRecords( { Records: recordsInRange } );

    // we asked for RAW data to be modified... if we do a read of RAW values then the range should be empty
    if( !HistoryReadHelper.Execute( CUVariables.HistoryReadParameters ) ) result = false;
    else if( !Assert.Equal( 0, CUVariables.Items[0].Value.length, "Raw values were found, but not expected, in the time-range where we deleted records.", "No raw data found between '" + startTime + "' and '" + endTime + "'." ) ) result = false;


    return( result );
}

Test.Execute( { Procedure: deleteValueTest } );