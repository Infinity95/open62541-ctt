/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Empty 'ReqTimes' array */

function deleteAtTimeTest() {
    var items = MonitoredItem.fromSettings( Settings.Advanced.NodeIds.Invalid.Invalids );

    CUVariables.HistoryUpdateParameters = {
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: UaDeleteAtTimeDetails.New( { NodeId:   items[0].NodeId, ReqTimes: [ ] } ),
          OperationResults: [ new ExpectedAndAcceptedResults( [ StatusCode.BadNodeIdInvalid, StatusCode.BadInvalidArgument ] ) ] };

    var result = true;
    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;


    return( result );
}

Test.Execute( { Procedure: deleteAtTimeTest } );