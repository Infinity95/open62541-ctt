/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Queue 2 data-change notifications and then retrieve them using Republish.
    Expects: Either (a) ServiceResult: Good, and DataChange notifications; (b) BadMessageNotAvailable*/

function pubmin05_005() {
    var retransmitQueueSize = 5;
    var result = true;
    var subscription = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription, SuppressMessaging: ISDEBUG } ) ) return( false );
    else {
        if ( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: testItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription, SuppressMessaging: ISDEBUG } ) ) { 
            var sequenceNumbersReceived = [];
            for( var r=0; r<retransmitQueueSize; r++ ) { // repeat the following test
                // increment the value for each item and then write them to the Server.
                for( var i=0; i<testItems.length; i++ ) UaVariant.Increment( { Value: testItems[i].Value } );
                if( WriteHelper.Execute( { NodesToWrite: testItems, ReadVerification: false, SuppressMessaging: ISDEBUG } ) ) {
                    PublishHelper.WaitInterval( { Subscription: subscription, Items: testItems } );
                    if( PublishHelper.Execute( { NoAcks: true, SuppressMessaging: ISDEBUG } ) ) {
                        // make sure we have received a data-change and then buffer the sequence number
                        if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish expected to return data-change notification with the values of the items we just wrote." ) ) {
                            sequenceNumbersReceived.push( PublishHelper.Response.NotificationMessage.SequenceNumber );
                        }
                    }// publish success?
                }// write success?
            }//for r...
            // we should have queued-up several notifications now.
            var republishResults = [];
            for( var s=0; s<sequenceNumbersReceived.length; s++ ) {
                // invoke republish; allow it to pass or fail
                if( RepublishHelper.Execute( { SubscriptionId: subscription, RetransmitSequenceNumber: sequenceNumbersReceived[s], ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadMessageNotAvailable ] ), SuppressMessaging: ISDEBUG } ) ) {
                    if( RepublishHelper.Response.ResponseHeader.ServiceResult.isGood() ) { 
                        Assert.Equal( sequenceNumbersReceived[s], RepublishHelper.Response.NotificationMessage.SequenceNumber, "Republish responded with wrong SequenceNumber." );
                        if( RepublishHelper.ReceivedDataChange === null ) addError( "Republish did not return a data-change." );
                    }
                }
                republishResults.push( RepublishHelper.Response.ResponseHeader.ServiceResult );
            }//for s...
            // check if republish ever returned any data; if it did, then it is clearly supported
            var republishGoodCount = 0;
            for( var r=0; r<republishResults.length; r++ ) if( republishResults[r].isGood() ) republishGoodCount++;
            if( !Assert.GreaterThan( 0, republishGoodCount, "Republish support is optional in 'Subscription Publish Min 02' conformance unit, but is REQUIRED in this conformance unit." ) ) result = false;
            // clean-up and exit
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: testItems, SubscriptionId: subscription, SuppressMessaging: ISDEBUG } );
        }
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription, SuppressMessaging: ISDEBUG } );
    }
    return( result );
}

Test.Execute( { Procedure: pubmin05_005 } );