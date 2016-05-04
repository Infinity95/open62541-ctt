/*  Test prepared by Development; compliance@opcfoundation.org
    Description: QueueSize = Max UInt32; Expect revision. */

function createMonitoredItems591004() {
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, 0 )[0];
    if( !isDefined( item ) ) {
        addSkipped( "No scalar items defined. Aborting." );
        return( false );
    }
    item.QueueSize = Constants.UInt32_Max;
    // create the subscription
    var subscription = new Subscription();
    CreateSubscriptionHelper.Execute( { Subscription: subscription } );
    // add the item
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: subscription } ) ) {
        if( Constants.UInt32_Max === item.RevisedQueueSize) addWarning( "Expected the server to revise the queueSize from a Max UInt32." );
        Assert.GreaterThan( 0, item.RevisedQueueSize, "Expected the server to revise the queueSize to be 2 or greater, per the conformance unit requirements.", "CreateMonitoredItems() revised queueSize as expected from Max UInt32 to " + item.RevisedQueueSize + "." );
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: subscription } );
    }
    // clean-up
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591004 } );