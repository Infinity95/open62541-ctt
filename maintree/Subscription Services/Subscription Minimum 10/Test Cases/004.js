/*  Test 17 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Disables each odd subscription in 10 active subscriptions. */

Test.Execute( { Debug: true, Procedure: function test() {
    // create 10 active subscriptions
    var subscriptions = [], items = [];

    for( i=0; i<10; i++ ) {
        subscriptions.push( new Subscription() ); 
        items[i] = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings );
        ReadHelper.Execute( { NodesToRead: items[i] } );
        if( CreateSubscriptionHelper.Execute( { Subscription: subscriptions[i] } ) ) {
            // add some monitored items our subscriptions
            if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items[i], TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscriptions[i] } ) ) return( false );
        }
    }

    // now to call Publish() on all of these subscriptions to make sure that
    // we are NOT receiving any data change notifications...
    addLog( "call Publish() to make sure that we receive data for each subscription." );
    for( i=0; i<subscriptions.length; i++ ) {
        PublishHelper.Execute(); //do not acknowledge any subscriptions
        Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a callback." );
    }

    // set publishing mode, Disable every other subscriptions
    var oddSubscriptions = [];
    for( var i=0; i<subscriptions.length; i++ ) if( i % 2 == 1 ) oddSubscriptions.push( subscriptions[i] );
    if( SetPublishingModeHelper.Execute( { SubscriptionIds: oddSubscriptions, PublishingEnabled: false } ) ) {
        var receivedSubscriptions = [];

        // write to all items
        for( var o=0; o<items.length; o++ ) {
            for( var i=0; i<items[o].length; i++ ) UaVariant.Increment( { Value: items[o][i].Value } );
            WriteHelper.Execute( { NodesToWrite: items[o], ReadVerification: false } );
        }//for o

        // wait to ensure we get data
        PublishHelper.WaitInterval( { Items: items[0], Subscription: subscriptions[0] } );

        // we'll call Publish() a number of times to see which subscriptions return data
        // call Publish() 6 times, the first 5 should contain data; 6th a keep alive (first 5 in this loop)
        for( var s=0; s<5; s++ ) {
            PublishHelper.Execute( );
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected a data change for the active subscriptions." ) ) {
                receivedSubscriptions.push( PublishHelper.Response.SubscriptionId );
            }
        }//for s...

        // now the 6th publish
        PublishHelper.Execute();
        Assert.False( PublishHelper.CurrentlyContainsData(), "Expected a keep alive." );

        // now to check that each returned subscription is one that should have been returned.
        for( var i=0; i<receivedSubscriptions.length; i++ ) {
            // check the state of each subscription
            for( var s=0; s<subscriptions.length; s++ ) {
                if( subscriptions[s].SubscriptionId === receivedSubscriptions[i] ) {
                    Assert.True( subscriptions[s].PublishingEnabled, "Received a data change for a subscription that was disabled." );
                    break;
                }
            }//for s
        }//for i

    }//SetPublishingModeHelper

    // delete all subscriptions added above
    for( i=0; i<subscriptions.length; i++ ) {
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items[i], SubscriptionId: subscriptions[i] } )
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions[i] } );
    }
    return( true );
} } );