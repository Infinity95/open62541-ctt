/*  Test 5.10.3 Test 2 prepared by Development; compliance@opcfoundation.org
    Description: Modifies a valid (disabled) subscription by enabling it.
        This script works by:
         1) creating 2 monitored items
         2) subscribing to them (disabled subscription)
         3) calling Publish once, to verify we are NOT receiving data
         4) enabling the subscription
         5) calling Publish again, to verify we ARE receiving data for the subscription. */

Test.Execute( { Procedure: function test() {
    // create a DISABLED subscriptiion...
    basicSubscription1 = new Subscription( null, false );
    if( CreateSubscriptionHelper.Execute( { Subscription: basicSubscription1 } ) ) {
        // add some monitored items to our subscription
        var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];

        // 4 params are: (1) items to monitor (2) timestamps (3) subscription (4) sesssion
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: basicSubscription1 } ) ) {
            // call Publish() to make sure that we do NOT receive data.
            addLog( "call Publish() to make sure that we DO NOT receive data." );
            if( PublishHelper.Execute() ) {
                if( Assert.Equal( false, PublishHelper.CurrentlyContainsData(), "Did not expect to receive data for a disabled subscription!" ) ) {
                    // NOW to ENABLE the subscription.
                    addLog( "SetPublishMode to be disabled for subscriptionId: " + basicSubscription1.SubscriptionId );
                    // set publishing mode
                    if( SetPublishingModeHelper.Execute( { SubscriptionIds: [basicSubscription1], PublishingEnabled: true } ) ) {
                        // LAST STEP: call Publish() again, this time we expect data!
                        addLog( "call Publish() to make sure that we DO receive data." );
                        if( PublishHelper.Execute() ) Assert.Equal( true, PublishHelper.CurrentlyContainsData(), "Expected DataChanges!" );
                    }
                }
            }
            // delete the monitoredItems
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: basicSubscription1 } );
        }
    }
    // delete subscription added above
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription1 } );
    return( true );
} } );