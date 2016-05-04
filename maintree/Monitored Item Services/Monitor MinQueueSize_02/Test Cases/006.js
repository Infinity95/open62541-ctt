/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script modifies the ClientHandle for the first item to another 
        unique number. The remaining items are modified to use a 
        queueSize of 2. */

Test.Execute( { Procedure: function test() {
    var MonitorQueueSize2Subscription = new Subscription();
    CreateSubscriptionHelper.Execute( { Subscription: MonitorQueueSize2Subscription } );
    if( !MonitorQueueSize2Subscription.SubscriptionCreated ) { addError( "Subscription for Monitor Basic was not created" ); return( false ); }

    // Add 3 monitored items using default parameters
    var items = MonitoredItem.GetRequiredNodes( { Settings: Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, Number: 3 } );
    if( CreateMonitoredItemsHelper.Execute( { SubscriptionId: MonitorQueueSize2Subscription, ItemsToCreate: items } ) ) {
        // Modify the three monitoredItems; Specify a new unique clientHandle for the first item, and QueueSize=2 for others...
        items[0].ClientHandle += 0x123;
        for( var i=1; i<3; i++ ) items[i].QueueSize = 2;
        if( ModifyMonitoredItemsHelper.Execute( { SubscriptionId: MonitorQueueSize2Subscription, ItemsToModify: items } ) ) {
            Assert.Equal( 2, ModifyMonitoredItemsHelper.Response.Results[1].RevisedQueueSize );
            Assert.Equal( 2, ModifyMonitoredItemsHelper.Response.Results[2].RevisedQueueSize );
        }

    }// create monitored items
    // Cleanup
    // Delete the items we added in this test
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorQueueSize2Subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: MonitorQueueSize2Subscription } );
    return( true );
} } );