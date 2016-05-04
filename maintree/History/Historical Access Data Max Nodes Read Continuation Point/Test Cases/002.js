/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Invoke call with max # of nodes specified in HistoryRead. */

function hadatamaxnodes() {
    // do we have the max # of nodes per history read setting? if not, go get it
    if( CUVariables.MaxNodesPerHistoryRead == 0 ) include( "./maintree/History/Historical Access Data Max Nodes Read Continuation Point/Test Cases/000.js" );
    var maxNodesPerHRead = CUVariables.MaxNodesPerHistoryRead;
    if( maxNodesPerHRead == 0 ) maxNodesPerHRead = 20;

    var maxItems = MonitoredItem.GetRequiredNodes( { Number: maxNodesPerHRead, Settings: Settings.ServerTest.NodeIds.Static.HAProfile.Scalar.Settings } );

    var haparams = { 
          NodesToRead: maxItems,
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].FirstRecord().SourceTimestamp,
                                    EndTime: UaDateTime.utcNow(),
                                    NumValuesPerNode: 1, 
                                    ReturnBounds: false } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          Debug: CUVariables.Debug };

    var result = true;

    // occupy all CPs
    if( CUVariables.Debug ) print( "\nTEST 1: Read and occupy all ContinuationPoints..." );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() success expected." ) ) {
        if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.Good ), HistoryReadHelper.Response.ResponseHeader.ServiceResult, "Service Result not Good! (TimestampsToReturn.Source)" ) ) result = false;
        if( !Assert.True( HistoryReadHelper.Response.Results[0].StatusCode.isGood(), "OperationResults[0] is not Good! (TimestampsToReturn.Source)" ) ) result = false;

        // obtain the next page of data; do this a few times
        for( var i=0; i<2; i++ ) if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() #2 (continuation) success expected." ) ) result = false;

        // now record the "current" CP and then issue another read. Then specify this outdated CP in the next call...
        for( var i=0; i<maxItems.length; i++ ) maxItems[i].PreviousCP = maxItems[i].ContinuationPoint.clone();
        if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() #3 (valid continuationPoint) succeed expected." ) ) result = false;
        haparams.OperationResults = [];
        for( var i=0; i<maxItems.length; i++ ) {
            haparams.OperationResults.push( new ExpectedAndAcceptedResults( StatusCode.BadContinuationPointInvalid ) );
            maxItems[i].ContinuationPoint = maxItems[i].PreviousCP.clone();
        }
        if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() #3 (invalid continuationPoint) failure expected." ) ) result = false;

        // release all CPs
        haparams.ReleaseContinuationPoints = true;
        haparams.OperationResults = null;
        if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() #4 (clear ContinuationPoints) success expected." ) ) result = false;

    }
    else result = false;

    return( result );
}

Test.Execute( { Procedure: hadatamaxnodes } );