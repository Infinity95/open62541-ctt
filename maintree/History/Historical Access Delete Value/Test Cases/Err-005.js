/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Delete history on a node that the user doesn't have access */

function deleteValueTest() {
    var items = MonitoredItem.fromSettings( [ readSetting( "/Server Test/NodeIds/Static/HA Profile/AccessRights/UserAccessLevel_ReadOnly" ),
                                              readSetting( "/Server Test/NodeIds/Static/HA Profile/AccessRights/UserAccessLevel_None" ) ] );

    if( !isDefined( items ) || items.length === 0 ) { addSkipped( "No items configured to test user access rights. Check 'HA Profile' AccessRights settings." ); return( false ); }

    CUVariables.HistoryUpdateParameters = {
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: UaDeleteRawModifiedDetails.New(
                                  { NodeId: items[0].NodeId,
                                    IsDeleteModified: false,
                                    StartTime: CUVariables.Items[0].RawValues.FirstRecord().SourceTimestamp,
                                    EndTime: new UaDateTime() } ),
          OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.BadNotWritable ) ] };

    var result = true;
    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;


    return( result );
}

Test.Execute( { Procedure: deleteValueTest } );