/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Do not specify 2 of the 3 required parameters. Expect BadHistoryOperationInvalid. */

function readrawErr027() {
    var result = true;

    var haparams = {
          NodesToRead: CUVariables.Items[0],
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    EndTime: new UaDateTime(),
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: false } ),
          OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadHistoryOperationInvalid ),
          Debug: CUVariables.Debug };

    if( CUVariables.Debug ) print( "\nTEST 1: startTime specified only.\n" );
    if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() test #1." ) ) result = false;


    if( CUVariables.Debug ) print( "\nTEST 2: endTime specified only.\n" );
    haparams.HistoryReadDetails.EndTime = haparams.HistoryReadDetails.StartTime.clone();
    haparams.HistoryReadDetails.StartTime = new UaDateTime();
    if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() test #2." ) ) result = false;


    if( CUVariables.Debug ) print( "\nTEST 3: numValuesPerNode specified only.\n" );
    haparams.HistoryReadDetails.EndTime = new UaDateTime();
    haparams.HistoryReadDetails.NumValuesPerNode = 1;
    if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() test #3." ) ) result = false;


    return( result );
}// function readrawErr027()

Test.Execute( { Procedure: readrawErr027 } );