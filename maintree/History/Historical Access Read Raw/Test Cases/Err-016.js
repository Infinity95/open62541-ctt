/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request timestamp that is not supported on a node */
    
function readrawErr016() {
    var item = MonitoredItem.fromSetting( "/Server Test/NodeIds/Static/HA Profile/NodeDoesNotSupportSourceTimestamp" );
    if( !isDefined( item ) ) { addSkipped( "No item to test with. Check settings (see this script)." ); return( true ); };
    var haparams = { 
          NodesToRead: item,
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    EndTime: new UaDateTime(), 
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: true } ),
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.BadTimestampNotSupported ) ],
          Debug: CUVariables.Debug };

    var result = Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() success expected." );

    return( result );
}// function readraw016

Test.Execute( { Procedure: readrawErr016 } );