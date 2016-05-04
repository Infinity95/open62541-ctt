/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: deleteAtTime on a node that doesn't support history */

function deleteAtTimeTest() {
    CUVariables.HistoryUpdateParameters = {
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: UaDeleteAtTimeDetails.New(
                                  { NodeId:   MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings )[0].NodeId,
                                    ReqTimes: [ CUVariables.Items[0].RawValues[0].SourceTimestamp ] } ),
          OperationResults: [ new ExpectedAndAcceptedResults( [ StatusCode.BadNotSupported, StatusCode.BadHistoryOperationUnsupported ] ) ] };

    var result = true;
    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;


    return( result );
}

Test.Execute( { Procedure: deleteAtTimeTest } );