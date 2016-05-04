/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Read the EventNotifier attribute from a valid node. */

function read581001() {
    var vItem = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, 0, Attribute.Value, "", MonitoringMode.Reporting, true, null, 1, 0, TimestampsToReturn.Both, true )[0];
    if( vItem == null ) {
        addSkipped( SETTING_UNDEFINED_SCALARSTATIC );
        return( false );
    }
    // now clone the items to get the NodeClass 
    var ncItem = MonitoredItem.Clone( vItem );
    ncItem.AttributeId = Attribute.NodeClass;
    // now clone the items to get the EventNotifier
    var enItem = MonitoredItem.Clone( vItem );
    enItem.AttributeId = Attribute.EventNotifier;

    var items = [ vItem, ncItem, enItem ];

    // do this part twice, once for the variable, second on the server object
    for( var z=0; z<2; z++ ) {
        // for the sake of the read we will allow the call to succeed or fail until we 
        // do some post-processing.
        var expectations = [];
        for( var i=0; i<items.length; i++ ) expectations[i] = new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadAttributeIdInvalid ] );
        ReadHelper.Execute( { NodesToRead: items, OperationResults: expectations } );

        // post-processing
        var receivedNodeClass = ReadHelper.Response.Results[1].Value.toInt32();
        print( "** Received NodeClass: " + NodeClass.toString( receivedNodeClass ) );
        if( receivedNodeClass === NodeClass.Object || receivedNodeClass === NodeClass.View ) {
            if( Assert.True( ReadHelper.Response.Results[2].StatusCode.isGood(), "Expecting EventNotifier to work... received NodeClass: " + NodeClass.toString( receivedNodeClass ) ) ) {
                addLog( "EventNotifier exists, as expected." );
            }
        }
        else {
            if( Assert.False( ReadHelper.Response.Results[2].StatusCode.isGood(), "Expected reading the EventNotifier to fail... received NodeClass: " + NodeClass.toString( receivedNodeClass ) ) ) {
                addLog( "EventNotifier does not exist, as expected." );
            }
        }
        // now change the items' nodeid to be the server
        for( var i=0; i<items.length; i++ ){ items[i].NodeId = new UaNodeId( Identifier.Server ); }
    }//for z...
    return( true );
}

Test.Execute( { Procedure: read581001 } );