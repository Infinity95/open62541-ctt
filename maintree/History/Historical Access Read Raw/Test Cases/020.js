/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Consume all supported continuationPoints. */

function readraw020() {
    var result = true;

    var maxCPs = gServerCapabilities.MaxHistoryContinuationPoints;
    if( maxCPs === 0 ) maxCPs = 50;
    if( CUVariables.Debug ) print( "Max # ContinuationPoints = " + gServerCapabilities.MaxHistoryContinuationPoints );

    var haparams = { 
          NodesToRead: CUVariables.Items,
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].LastValueInHistory.SourceTimestamp,
                                    EndTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    NumValuesPerNode: 1, 
                                    ReturnBounds: false } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };

    // now to consume all CPs
    while( maxCPs > 0 ) {
        if( CUVariables.Debug ) print( "maxCPs = " + maxCPs );
        for( var i=0; i<CUVariables.Items.length; i++ ) haparams.NodesToRead[i].ContinuationPoint = new UaByteString();
        if( HistoryReadHelper.Execute( haparams ) ) {
            maxCPs -= CUVariables.Items.length;
        }
    }

    // now release all CPs 
    haparams.ReleaseContinuationPoints = true;
    Assert.True( HistoryReadHelper.Execute( haparams ), "Expected HistoryRead( release ContinuationPoints ) to be successful.", "ReleaseContinuationPoints success." );

    return( result );
}// function readraw020()

readraw020(); Test.Execute( { Procedure: readraw020 } );