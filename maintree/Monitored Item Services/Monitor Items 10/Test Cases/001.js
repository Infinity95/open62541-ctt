/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request 10 items in a subscription */

function createMonitoredItems2() {
    if( items.length < 10 ) {
        addSkipped( "Not enough items available for testing. Need 10, but only " + items.length + " are available. Please check Scalar NodeId settings." );
        return( false );
    }
    var items2 = [];
    for( var i=0; i<10; i++ ) items2.push( items[i] );

    CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items2, TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: defaultSubscription, MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall } );

    PublishHelper.Execute( { FirstPublish: true } );
    Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() did not provide an initial data-change notification.", "Publish() returned initial-data as expected." );
    return( DeleteMonitoredItemsHelper.Execute( {
            ItemsToDelete: items2, 
            SubscriptionId: defaultSubscription,
            MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall
            } ) );
}


Test.Execute( { Procedure: createMonitoredItems2 } );