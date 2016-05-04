/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request 500 items per subscription, with 3 subscriptions. */

function createMonitoredItems500x3subscriptions() {
    // use our existing subscription as the first subscription
    if( !CreateMonitoredItemsHelper.Execute( {
                ItemsToCreate: originalItems500, 
                TimestampsToReturn: TimestampsToReturn.Server,
                SubscriptionId: defaultSubscription,
                MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall,
                SuppressMessaging: true
                } ) ) {
        return( flase );
    }
    PublishHelper.WaitInterval( { Items: originalItems500, Subscription: defaultSubscription } );
    PublishHelper.Execute( { FirstPublish: true } );
    Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() did not provide an initial data-change notification.", "Publish() returned initial-data as expected." );    
    Assert.Equal( defaultSubscription.SubscriptionId, PublishHelper.Response.SubscriptionId, "Publish #1 should have received an initial notification for Subscription #1 (Id: " + defaultSubscription.SubscriptionId + ")", "Subscription1 initial data received!" );

    // create 2 more subscriptions, and add a clone of our other items into each
    var clonedItems1= MonitoredItem.Clone( originalItems500 );
    var subscription2 = new Subscription();
    subscription2.PublishingInterval = 1000;
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription2 } ) ) return( false );
    CreateMonitoredItemsHelper.Execute( {
            ItemsToCreate: clonedItems1, 
            TimestampsToReturn: TimestampsToReturn.Server,
            SubscriptionId: subscription2,
            MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall,
            SuppressMessaging: true
            } );

    subscription2.InitialCallbackReceived = false;
    var expectedDelivery = UaDateTime.utcNow();
    expectedDelivery.addMilliSeconds( subscription2.RevisedPublishingInterval );
    while( UaDateTime.utcNow() < expectedDelivery ) {
        PublishHelper.Execute( { FirstPublish: true } );
        if( PublishHelper.CurrentlyContainsData() ) {
            if( subscription2.SubscriptionId === PublishHelper.Response.SubscriptionId ){
                subscription2.InitialCallbackReceived = true;
                break;
            }
            else print( "RETRY Publish, received different Subscription..." );
        }
        else print( "RETRY Publish to get Subscription2 initial data..." );
    }
    Assert.True( subscription2.InitialCallbackReceived, "Subscription#2 did not provide an initial data-change notification on subscription 2 (SubscriptionId: " + subscription2.SubscriptionId + ").", "Subscription2 initial data received." );

    var clonedItems2 = MonitoredItem.Clone( originalItems500 );
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

    subscription3.InitialCallbackReceived = false;
    expectedDelivery = UaDateTime.utcNow();
    expectedDelivery.addMilliSeconds( subscription3.RevisedPublishingInterval );
    while( UaDateTime.utcNow() < expectedDelivery ) {
        PublishHelper.Execute( { FirstPublish: true } );
        if( PublishHelper.CurrentlyContainsData() ) {
            if( subscription3.SubscriptionId === PublishHelper.Response.SubscriptionId ){
                subscription3.InitialCallbackReceived = true;
                break;
            }
            else print( "RETRY Publish (seeking Subscription3), received different Subscription..." );
        }
        else print( "RETRY Publish seeking Subscription3 initial data. Keep alive received for subscriptionId: " + PublishHelper.Response.SubscriptionId );
    }
    Assert.True( subscription3.InitialCallbackReceived, "Subscription#3 did not provide an initial data-change notification on subscription 3 (SubscriptionId: " + subscription3.SubscriptionId + ").", "Subscription3 initial data received." );


    // clean-up
    // delete first subscription's items, but keep the subscription
    DeleteMonitoredItemsHelper.Execute( {
            ItemsToDelete: originalItems500, 
            SubscriptionId: defaultSubscription,
            MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall,
            SuppressMessaging: true
            } );

    // delete second subscription/items
    DeleteMonitoredItemsHelper.Execute( {
            ItemsToDelete: clonedItems1, 
            SubscriptionId: subscription2,
            MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall,
            SuppressMessaging: true
            } );
    
    DeleteSubscriptionsHelper.Execute( { 
            SubscriptionIds: subscription2 
            } );

    // delete third subscription/items
    DeleteMonitoredItemsHelper.Execute( {
            ItemsToDelete: clonedItems2, 
            SubscriptionId: subscription3,
            MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall,
            SuppressMessaging: true
            } );

    DeleteSubscriptionsHelper.Execute( { 
            SubscriptionIds: subscription3
            } );

    clonedItems1 = null;
    clonedItems2 = null;

    PublishHelper.Clear();
    return( true );
}// function createMonitoredItems500x3subscriptions()

Test.Execute( { Procedure: createMonitoredItems500x3subscriptions } );