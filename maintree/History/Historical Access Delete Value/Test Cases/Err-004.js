/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Delete history on a node that doesn't support history */

function deleteValueTest() {
    CUVariables.HistoryUpdateParameters = {
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: UaDeleteRawModifiedDetails.New(
                                  { NodeId: MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings )[0].NodeId,
                                    IsDeleteModified: false,
                                    StartTime: CUVariables.Items[0].RawValues.FirstRecord().SourceTimestamp,
                                    EndTime: new UaDateTime() } ),
          OperationResults: [ new ExpectedAndAcceptedResults( [ StatusCode.BadNotSupported, StatusCode.BadHistoryOperationUnsupported ] ) ] };

    var result = true;
    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;


    return( result );
}

Test.Execute( { Procedure: deleteValueTest } );