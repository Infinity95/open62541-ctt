/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: deleteAtTime multiple known records */

function deleteAtTimeTest() {
    CUVariables.HistoryUpdateParameters = { 
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: UaDeleteAtTimeDetails.New(
                                  { NodeId:   CUVariables.Items[0].NodeId,
                                    ReqTimes: [ ] } ),
          OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.Good ) ] };

    // using our cache, specify the timestamps to delete and also
    // cache the records so that we can restore them after the delete.
    var archiveRecords = [];
    for( var i=0; i<3; i++ ) {
        archiveRecords.push( CUVariables.Items[0].RawValues[i].clone() );
        CUVariables.HistoryUpdateParameters.HistoryUpdateDetails.ReqTimes[i] = archiveRecords[i].SourceTimestamp;
    }

    var result = true;
    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;
    else CUVariables.ArchiveRecords( { Records: archiveRecords } );

    return( result );
}

Test.Execute( { Procedure: deleteAtTimeTest } );