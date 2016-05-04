/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: HistoryRead with an empty request. */

function readrawErr026() {
    var result = true;

    var haparams = {
          PreHook: function( ) { HistoryReadHelper.Request.NodesToRead.length = 0; },
          NodesToRead: new MonitoredItem.fromNodeIds( new UaNodeId() )[0],
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: new UaDateTime(),
                                    EndTime: new UaDateTime(),
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: false } ),
          ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadNothingToDo ),
          Debug: CUVariables.Debug };

    if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() 'BadNothingToDo' expected." ) ) result = false;


    return( result );
}// function readrawErr026()

Test.Execute( { Procedure: readrawErr026 } );