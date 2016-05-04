/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Modifies a subsription's MaxNotificationsPerPublish to 10 (from 0).
        Tests this by invoking writes/publishes and counting the notifications.
        Difference between this and 26; DiscardOldest=FALSE now. */

Test.Execute( { Procedure: function test() {
    const DISCARDOLDEST = false, FILTER = null, QUEUE = 2, INDEXRANGE = "";
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings, 0, Attribute.Value, INDEXRANGE, MonitoringMode.Reporting, DISCARDOLDEST, FILTER, QUEUE );
    if( !isDefined( items ) || items.length < 6 ) {
        addSkipped( "Not enough static scalar nodes defined; need 5 or more. Aborting." );
        return( false );
    }
    var receivedItems = [];
    // get the initial values of the nodes
    // we will be writing to them later by incrementing their values, so we need a baseline.
    ReadHelper.Execute( { NodesToRead:items } );

    var info = [];
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) {
            // wait, and then call Publish() to get the initial dataChange
            PublishHelper.WaitInterval( { Items: items, Subscription: subscription } );
            PublishHelper.Execute( { FirstPublish: true } );
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive initial data." ) ) {
                Assert.Equal( items.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive " + items.length + " notifications in the initial publish response." );
            }
            else {
                // we didn't receive the notification, so call Publish() again to clear the queue.
                PublishHelper.Execute();
            }

            // modify subscription
            subscription.SetParameters2( { MaxNotificationsPerPublish:10 } );
            addLog( "Changing the MaxNotificationsPerPublish to: " + subscription.MaxNotificationsPerPublish );
            ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );

            // now write a value to all of the nodes - we will do this 3 times since we want each 
            // monitored item to overflow its buffer/queue 
            for( var w=0; w<3; w++ ) {
                // increment the value for each node
                for( var i=0; i<items.length; i++ ) {
                    UaVariant.Increment( { Value: items[i].Value } );
                    if( !isDefined( items[i].WrittenValues ) ) items[i].WrittenValues = [];
                    items[i].WrittenValues.push( items[i].Value.Value.clone() );
                }
                info.push( "About to Write: " + MonitoredItem.GetValuesToString( { Items: items } ) );
                // wait the revised sampling interval and then write the new node values
                PublishHelper.WaitInterval( { Items: items[0], Subscription: subscription } );
                WriteHelper.Execute( { NodesToWrite:items, ReadVerification:false } );
            }

            // wait, before calling publish 
            PublishHelper.WaitInterval( { Items: items, Subscription: subscription } );

            // now to call Publish() 3 times
            // publish #1 - we expect a FULL data change with MoreNotifications = true
            PublishHelper.Execute();
            info.push( "Publish(0) to obtain initial data-change notifications." );
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange notification." ) ) {
                for( var i=0; i<PublishHelper.CurrentDataChanges[0].MonitoredItems.length; i++ ) {
                    receivedItems.push( PublishHelper.CurrentDataChanges[0].MonitoredItems[i].clone() );
                }
                Assert.Equal( 10, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive 10 notifications only." );
                Assert.True( PublishHelper.Response.MoreNotifications, "Expected 'MoreNotifications' to be TRUE since we have previously written more values than the queue size allows (for each monitored item)." );
                info.push( "\tExpected 'MoreNotification=TRUE': " + ( PublishHelper.Response.MoreNotifications? "Correct." : "INCORRECT. Non-compliant server returned 'MoreNotifications=TRUE'." ) );
            }

            // publish #2 through ? the remaining data changes
            var remainingNotifications = ( items.length * 2 ) - 10;// 2 queues per item
            var i=0;
            do {
                PublishHelper.Execute();
                info.push( "Publish(" + (++i) + ") expecting notifications (" + remainingNotifications + " to remain in Server's queue)" );
                if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive another dataChange notification (" + remainingNotifications + " notifications remain) to contain more information that couldn't fit into the previous publish response." ) ) {
                    for( var i=0; i<PublishHelper.CurrentDataChanges[0].MonitoredItems.length; i++ ) {
                        receivedItems.push( PublishHelper.CurrentDataChanges[0].MonitoredItems[i].clone() );
                    }
                    
                    // we need to check that each monitored item is showing that its buffer has overflown: Server may send the data in any order. So lookup the data after both the publish calls
                    var expectedOverflow = 0x80; // bit #7 (8th bit)
                    for( var i=0; i<items.length; i++ ) {
                        Assert.True( PublishHelper.LookupDataChange( {Items: items[i], ReceivedItems:receivedItems, ExpectedValue: items[i].Value.Value, StatusCode: expectedOverflow } ) , "Expected to receive Overflow bit in the statusCode for the latest value in the queue."  ) ; 
                    }
            
                    // how many items do we expect to receive?
                    var expectedNotificationsThisTime = ( remainingNotifications >= subscription.MaxNotificationsPerPublish )? subscription.MaxNotificationsPerPublish : remainingNotifications;
                    info.push( "\tReceived " + PublishHelper.CurrentDataChanges[0].MonitoredItems.length + " notifications; expected: " + expectedNotificationsThisTime );
                    Assert.Equal( expectedNotificationsThisTime, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive " + expectedNotificationsThisTime + " notifications only." );
                    // more notifications?
                    remainingNotifications -= PublishHelper.CurrentDataChanges[0].MonitoredItems.length;
                    info.push( "\tExpecting " + remainingNotifications + " notifications to remain in the Server`s queue." );
                    if( remainingNotifications > 0 ) {
                        info.push( "\tExpected 'MoreNotifications=TRUE': " + ( PublishHelper.Response.MoreNotifications? "Correct." : "INCORRECT. Non-compliant server returned 'MoreNotifications=TRUE'." ) );
                        Assert.True( PublishHelper.Response.MoreNotifications, "Expected 'MoreNotifications' to be TRUE since we have not yet received all expected notifications." );
                    }
                    else {
                        info.push( "\tExpected 'MoreNotifications=FALSE: " + ( PublishHelper.Response.MoreNotifications? "INCORRECT. Non-compliant server returned 'MoreNotifications=TRUE'." : "Correct." ) );
                        Assert.False( PublishHelper.Response.MoreNotifications, "Expected 'MoreNotifications' to be FALSE since there shouldn't be any more notifications." );
                    }
                }
                else {
                    break;
                }
            }
            while( remainingNotifications > 0 )


            // publish #3 - keep alive
            PublishHelper.Execute();
            info.push( "Publish(last) expecting a keepAlive only... KeepAlive: " + ( PublishHelper.CurrentlyContainsData() ? "No, has data!!?" : "Yes, no data received!" ) );
            Assert.False( PublishHelper.CurrentlyContainsData(), "Last Publish() call: Expected to receive a KeepAlive only as all notifications should have been previously received." );


            // check only the expected values were received (first values are filtered)
            for( var i=0; i<items.length; i++ ) {
                var found = false;
                for( var v=0; v<receivedItems.length; v++ ) {
                    if( receivedItems[v].ClientHandle == items[i].ClientHandle ) {
                        Assert.NotEqual( items[i].WrittenValues[1].toString(), receivedItems[v].Value.Value.toString(), "The SECOND value written (" + items[i].WrittenValues[0] + ") for NodeId '" + items[i].NodeId + "' (Setting: '" + items[i].NodeSetting + "') was received in a DataChange. DiscardOldest=FALSE is not compliant. The SECOND value should have been deleted leaving the first value and the latest value in the queue." );
                        found = true;
                        break;
                    }
                }//for v
                if( !found ) addError( "Item not received in any DataChanges: '" + items[i].NodeId + "' Handle: " + items[i].ClientHandle + " (Setting '" + items[i].NodeSetting + "') to make sure first written value was purged from the queue and therefore NOT received in DataChange." );
            }// for i
        }
    }

    // delete the subscription we added here 
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );

    // display messages
    print( "----< REPORT >----" );
    for( var i=0; i<info.length; i++ ) print( info[i] );
    return( true );
} } );