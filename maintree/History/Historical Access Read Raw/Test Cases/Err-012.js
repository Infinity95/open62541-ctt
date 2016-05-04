/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request history on a node where the user does not have access. */

function readrawErr012() {
    var result = true;
    
    var nodeIdNoAccess = MonitoredItem.fromNodeIds( UaNodeId.fromString( readSetting( "/Server Test/NodeIds/Static/HA Profile/AccessRights/UserAccessLevel_None" ).toString() ) )[0];
    if( !isDefined( nodeIdNoAccess ) ) { addSkipped( "No NodeIds configured that have 'No Access'. Please check settings." ); return( false ); }

    var haparams = {
          NodesToRead: nodeIdNoAccess,
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    EndTime: CUVariables.Items[0].LastValueInHistory.SourceTimestamp,
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: false } ),
          Debug: CUVariables.Debug,
          OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadUserAccessDenied ) };

    if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #"+ (1+i) + "] ServiceResult 'Good' expected; error codes expected at the operation level." ) ) result = false;

    return( result );
}// function readrawErr012()

Test.Execute( { Procedure: readrawErr012 } );