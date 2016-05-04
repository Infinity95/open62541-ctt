/*  Test 5.10.2 Test case 2 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Modifies a subsription setting the RequestedPublishingInterval=7ms greater than RevisedPublishingInterval from CreateSubscription. */

function modifySubscription5102002() {
    const REVISED_OFFSET = 7;
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        // register the subscription with Publish.
        PublishHelper.RegisterSubscription( subscription );

        var defaultPublishingInterval = subscription.RevisedPublishingInterval;
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: defaultStaticItem, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) {
            var newRevisedPublishingInterval = subscription.RevisedPublishingInterval + REVISED_OFFSET;
            subscription.SetParameters( newRevisedPublishingInterval, true, 30, 10, 0 , 0 );
            ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );

            // flag used to continue the test, or not...
            var doPublish = true;

            // see if the revisedPublishingInterval matches the previous value (unchanged)
            print( "\tChecking revisedPublishingInterval value=" + subscription.RevisedPublishingInterval + " either (a) matches the requestedPublishingInterval=" + newRevisedPublishingInterval + " or is greater than that value." );
            if( defaultPublishingInterval === subscription.RevisedPublishingInterval ) addLog( "RevisedPublishingInterval is unchanged. This is acceptable." );
            // see if the revised value matches the request
            else if( newRevisedPublishingInterval === subscription.RevisedPublishingInterval ) addLog( "RevisedPublishingInterval matches the request." );
            // see if the revised value is greater than requested (expected)
            else if( newRevisedPublishingInterval < subscription.RevisedPublishingInterval ) addLog( "RevisedPublishingInterval is slower than requested. This is acceptable." );
            // is the value less than requested
            else if( (defaultPublishingInterval-REVISED_OFFSET) > subscription.RevisedPublishingInterval ) addWarning( "RevisedPublishingInterval is FASTER than requested. This is not the expected behavior." );
            else {
                // catch-all, we're not expecting anything else so report an error
                addError( "RevisedPublishingInterval is different to anything expected. RequestedPublishingInterval=" + newRevisedPublishingInterval + "; RevisedPublishingInterval=" + subscription.RevisedPublishingInterval );
                doPublish = false;
            }
            // are we happy with the server so far, in that we should try publishes?
            if( doPublish ) {
                var startTime = UaDateTime.utcNow();
                for( var i=0; i<3; i++ ) {
                    GenerateScalarValue( defaultStaticItem.Value.Value, UaNodeId.GuessType( defaultStaticItem.NodeSetting ), 2 + i );
                    WriteHelper.Execute( { NodesToWrite: defaultStaticItem } );
                    PublishHelper.WaitInterval( { Items: defaultStaticItem, Subscription: subscription } );
                    PublishHelper.Execute( { NoAcks: true } );
                }// while
                var stopTime = UaDateTime.utcNow();
                var difference = startTime.secsTo( stopTime );
                addLog( "start: " + startTime + "; stop: " + stopTime + "; difference: " + difference );
                Assert.Equal( 3, PublishHelper.ReceivedDataChanges.length, "Expected 3 callbacks." );
            }
            // clean-up
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: defaultStaticItem, SubscriptionId: subscription } )
        }
    }
    PublishHelper.UnregisterSubscription( subscription );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: modifySubscription5102002 } );