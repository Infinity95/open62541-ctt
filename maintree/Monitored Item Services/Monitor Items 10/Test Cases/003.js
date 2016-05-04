/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Modify the samplingInterval of multiple nodes, where the first half are set to 1000 msec and the latter half 3000 msec.
        Where initial configuration is: A subscription of 10 (or more) monitoredItems using default parameters */

function modifyMonitoredItems592009() {
    if( !defaultSubscription.SubscriptionCreated ) {
        addError( "Subscription for Monitor Basic was not created" );
        return( false );
    }
    // array to store the NodeIds from the settings
    var items = MonitoredItem.GetRequiredNodes( { Number: 10, Settings: Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings } );
    // configure the items and then add them to the subscription
    for( var i=0; i<items.length; i++ ) {
        items[i].SamplingInterval = 500;
        items[i].QueueSize = 1;
        items[i].DiscardOldest = true;
    }
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, SubscriptionId: defaultSubscription, TimestampsToReturn: TimestampsToReturn.Both } ) ) {
        // Modify the  monitoredItems; Specify a sampling interval of 1000ms for first 5 items
        for( var i=0; i<5; i++ ) items[i].SamplingInterval = 1000;
        for( var i=5; i<items.length; i++ ) items[i].SamplingInterval = 3000;
        Assert.True( ModifyMonitoredItemsHelper.Execute( { ItemsToModify: items, SubscriptionId: defaultSubscription } ) );
        // Cleanup
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: defaultSubscription } );
    }
    return( true );
}

Test.Execute( { Procedure: modifyMonitoredItems592009 } );