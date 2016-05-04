/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Multiple transactions in one call; various request types
                    [0] equivalent to test dat-001
                    [1] equivalent to test dat-002
                    [2] equivalent to test dat-err-001 */

function deleteAtTimeTest() {
    CUVariables.HistoryUpdateParameters = { 
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: [ // deleteAtTime a known record 
                                  UaDeleteAtTimeDetails.New( { NodeId: CUVariables.Items[0].NodeId,
                                                               ReqTimes: [ CUVariables.Items[0].RawModifiedValues[0].SourceTimestamp ] } ),

                                  // deleteAtTime multiple known records (records are inserted below)
                                  UaDeleteAtTimeDetails.New( { NodeId: CUVariables.Items[0].NodeId,
                                                               ReqTimes: [ ] } ),

                                  // deleteAtTime on a node that doesn't support history 
                                  UaDeleteAtTimeDetails.New( { NodeId:   MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings )[0].NodeId,
                                                               ReqTimes: [ CUVariables.Items[0].RawValues[0].SourceTimestamp ] } ) 
                                ],
          OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.Good ), 
                              new ExpectedAndAcceptedResults( StatusCode.Good ),
                              new ExpectedAndAcceptedResults( [ StatusCode.BadNotSupported, StatusCode.BadHistoryOperationUnsupported ] ) 
                            ] };

    // insert the mulitple values that are needed in the middle transaction
    var archiveRecords = [];
    for( var i=0; i<3; i++ ) {
        archiveRecords.push( CUVariables.Items[0].RawValues[i].clone() );
        CUVariables.HistoryUpdateParameters.HistoryUpdateDetails[1].ReqTimes[i] = archiveRecords[i].SourceTimestamp;
    }//for i...

    var result = true;
    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;


    return( result );
}

Test.Execute( { Procedure: deleteAtTimeTest } );