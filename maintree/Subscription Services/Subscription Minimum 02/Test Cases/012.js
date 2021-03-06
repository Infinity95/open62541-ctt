/*  Test 5.10.3 Test 9 prepared by Development; compliance@opcfoundation.org
    Description: Enable multiple already-enabled subscriptions. */

function setPublishingMode5103009()
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
                        SubscriptionId: subscriptions[i] } ) )
            {
                return( false );
            }
            allItems[i] = items;
        }
    }

    // now to call Publish() on all of these subscriptions to make sure that
    // we are NOT receiving any data change notifications...
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
    if( SetPublishingModeHelper.Execute( { SubscriptionIds: subscriptions, PublishingEnabled: true } ) )
    {
        // write to the monitoredItem
        for( i=0; i<allItems.length; i++ )
        {
            GenerateScalarValue( allItems[i].Value.Value, allItems[i].DataType, 9 );
        }
        WriteHelper.Execute( {
                    NodesToWrite: allItems 
                    } );

        // we'll call Publish() a number of times to see if we do NOT get data changes
        // for any of our subscriptions.
        addLog( "\nPublish to be called now a maximum of " + publishCount + " times....NO DATACHANGES EXPECTED!" );
        for( var s=0; s<publishCount; s++ )
        {
            PublishHelper.Execute( { 
                        NoAcks: true } );
        }//for s...
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

Test.Execute( { Procedure: setPublishingMode5103009 } );