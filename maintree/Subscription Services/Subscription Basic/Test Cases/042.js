/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Call Republish() with requests being out of the normal order.
    UA 1.03 Clarification: Republish() service is required; but behavior is optional and can return BadMessageNotAvailable. */

function Republish042() { 
    // create both subscriptions
    sub1 = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: sub1 } ) ) return( false );

    // now to add an item to the subscription
    var itemSub1 = MonitoredItem.Clone( defaultStaticItem );
    var itemSub2 = MonitoredItem.Clone( defaultStaticItem );
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: itemSub1, SubscriptionId: sub1 } ) ) {
        // read the value of itemSub1, so that we can then increment it in our testing 
        ReadHelper.Execute( { NodesToRead: itemSub1 } );

        // in a loop of 3 we will: a) write to all items b) call Publish() and NOT acknowledge any SequenceNumbers'
        for( var i=0; i<3; i++ ) {
            UaVariant.Increment( { Value: itemSub1.Value } );
            WriteHelper.Execute( { NodesToWrite: itemSub1, ReadVerification: false } );
            PublishHelper.Execute( { NoAcks: true  } ); // call Publish() and do not ack
        }//for i...

        // lets now randomize the order of the sequenceNumbers
        var sequenceNumbers = [];
        for( var i=0; i<PublishHelper.Response.AvailableSequenceNumbers.length; i++ ) sequenceNumbers.push( PublishHelper.Response.AvailableSequenceNumbers[i] );
        print( "There are " + sequenceNumbers.length + " SequenceNumbers to request via Republish()." );
        sequenceNumbers = RandomizeArrayElements( sequenceNumbers );
        print( "The randomized order of SequenceNumbers to request are: " + sequenceNumbers.toString() );

        // we can now call Republish() to obtain the SequenceNumbers that were not previously acknowledged 
        while( sequenceNumbers.length > 0 ) {
            // call Republish, and check that we have received the data change notification
            if( RepublishHelper.Execute( { RetransmitSequenceNumber: sequenceNumbers.shift(), SubscriptionId: sub1, ServiceResult: new ExpectedAndAcceptedResults( [StatusCode.Good, StatusCode.BadMessageNotAvailable ] ) } ) ) {
                if( Assert.True( RepublishHelper.CurrentlyContainsData(), "Republish() failed to retrieve the data-change notification.", "Republish() successfully retrieved SequenceNumber: " + RepublishHelper.Request.RetransmitSequenceNumber ) ) { 
                    Assert.Equal( RepublishHelper.Request.RetransmitSequenceNumber, RepublishHelper.Response.NotificationMessage.SequenceNumber, "Republish() returned the wrong SequenceNumber." );
                }//RepublishHelper.CurrentlyContainsData
            }
            if( RepublishHelper.Response.ResponseHeader.ServiceResult.StatusCode === StatusCode.BadMessageNotAvailable ) __republishNotSupported = true;
        }//while

        // clean-up
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: itemSub1, SubscriptionId: sub1 } );
    }//CreateMonitoredItems - sub1
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: sub1 } );
    return( true );
}//Republish020

Test.Execute( { Procedure: Republish042 } );