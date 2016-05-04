/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create a subscription (no monitored items) with a requestedPublishingInterval of 1000 and a requestedMaxKeepAliveCount of 5.
        call Publish(). call Publish() again. */

function createSubscription5101026( publishingInterval, lifetimeCount ) {
    var defaultStaticItem = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( !isDefined( defaultStaticItem ) ) {
        addError( "No scalar static item defined in settings. Aborting." );
        return( false );
    }
    // read the node first, to get the initial value 
    if( !ReadHelper.Execute( { NodesToRead:defaultStaticItem } ) ) {
        addError( "Aborting test. Unable to read the node id." );
        return( false );
    }
    // now define our new subscription
    var subscription = new Subscription2( { PublishingInterval:1000, RequestedMaxKeepAliveCount:5 } );
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        defaultStaticItem.QueueSize = 2;
        // create the monitored item
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: [defaultStaticItem], TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: subscription } ) ) {
            PublishHelper.WaitInterval( { Items: defaultStaticItem, Subscription: subscription } );

            // test #1
            // write a value and then call Publish()
            UaVariant.Increment( { Value: defaultStaticItem.Value } );
            defaultStaticItem.firstWrittenValue = defaultStaticItem.Value.Value;
            WriteHelper.Execute( { NodesToWrite:defaultStaticItem } );
            // wait, and then call Publish().
            PublishHelper.WaitInterval( { Items: defaultStaticItem, Subscription: subscription } );
            PublishHelper.Execute();

            // test #1 expectations state: publish #1 is a keepalive and sequenceNumber=1
            Assert.Equal( 1, PublishHelper.Response.NotificationMessage.SequenceNumber, "The first sequence number should always be 1." );
            Assert.Equal( subscription.SubscriptionId, PublishHelper.Response.SubscriptionId, "Received Publish response in relation to an unexpected Subscription." );
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected a KeepAlive only. We have not added any monitored items to the subscription!" ) ) {
                Assert.Equal( 2, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected 2 monitored items in the DataChange notification message.", "Correctly received 2 monitored item in Publish call #1" );
                Assert.Equal( defaultStaticItem.firstWrittenValue, defaultStaticItem.Value.Value, "Expected to receive the same value as previously written.", "The value received in Publish #1 matches the value previously written." );
            }

            // test #2
            // do not write anything, but call Publish()
            PublishHelper.Execute();

            // test #2 expectations state: publish #2 is a keepalive and sequenceNumber=2
            Assert.False( PublishHelper.CurrentlyContainsData(), "Expected a KeepAlive only. We have not added any monitored items to the subscription!" );
            Assert.Equal( 2, PublishHelper.Response.NotificationMessage.SequenceNumber, "The next sequence number should be 2 since we have already received #1.", "Correctly received a KeepAlive only for Publish call #2, and SequenceNumber = 2." );
            Assert.Equal( subscription.SubscriptionId, PublishHelper.Response.SubscriptionId, "Received Publish response in relation to an unexpected Subscription." );

            // test #3
            // write another value and then call Publish() 
            UaVariant.Increment( { Value: defaultStaticItem.Value } );
            defaultStaticItem.secondWrittenValue = defaultStaticItem.Value.Value;
            WriteHelper.Execute( { NodesToWrite:defaultStaticItem } );
            // wait, and then call Publish().
            wait( subscription.RevisedPublishingInterval * subscription.RevisedMaxKeepAliveCount );
            PublishHelper.Execute();

            // test #2 expectations state; publish #3 contains data, the sequence is 3, and the values matches prior written
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange." ) ) {
                Assert.Equal( 2, PublishHelper.Response.NotificationMessage.SequenceNumber, "The next sequence number should be 3 since we have already received #1 (sequence #2 was a keepalive).", "Correctly received SequenceNumber = 3." );
                Assert.Equal( subscription.SubscriptionId, PublishHelper.Response.SubscriptionId, "Received Publish response in relation to an unexpected Subscription." );
                var receivedValueAsNative = UaVariantToSimpleType( PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.Value );
                Assert.Equal( defaultStaticItem.secondWrittenValue, defaultStaticItem.Value.Value, "Expected to receive the same value as previously written.", "The value received in Publish #1 matches the value previously written." );
            }

            // clean-up
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: [defaultStaticItem], SubscriptionId: subscription } );
        }
    }
    // Since we need to call deleteSubscriptions anyway, let's just use it to
    // validate if the subscription expired or not (i.e., the operation result
    // should be BadSubscriptionIdInvalid if the subscription expired before
    // its expected lifetime).
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );

    // clean-up
    subscription = null;
    return( true );
}

Test.Execute( { Procedure: createSubscription5101026 } );