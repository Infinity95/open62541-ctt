/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request invalid indexRange for array node. Expects BadIndexRangeInvalid'. */

function readrawErr010() {
    // do we have any array items to work with? if not then skip the test
    if( CUVariables.ArrayItems.length === 0 ) { addSkipped( "No array-based items configured. Check settings." ); return( true ); }

    var result = true;
    var indexRanges = [ "3:1", "3:3", "1:A", "1-3", "?:1", " 1:3", "\\t1:3", "\\n1:3", "1:3,3:1", "1:3,3:3", "1:3,3:A" ];
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
            if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.BadIndexRangeInvalid ), 
                                      HistoryReadHelper.Response.Results[0].StatusCode, 
                                      "status code is wrong.", 
                                      "status code is correct." ) ) result = false;
        }

    }// for i...

    // clean-up and exit
    CUVariables.Items[0].IndexRange = "";
    return( result );
}// function readrawErr010()

Test.Execute( { Procedure: readrawErr010 } );