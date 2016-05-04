/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: deleteAtTime a known record */

function deleteAtTimeTest() {
    var startTime = CUVariables.Items[0].RawValues[0].SourceTimestamp;
    CUVariables.HistoryUpdateParameters = { 
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: UaDeleteAtTimeDetails.New(
                                  { NodeId:   CUVariables.Items[0].NodeId,
                                    ReqTimes: [ startTime ] } ),
          OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.Good ) ] };

    var result = true;

    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;
    else CUVariables.ArchiveRecords( { Records: CUVariables.Items[0].RawModifiedValues[0].DataValues } );

    return( result );
}

Test.Execute( { Procedure: deleteAtTimeTest } );