/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: do not acknowledge the 3rd sequenceNumber. Call Republish() to retrieve the 3rd (missing) dataChange notification message
    UA 1.03 Clarification: Republish() service is required; but behavior is optional and can return BadMessageNotAvailable. */

function RemoveSeq(){ 
    var newAcks = new UaSubscriptionAcknowledgements();
    newAcks[0] = PublishHelper.Request.SubscriptionAcknowledgements[1];
    PublishHelper.Request.SubscriptionAcknowledgements = newAcks;
}// remove sequence number from requst 

function Republish059() { 
    if( __republishNotSupported ) {
        addSkipped( "Republish is not supported. Skipping test." );
        return( false );
    }

    var subscription = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) return( false );
    // get some items to monitor, and then read their values to get their initial state 
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    ReadHelper.Execute( { NodesToRead: items } );
    // create the monitored items 
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, SubscriptionId: subscription } ) ) { 
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
        return( false );
    }
    // For a period of Publish.Response.RevisedKeepAliveInterval-1 
    var expirationTime = UaDateTime.utcNow();
    expirationTime.addMilliSeconds( subscription.RevisedPublishingInterval * subscription.RevisedMaxKeepAliveCount );
    addLog( "Entering a timed-loop that expires in: " + Math.abs( expirationTime.msecsTo( UaDateTime.utcNow() ) ) + " msec..." );
    for( var i=0; i<4; i++ ) { 
        // Write to all items 
        for( var l=0; l<items.length; l++ ) UaVariant.Increment( { Value: items[l].Value } );
        // don't write on the last iteration because we do not need an additional sequence number
        if( i < 3 ) WriteHelper.Execute( { NodesToWrite: items, ReadVerification: false } );
        // call Publish() but do not acknowledge the 3rd  subscriptions/sequences.
        PublishHelper.WaitInterval( { Items: items, Subscription: subscription } );
        if( i < 2 ) PublishHelper.Execute();
        else if( i === 2 ) PublishHelper.Execute( { NoAcks: true } );
        else if( i== 3 ){
            // temporarily intercept the Publish before it is called so that the function
            // above can remove the first sequence number.
            PublishHelper.HookBeforeCall = RemoveSeq;
            PublishHelper.Execute();
            PublishHelper.HookBeforeCall = null;
        }
    }//while
    // after this period, call Republish() to get missing notifications 
    // check the AvailableSequenceNumbers and then request them 
    addLog( "AvailableSequenceNumbers: " + PublishHelper.Response.AvailableSequenceNumbers.length + "\nRetransmissionQueueSizePerSession: " + gServerCapabilities.RetransmissionQueueSizePerSession );
    var requestedStartIndex = 0;
    if( PublishHelper.Response.AvailableSequenceNumbers.length > gServerCapabilities.RetransmissionQueueSizePerSession ) requestedStartIndex = PublishHelper.Response.AvailableSequenceNumbers.length - gServerCapabilities.RetransmissionQueueSizePerSession;
    for( var i=requestedStartIndex; i<PublishHelper.Response.AvailableSequenceNumbers.length; i++ ) {
        if( RepublishHelper.Execute( { SubscriptionId: subscription, RetransmitSequenceNumber: PublishHelper.Response.AvailableSequenceNumbers[i], ServiceResult: new ExpectedAndAcceptedResults( [StatusCode.Good, StatusCode.BadMessageNotAvailable ] ) } ) ) {
            Assert.True( RepublishHelper.CurrentlyContainsData(), "Republish().Response.NotificationMessage.NotificationData does not contain the requested sequence number: " + RepublishHelper.Request.RetransmitSequenceNumber );
        }
    }// while 
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}//func

Test.Execute( { Procedure: Republish059 } );