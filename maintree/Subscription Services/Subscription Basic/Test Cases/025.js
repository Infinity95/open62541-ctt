/*  Test 5.10.2 Test case 3 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Modifies a subsription setting the RequestedPublishingInterval=7ms less than RevisedPublishingInterval from CreateSubscription. */

function modifySubscription5102003() {
    const REVISED_OFFSET = 7;
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        // register the subscription with Publish.
        PublishHelper.RegisterSubscription( subscription );

        var defaultPublishingInterval = subscription.RevisedPublishingInterval;
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: defaultStaticItem, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) {
            subscription.SetParameters( subscription.RevisedPublishingInterval - REVISED_OFFSET, true, 30, 10, 0 , 0 );
            ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );

            // check the revisedPublishingInterval is +/- the OFFSET
            print( "\tChecking revisedPublishingInterval value=" + subscription.RevisedPublishingInterval + " is in the range of " + (defaultPublishingInterval - REVISED_OFFSET) + " and " + (defaultPublishingInterval + REVISED_OFFSET) );
            Assert.InRange( defaultPublishingInterval - REVISED_OFFSET, defaultPublishingInterval + REVISED_OFFSET, subscription.RevisedPublishingInterval, "Expected the revisedPublishingInterval to be the previous value of: " + defaultPublishingInterval + " +/- the offset: " + REVISED_OFFSET );

            var startTime = UaDateTime.utcNow();
            for( var i=0; i<3; i++ ) {
                GenerateScalarValue( defaultStaticItem.Value.Value, defaultStaticItem.DataType, 3 + i );
                WriteHelper.Execute( { NodesToWrite: defaultStaticItem } );
                PublishHelper.WaitInterval( { Items: defaultStaticItem, Subscription: subscription } );
                PublishHelper.Execute( { NoAcks: true } );
            }// for i
            var stopTime = UaDateTime.utcNow();
            var difference = startTime.secsTo( stopTime );
            addLog( "start: " + startTime + "; stop: " + stopTime + "; difference: " + difference );
            Assert.Equal( 3, PublishHelper.ReceivedDataChanges.length, "Expected 3 callbacks." );
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: defaultStaticItem, SubscriptionId: subscription } )
        }
    }
    // unregister the subscription with Publish 
    PublishHelper.UnregisterSubscription( subscription );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: modifySubscription5102003 } );