/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request 100 items in a subscription */

function createMonitoredItems100() {
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: originalItems100, TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: defaultSubscription, MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall, SuppressMessaging: true } ) ) {
        PublishHelper.Execute( { FirstPublish: true } );
        Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() did not provide an initial data-change notification.", "Publish() returned initial-data as expected." );    
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: originalItems100, SubscriptionId: defaultSubscription, MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall, SuppressMessaging: true } );
    }
    return( true );
}


Test.Execute( { Procedure: createMonitoredItems100 } );