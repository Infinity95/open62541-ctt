/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        If supported, read the ServerCapabilities object to find the max number of entries that can be 
        specified in one call. Invoke the call using valid parameters, but the browsePaths contains one 
        additional request in order to exceed the max allowed in a single request. */

function translate573err021() {
    // HACK: define NodeId for OperatinLimits type until ANSI C stack revised 
    const Identifier_ServerCapabilities_OperationLimits_MaxTranslate = 11712;
    var systemNode = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.Server ) )[0];
    // can we read the server capabilties?
    var expectedResults = [ new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNodeIdUnknown ] ) ];
    var maxBrowseContinuationPoints = MonitoredItem.fromNodeIds( new UaNodeId( Identifier_ServerCapabilities_OperationLimits_MaxTranslate ) )[0];
    ReadHelper.Execute( { NodesToRead: maxBrowseContinuationPoints, OperationResults: expectedResults } );
    // does node exist? if not then exit
    if( ReadHelper.Response.Results[0].StatusCode.isBad() ) {
        addSkipped( "Skipping test. Read().Response.Results[0].StatusCode=" + ReadHelper.Response.Results[0].StatusCode.toString() + " when querying ServerCapabilities.OperationLimits (optional structure)." );
        return( false );
    }
    // get the limit
    var limit = 100;
    if( maxBrowseContinuationPoints.Value.Value === null ) limit = maxBrowseContinuationPoints.Value.Value.toUInt32();
    // now to request MORE items than the service can supposedly handle ; and add one more
    var operations = [];
    for( var i=0; i<=limit; i++ ) operations.push( TranslateBrowsePathsToNodeIdsHelper.stringsToBrowsePaths( systemNode, [ "MaxBrowseContinuationPoints" ] ));
    // now to overload the call
    expectedResults = new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadTooManyOperations ] );
    TranslateBrowsePathsToNodeIdsHelper.Execute( { Node: systemNode, UaBrowsePaths: operations, ServiceResult: expectedResults } );
    return( true );
}

Test.Execute( { Procedure: translate573err021 } );