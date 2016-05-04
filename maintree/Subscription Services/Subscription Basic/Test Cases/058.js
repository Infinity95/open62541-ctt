/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: For a period of Publish.Response.RevisedKeepAliveInterval-1 call Publish() but do 
    not acknowledge any of the subscriptions/sequences. After this period, call Republish()
    UA 1.03 Clarification: Republish() service is required; but behavior is optional and can return BadMessageNotAvailable. */

function Republish058() { 
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
    while( UaDateTime.utcNow() < expirationTime ) { 
        // Write to all items 
        for( var i=0; i<items.length; i++ ) UaVariant.Increment( { Value: items[i].Value } );
        WriteHelper.Execute( { NodesToWrite: items, ReadVerification: false } );
        // call Publish() but do not acknowledge any of the subscriptions/sequences.
        PublishHelper.WaitInterval( { Items: items, Subscription: subscription } );
        PublishHelper.Execute( { NoAcks: true } );
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
    // clean-up
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}//func

Test.Execute( { Procedure: Republish058 } );