/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Read a node that is NOT readable. */

function read581err019() {
    const SETTING = "/Server Test/NodeIds/SecurityAccess/AccessLevel_CurrentWrite_NotCurrentRead";
    if( !AssertSettingGood( SETTING, undefined, true ) ) return( false );

    var item = MonitoredItem.fromSetting( SETTING, 0, Attribute.Value, "", MonitoringMode.Reporting, true, null, 1, 0, TimestampsToReturn.Both, true );

    // before we read the item, lets check that it correctly shows that it is NOT readable 
    var itemPreCheck = MonitoredItem.Clone( item );
    itemPreCheck.AttributeId = Attribute.UserAccessLevel;
    ReadHelper.Execute( { NodesToRead:itemPreCheck, TimestampsToReturn:TimestampsToReturn.Server } );

    var isReadable = itemPreCheck.Value.Value.toByte();
    if( !Assert.False( isReadable & AccessLevel.CurrentRead, "Node in setting '" + itemPreCheck.NodeSetting + "' should NOT be readable, but the UserAccessLevel indicates that it is readable. UserAccessLevel=" + AccessLevel.toString( isReadable ) ) ) return( false );

    var expectedResults = [ new ExpectedAndAcceptedResults( [ StatusCode.BadNotReadable, StatusCode.BadUserAccessDenied ] ) ];
    return( ReadHelper.Execute( { NodesToRead:item, TimestampsToReturn: TimestampsToReturn.Server, OperationResults: expectedResults } ) );
}

Test.Execute( { Procedure: read581err019 } );