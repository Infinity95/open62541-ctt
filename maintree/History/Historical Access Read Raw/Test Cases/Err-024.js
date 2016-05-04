/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Use a ContinuationPoint that was randomly generated. */

function readrawErr024() {
    var result = true;

    // generate a random string for a ContinuationPoint
    var cpByteString = UaByteString.fromStringData( "helloUnifiedArchitectureWorld" );

    // inject the CP from the Browse response into the HistoryRead call
    if( CUVariables.Debug ) print( "\nStep 1: HistoryRead\n" );
    CUVariables.Items[0].ContinuationPoint = cpByteString.clone();
    var haparams = {
          NodesToRead: CUVariables.Items[0],
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    EndTime: CUVariables.Items[0].LastValueInHistory.SourceTimestamp,
                                    NumValuesPerNode: 1, 
                                    ReturnBounds: false } ),
          OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadContinuationPointInvalid ),
          Debug: CUVariables.Debug };

    if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #1] OperationResults[0] 'BadContinuationPointInvalid' expected." ) ) result = false;


    CUVariables.Items[0].ContinuationPoint = null;
    return( result );
}// function readrawErr024()

Test.Execute( { Procedure: readrawErr024 } );