/*  Test 5.10.1 Test 14, prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create a subscription where PublishingEnabled=FALSE. Verifies the publishing does not begin. */
   
function createSubscription5101014() {
    // step 1 - create the subscription and specify publishingEnabled=FALSE.
    basicSubscription = new Subscription( null, false );
    if( CreateSubscriptionHelper.Execute( { Subscription: basicSubscription } ) ) {
        // step 2 - adding some items to subscribe to (monitor).
        // define the monitored items and then make the call to monitor them!
        var items = [
            MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0],
            MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[1]
        ];

        // create the monitored items adding them to our subscription
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: basicSubscription } ) ) {
            PublishHelper.WaitInterval( { Items: items, Subscription: basicSubscription } );
            if( PublishHelper.Execute() ) {
                // check the NotificationData is empty.
                Assert.False( PublishHelper.CurrentlyContainsData(), "No results were expected since the subscription is disabled." );
                // check the serviceResult=Good and the SubscriptionId=0.
                if( Assert.True( PublishHelper.Response.ResponseHeader.ServiceResult.isGood(), "Publish() expected to succeed even with disabled subscriptions." ) ) {
                    Assert.Equal( basicSubscription.SubscriptionId, PublishHelper.Response.SubscriptionId, "Publish.Response.SubscriptionId should match the disabled subscription (PublishingEnabled=false).\nSee UA Part 4 section 5.13.5.3 (Publish Service Results) table 93, 'SubscriptionId' parameter description.\nUA Part 4 Table 80 (Subscription State Table) item #7." ); 
                }
            }
            //Now Delete the MonitoredItems
            if( !DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: basicSubscription } ) ) {
                addWarning( "Unable to delete the monitoredItems in the Publish test." );
            }
        }
    }
    // delete the subscription we added here 
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription } );
    return( true );
}

Test.Execute( { Procedure: createSubscription5101014 } );