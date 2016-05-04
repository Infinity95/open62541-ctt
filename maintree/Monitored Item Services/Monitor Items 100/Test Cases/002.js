/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request 100 items per subscription, with 3 subscriptions. */

function createMonitoredItems100x3subscriptions() {
    // use our existing subscription as the first subscription
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: originalItems100, TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: defaultSubscription, MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall, SuppressMessaging: true } ) ) return( false );
    PublishHelper.WaitInterval( { Items: originalItems100, Subscription: defaultSubscription } );
    PublishHelper.Execute( { FirstPublish: true } );
    Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() did not provide an initial data-change notification on Subscription 1.", "Publish() returned initial-data as expected." );    

    // create 2 more subscriptions, and add a clone of our other items into each
    var clonedItems1= MonitoredItem.Clone( originalItems100 );
    var subscription2 = new Subscription();
    subscription2.PublishingInterval = 1000;
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription2 } ) ) return( false );

    CreateMonitoredItemsHelper.Execute( { ItemsToCreate: clonedItems1, TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: subscription2, MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall, SuppressMessaging: true } );

    PublishHelper.WaitInterval( { Items: clonedItems1, Subscription: subscription2 } );
    PublishHelper.Execute( { FirstPublish: true } );

    if( !PublishHelper.CurrentlyContainsData() ) PublishHelper.Execute();
    if( PublishHelper.CurrentlyContainsData() ) Assert.Equal( subscription2.SubscriptionId, PublishHelper.Response.SubscriptionId, "Publish() did not provide an initial data-change notification on subscription 2 (SubscriptionId: " + subscription2.SubscriptionId + ")." );

    var clonedItems2 = MonitoredItem.Clone( originalItems100 );
    var subscription3 = new Subscription();
    subscription3.PublishingInterval = 5000;
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription3 } ) ) return( false );

    CreateMonitoredItemsHelper.Execute( { ItemsToCreate: clonedItems2, TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: subscription3, MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall, SuppressMessaging: true } );

    PublishHelper.WaitInterval( { Items: clonedItems2, Subscription: subscription3 } );
    PublishHelper.Execute( { FirstPublish: true } );
    for( var i=0; i<2; i++ ) { 
        if( PublishHelper.CurrentlyContainsData() ) break;
        else PublishHelper.Execute();
    }// for i...
    Assert.Equal( subscription3.SubscriptionId, PublishHelper.Response.SubscriptionId, "Publish() did not provide an initial data-change notification on subscription 3 (SubscriptionId: " + subscription3.SubscriptionId + ")." );

    // clean-up
    // delete first subscription's items, but keep the subscription
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: originalItems100, SubscriptionId: defaultSubscription, MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall, SuppressMessaging: true } );

    // delete second subscription/items
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: clonedItems1, SubscriptionId: subscription2, MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall, SuppressMessaging: true } );

    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription2 } );

    // delete third subscription/items
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: clonedItems2, SubscriptionId: subscription3, MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall, SuppressMessaging: true } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription3 } );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems100x3subscriptions } );