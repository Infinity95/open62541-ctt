/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: delete data spanning midnight */

function deleteValueTest() {
    // do we have data that spans a day starting from the first cached record?
    var startTime = CUVariables.Items[0].RawValues.FirstRecord().SourceTimestamp;
    var endTime = CUVariables.Items[0].RawValues.LastRecord().SourceTimestamp;
    if( startTime.daysTo( endTime ) < 1 ) { addSkipped( "Data does not span midnight. Skipping test." ); return( true ); }

    // Find the last record in a day
    var startTime = OPCF.HA.Analysis.Find.Date.LastOnDay( { Date: startTime, RawData: CUVariables.Items[0].RawValues } );
    print( "First time on Day found: " + startTime );

    // Find the first record in the next day
    var nextDay = startTime.SourceTimestamp.clone();
    nextDay.addDays( 1 );
    endTime = OPCF.HA.Analysis.Find.Date.FirstOnDay( { Date: nextDay, RawData: CUVariables.Items[0].RawValues } );
    print( "Last time on Day found: " + endTime );


    // delete values that span midnight
    CUVariables.HistoryUpdateParameters = {
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: UaDeleteRawModifiedDetails.New(
                                  { NodeId: CUVariables.Items[0],
                                    IsDeleteModified: false,
                                    StartTime: startTime,
                                    EndTime: endTime } ) };

    var result = true;
    var recordsInRange = OPCF.HA.Analysis.Find.Date.Range( { RawData: CUVariables.Items[0].RawValues.parent, StartTime: CUVariables.HistoryUpdateParameters.HistoryUpdateDetails.StartTime, Hours: 1, Debug: CUVariables.Debug } );

    if( CUVariables.Debug ) print( "BEFORE TEST:\nNode[0] (" + CUVariables.Items[0].NodeId + ") has " + CUVariables.Items[0].RawValues.length + " raw values and " + CUVariables.Items[0].RawModifiedValues.length + " modified values." );
    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;
    else CUVariables.ArchiveRecords( { Records: recordsInRange } );


    // we asked for RAW data to be modified... if we do a read of RAW values then the range should be empty
    var myHistoryReadParameters = { 
          Debug: CUVariables.Debug,
          NodesToRead: CUVariables.Items[0],
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: startTime, 
                                    EndTime: endTime,
                                    NumValuesPerNode: 999, 
                                    ReturnBounds: false } ) };
    if( !HistoryReadHelper.Execute( myHistoryReadParameters ) ) result = false;
    else if( !Assert.Equal( 0, CUVariables.Items[0].ModifiedValues.length, "Raw values were found, but not expected in the time-range where we deleted records.", "No raw data found between '" + startTime + "' and '" + endTime + "'." ) ) result = false;


    // make sure now Modified data was NOT deleted
    myHistoryReadParameters.HistoryReadDetails.IsReadModified = true;
    if( !HistoryReadHelper.Execute( myHistoryReadParameters ) ) result = false;
    else {
        var expectedModifiedRecordsInRange = OPCF.HA.Analysis.Find.Date.Range( { RawData: CUVariables.Items[0].RawModifiedValues, StartTime: startTime, EndTime: endTime } );
        if( !Assert.Equal( expectedModifiedRecordsInRange.length, CUVariables.Items[0].ModifiedValues.length, "ModifiedValues have changed. The # of values detected does not match the # detected before testing (in initialize.js)", "Modified values appear to be OK (untouched)." ) ) result = false;
    }
    

    return( result );
}

Test.Execute( { Procedure: deleteValueTest } );