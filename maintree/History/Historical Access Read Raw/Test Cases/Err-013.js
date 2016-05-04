/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: While browsing and using ContinuationPoints, use one that was previously used. */

function readrawErr013() {
    var result = true;
    
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
          Debug: CUVariables.Debug };

    // step 1, issue a read while requesting just one item back (force a CP) and then record it
    if( CUVariables.Debug ) print( "\nTEST ONE: Initial read...\n" );
    if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #1] ServiceResult 'Good' expected." ) ) result = false;
    var firstCP = HistoryReadHelper.Response.Results[0].ContinuationPoint.clone();
    if( firstCP.length === 0 ) { addError( "No ContinuationPoint received. Aborting test." ); return( false ); }

    // step 2, invoke the next read and allow the CP to be used (we have a clone stored in our variable
    if( CUVariables.Debug ) print( "\nTEST TWO: Continued read... valid ContinuationPoint...\n" );
    if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #2] ServiceResult 'Good' expected." ) ) result = false;

    // step 3, use the CP from the first call. Expect BadContinuationPointInvalid
    if( CUVariables.Debug ) print( "\nTEST THREE: Continued read... invalid ContinuationPoint...\n" );
    haparams.NodesToRead[0].ContinuationPoint = firstCP.clone();
    haparams.OperationResults = new ExpectedAndAcceptedResults( StatusCode.BadContinuationPointInvalid );
    if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #3] ServiceResult 'BadContinuationPointInvalid' expected." ) ) result = false;


    return( result );
}// function readrawErr013()

Test.Execute( { Procedure: readrawErr013 } );