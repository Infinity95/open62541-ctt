/*  Test 5.10.2 Test case 26 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Modifies a subsription's MaxNotificationsPerPublish to 10 (from 0). Tests this by invoking writes/publishes and counting the notifications. */

function modifySubscription5102026() {
    var items = MonitoredItem.GetRequiredNodes( { Number: 15, 
                                                  Settings: Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings } );
    if( !isDefined( items ) || items.length < 15 ) {
        addSkipped( "Not enough static nodes defined; need 15 or more. Aborting." );
        return( false );
    }

    var info = [];
    
    // we just want 15 items, no more
    var items15 = [];
    for( var i=0; i<15 && i<items.length; i++ ) items15.push( items[i] );
    items = items15;
    info.push( "Items prepared for test: " + items.length );

    // get the initial values of the nodes
    // we will be writing to them later by incrementing their values, so we need a baseline.
    ReadHelper.Execute( { NodesToRead:items } );
    setInitialLargeFiletypeValues( items );
    info.push( "Read #1, initial values. Checked large filetypes and reset their values to zero for effective testing." );

    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        info.push( "CreateSubscription, success" );
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) {
            info.push( "CreateMonitoredItems, success" );
            // wait, and then call Publish() to get the initial dataChange
            PublishHelper.WaitInterval( { Items: items, Subscription: subscription } );
            info.push( "Publish #1, initial data-change" );
            PublishHelper.Execute( { FirstPublish: true } );
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive initial data." ) ) {
                Assert.Equal( items.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive " + items.length + " notifications in the initial publish response." );
                info.push( "\tContains initial data. Items received: " + PublishHelper.CurrentDataChanges[0].MonitoredItems.length );
            }
            else {
                // we didn't receive the notification, so call Publish() again to clear the queue.
                PublishHelper.Execute();
                info.push( "\tEmpty, Publish called again to clear the queue." );
            }

            // modify subscription
            subscription.SetParameters2( {  MaxNotificationsPerPublish:5 } );
            ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );
            info.push( "ModifySubscription: Changing the MaxNotificationsPerPublish to: " + subscription.MaxNotificationsPerPublish );

            // increment the value for each node
            info.push( "Item values raw: " + MonitoredItem.GetValuesToString( { Items: items } ) );
            for( var i=0; i<items.length; i++ ) UaVariant.Increment( { Value: items[i].Value } );

            // wait the revised sampling interval and then write the new node values
            info.push( "Item values now: " + MonitoredItem.GetValuesToString( { Items: items } ) );
            WriteHelper.Execute( { NodesToWrite:items, ReadVerification:false } );

            // wait, before calling publish 
            PublishHelper.WaitInterval( { Items: items, Subscription: subscription } );

            // publish #2 through ? the remaining data changes
            var remainingNotifications = items.length;// 5 notifications per publish
            var i=0;
            do {
                PublishHelper.Execute();
                info.push( "Publish(" + (++i) + ") expecting notifications (" + remainingNotifications + " to remain in Server's queue)" );
                if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive another dataChange notification (" + remainingNotifications + " notifications remain) to contain more information that couldn't fit into the previous publish response." ) ) {
                    // how many items do we expect to receive?
                    var expectedNotificationsThisTime = ( remainingNotifications >= subscription.MaxNotificationsPerPublish )? subscription.MaxNotificationsPerPublish : remainingNotifications;
                    info.push( "\tReceived " + PublishHelper.CurrentDataChanges[0].MonitoredItems.length + " notifications; expected: " + expectedNotificationsThisTime );
                    Assert.Equal( expectedNotificationsThisTime, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive " + expectedNotificationsThisTime + " notifications only." );
                    // more notifications?
                    remainingNotifications -= PublishHelper.CurrentDataChanges[0].MonitoredItems.length;
                    info.push( "\tExpecting " + remainingNotifications + " remain in the Server`s queue." );
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
            Assert.False( PublishHelper.CurrentlyContainsData(), "Expected to receive a KeepAlive only as all notifications should have been previously received." );
            info.push( "Last Publish call, expects no data. " + ( PublishHelper.CurrentlyContainsData() ? "None received." : "Non-compliant server returned data!" ) );
        }
    }

    // delete the subscription we added here 
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );

    // clean-up
    subscription = null;
    items = null;

    // display messages
    print( "----< REPORT >----" );
    for( var i=0; i<info.length; i++ ) print( info[i] );
    return( true );
}

Test.Execute( { Procedure: modifySubscription5102026 } );