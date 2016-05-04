/*  Test prepared by nathan.pocock@opcfoundation.org (original work by: Anand Taparia; ataparia@kepware.com)
    Description: 2 subscriptions with 1 disabled item; Change reportingMode=REPORTING (item2) and call Publish to receive data. */

Test.Execute( { Procedure: function test() {
    var item1 = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( !isDefined( item1 ) ) { addSkipped( "Static Scalar (numeric)" ); return( false ); }

    // create a subscription in each session
    var subscription1 = new Subscription();
    var subscription2 = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription1 } ) ) return( false );
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription2 } ) ) { DeleteSubscriptionHelper.Execute( { Subscription: subscription1 } ); return( false ); }

    // create the monitoredItem for session #1 and session #2
    item1.MonitoringMode = MonitoringMode.Disabled;
    var item2 = item1.clone();

    // add monitoredItems to subscriptions
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item1, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription1 } ) ) return( false );
    // add monitoredItems to subscriptions
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item2, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription2 } ) ) {
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item2, SubscriptionId: subscription2 } );
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: [ subscription1, subscription2 ] } );
        return( false );
    }

    // call Publish(), make sure we get a keep alive for both
    // we have to 2 call Publish() twice, once per subscription. Neither should return a value.
    PublishHelper.WaitInterval( { Items: item2, Subscription: subscription2 } );
    PublishHelper.Execute();
    Assert.Equal( false, PublishHelper.CurrentlyContainsData(), "Publish() yielded data for an item that is DISABLED!" );

    PublishHelper.Execute();
    Assert.Equal( false, PublishHelper.CurrentlyContainsData(), "Publish() yielded data for an item that is DISABLED!" );

    // now to change the monitoringMode to REPORTING in subscription #2.
    addLog( "Modifying the monitoringMode as REPORTING for subscription 2" );
    var SetMonitoringModeHelper2 = new SetMonitoringModeService( { Session: Test.Session.Session } );
    if( SetMonitoringModeHelper2.Execute( { MonitoringMode: MonitoringMode.Reporting, SubscriptionId: subscription2, MonitoredItemIds: item2 } ) ) {
        // wait for at least one sampling interval so as to allow the server some time to poll the data source.
        print( "\t** Wait one RevisedPublishingInterval (" + item1.RevisedSamplingInterval + " ms) **" );
        PublishHelper.WaitInterval( { Items: item2, Subscription: subscription2 } );

        // call Publish(), we expect a dataChange for the item that is now reporting 
        // we have 2 subscriptions, so we MIGHT need to call Publish() twice, just in case the response comes back 
        // as a keepAlive for the 1st subscription.
        for( var p=0; p<2; p++ ) {
            PublishHelper.Execute();
            if( PublishHelper.Response.SubscriptionId === subscription2.SubscriptionId ) break;
            addLog( "** CALLING PUBLISH AGAIN! we received a publish response for the first subscription (Id: " + subscription1.SubscriptionId + ") although we're actually waiting for subscription #2." );
        }
        Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange as the disabled item (MonitoredItemId: " + item2.MonitoredItemId + ") in Subscription #2 (SubscriptionId: " + subscription2.SubscriptionId + ") was changed to reporting." );

        // call Publish() several times and verify that no more data is received because: 
        //  a.) one item in its own subscription is DISABLED.
        //  b.) the other item that is REPORTING is static and therefor not changing value.
        for( var i=0; i<4; i++ ) {
            PublishHelper.Execute();
            Assert.False( PublishHelper.CurrentlyContainsData(), "Received an unexpected dataChange! we have a disabled item (MonitoredItem: " + item2.MonitoredItemId + ") in Subscription #1 (SubscriptionId: " + subscription1.SubscriptionId + ")\r\nand one REPORTING item (MonitoredItemId: " + item2.MonitoredItemId + ") in Subscription #2 (SubscriptionId: " + subscription2.SubscriptionId + ") although its value should be static and not changing." );
        }//for i
    }

    // CLEAN UP
    SetMonitoringModeHelper2 = null;
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item1, SubscriptionId: subscription1 } );
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item2, SubscriptionId: subscription2 } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: [ subscription1, subscription2 ] } );
    PublishHelper.Clear();
    return( true );
} } );