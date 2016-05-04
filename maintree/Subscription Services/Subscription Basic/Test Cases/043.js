/*  Test 5.10.3 Test 1 prepared by Development; compliance@opcfoundation.org
    Description: Modifies a valid (enabled) subscription by disabling it.
        This script works by:
         1) creating 2 monitored items
         2) subscribing to them
         3) calling Publish once, to verify we are receiving data
         4) disabling a subscription
         5) calling Publish again, to verify we do not receive data for the disabled subscription. */

Test.Execute( { Procedure: function test() {
    const DELAYTIMER = 1000;
    var basicSubscription1 = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: basicSubscription1 } ) ) {
        var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];

        // 4 params are: (1) items to monitor (2) timestamps (3) subscription (4) sesssion
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: basicSubscription1 } ) ) {
            wait( DELAYTIMER );
            // call Publish() to make sure that we do receive data.
            if( PublishHelper.Execute( { FirstPublish: true } ) ) {
                if( Assert.Equal( true, PublishHelper.CurrentlyContainsData(), "We expect a DataChange" ) ) {
                    print( "SetPublishMode to be disabled for subscriptionId: " + basicSubscription1.SubscriptionId );
                    // set publishing mode
                    if( SetPublishingModeHelper.Execute( { SubscriptionIds: basicSubscription1, PublishingEnabled: false } ) ) {
                        // Write a value to the monitoredItem
                        GenerateScalarValue( item.Value.Value, UaNodeId.GuessType( item.NodeSetting ), 1 );
                        WriteHelper.Execute( { NodesToWrite: item } );
                        // add a delay to give UA Server time to acquire some data
                        wait( DELAYTIMER );
                        // LAST STEP: call Publish() again, this time we expect no data!
                        if( PublishHelper.Execute() ) Assert.Equal( false, PublishHelper.CurrentlyContainsData(), "We DO NOT expect DataChanges" );
                    }
                }
            }
            // delete the monitoredItems
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: basicSubscription1 } );
        }// if createMonItems
    }
    // delete all subscriptions added above
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription1 } );
    return( true );
} } );