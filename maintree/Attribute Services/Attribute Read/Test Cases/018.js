/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Read the Server's state. This script verifies that the server reports as RUNNING_0, which should be the default state. */

function read581020() {
    var item = MonitoredItem.fromNodeIds(  new UaNodeId( Identifier.Server_ServerStatus_State, 0 ) );
    if( ReadHelper.Execute( { NodesToRead: item, TimestampsToReturn: TimestampsToReturn.Both, MaxAge: 100 } ) ) {
        Assert.CoercedEqual( ServerState.Running, ReadHelper.Response.Results[0].Value, "Server State is not what was expected." );
    }
    return( true );
}

Test.Execute( { Procedure: read581020 } );