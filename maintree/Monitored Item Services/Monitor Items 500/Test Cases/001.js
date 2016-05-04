/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request 500 items in a subscription */

function createMonitoredItems500() {
    if( CreateMonitoredItemsHelper.Execute( {
            ItemsToCreate: originalItems500, 
            TimestampsToReturn: TimestampsToReturn.Server,
            SubscriptionId: defaultSubscription,
            MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall,
            SuppressMessaging: true
            } ) ) {
        PublishHelper.WaitInterval( { Items: originalItems500, Subscription: defaultSubscription } );
        PublishHelper.Execute( { FirstPublish: true } );
        Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() did not provide an initial data-change notification.", "Publish() returned initial-data as expected." );    
        DeleteMonitoredItemsHelper.Execute( {
                ItemsToDelete: originalItems500, 
                SubscriptionId: defaultSubscription,
                MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall,
                SuppressMessaging: true
                } );
    }
    return( true );
}// function createMonitoredItems500()

Test.Execute( { Procedure: createMonitoredItems500 } );