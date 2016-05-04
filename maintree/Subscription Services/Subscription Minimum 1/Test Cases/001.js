/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Acknowledge sequenceNumbers out of order. */

var availableSequenceNumbers = [];
var subId;

function prehook50104013() {
    // inject the last sequence received into the ack; normally we would add them in order, here we are going backwards
    PublishHelper.Request.SubscriptionAcknowledgements[0].SequenceNumber = availableSequenceNumbers.pop();
    PublishHelper.Request.SubscriptionAcknowledgements[0].SubscriptionId = subId;
    print( "Hook->Publish().Execute ----- Injecting SubscriptionAcknowledgements[0].SequenceNumber = " + PublishHelper.Request.SubscriptionAcknowledgements[0].SequenceNumber + "; SubscriptionId: " + PublishHelper.Request.SubscriptionAcknowledgements[0].SubscriptionId );
}// function prehook50104013()

function pub50104013() {
    var item1 = MonitoredItem.Clone( defaultStaticItem );
    ReadHelper.Execute( { NodesToRead: item1 } );

    // create a subscription
    var sub1 = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: sub1, RequestedLifetimeCount: 3, RequestedMaxKeepAliveCount: 1 } ) ) return( false );

    // add a monitored item to both subscriptions
    PublishHelper.RegisterSubscription( sub1 );
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item1, SubscriptionId: sub1 } ) ) {
        PublishHelper.WaitInterval( { Items: item1, Subscription: sub1 } );
        PublishHelper.Execute( { FirstPublish: true } );
        // invoke another Publish call in order to clear it from the queue
        if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() did not receive an initial dataChange notification." ) ) PublishHelper.Execute();

        // ROUND ONE
        // now to write to the item numerous times, and call Publish(), but NEVER acknowledges a sequence
        addLog( "Invoking " + gServerCapabilities.RetransmissionQueueSizePerSession + " writes in order to fill the notifications queue." );
        for( var i=0; i<gServerCapabilities.RetransmissionQueueSizePerSession; i++ ) {
            // write a new value to the item
            UaVariant.Increment( { Value: item1.Value } );
            WriteHelper.Execute( { NodesToWrite: item1, ReadVerification: false } );
            // call Publish() and do not acknowledge the sequenceNumber
            PublishHelper.Execute( { NoAcks: true } );
        }//for i



        // ROUND TWO
        // in a loop, call Publish() and ack just one sequence number, but in a different order than was received.
        // to keep it simple, we will acknowledge in the reverse-order of being received (newest first, oldest last)
        PublishHelper.HookBeforeCall = prehook50104013;
        PublishHelper.Clear(); // we will completely bypass all functionality in the helper object
        for( var i=0; i<PublishHelper.Response.AvailableSequenceNumbers.length; i++ ) availableSequenceNumbers[i] = PublishHelper.Response.AvailableSequenceNumbers[i];
        subId = PublishHelper.Response.SubscriptionId;
        for( var i=0; i<gServerCapabilities.RetransmissionQueueSizePerSession; i++ ) PublishHelper.Execute( { NoAcks: true } );
        PublishHelper.HookBeforeCall = null;

        // make sure there's no sequence numbers left to ack 
        Assert.Equal( 0, PublishHelper.Response.AvailableSequenceNumbers.length, "Publish().Response.AvailableSequenceNumbers is not empty although we have finally acknowledged ALL sequenceNumbers that were expected in the queue.\nAvailableSequenceNumbers: " + PublishHelper.Response.AvailableSequenceNumbers.toString() );

        // clean-up
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item1, SubscriptionId: sub1 } );
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: sub1 } );
    }

    // clean-up
    PublishHelper.UnregisterSubscription( sub1 );
    sub1 = null;
    return( true );
}// function pub50104013()

Test.Execute( { Procedure: pub50104013 } );