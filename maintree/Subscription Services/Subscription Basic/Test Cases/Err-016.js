/*  Test 5.10.4 Error Test 5, prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Acknowledge multiple invalid sequence numbers from an invalid subscription.
        ServiceResult = Good.
            results[i] = Bad_SequenceNumberUnknown. */

function publish5104Err005()
{
    const PUBLISHCALLCOUNT = 5; //how many times to call "Publish" in a loop.
    const FUZZER = 0x0123;

    // step 1 - create the subscription.
    basicSubscription = new Subscription();
    CreateSubscriptionHelper.Execute( { Subscription: basicSubscription } );

    // step 2 - adding some items to subscribe to (monitor).
    // define the monitored items and then make the call to monitor them!
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings );
    if( items === null || items.length === 0 ) {
        addSkipped( "Static Scalar NodeId1, NodeId2" );
        return( false );
    }

    // set the queue size to 10 for each monitoredItem
    var m;
    for( m=0; m<items.length; m++ ) {
        items[m].QueueSize = 10;
    }//for m

    // get the initial values for all nodes
    ReadHelper.Execute( { NodesToRead: items } );

    // 4 params are: (1) items to monitor (2) timestamps (3) subscription (4) sesssion
    CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: basicSubscription } );

    // call Publish() to get the first sequence number
    var receivedSequenceNumbers = new IntegerSet();
    var unacknowledgedSequenceNumbers = new IntegerSet();
    var acknowledgedSequenceNumbers = new IntegerSet();

    // publish calls, get some sequenceNumber's buffered for later acknowledgement.
    for( var z=0; z<PUBLISHCALLCOUNT; z++ )
    {
        // update each node's value to cause a dataChange
        for( m=0; m<items.length; m++ )
        {
            items[m].SafelySetValueTypeKnown( 1 + UaVariantToSimpleType(items[m].Value.Value), items[m].Value.Value.DataType );
        }//for m
        WriteHelper.Execute( { NodesToWrite: items, ReadVerification: false } );

        // wait a sampling interval, and then call Publish() 
        PublishHelper.WaitInterval( { Items: items[0], Subscription: basicSubscription } );

        var publishRequest = new UaPublishRequest();
        var publishResponse = new UaPublishResponse();
        Test.Session.Session.buildRequestHeader( publishRequest.RequestHeader );
        publishRequest.RequestHeader.TimeoutRequest = basicSubscription.TimeoutHint;

        addLog( "\nPUBLISH...(call #" + (1+z) + " of " + PUBLISHCALLCOUNT + ")" );
        var uaStatus = Test.Session.Session.publish( publishRequest, publishResponse );
        if( uaStatus.isGood() )
        {
            checkPublishValidParameter( publishRequest, publishResponse );

            // add our first sequence number to list of received SequenceNumbers
            receivedSequenceNumbers.insert( publishResponse.NotificationMessage.SequenceNumber );

            // add all unacknowledged SequenceNumbers to list of unacknowledged SequenceNumbers
            for( var i = 0; i < publishResponse.AvailableSequenceNumbers.length; i++ )
            {
                unacknowledgedSequenceNumbers.insert( publishResponse.AvailableSequenceNumbers[i] );
            }
            // show what we're currently buffering...
            addLog( "receivedSequenceNumbers = " + receivedSequenceNumbers );
            addLog( "unacknowledgedSequenceNumbers = " + unacknowledgedSequenceNumbers );
            addLog( "acknowledgedSequenceNumbers = " + acknowledgedSequenceNumbers );
        }
        else
        {
            addError( "Publish() status " + uaStatus, uaStatus );
        }//if..else...
    }//for


    // now to acknowledge everything in one call
    // rebuild our request, and specify the sequence number and subscriptionId
    Test.Session.Session.buildRequestHeader( publishRequest.RequestHeader );

    // acknowledge ALL of the sequenceNumbers we've received:
    var unackSize = unacknowledgedSequenceNumbers.size();
    for( var i = 0; i < unackSize; i++ )
    {
        addLog( "unacknowledgedSequenceNumbers[i] = " + unacknowledgedSequenceNumbers.atIndex(i) );
        publishRequest.SubscriptionAcknowledgements[i].SequenceNumber = FUZZER * unacknowledgedSequenceNumbers.atIndex(i); //injected
        publishRequest.SubscriptionAcknowledgements[i].SubscriptionId = FUZZER * basicSubscription.SubscriptionId;
    }

    // call Publish() and acknowledging all of the sequenceNumbers received.
    addLog( "\nPublish last call, acknowledging INVALID sequenceNumbers: " + unacknowledgedSequenceNumbers.toString() );
    var uaStatus = Test.Session.Session.publish( publishRequest, publishResponse );
    if( uaStatus.isGood() )
    {
        var expectedError = [];
        for( i=0; i<unackSize; i++ )
        {
            expectedError[i] = new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid );
        }
        checkPublishError( publishRequest, publishResponse, expectedError );
    }
    else
    {
        addError( "Publish() status " + uaStatus, uaStatus );
    }
    //Now Delete the MonitoredItems
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: basicSubscription } );
    // delete the subscription we added here 
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription } );
    return( true );
}

Test.Execute( { Procedure: publish5104Err005 } );