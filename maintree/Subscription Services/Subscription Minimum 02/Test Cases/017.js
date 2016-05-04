/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Multiple subscriptions, when polled in a loop, are serviced equally. */

function CreateSubscription017() { 

    // create our subscriptions
    var subs = [];
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
    }//for i...


    // add a monitored item to each subscription 
    var subItems = [];
    for( var i=0; i<SUBSCRIPTIONCOUNT; i++ ) { 

        // clone the item
        subItems.push( MonitoredItem.Clone( defaultStaticItem ) );
        // add to subscription
        if( !CreateMonitoredItemsHelper.Execute( { 
                    ItemsToCreate: subItems[i],
                    SubscriptionId: subs[i]
                    } ) ) break;
    }//for i...


    // read all items, to get initial values 
    ReadHelper.Execute( { 
            NodesToRead: subItems
            } );


    // now the test, 3 iterations of Write, Publish, Check 
    for( var i=0; i<3; i++ ) { 

        var receivedSubIds = new IntegerSet();

        // write new values 
        for( var w=0; w<subItems.length; w++ ) UaVariant.Increment( { Value: subItems[w].Value } );
        WriteHelper.Execute( { 
                    NodesToWrite: subItems,
                    ReadVerification: false
                    } );

        // call Publish #1 & #2 make sure we have a data-change
        wait( subs[0].RevisedPublishingInterval );
        for( var p=0; p<SUBSCRIPTIONCOUNT; p++ ) {
            PublishHelper.Execute();
            Assert.True( PublishHelper.CurrentlyContainsData(), "Publish().Response.NotificationMessage does not contain a data-change." );
            // make sure this subscription was not previously serviced in this loop iteration
            if( Assert.False( receivedSubIds.contains( PublishHelper.Response.SubscriptionId ), "Publish().Response.SubscriptionId (" + PublishHelper.Response.SubscriptionId + ") already received in this round. Server not equally servicing subscriptions!", "Publish().Response.Subscription (" + PublishHelper.Response.SubscriptionId + ") is unique in this loop-iteration." ) )
                receivedSubIds.insert( PublishHelper.Response.SubscriptionId );
        }

    }//for i

    // clean-up
    DeleteSubscriptionsHelper.Execute( { 
            SubscriptionIds: subs 
            } );
    return( true );
}//func

Test.Execute( { Procedure: CreateSubscription017 } );