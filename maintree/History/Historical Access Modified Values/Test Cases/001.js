/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Read the most recent modified value. */

function hamodified() {
    var result = true;

    var haparams = { 
          NodesToRead: CUVariables.ModifiedItems,
          TimestampsToReturn: TimestampsToReturn.Source,
          HistoryReadDetails: [],
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };

    // add the individual read requests for each of our items that contains modified values 
    for( var i=0; i<CUVariables.ModifiedItems.length; i++ ) {
          haparams.HistoryReadDetails.push( UaReadRawModifiedDetails.New(
                          { IsReadModified: true,
                            StartTime: CUVariables.ModifiedItems[i].FirstModifiedValue.SourceTimestamp,
                            EndTime: CUVariables.ModifiedItems[i].FirstModifiedValue.SourceTimestamp,
                            NumValuesPerNode: 1, 
                            ReturnBounds: false } ) ),

    }//for i...

    var result = true;

    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() success expected." ) ) {
        if( Assert.Equal( CUVariables.ModifiedItems.length, HistoryReadDetails.Response.Results.length, "Expected the # of results to match the number of requested items." ) ) {
            for( var i=0; i<CUVariables.ModifiedItems.length; i++ ) {
                if( !Assert.Equal( 1, CUVariables.ModifiedItems.Value.length, "Expected one modified value." ) ) result = false;
            }//for i...
        } else result = false;
    }else result = false;

    return( result );
}

Test.Execute( { Procedure: hamodified } );