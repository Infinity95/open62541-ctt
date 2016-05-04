/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Empty 'ReqTimes' array */

function deleteAtTimeTest() {
    var items = MonitoredItem.fromSettings( [ readSetting( "/Server Test/NodeIds/Static/HA Profile/AccessRights/UserAccessLevel_ReadOnly" ),
                                              readSetting( "/Server Test/NodeIds/Static/HA Profile/AccessRights/UserAccessLevel_None" ) ] );

    if( !isDefined( items ) || items.length === 0 ) { addSkipped( "No items configured to test user access rights. Check 'HA Profile' AccessRights settings." ); return( false ); }

    CUVariables.HistoryUpdateParameters = {
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: UaDeleteAtTimeDetails.New(
                                  { NodeId:   MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings )[0].NodeId,
                                    ReqTimes: [ ] } ),
          OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.BadInvalidArgument ) ] };

    var result = true;
    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;


    return( result );
}

Test.Execute( { Procedure: deleteAtTimeTest } );