/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request indexRange for non-array node. Expects 'BadIndexRangeNoData or BadIndexRangeInvalid'. */

function readrawErr009() {
    var result = true;
    var indexRanges = [ "3", "3:4", "1:3", "2", "4", "1:5", "1:3,1:3:", "1:3,3" ];
    var haparams = {
          NodesToRead: CUVariables.Items[0],
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    EndTime: CUVariables.Items[0].LastValueInHistory.SourceTimestamp,
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: false } ),
          Debug: CUVariables.Debug,
          ServiceResult: new ExpectedAndAcceptedResults( StatusCode.Good ) };

    for( var i=0; i<indexRanges.length; i++ ) {
        CUVariables.Items[0].IndexRange = indexRanges[i];
        if( CUVariables.Debug ) print( "\nIndexRange: '" + indexRanges[i] + "'" );

        // issue the call and check the result
        result = Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #"+ (1+i) + "] ServiceResult 'Good' expected; error codes expected at the operation level." );
        if( result ) { 
            // operation result can be 1 of 2 codes: 
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( [ StatusCode.BadIndexRangeNoData, StatusCode.BadIndexRangeInvalid ] ), 
                                      HistoryReadHelper.Response.Results[0].StatusCode, 
                                      "Results[0].StatusCode 'BadIndexRangeNoData or BadIndexRangeInvalid' expected.", 
                                      "Results[0].StatusCode is correct." ) ) result = false;
        }

    }// for i...

    // clean-up and exit
    CUVariables.Items[0].IndexRange = "";
    return( result );
}// function readrawErr009()

Test.Execute( { Procedure: readrawErr009 } );