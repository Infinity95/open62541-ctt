/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request an indexRange that is out of bounds, on array-based nodes */
    
    // NOTE: AUG-28-2013: THIS SCRIPT IS UNTESTED

function readraw012() {
    var result = true;

    // can we do this test?
    if( CUVariables.ArrayItems === null || CUVariables.ArrayItems.length === 0 ) {
        addSkipped( "No historical items of type Array are configured in settings. Skipping test." );
        return( true );
    }

    var startTime = new UaDateTime();
    startTime.addDays( 1 );

    var haparams = { 
          NodesToRead: CUVariables.ArrayItems[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: startTime,
                                    EndTime: new UaDateTime(),
                                    NumValuesPerNode: 1, 
                                    ReturnBounds: true } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };


    // identify the bounsd of the array first
    if( HistoryReadHelper.Execute( haparams ) ) if( !Assert.GreaterThan( 0, CUVariables.ArrayItems[0].Value[0].Value.getArraySize(), "Node not an array! Aborting test." ) ) return( false );

    // TEST 1: indexRange = "<too big>"
    CUVariables.ArrayItems[0].IndexRange = 1 + CUVariables.ArrayItems[0].Value[0].Value.getArraySize();
    if( CUVariables.Debug ) print( "\nTEST1 1: indexRange = \"" + CUVariables.ArrayItems[0].IndexRange + "\"\n" );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #1 success expected." ) ) {
        if( !Assert.GreaterThan( 0, CUVariables.ArrayItems[0].Value[0].Value.getArraySize(), "Node not an array!" ) ) result = false;
        if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.BadIndexRangeNoData ), HistoryReadHelper.Response.Results[0].StatusCode, "Wrong operation status code.", "Correct operation status code" ) ) result = false;
    }
    else result = false;


    CUVariables.ArrayItems[0].IndexRange = "";
    return( result );
}// function readraw012

Test.Execute( { Procedure: readraw012 } );