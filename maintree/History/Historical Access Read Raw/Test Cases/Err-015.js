/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: ContinuationPoint (previously used/released) is reused and rejected. */

function readrawerr015() {
    var result = true;
    var savedCP = null;

    var haparams = { 
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    EndTime: CUVariables.Items[0].LastValueInHistory.SourceTimestamp,
                                    NumValuesPerNode: 1, 
                                    ReturnBounds: false } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };

    // invoke the initial call to get CP
    if( CUVariables.Debug ) print( "\nTEST: Get initial ContinuationPoint\n" );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #1] success expected." ) ) {
        if( !Assert.Equal( 1, CUVariables.Items[0].Value.length, "Wrong # of records returned.", "Correct # records returned." ) ) result = false;
        if( !Assert.NotEqual(0,  HistoryReadHelper.Response.Results[0].ContinuationPoint.length, "ContinuationPoint not received.", "Correct, ContinuationPoint received." ) ) result = false;
        else savedCP = HistoryReadHelper.Response.Results[0].ContinuationPoint.clone();
        print( "savedCP = " + savedCP.toString() );
    }// test 1
    else result = false;


    // release the CP (if received) 
    if( result ) { 
        haparams.ReleaseContinuationPoints = true;
        result = HistoryReadHelper.Execute( haparams );


        // if the release was successful, then try to use it in another read (to continue reading)
        if( Assert.True( result, "HistoryRead() [test #2] failed when releasing the ContinuationPoint", "ContinuationPoint released successfully" ) ) {
            haparams.ReleaseContinuationPoints = false;
            haparams.NodesToRead[0].ContinuationPoint = savedCP;
            haparams.OperationResults = [ new ExpectedAndAcceptedResults( StatusCode.BadContinuationPointInvalid ) ];
            result = HistoryReadHelper.Execute( haparams );
        }
    }


    return( result );
}// function readrawerr015()

Test.Execute( { Procedure: readrawerr015 } );