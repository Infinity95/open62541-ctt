/*  Test 5.10.2 Test case 4 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Modifies a subsription setting RequestedPublishingInterval matches RevisedPublishingInterval from CreateSubscription. */

function modifySubscription5102004() {
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        // register the subscription with Publish.
        PublishHelper.RegisterSubscription( subscription );
        var originalSubscription = subscription.Clone();
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: defaultStaticItem, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) {
            ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );

            // check the revisedValues are the same as they were previously
            Assert.Equal( originalSubscription.RevisedPublishingInterval, subscription.RevisedPublishingInterval, "RevisedPublishingInterval difference." );
            Assert.Equal( originalSubscription.RevisedLifetimeCount, subscription.RevisedLifetimeCount, "RevisedLifetimeCount difference." );
            Assert.Equal( originalSubscription.RevisedMaxKeepAliveCount, subscription.RevisedMaxKeepAliveCount, "RevisedMaxKeepAliveCount difference." );

            var startTime = UaDateTime.utcNow();
            for( var i=0; i<3; i++ ) {
                GenerateScalarValue( defaultStaticItem.Value.Value, defaultStaticItem.DataType, 4 + i );
                WriteHelper.Execute( { NodesToWrite: defaultStaticItem } );
                PublishHelper.WaitInterval( { Items: defaultStaticItem, Subscription: subscription } );
                PublishHelper.Execute( { NoAcks: true } );
            }// while
            var stopTime = UaDateTime.utcNow();
            var difference = startTime.secsTo( stopTime );
            addLog( "start: " + startTime + "; stop: " + stopTime + "; difference: " + difference );

            Assert.Equal( 3, PublishHelper.ReceivedDataChanges.length, "Expected 3 callbacks." );
            //delete the monitoredItem
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: defaultStaticItem, SubscriptionId: subscription } );
        }
    }
    // unregister the subscription with Publish 
    PublishHelper.UnregisterSubscription( subscription );
    // clean-up
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: modifySubscription5102004 } );