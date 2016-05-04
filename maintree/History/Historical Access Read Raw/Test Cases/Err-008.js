/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: History for a node that doesn't exist. Expects 'Bad_NodeIdUnknown' */

function readrawErr008() {
    var result = true;

    var haparams = {
          NodesToRead: new MonitoredItem( UaNodeId.fromString( readSetting( "/Advanced/NodeIds/Invalid/UnknownNodeId1" ).toString() ) ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    EndTime: CUVariables.Items[0].LastValueInHistory.SourceTimestamp,
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: false } ),
          Debug: CUVariables.Debug,
          OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.BadNodeIdUnknown ) ] };

    // issue the call and check the result
    result = Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #1] ServiceResult 'Good' expected; error codes expected at the operation level." );

    return( result );
}// function readrawErr008()

Test.Execute( { Procedure: readrawErr008 } );