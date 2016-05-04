/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: While browsing and using ContinuationPoints, use one that was previously used. */

function readrawErr014() {
    var result = true;

    // browse the item first, and if successful (expected) then use that CP in a HistoryReadDetails request...
    if( CUVariables.Debug ) print( "\nStep 1: Browse\n" );
    if( !BrowseHelper.Execute( { NodesToBrowse: CUVariables.Items[0], MaxReferencesToReturn: 1 } ) ) { 
        addError( "Unable to Browse the Node and therefore unable to obtain a ContinuationPoint. Aborting test." );
        return( false );
    }
    if( !Assert.GreaterThan( 0, BrowseHelper.Response.Results[0].ContinuationPoint.length, "ContinuationPoint expected." ) ) {
        addError( "No ContinuationPoint received for Browse. Aborting test." );
        return( false );
    }

    // inject the CP from the Browse response into the HistoryRead call
    if( CUVariables.Debug ) print( "\nStep 2: HistoryRead\n" );
    CUVariables.Items[0].ContinuationPoint = BrowseHelper.Response.Results[0].ContinuationPoint.clone();
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
}// function readrawErr014()

Test.Execute( { Procedure: readrawErr014 } );