/*  Test 5.8.1 Error Test 20; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org

    Description:
        Read a node that is NOT readable according to the UserAccessLevel attribute.

    Revision History
        28-Mar-2012 NP: Initial version.
*/

function read581err019()
{
    var item = MonitoredItem.fromSetting( "/Server Test/NodeIds/Static/All Profiles/Scalar/Write Only", 0, Attribute.Value, "", MonitoringMode.Reporting, true, null, 1, 0, TimestampsToReturn.Both, true );
    if( item == null || item.length == 0 )
    {
        addSkipped( SETTING_UNDEFINED_SCALARSTATIC );
        return( false );
    }

    // before we read the item, lets check that it correctly shows that it is NOT readable 
    var itemPreCheck = MonitoredItem.Clone( item );
    itemPreCheck.AttributeId = Attribute.AccessLevel;
    ReadHelper.Execute( { 
                NodesToRead:itemPreCheck,
                TimestampsToReturn:TimestampsToReturn.Server } );

    var isReadable1 = itemPreCheck.Value.Value.toByte();
    if( !Assert.False( isReadable1 & AccessLevel.CurrentRead, "Node in setting '" + itemPreCheck.NodeSetting + "' should NOT be readable, but the AccessLevel indicates that it is readable. AccessLevel=" + AccessLevel.toString( isReadable1 ) ) )
    {
        return( false );
    }

    // now lets check the USER's access level
    itemPreCheck.AttributeId = Attribute.UserAccessLevel;
    ReadHelper.Execute( { 
                NodesToRead:itemPreCheck,
                TimestampsToReturn:TimestampsToReturn.Server } );

    var isReadable2 = itemPreCheck.Value.Value.toByte();
    if( !Assert.False( isReadable2 & AccessLevel.CurrentRead, "Node in setting '" + itemPreCheck.NodeSetting + "' should NOT be readable, but the AccessLevel indicates that it is readable. AccessLevel=" + AccessLevel.toString( isReadable2 ) ) )
    {
        return( false );
    }

    // quick check to make sure that the user access level is the same or MORE restrictive than the access level
    AssertBitmaskSameOrRestricted( isReadable1, isReadable2, "UserAccessLevel should be the same as, or have more restrictions than AccessLevel." );

    // now read the item that we should not have access to!
    var expectedResults = [ new ExpectedAndAcceptedResults( [ StatusCode.BadUserAccessDenied, StatusCode.BadNotReadable ] ) ];
    ReadHelper.Execute( {
            NodesToRead:item,
            TimestampsToReturn: TimestampsToReturn.Server,
            ExpectedErrors:expectedResults,
            ExpectError:true } );
}

safelyInvoke( read581err019 );