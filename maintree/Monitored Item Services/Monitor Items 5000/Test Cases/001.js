/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request 5000 items in a subscription */

function createMonitoredItems5000() {
    if( CreateMonitoredItemsHelper.Execute( {
            ItemsToCreate: originalItems5000, 
            TimestampsToReturn: TimestampsToReturn.Server,
            SubscriptionId: defaultSubscription,
            MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall,
            SuppressMessaging: true
            } ) ) {
        PublishHelper.WaitInterval( { Items: originalItems5000, Subscription: defaultSubscription } );
        PublishHelper.Execute( { FirstPublish: true } );
        Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() did not provide an initial data-change notification.", "Publish() returned initial-data as expected." );    
        DeleteMonitoredItemsHelper.Execute( {
                ItemsToDelete: originalItems5000, 
                SubscriptionId: defaultSubscription,
                MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall,
                SuppressMessaging: true
                } );
    }
    return( true );
}// function createMonitoredItems5000()

Test.Execute( { Procedure: createMonitoredItems5000 } );