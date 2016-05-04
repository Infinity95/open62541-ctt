/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: delete a specific modified record */

function deleteValueTest() {
    // do we have data that spans a day starting from the first cached record?
    if( CUVariables.Items[0].RawModifiedValues.length < 1 ) { addSkipped( "No modified values detected. Skipping test." ); return( true ); }

    // create our request of the specific timestamp
    var startTime = CUVariables.Items[0].RawModifiedValues[0].SourceTimestamp;
    var endTime = startTime.clone();
    CUVariables.HistoryUpdateParameters = {
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: UaDeleteRawModifiedDetails.New(
                                  { NodeId: CUVariables.Items[0],
                                    IsDeleteModified: false,
                                    StartTime: startTime,
                                    EndTime: endTime } ) };

    // capture the modified records (currently in cache) that we think we'll need to put-back after the test
    var result = true;
    var recordsInRange = OPCF.HA.Analysis.Find.Date.Range( { RawData: CUVariables.Items[0].RawModifiedValues, StartTime: CUVariables.HistoryUpdateParameters.HistoryUpdateDetails.StartTime, Hours: 1, Debug: CUVariables.Debug } );

    // execute the delete
    if( CUVariables.Debug ) print( "BEFORE TEST:\nNode[0] (" + CUVariables.Items[0].NodeId + ") has " + CUVariables.Items[0].RawModifiedValues.length + " modified values." );
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


    return( result );
}

Test.Execute( { Procedure: deleteValueTest } );