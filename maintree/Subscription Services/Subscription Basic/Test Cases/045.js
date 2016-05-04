/*  Test 5.10.3 Test 3 prepared by Development; compliance@opcfoundation.org
    Description: Modifies a valid (enabled) subscription by enabling it (again).
        This script works by:
         1) creating 2 monitored items
         2) subscribing to them
         3) calling Publish once, to verify we are receiving data
         4) enabling a subscription
         5) calling Publish again, to verify we do not receive data for the disabled subscription. */

Test.Execute( { Procedure: function test() {
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( !ReadHelper.Execute( { NodesToRead: item } ) ) return( false );    // get the initial value
    // create an Enabled subscription
    var basicSubscription1 = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: basicSubscription1 } ) ) {
        // 4 params are: (1) items to monitor (2) timestamps (3) subscription (4) sesssion
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: basicSubscription1 } ) ) {
            // call Publish() to make sure that we do receive data.
            addLog( "call Publish() to make sure that we receive data." );
            PublishHelper.WaitInterval( { Items: item, Subscription: basicSubscription1 } );
            if( PublishHelper.Execute( { FirstPublish: true } ) ) {
                if( PublishHelper.CurrentlyContainsData() ) {
                    PublishHelper.SetItemValuesFromDataChange( item );
                    PublishHelper.PrintDataChanges();
                    addLog( "SetPublishMode to be disabled for subscriptionId: " + basicSubscription1.SubscriptionId );
                    // set publishing mode
                    if( SetPublishingModeHelper.Execute( { SubscriptionIds: basicSubscription1, PublishingEnabled: true } ) ) {
                        // Write a value to the node, this should cause a dataChange event to 
                        // be raised if the subscription were alive!
                        print( "\n\nWriting a value to cause a dataChange:\n\tValue originally: " + item.Value.Value );
                        UaVariant.Increment( { Value: item.Value } );
                        print( "\tValue now (before write): " + item.Value.Value );
                        WriteHelper.Execute( { NodesToWrite: item } );
                        // LAST STEP: call Publish() again, this time we expect data!
                        addLog( "call Publish() to make sure that we DO receive data." );
                        PublishHelper.WaitInterval( { Items: item, Subscription: basicSubscription1 } );
                        if( PublishHelper.Execute() ) Assert.True( PublishHelper.CurrentlyContainsData(), "We expect to receive data because we ENABLED the subscription!" );
                    }
                }
                else addError( "Publish() returned no dataChanges. NotificationMessage.NotificationData length: " + PublishHelper.Response.NotificationMessage.NotificationData.length );
            }
            // delete the monitoredItems
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: basicSubscription1 } );
        }
    }
    // delete all subscriptions added above
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription1 } );
    return( true );
} } );