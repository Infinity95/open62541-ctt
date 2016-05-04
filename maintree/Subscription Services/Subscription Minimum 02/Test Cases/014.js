/*  Test 5.10.3 Test 15, prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Create 2 subscriptions per session. Verify both subscriptions are returning data. Disable 1 subscription.
        Verify the subscription still returning is returning data, except for the disabled. */

function setPublishingMode593015()
{
    var subscriptions = [ 
    new Subscription(), 
    new Subscription() ];

    var publishCount = subscriptions.length * 2;
    var allItems     = [];
    var i;

    for( i=0; i<subscriptions.length; i++ )
    {
        if( CreateSubscriptionHelper.Execute( { Subscription: subscriptions[i] } ) )
        {
            // add some monitored items our subscriptions
            var items = MonitoredItem.Clone( defaultStaticItem );
            if( !CreateMonitoredItemsHelper.Execute( { 
                        ItemsToCreate: items, 
                        TimestampsToReturn: TimestampsToReturn.Both, 
                        SubscriptionId: subscriptions[i]
                        } ) )
            {
                return( false );
            }
            allItems[i] = items;
        }
    }


    // read all items, to get their initial value 
    ReadHelper.Execute( {
            NodesToRead:allItems } );

    // now to call Publish() on all of these subscriptions to make sure that
    // we are NOT receiving any data change notifications...
    addLog( "call Publish() to make sure that we are NOT receiving data for enabled subscriptions." );
    for( i=0; i<publishCount; i++ )
    {
        PublishHelper.Execute( { 
                    NoAcks: true } ); //do not acknowledge any subscriptions
    }

    // now check which subscriptions provided dataChanges
    AssertSubscriptionCallbacks( subscriptions, PublishHelper );
    // clear the publish object's properties...
    PublishHelper.Clear();

    // set publishing mode, ENABLE ALL subscriptions
    if( SetPublishingModeHelper.Execute( { SubscriptionIds: subscriptions[0], PublishingEnabled: false } ) )
    {
        // write to the monitoredItem
        for( i=0; i<allItems.length; i++ ) UaVariant.Increment( { Value: allItems[i].Value } );
        WriteHelper.Execute( { NodesToWrite: allItems } );

        // we'll call Publish() a number of times to see if we do NOT get data changes
        // for any of our subscriptions.
        addLog( "\nPublish to be called now a maximum of " + publishCount + " times....NO DATACHANGES EXPECTED!" );
        for( var s=0; s<publishCount; s++ ) PublishHelper.Execute( { NoAcks: true } );
    }//SetPublishingModeHelper

    // now check which subscriptions provided dataChanges
    AssertSubscriptionCallbacks( subscriptions, PublishHelper );

    // delete all subscriptions added above
    for( i=0; i<subscriptions.length; i++ )
    {
        DeleteMonitoredItemsHelper.Execute( {
                    ItemsToDelete: allItems[i], 
                    SubscriptionId: subscriptions[i] 
                    } )
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions[i] } );
    }
    // clear the publish object's properties...
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: setPublishingMode593015 } );