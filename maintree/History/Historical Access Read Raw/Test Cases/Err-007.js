/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Invalid NodeId expects Results[0] 'BadInvalidNodeId'. */

function readrawErr007() {
    var result = true;

    var haparams = {
          NodesToRead: new MonitoredItem( UaNodeId.fromString( readSetting( "/Advanced/NodeIds/Invalid/InvalidSyntaxNodeId2" ).toString() ) ),
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

    // issue the call and check the result
    result = Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #1] ServiceResult 'Good' expected; error codes expected at the operation level." );
    if( result ) { 
        // operation result can be 1 of 2 codes: 
        if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.BadNodeIdInvalid ), 
                                  HistoryReadHelper.Response.Results[0].StatusCode, 
                                  "Results[0].StatusCode 'BadNodeIdInvalid' expected.", 
                                  "Results[0].StatusCode 'BadNodeIdInvalid' received, as expected." ) ) result = false;
    }

    return( result );
}// function readrawErr007()

Test.Execute( { Procedure: readrawErr007 } );