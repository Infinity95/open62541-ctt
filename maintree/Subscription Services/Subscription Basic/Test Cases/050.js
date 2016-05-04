/*  Test 5.10.4 Test 2, prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Calls Publish while acknowledging a valid sequenceNumber on a valid subscription. */

function publish5104002()
{
    const PUBLISHCALLCOUNT = 5; //how many times to call "Publish" in a loop.

    // step 1 - adding some items to subscribe to (monitor).
    // define the monitored items and then make the call to monitor them!
    var items = [
        MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0],
        MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[1]
    ];

    if( items == null || items.length == 0 )
    {
        addSkipped( "Static Scalar - 2 items needed" );
        return( false );
    }

    // step 2 - create the subscription.
    basicSubscription = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: basicSubscription } ) )
    {
        return( false );
    }

    // 4 params are: (1) items to monitor (2) timestamps (3) subscription (4) sesssion
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: basicSubscription } ) )
    {
        // wait for 1 publish interval to allow the monitoredItems to be polled.
        print( "Waiting " + basicSubscription.RevisedPublishingInterval + " msecs (1 publishingInterval) before calling Publish()" );
       PublishHelper.WaitInterval( { Items: items, Subscription: basicSubscription } );

        PublishHelper.Execute( { FirstPublish: true } ); // initial dataChange
        PublishHelper.Execute(); // acknowledge receipt of above

        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: basicSubscription } )
    }
    // delete the subscription we added here 
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription } );
    return( true );
}

Test.Execute( { Procedure: publish5104002 } );