/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Check indexRange on array-based historical nodes */
    
    // NOTE: AUG-28-2013: THIS SCRIPT IS UNTESTED

function readraw011() {
    var result = true;

    // can we do this test?
    if( CUVariables.ArrayItems === null || CUVariables.ArrayItems.length === 0 ) {
        addSkipped( "No historical items of type Array are configured in settings. Skipping test." );
        return( true );
    }

    var haparams = { 
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    EndTime: CUVariables.Items[0].LastValueInHistory.SourceTimestamp,
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: true } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };


    // TEST 1: indexRange = "1"
    if( CUVariables.Debug ) print( "\nTEST1 1: indexRange = \"1\"\n" );
    CUVariables.Items[0].IndexRange = "1";
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #1 success expected." ) ) {
        if( !Assert.GreaterThan( 0, CUVariables.Items[0].Value[0].Value.getArraySize(), "Node not an array!" ) ) result = false;
        else {
            if( !Assert.Equal( CUVariables.Items[0].RawValues[0].SourceTimestamp, CUVariables.Items[0].Value[0].SourceTimestamp, "Wrong record received." ) ) result = false;
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.Results[0].StatusCode, "Wrong operation status code.", "Correct operation status code" ) ) result = false;
            Assert.Equal( 1, CUVariables.Items[0].Value[0].length, "??bad??", "??good??" );
        }
    }
    else result = false;


    // TEST 2: indexRange = "1:2"
    if( CUVariables.Debug ) print( "\nTEST1 2: indexRange = \"1:2\"\n" );
    CUVariables.Items[0].IndexRange = "1:2";
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #2 success expected." ) ) {
        if( !Assert.GreaterThan( 0, CUVariables.Items[0].Value[0].Value.getArraySize(), "Node not an array!" ) ) result = false;
        else {
            if( !Assert.Equal( CUVariables.Items[0].RawValues[0].SourceTimestamp, CUVariables.Items[0].Value[0].SourceTimestamp, "Wrong record received." ) ) result = false;
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.Results[0].StatusCode, "Wrong operation status code.", "Correct operation status code" ) ) result = false;
            Assert.Equal( 1, CUVariables.Items[0].Value[0].length, "??bad??", "??good??" );
        }
    }
    else result = false;


    // TEST 3: indexRange = "2:4"
    if( CUVariables.Debug ) print( "\nTEST1 3: indexRange = \"2:4\"\n" );
    CUVariables.Items[0].IndexRange = "1";
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #3 success expected." ) ) {
        if( !Assert.GreaterThan( 0, CUVariables.Items[0].Value[0].Value.getArraySize(), "Node not an array!" ) ) result = false;
        else {
            if( !Assert.Equal( CUVariables.Items[0].RawValues[0].SourceTimestamp, CUVariables.Items[0].Value[0].SourceTimestamp, "Wrong record received." ) ) result = false;
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.Results[0].StatusCode, "Wrong operation status code.", "Correct operation status code" ) ) result = false;
            Assert.Equal( 2, CUVariables.Items[0].Value[0].length, "??bad??", "??good??" );
        }
    }
    else result = false;


    // TEST 4: indexRange = "<last 3>"
    if( CUVariables.Debug ) print( "\nTEST 4: indexRange = \"last 3\"\n" );
    var length = CUVariables.Items[0].RawValues[0].Value.getArraySize();
    CUVariables.Items[0].IndexRange = ( length - 4 ) + ":" + ( length - 3 );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #4 success expected." ) ) {
        if( !Assert.GreaterThan( 0, CUVariables.Items[0].Value.length, "Wrong, no items returned!", "Results received" ) ) result = false;
        else {
            if( !Assert.GreaterThan( 0, CUVariables.Items[0].Value[0].Value.getArraySize(), "Node not an array!" ) ) result = false;
            else {
                if( !Assert.Equal( CUVariables.Items[0].RawValues[0].SourceTimestamp, CUVariables.Items[0].Value[0].SourceTimestamp, "Wrong record received." ) ) result = false;
                if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.Results[0].StatusCode, "Wrong operation status code.", "Correct operation status code" ) ) result = false;
                Assert.Equal( 1, CUVariables.Items[0].Value[0].length, "??bad??", "??good??" );
                //TODO: check the values received match expectations
            }
        }
    }
    else result = false;


    CUVariables.Items[0].IndexRange = "";
    return( result );
}// function readraw011

Test.Execute( { Procedure: readraw011 } );