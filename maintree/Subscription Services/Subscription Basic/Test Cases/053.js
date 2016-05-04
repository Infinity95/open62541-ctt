/*  Test 5.10.4 Test 6, prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Acknowledge multiple valid and invalid sequence numbers from multiple valid and invalid subscriptions. */

var basicSubscription;

function fuzzPublishCall_5104006() {
    var FUZZER = 1000;         // an "offset" we'll apply to make sequence/subscriptions ids INVALID
    var z = PublishHelper.Request.SubscriptionAcknowledgements.length;
    for( var i=0; i < z; i++ ) {
        switch( i ) {
            case 0: PublishHelper.Request.SubscriptionAcknowledgements[i].SequenceNumber += FUZZER; break;
            case 1: PublishHelper.Request.SubscriptionAcknowledgements[i].SubscriptionId += FUZZER; break;
            case 2:
                PublishHelper.Request.SubscriptionAcknowledgements[i].SequenceNumber += FUZZER;
                PublishHelper.Request.SubscriptionAcknowledgements[i].SubscriptionId += FUZZER;
                break;
            default: break;
        }
    }
}

function publish5104006() {
    // define the monitored items 
    var items = MonitoredItem.GetRequiredNodes( { Number: 4,
                                                  Settings: Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings } );
    const PUBLISHCALLCOUNT = 5;  // how many times to call "Publish" in a loop AND write new values.

    basicSubscription = new Subscription();
    basicSubscription.MaxKeepAliveCount = PUBLISHCALLCOUNT + 10;

    // step 1 - create the subscriptions (incl. monitoredItems).
    if( !CreateSubscriptionHelper.Execute( { Subscription: basicSubscription } ) ) return( false );

    // register the subscription with Publish.
    PublishHelper.RegisterSubscription( basicSubscription );

    // step 2 - adding some items to subscribe to (monitor).

    // initiate the values of our MonitoredItems so that we can write values to them
    if( ReadHelper.Execute( { NodesToRead: items } ) == false ) {  return( false ); }

    // 4 params are: (1) items to monitor (2) timestamps (3) subscription (4) sesssion
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: basicSubscription } ) ) {
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription } );
        PublishHelper.UnregisterSubscription( subscription );
        return( false );
    }

    // publish calls, get some sequenceNumber's buffered for later acknowledgement.
    for( var z=0; z<PUBLISHCALLCOUNT; z++ ) {
        // write some values to our static items
        for( var i=0; i<items.length; i++ ) {
            if( items[i].Value.Value.DataType === BuiltInType.Float ) {
                var tmpVal = items[i].Value.Value.toFloat();
                if( isNaN( tmpVal ) ) items[i].Value.Value.setFloat( 1 );
            }
            UaVariant.Increment( { Value: items[i].Value } );
        }
        WriteHelper.Execute( { NodesToWrite: items } );

        // wait for a publish cycle; then call Publish()() without acknowledging anything!
        addLog( "Waiting: " + basicSubscription.RevisedPublishingInterval + " msecs, before calling Publish()" );
        PublishHelper.WaitInterval( { Items: items, Subscription: basicSubscription } );
        PublishHelper.Execute( { NoAcks: true } );
    }//for

    // now to acknowledge everything in one call
    // check if the server has maintained the notification messages in the queue; if it has then we can continue with the test, otherwise 
    // we can't. Embedded servers with limited resources are more likely to purge unacknowledged notification messages.
    if( PublishHelper.Response.AvailableSequenceNumbers.length < PUBLISHCALLCOUNT ) {
        addSkipped( "Server PURGED 1 or more of the unacknowledged SequenceNumbers; we cannot conduct this test. We expected " + PUBLISHCALLCOUNT + " notifications to be available, but only " + PublishHelper.Response.AvailableSequenceNumbers.length + " are available." );
    }
    else {
        // prepare the expected errors
        var expectedErrors = [];
        var unackSize = PublishHelper.UnAcknowledgedSequenceNumbers.length;
        for( i=0; i<unackSize; i++ ) {
            switch( i ) {
                case 0:  expectedErrors.push( new ExpectedAndAcceptedResults( StatusCode.BadSequenceNumberUnknown ) ); break;
                case 1:  expectedErrors.push( new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ) ); break;
                case 2:  expectedErrors.push( new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ) ); break;
                default: expectedErrors.push( new ExpectedAndAcceptedResults( StatusCode.Good ) ); break;
            }
        }//switch
        // temporarily attach the hook, then execute, then clear the hook: 
        PublishHelper.HookBeforeCall = fuzzPublishCall_5104006;
        print( "Expected results:\n\t" + expectedErrors.toString() );
        PublishHelper.Execute( { OperationResults: expectedErrors } );
        PublishHelper.HookBeforeCall = null;
    }//..else if...

    //Now Delete the MonitoredItems
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: basicSubscription } );
    // unregister the subscription with Publish 
    PublishHelper.UnregisterSubscription( basicSubscription );
    // delete the subscription we added here 
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription } );
    return( true );
}

Test.Execute( { Procedure: publish5104006 } );