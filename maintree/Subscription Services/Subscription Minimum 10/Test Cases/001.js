/*  Test 3, prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create 10 subscriptions; test with Publish.  */

function createSubscription5101020()
{
    var subs = [];
    var items = [];
    var subIds = new IntegerSet();
    for( var i=0; i<SUBSCRIPTIONCOUNT; i++ ) {

        // define the subscription
        subs.push( new Subscription() );

        // create the subscription; if it fails the undo the creation
        if( !CreateSubscriptionHelper.Execute( { 
                    Subscription: subs[i]
                    } ) ) {
            DeleteSubscriptions.Execute( { 
                    SubscriptionIds: subs
                    } );
        }
        subIds.insert( subs[i].SubscriptionId );

        // add the monitored item 
        var item = MonitoredItem.Clone( monitoredItem );
        if( CreateMonitoredItemsHelper.Execute( { 
                    ItemsToCreate: item,
                    SubscriptionId: subs[i]
                    }  ) )
            items.push( item );
    }//for i...

    // subscriptions added, now to make sure that they all come back 
    PublishHelper.WaitInterval( { Items: item, Subscription: subs[0] } );
    for( var i=0; i<SUBSCRIPTIONCOUNT; i++ ) {

        PublishHelper.Execute( { FirstPublish: true } );
        Assert.True( PublishHelper.CurrentlyContainsData(), "Publish().Response.NotificationMessage did not return an initial data-change notification." );
        if( Assert.True( subIds.contains( PublishHelper.Response.SubscriptionId ), "Publish().Response.SubscriptionId is not known by this test." ) )
            subIds.remove( PublishHelper.Response.SubscriptionId );
    }//for i

    // make sure all subscriptions were received 
    Assert.Equal( 0, subIds.length, "Publish() did not receive Subscription updates for: " + subIds.toString() );

    // clean-up
    for( var i=0; i<SUBSCRIPTIONCOUNT; i++ ) 
        DeleteMonitoredItemsHelper.Execute( { 
                    ItemsToDelete: items[i],
                    SubscriptionId: subs[i]
                    } );
    DeleteSubscriptionsHelper.Execute( { 
            SubscriptionIds: subs
            } );
    return( true );
}

Test.Execute( { Procedure: createSubscription5101020 } );