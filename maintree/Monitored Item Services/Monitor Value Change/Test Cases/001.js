/*  Test prepared by Development; compliance@opcfoundation.org
    Description: CreateMonitoredItems uses default parameter values. Expected to succeed.
        subscription is created and deleted in initialize and cleanup scripts */

function createMonitoredItems591001() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, 0 )[0];
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
        // wait one publishing cycle before calling publish
        PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
        if( PublishHelper.Execute( { FirstPublish: true } ) ) {
            if( Assert.True ( PublishHelper.CurrentlyContainsData(), "Expected an initial dataChange! The subscription was created, we waited for one publish interval and then called Publish." ) ) {
                Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive an initial callback for all nodes added." );
            }
        }
    }
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorBasicSubscription } );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591001 } );