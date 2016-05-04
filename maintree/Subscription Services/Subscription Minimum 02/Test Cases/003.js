/*  Test 5.10.1 Test 32, prepared by Nathan Pocock; nathan.pocockopcfoundation.org
    Description: Create two subscriptions with one whose priority is larger. Add 2 items per subscription and call Publish() 4 times. */

function createSubscription5101032() {
    var summaryInformation = []; // will store text to say "priority x subscription callback count received X, expected to be in range of Y and Z." etc.
    var priorities = [ 100, 200, 0 ];
    var subscriptions = [ 
        new Subscription2( { Priority: 50, MaxNotificationsPerPublish:1 } ), 
        new Subscription2( { Priority: 51, MaxNotificationsPerPublish:1 } )
        ];

    var items1 = MonitoredItem.GetRequiredNodes( { Settings: Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, Number: 2 } );
    var items2 = MonitoredItem.GetRequiredNodes( { Settings: Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, Number: 2 } );
    var allItems = items1.concat( items2 );

    // get the initial values for all items
    ReadHelper.Execute( { NodesToRead:allItems } );

    // create first subscription
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscriptions[0] } ) ) return( false );
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items1, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId :subscriptions[0] } ) ) {
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions[0] } );
        return( false );
    }

    // create second subscription
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscriptions[1] } ) ) return( false );
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items2, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscriptions[1] } ) ) {
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions[0] } );
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions[1] } );
        return( false );
    }
    summaryInformation.push( "Created subscription #1: id: " + subscriptions[0].SubscriptionId + "; priority: " + subscriptions[0].Priority + "; items added: " + items1.length );
    summaryInformation.push( "Created subscription #2: id: " + subscriptions[1].SubscriptionId + "; priority: " + subscriptions[1].Priority + "; items added: " + items2.length );

    // register subscriptions with Publish 
    PublishHelper.RegisterSubscription( subscriptions );

    // call Publish() 4 times (twice per subscription), to get the initial data changes 
    PublishHelper.WaitInterval( { Items: items2, Subscription: subscriptions[0] } );
    for( var p=0; p<4; p++ ) PublishHelper.Execute();

    // write a value to ALL items
    for( var i=0; i<allItems.length; i++ ) UaVariant.Increment( { Value: allItems[i].Value } );
    WriteHelper.Execute( { NodesToWrite:allItems, ReadVerification:false } );
    summaryInformation.push( "Values written to all subscribed monitored items (both subscriptions)." );

    PublishHelper.WaitInterval( { Items: allItems, Subscription: subscriptions[0] } );

    // call Publish() 4 times to see if we get the data changes in the order expected
    var firstReceivedDictionary = new Dictionary();
    // publish #1
    PublishHelper.Execute();
    if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected Publish #1 to receive a data change." ) ) {
        firstReceivedDictionary.Add( PublishHelper.Response.SubscriptionId );
        Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected Publish #1 to have ONE notification in the data change." );
        Assert.True( PublishHelper.Response.MoreNotifications, "Expected Publish #1 to show MoreNotifications=TRUE." );
    }
    var pub1Sub = PublishHelper.Response.SubscriptionId;

    // publish #2
    PublishHelper.Execute();
    if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected Publish #2 to receive a data change." ) ) {
        Assert.Equal( pub1Sub, PublishHelper.Response.SubscriptionId, "Expected to receive the continued data-change information for the same subscription as Publish #1." );
        Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected Publish #2 to have ONE notification in the data change." );
        Assert.False( PublishHelper.Response.MoreNotifications, "Expected Publish #2 to show MoreNotifications=FALSE." );
    }
    summaryInformation.push( "Publish #1 and #2 called to obtain the data changes for the[intended]  high-priority subscription." );

    // publish #3
    PublishHelper.Execute();
    if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected Publish #3 to receive a data change." ) ) {
        firstReceivedDictionary.Add( PublishHelper.Response.SubscriptionId );
        Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected Publish #3 to have ONE notification in the data change." );
        Assert.True( PublishHelper.Response.MoreNotifications, "Expected Publish #3 to show MoreNotifications=TRUE." );
    }
    var pub3Sub = PublishHelper.Response.SubscriptionId;

    // publish #4 
    PublishHelper.Execute();
    if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected Publish #4 to receive a data change." ) ) {
        Assert.Equal( pub3Sub, PublishHelper.Response.SubscriptionId, "Expected to receive the continued data-change information for the same subscription as Publish #3." );
        Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected Publish #4 to have ONE notification in the data change." );
        Assert.False( PublishHelper.Response.MoreNotifications, "Expected Publish #4 to show MoreNotifications=FALSE." );
    }
    summaryInformation.push( "Publish #3 and #4 called to obtain the data changes for the [intended] lwo-priority subscription." );

    // publish #5 is keep alive for hi-priority sub
    wait( subscriptions[0].RevisedPublishingInterval * subscriptions[0].RevisedMaxKeepAliveCount ); // wait long enough to cause both subscriptions to be late.
    PublishHelper.Execute();
    Assert.False( PublishHelper.CurrentlyContainsData(), "Expected Publish #5 to be a keep-alive only." );
    firstReceivedDictionary.Add( PublishHelper.Response.SubscriptionId );

    // publish #6 is a keep alive for lo-priority sub
    PublishHelper.Execute();
    Assert.False( PublishHelper.CurrentlyContainsData(), "Expected Publish #6 to be a keep-alive only." );
    summaryInformation.push( "Publish #5 and #6 called to obtain keep-alives for both subscriptions." );

    //clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items1, SubscriptionId: subscriptions[0] } );
    DeleteSubscriptionsHelper.Execute(  { SubscriptionIds: subscriptions[0] } );
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items2, SubscriptionId: subscriptions[1] } );
    DeleteSubscriptionsHelper.Execute(  { SubscriptionIds: subscriptions[1] } );

    // unregister subscriptions with Publish 
    PublishHelper.UnregisterSubscription( subscriptions );
    PublishHelper.Clear();
    print( summaryInformation.toString() );


    // analysis, which subscription was reported first, most of the time?
    var analysis = firstReceivedDictionary.ToHighestOccurrence();
    summaryInformation.push( "SubscriptionId received first, most of the time: " + analysis.Values._values[0] );
    Assert.Equal( 1, analysis.Values.length(), "Expected only 1 subscription to be the dominant subscription that is returned first, most of the time." );
    if( Assert.Equal( subscriptions[1].SubscriptionId, analysis.Values._values[0], "Expected subscriptionId: " + subscriptions[1].SubscriptionId + " to be the dominant subscription that is received first, most of the time.", undefined, LOGWARNING) ) {
        summaryInformation.push( "Subscription received first, most of the time, met the expectation. Priority is observed within this server." );
    }
    else summaryInformation.push( "Subscription received first, most of the time, was NOT the expected subscription. Expected SubscriptionId: " + subscriptions[1].SubscriptionId + " to win. Priorities are not observed within this server." );

    // display our narrative
    print( summaryInformation.toString() );
    return( true );
}

Test.Execute( { Procedure: createSubscription5101032 } );