/*  Test 5.10.2 Test 21, prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create two subscriptions with their priorities being equal. Modify the second subscriptions to have a HIGHER priority.
          Write some values and call Publish(). Then lower the second subscriptions' priority to have the least priority.
          Write more values and call Publish(). */

function modifySubscription5102021() {
    const SUBSCRIPTION_WAIT_DELTA = 50;
    var sub1Items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    if( !isDefined( [ sub1Items, sub1Items.length ] ) && sub1Items.length > 2 ) {
        addSkipped( "Not enough static scalar items configured." );
        return( false );
    }
    // create another copy of the items
    var sub2Items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    var allItems = [ sub1Items, sub2Items ];
    // get the initial values for all items
    ReadHelper.Execute( { NodesToRead: sub1Items.concat( sub2Items ) } );
    var subscriptions = [ new Subscription(), new Subscription() ];
    for( var i=0; i<2; i++ ) {
        subscriptions[i].Priority = 75;    // set a default value, then we can create a lesser value later.
        if( !CreateSubscriptionHelper.Execute( { Subscription: subscriptions[i] } ) ) return( false );
        if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: allItems[i], TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscriptions[i] } ) ) {
            DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions[i] } );
            return( false );
        }
        // register subscriptions with Publish 
        PublishHelper.RegisterSubscription( subscriptions );
    }
    // get the initial data-changes out of the way; we expect 2 notifications.
    wait( subscriptions[0].RevisedPublishingInterval + SUBSCRIPTION_WAIT_DELTA );
    PublishHelper.Execute();
    Assert.True( PublishHelper.CurrentlyContainsData(), "Expected the initial data for one of our subscriptions." );
    PublishHelper.Execute();
    Assert.True( PublishHelper.CurrentlyContainsData(), "Expected the initial data of our other subscription." );
    PublishHelper.Execute();
    Assert.False( PublishHelper.CurrentlyContainsData(), "Did not expect to receive any more notifications." );

    var firstReceivedDictionary = new Dictionary();

    // make the first subscription have the higher priority
    subscriptions[0].Priority -= 50;
    ModifySubscriptionHelper.Execute( { SubscriptionId: subscriptions[0] } );

    // in a loop, Write() values to the items and then call Publish(). Record the first subscription received.
    for( var l=0; l<10; l++ ) {
        // increment all values and then write them
        for( var i=0; i<sub1Items.length; i++ ) UaVariant.Increment( { Value: sub1Items[i].Value } );
        WriteHelper.Execute( { NodesToWrite:sub1Items, ReadVerification:false } );
        PublishHelper.WaitInterval( { Items: sub1Items, Subscription: subscriptions[0] } );
        //  call Publish()() once per subscription
        for( var s=0; s<subscriptions.length; s++ ) {
            // now to call Publish() 3 times again; same expectations as before except we definitely want to see the first subscription come back first because of the higher priority.
            PublishHelper.Execute();
            Assert.True( PublishHelper.CurrentlyContainsData(), "Expected the initial data for one of our subscriptions." );
            if( s === 0 )firstReceivedDictionary.push( PublishHelper.Response.SubscriptionId );
        }
    }

    // analyze which subscription was returned first, most of the time
    var analysis = firstReceivedDictionary.ToHighestOccurrence();
    var messages = [ "Analysis of subscription #1 as the LOW priority subscription." ];
    messages.push( "SubscriptionId received first, most of the time: " + analysis.Values._values[0] );
    Assert.Equal( 1, analysis.Values.length(), "Expected only 1 subscription to be the dominant subscription that is returned first, most of the time." );
    if( Assert.Equal( subscriptions[1].SubscriptionId, analysis.Values._values[0], "Expected subscriptionId: " + subscriptions[1].SubscriptionId + " to be the dominant subscription that is received first, most of the time.", undefined, LOGWARNING ) ) {
        messages.push( "Subscription received first, most of the time, met the expectation. Priority is observed within this server." );
    }
    else {
        messages.push( "Subscription received first, most of the time, was NOT the expected subscription. Expected SubscriptionId: " + subscriptions[1].SubscriptionId + " to win. Priorities are not observed within this server." );
    }

    // make the first subscription have the lowest priority
    subscriptions[0].Priority += 100;
    ModifySubscriptionHelper.Execute( { SubscriptionId: subscriptions[0] } );

    // in a loop, Write() values to the items and then call Publish(). Record the first subscription received.
    firstReceivedDictionary = new Dictionary();
    for( var l=0; l<10; l++ ) {
        // increment all values and then write them
        for( var i=0; i<sub1Items.length; i++ ) UaVariant.Increment( { Value: sub1Items[i].Value } );
        WriteHelper.Execute( { NodesToWrite:sub1Items, ReadVerification:false } );
        wait( subscriptions[0].RevisedPublishingInterval + SUBSCRIPTION_WAIT_DELTA );
        //  call Publish()() once per subscription
        for( var s=0; s<subscriptions.length; s++ ) {
            // now to call Publish() 3 times again; same expectations as before except we definitely want to see the first subscription come back first because of the higher priority.
            PublishHelper.Execute();
            Assert.True( PublishHelper.CurrentlyContainsData(), "Expected the initial data for one of our subscriptions." );
            if( s === 0 )firstReceivedDictionary.push( PublishHelper.Response.SubscriptionId );
        }
    }

    //clean-up
    for( var i=0; i<subscriptions.length; i++ ) {
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: allItems[i], SubscriptionId: subscriptions[i] } )
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions[i] } );
    }

    // unregister subscriptions with Publish 
    PublishHelper.UnregisterSubscription( subscriptions );
    PublishHelper.Clear();

    // analyze which subscription was returned first, most of the time
    analysis = firstReceivedDictionary.ToHighestOccurrence();
    messages.push( "Analysis of when Subscription #1 is the HIGH priority subscription." );
    messages.push( "SubscriptionId received first, most of the time: " + analysis.Values._values[0] );
    Assert.Equal( 1, analysis.Values.length(), "Expected only 1 subscription to be the dominant subscription that is returned first, most of the time." );
    if( Assert.Equal( subscriptions[0].SubscriptionId, analysis.Values._values[0], "Expected subscriptionId: " + subscriptions[0].SubscriptionId + " to be the dominant subscription that is received first, most of the time.", undefined, LOGWARNING ) ) {
        messages.push( "Subscription received first, most of the time, met the expectation. Priority is observed within this server." );
    }
    else {
        messages.push( "Subscription received first, most of the time, was NOT the expected subscription. Expected SubscriptionId: " + subscriptions[0].SubscriptionId + " to win. Priorities are not observed within this server." );
    }

    // display our narrative
    print( "Messages:\n" + messages.toString() );
    return( true );
}

Test.Execute( { Procedure: modifySubscription5102021 } );