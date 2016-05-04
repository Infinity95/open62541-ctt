/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Change the ClientHandle for the first item to another unique number, modify the remaining items by changing their queueSize (e.g. from 1 to 2). */

function modify010(){ 
    // get some items and add them to a subscription
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, 0 );
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, SubscriptionId: subscription } ) ) {
                // lets call Publish, just to make sure that we receive a notification
                PublishHelper.WaitInterval( { Items: items, Subscription: subscription } );
                PublishHelper.Execute( { FirstPublish: true } );
                Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() did not receive the initial data-change.", "Publish() correctly received the initial data-change." );

                // now to modify our first monitored item only; we expect this to succeed.
                items[0].ClientHandle += 100;
                items[0].QueueSize = 2;
                ModifyMonitoredItemsHelper.Execute( { ItemsToModify: items[0], SubscriptionId: subscription } );

                // clean-up
                DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: subscription } );
        }// create monitored items

        // clean-up
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    }// create subscription
    return( true );
}

Test.Execute( { Procedure: modify010 } );