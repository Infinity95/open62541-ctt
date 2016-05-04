/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request 500 items per subscription, with 3 subscriptions. */

function createMonitoredItems5000x3subscriptions() {
    // use our existing subscription as the first subscription
    if( !CreateMonitoredItemsHelper.Execute( {
            ItemsToCreate: originalItems5000, 
            TimestampsToReturn: TimestampsToReturn.Server,
            SubscriptionId: defaultSubscription,
            MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall,
            SuppressMessaging: true
            } ) ) return( false );

    PublishHelper.WaitInterval( { Items: originalItems5000, Subscription: defaultSubscription } );
    PublishHelper.Execute( { FirstPublish: true } );
    Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() #1 did not provide an initial data-change notification.", "Publish() #1 returned initial-data as expected." );

    // create 2 more subscriptions, and add a clone of our other items into each
    var clonedItems1= MonitoredItem.Clone( originalItems5000 );
    var subscription2 = new Subscription();
    subscription2.PublishingInterval = 1000;
    subscription2.LifetimeCount = 200;
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription2 } ) ) return( false );

    CreateMonitoredItemsHelper.Execute( {
            ItemsToCreate: clonedItems1, 
            TimestampsToReturn: TimestampsToReturn.Server,
            SubscriptionId: subscription2,
            MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall,
            SuppressMessaging: true
            } );

    PublishHelper.WaitInterval( { Items: clonedItems1, Subscription: subscription2 } );
    for( var p=0; p<2; p++ ) PublishHelper.Execute( { FirstPublish: true } ); // call twice so we can try to keep the first subscription alive
    Assert.GreaterThan( 1, PublishHelper.ReceivedSequenceNumbers.length, "Publish() #2 did not provide an initial data-change notification.", "Publish() #2 returned initial-data as expected." );

    var clonedItems2 = MonitoredItem.Clone( originalItems5000 );
    var subscription3 = new Subscription();
    subscription3.PublishingInterval = 5000;
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription3 } ) ) return( false );

    CreateMonitoredItemsHelper.Execute( {
            ItemsToCreate: clonedItems2, 
            TimestampsToReturn: TimestampsToReturn.Server,
            SubscriptionId: subscription3,
            MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall,
            SuppressMessaging: true
            } );

    PublishHelper.WaitInterval( { Items: clonedItems2, Subscription: subscription3 } );
    for( var p=0; p<3; p++ ) PublishHelper.Execute( { FirstPublish: true } ); // call thrice so we can try to keep the first and second subscriptions alive
    Assert.GreaterThan( 2, PublishHelper.ReceivedSequenceNumbers.length, "Publish() #3 did not provide an initial data-change notification.", "Publish() #3 returned initial-data as expected." );


    // clean-up
    // delete first subscription's items, but keep the subscription
    DeleteMonitoredItemsHelper.Execute( {
            ItemsToDelete: originalItems5000, 
            SubscriptionId: defaultSubscription,
            MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall,
            SuppressMessaging: true
            } );

    // delete second subscription
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription2 } );

    // delete third subscription/items
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription3 } );

    // clean-up
    clonedItems1 = null;
    clonedItems2 = null;
    subscription2 = null;
    subscription3 = null;
    PublishHelper.Clear();
    return( true );
}// function createMonitoredItems5000x3subscriptions()

Test.Execute( { Procedure: createMonitoredItems5000x3subscriptions } );