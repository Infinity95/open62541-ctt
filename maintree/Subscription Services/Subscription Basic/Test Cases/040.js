/*  Test 5.10.2 Test case 24 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Modifies a subsription's MaxNotificationsPerPublish to 1. */

function modifySubscription5102024() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings );
    if( !isDefined( items ) || items.length < 2 ) { addSkipped( "Not enough static scalar nodes defined; need 2 or more. Aborting." ); return( false ); }
    ReadHelper.Execute( { NodesToRead:items } );

    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) {
            // call Publish() to get the initial dataChange
            PublishHelper.WaitInterval( { Items: items, Subscription: subscription } );
            PublishHelper.Execute( { FirstPublish: true } );
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive initial data." ) ) Assert.Equal( items.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive " + items.length + " notifications in the initial publish response." );

            // modify subscription
            subscription.SetParameters2( { MaxNotificationsPerPublish:1 } );
            ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );

            var itemIds = new IntegerSet();
            // now write a value to all of the nodes 
            for( var i=0; i<items.length; i++ ) {
                UaVariant.Increment( { Value: items[i].Value.Value } );
                itemIds.insert( items[i].ClientHandle );
            }//for i
            WriteHelper.Execute( { NodesToWrite:items, ReadVerification:false } );

            // now to call Publish(); many calls should be needed 
            for( var i=0; i<items.length; i++ ) {
                PublishHelper.Execute();
                if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange notification. Publish call #" + i + " of " + items.length ) ) {
                    Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive ONE notification only. Publish call #" + i + " of " + items.length  );
                    itemIds.remove( PublishHelper.CurrentDataChanges[0].MonitoredItems[0].ClientHandle );
                    var expectMoreNotifications = itemIds.size() > 0;
                    Assert.Equal( expectMoreNotifications, PublishHelper.Response.MoreNotifications, "Publish().Response.MoreNotifications in error. More notifications " + ( expectMoreNotifications? "expected because notifications should remain on the Server. Publish call #" + i + " of " + items.length : "not expected." ) );
                }
                else {
                    addError( "Aborting test since Publish didn't yield the expected results. More Publish calls are unnecessary at this point." );
                    break;
                }
            }//for i

            // we should have received all items by now; (a) check our array; (b) expect publish KeepAlive
            if( !Assert.Equal( 0, itemIds.size(), "Expected all items to have been received in prior Publish() calls." ) ) {
                result = false;
                // now to show which items were not received
                var msg = "";
                for( var o=0; o<itemIds.size(); o++ ) { // o = outer
                    for( var i=0; i<items.length; i++ ) { // i = inner
                        if( items[i].ClientHandle === itemIds.atIndex(o) ) {
                            msg += "\n\t" + items[i].NodeSetting;
                            break;
                        }// found match?
                    }//for i...
                }//for o...
                if( msg.length > 0 ) addError( "Items not received in Publish: " + msg );
            }
            PublishHelper.Execute();
            Assert.False( PublishHelper.CurrentlyContainsData(), "Expected to receive a KeepAlive only as all notifications should have been previously received." );
        }
    }
    // delete the subscription we added here 
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: modifySubscription5102024 } );