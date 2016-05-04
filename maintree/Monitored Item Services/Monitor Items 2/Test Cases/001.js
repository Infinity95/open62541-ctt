/*  Test  prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request 2 items in a subscription */

function createMonitoredItems2() {
    var items2 = [ items[0], items[1] ];
    CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items2, TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: defaultSubscription } );
    PublishHelper.Execute( { FirstPublish: true } );
    Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() did not provide an initial data-change notification.", "Publish() returned initial-data as expected." );
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items2, SubscriptionId: defaultSubscription } );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems2 } );