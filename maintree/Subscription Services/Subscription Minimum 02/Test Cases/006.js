/*  Test 5.10.2 Test 19, prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
          Create two subscriptions with their priorities being equal.
          Modify one subscription to have a LOWER priority.
          Write some values and call Publish(). */

function modifySubscription5102019()
{
    const SUBSCRIPTION_WAIT_DELTA = 50;
    var sub1Items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    if( !isDefined( [ sub1Items, sub1Items.length ] ) && sub1Items.length > 2 )
    {
        addSkipped( "Not enough static scalar items configured." );
        return( false );
    }
    // create another copy of the items
    var sub2Items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    var allItems = [ sub1Items, sub2Items ];

    // get the initial values for all items
    ReadHelper.Execute( { 
                NodesToRead: sub1Items.concat( sub2Items ) } );

    var subscriptions = [ new Subscription(), new Subscription() ];

    for( var i=0; i<2; i++ )
    {
        subscriptions[i].Priority = 100;    // set a default value, then we can create a lesser value later.
        if( !CreateSubscriptionHelper.Execute( { 
                    Subscription: subscriptions[i] } ) )
        {
            return( false );
        }// if createSubscription
        if( !CreateMonitoredItemsHelper.Execute( { 
                    ItemsToCreate: allItems[i], 
                    TimestampsToReturn: TimestampsToReturn.Both, 
                    SubscriptionId: subscriptions[i] } ) )
        {
            DeleteSubscriptionsHelper.Execute( { 
                        SubscriptionIds: subscriptions[i] } );
            return( false );
        }
        // register subscriptions with Publish 
        PublishHelper.RegisterSubscription( subscriptions );
    }

    wait( subscriptions[0].RevisedPublishingInterval + SUBSCRIPTION_WAIT_DELTA );

    // get the initial data-changes out of the way; we expect 2 notifications.
    PublishHelper.Execute();
    Assert.True( PublishHelper.CurrentlyContainsData(), "Expected the initial data for one of our subscriptions." );
    PublishHelper.Execute();
    Assert.True( PublishHelper.CurrentlyContainsData(), "Expected the initial data of our other subscription." );
    PublishHelper.Execute();
    Assert.False( PublishHelper.CurrentlyContainsData(), "Did not expect to receive any more notifications." );


    // now modify the 1st subscription
    subscriptions[0].Priority -= 100;
    ModifySubscriptionHelper.Execute( {
                SubscriptionId: subscriptions[0] } );

    // in a loop, write some values and call Publish()()
    var firstReceivedDictionary = new Dictionary();
    for( var l=0; l<10; l++ )
    {
        // increment all values and then write them
        for( var i=0; i<sub1Items.length; i++ ) UaVariant.Increment( { Value: sub1Items[i].Value } );
        WriteHelper.Execute( {
                NodesToWrite:sub1Items, 
                ReadVerification:false } );

        wait( subscriptions[0].RevisedPublishingInterval + SUBSCRIPTION_WAIT_DELTA );

        //  call Publish()() once per subscription
        for( var s=0; s<subscriptions.length; s++ )
        {
            // now to call Publish() 3 times again; same expectations as before except we definitely want to see
            // the first subscription come back first because of the higher priority.
            PublishHelper.Execute();
            Assert.True( PublishHelper.CurrentlyContainsData(), "Expected the initial data for one of our subscriptions." );
            if( s === 0 )firstReceivedDictionary.push( PublishHelper.Response.SubscriptionId );
        }
    }



    //clean-up
    for( var i=0; i<subscriptions.length; i++ )
    {
        DeleteMonitoredItemsHelper.Execute( {
                    ItemsToDelete: allItems[i], 
                    SubscriptionId: subscriptions[i] } )
        DeleteSubscriptionsHelper.Execute( { 
                    SubscriptionIds: subscriptions[i] } );
    }

    // unregister subscriptions with Publish 
    PublishHelper.UnregisterSubscription( subscriptions );
    PublishHelper.Clear();


    // now to analyze the first-received subscriptions
    var analysis = firstReceivedDictionary.ToHighestOccurrence();
    var messages = [];
    messages.push( "SubscriptionId received first, most of the time: " + analysis.Values._values[0] );
    Assert.Equal( 1, analysis.Values.length(), "Expected only 1 subscription to be the dominant subscription that is returned first, most of the time." );
    if( Assert.Equal( subscriptions[1].SubscriptionId, analysis.Values._values[0], "Expected subscriptionId: " + subscriptions[1].SubscriptionId + " to be the dominant subscription that is received first, most of the time.", undefined, LOGWARNING ) )
    {
        messages.push( "Subscription received first, most of the time, met the expectation. Priority is observed within this server." );
    }
    else
    {
        messages.push( "Subscription received first, most of the time, was NOT the expected subscription. Expected SubscriptionId: " + subscriptions[1].SubscriptionId + " to win. Priorities are not observed within this server." );
    }

    // display our narrative
    print( "\nMessages:\n" + messages.toString() );
    return( true );
}

Test.Execute( { Procedure: modifySubscription5102019 } );