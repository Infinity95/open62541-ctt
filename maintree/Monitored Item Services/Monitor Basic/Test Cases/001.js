/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Create a monitored item with the nodeId set to that of a non-Variable node and 
        the attributeId set to a non-Value attribute. call Publish().
    Expected Results: All service and operation level results are Good. Publish response contains a DataChangeNotification. */

function createMonitoredItems591064() { 
    if( !MonitorBasicSubscription.SubscriptionCreated ) {
        addError( "Subscription not created." );
        return( false );
    }
    // use the server object, and we'll monitor the DisplayName
    var item = MonitoredItem.fromNodeIds( [ new UaNodeId( Identifier.Server ) ], Attribute.DisplayName )[0];
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
        // wait one publishing cycle before calling publish
        PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
        PublishHelper.Execute( );
        Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange." );
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
    }
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591064 } );