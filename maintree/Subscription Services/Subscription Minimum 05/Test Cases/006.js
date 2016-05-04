/*  Test 1 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create 3 subscriptions of varying priorities. */

include( "./library/ResourceTesting/getItemsFromCSV.js" );

function createSubscription5101016()
{
    const MAX_SUBSCRIPTIONS = 3;
    const MAX_ITEMS = 50;
    const ITEMS_FILENAME = "./nodesFile.csv";

    var messages = [];

    // load a list of items from the CSV file.
    var items = MonitoredItem.fromNodeIds( NodeIdSettings.GetScalarStaticNodeIds( 5 ) );
    if( !isDefined( items ) || items.length < 5 )
    {
        addSkipped( "Not enough items configured for testing. Please add more Scalar nodes." );
        return( false );
    }

    // read the items to get their initial values 
    ReadHelper.Execute( { NodesToRead:items } );


    // we need 3 subscriptions
    var subscriptions = [];
    subscriptions[0] = new Subscription2( { Priority: 1,   PublishingInterval:1000 } );
    subscriptions[1] = new Subscription2( { Priority: 125, PublishingInterval:1000 } );
    subscriptions[2] = new Subscription2( { Priority: 255, PublishingInterval:1000 } );


    // clone our items between each subscription
    // create a "bucket" of items; an array of arrays, e.g. [subscriptions][items]
    var itemBuckets = [];
    for( var s=0; s<MAX_SUBSCRIPTIONS; s++ )
    {
        itemBuckets.push( MonitoredItem.Clone( items ) );
    }


    // create the subscriptions
    var subscriptionDictionary = new Dictionary();
    for( s=0; s<MAX_SUBSCRIPTIONS; s++ )
    {
        if( CreateSubscriptionHelper.Execute( { Subscription: subscriptions[s] } ) )
        {
            var str="";
            subscriptionDictionary.push( subscriptions[s].SubscriptionId );
            str = "Subscription created: Id=" + subscriptions[s].SubscriptionId + ";  Priority:" + subscriptions[s].Priority;
            // now pass that bucket into createMonitoredItems
            CreateMonitoredItemsHelper.Execute( {
				ItemsToCreate: itemBuckets[s], 
				TimestampsToReturn: TimestampsToReturn.Both, 
				SubscriptionId: subscriptions[s] } );
            str += "; Added " + itemBuckets[s].length + " items to subscription.";
            messages.push( str );
        }
    }//for s...

    messages.push( "About to call Publish() 5 times (once per subscription). Check if highest priority subscription received first..." );

    var firstReceivedDictionary = new Dictionary();
    // call Publish() #1 - get values for all subscriptions
    for( var i=0; i<MAX_SUBSCRIPTIONS; i++ )
    {
        // call Publish()(); remember the first received subscription; check for initial values...
        PublishHelper.Execute( { FirstPublish: true } );
        if( i==0 )firstReceivedDictionary.push( PublishHelper.Response.SubscriptionId );
        if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected Publish() " + (1+i) + " of 5 (loop #1) to yield the initial values for one of our 5 subscriptions." ) )
        {
            messages.push( "Publish() [loop 1] received iniital values for SubscriptionId: " + PublishHelper.Response.SubscriptionId );
        }
    }

    /* Now to loop a number of times to see if the high-priority subscription is favored over the other subscirptions
        How this will work:
            1. invoke a Write() to all monitored items.
            2. call Publish()()
            3. Record which subscription comes in first.
            4. Repeat loop */
    for( var l=0; l<10; l++ ) {
        // write to all items
        for( var i=0; i<items.length; i++ ) UaVariant.Increment( { Value: items[i].Value } );
        WriteHelper.Execute( { NodesToWrite:items, ReadVerification:false } );
        PublishHelper.WaitInterval( { Items: items, Subscription: subscriptions[0] } );
        for( var s=0; s<subscriptions.length; s++ ) {
            PublishHelper.Execute();
            if( s==0 )firstReceivedDictionary.push( PublishHelper.Response.SubscriptionId );
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected Publish() " + (1+s) + " of 5 (loop #" + (2+l) + ") to yield the new values for one of our 5 subscriptions." ) ) {
                messages.push( "Publish() " + (1+s) + " [loop " + (2+l) + "] received new values for SubscriptionId: " + PublishHelper.Response.SubscriptionId );
            }
        }
    }

    // CLEAN UP
    // delete the item & subscriptions
    for( s=0; s<MAX_SUBSCRIPTIONS; s++ ) {
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: itemBuckets[s], SubscriptionId:subscriptions[s].SubscriptionId } );
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions[s] } );
    }
    messages.push( MAX_SUBSCRIPTIONS + " subscriptions deleted." );

    // analyze which subscription was returned first, most of the time
    var analysis = firstReceivedDictionary.ToHighestOccurrence();
    messages.push( "SubscriptionId received first, most of the time: " + analysis.Values._values[0] );
    Assert.Equal( 1, analysis.Values.length(), "Expected only 1 subscription to be the dominant subscription that is returned first, most of the time." );
    if( Assert.Equal( subscriptions[MAX_SUBSCRIPTIONS-1].SubscriptionId, analysis.Values._values[0], "Expected subscriptionId: " + subscriptions[MAX_SUBSCRIPTIONS-1].SubscriptionId + " to be the dominant subscription that is received first, most of the time.", undefined, LOGWARNING ) ) {
        messages.push( "Subscription received first, most of the time, met the expectation. Priority is observed within this server." );
    }
    else {
        messages.push( "Subscription received first, most of the time, was NOT the expected subscription. Expected SubscriptionId: " + subscriptions[MAX_SUBSCRIPTIONS-1].SubscriptionId + " to win. Priorities are not observed within this server." );
    }

    // display our narrative
    print( "Messages:" );
    for( var m=0; m<messages.length; m++ ){ print( "\t" + messages[m] ); }
    return( true );
}

Test.Execute( { Procedure: createSubscription5101016 } );