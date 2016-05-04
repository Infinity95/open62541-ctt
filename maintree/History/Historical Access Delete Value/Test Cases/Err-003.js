/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Delete modified values while not specifying one or both dates */

function deleteValueTest() {
    // test one: no EndTime 
    CUVariables.HistoryUpdateParameters = {
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: UaDeleteRawModifiedDetails.New(
                                  { NodeId: CUVariables.Items[0],
                                    IsDeleteModified: true,
                                    StartTime: CUVariables.Items[0].RawValues.FirstRecord().SourceTimestamp,
                                    EndTime: new UaDateTime() } ),
          OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.BadInvalidArgument ) ] };

    var result = true;

    if( CUVariables.Debug ) print( "\nTEST ONE: no EndTime...\n" );
    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;


    if( CUVariables.Debug ) print( "\nTEST TWO: no StartTime...\n" );
    CUVariables.HistoryUpdateParameters.HistoryUpdateDetails[0].EndTime = CUVariables.HistoryUpdateParameters.HistoryUpdateDetails[0].StartTime.clone();
    CUVariables.HistoryUpdateParameters.HistoryUpdateDetails[0].StartTime = new UaDateTime();
    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;


    if( CUVariables.Debug ) print( "\nTEST THREE: no StartTime and no EndTime...\n" );
    CUVariables.HistoryUpdateParameters.HistoryUpdateDetails[0].EndTime = new UaDateTime();
    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;


    return( result );
}

Test.Execute( { Procedure: deleteValueTest } );