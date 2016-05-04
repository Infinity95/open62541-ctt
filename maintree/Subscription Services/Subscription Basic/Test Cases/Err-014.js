/*  Test 5.10.4 Error test 3 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Acknowledge the same sequence number twice, in the same call. */

function publish5104Err003()
{
    // create subscription    
    basicSubscription = new Subscription();
    CreateSubscriptionHelper.Execute( { Subscription: basicSubscription } );

    // create monitored items
    var MonitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings );
    if( MonitoredItems === null || MonitoredItems.length === 0 ) {
        addSkipped( "Static Scalar - 2 nodes needed" );
        return( false );
    }
	while( MonitoredItems.length > 2 ) MonitoredItems.splice( 0, 1 );

    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: MonitoredItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: basicSubscription } ) )
    {
        return( false );
    }

    addLog( "Waiting 1 publish cycle: " + basicSubscription.RevisedPublishingInterval + " msecs" );
   PublishHelper.WaitInterval( { Items: MonitoredItems, Subscription: basicSubscription } );

    // call Publish() to get the first sequence number
    var receivedSequenceNumbers = new IntegerSet();
    var unacknowledgedSequenceNumbers = new IntegerSet();
    var acknowledgedSequenceNumbers = new IntegerSet();

    var publishRequest = new UaPublishRequest();
    var publishResponse = new UaPublishResponse();
    Test.Session.Session.buildRequestHeader( publishRequest.RequestHeader );
    publishRequest.RequestHeader.TimeoutRequest = basicSubscription.TimeoutHint;

    var uaStatus = Test.Session.Session.publish( publishRequest, publishResponse );
    if( uaStatus.isGood() )
    {
        checkPublishValidParameter( publishRequest, publishResponse );

        // add new sequence number to list of received SequenceNumbers
        receivedSequenceNumbers.insert( publishResponse.NotificationMessage.SequenceNumber );

        // add all unacknowledged SequenceNumbers to list of unacknowledged SequenceNumbers
        for( var i = 0; i < publishResponse.AvailableSequenceNumbers.length; i++ )
        {
            unacknowledgedSequenceNumbers.insert( publishResponse.AvailableSequenceNumbers[i] );
        }
    }
    else
    {
        addError( "Publish() status " + uaStatus, uaStatus );
    }

    addLog( "receivedSequenceNumbers = " + receivedSequenceNumbers );
    addLog( "unacknowledgedSequenceNumbers = " + unacknowledgedSequenceNumbers );
    addLog( "acknowledgedSequenceNumbers = " + acknowledgedSequenceNumbers );

    // call Publish() acknowledging the sequence number received above TWICE!!!
    var publishRequest = new UaPublishRequest();
    var publishResponse = new UaPublishResponse();
    Test.Session.Session.buildRequestHeader( publishRequest.RequestHeader );

    var sequenceNumber = receivedSequenceNumbers.atIndex( 0 );

    publishRequest.SubscriptionAcknowledgements[0].SequenceNumber = sequenceNumber;
    publishRequest.SubscriptionAcknowledgements[0].SubscriptionId = basicSubscription.SubscriptionId;
    publishRequest.SubscriptionAcknowledgements[1].SequenceNumber = sequenceNumber;
    publishRequest.SubscriptionAcknowledgements[1].SubscriptionId = basicSubscription.SubscriptionId;

    var uaStatus = Test.Session.Session.publish( publishRequest, publishResponse );
    if( uaStatus.isGood() )
    {
        // this is an array of ExpectedAndAcceptedResult. Size of the array = number of SubscriptionIds
        var expectedOperationResultsArray = [];
        expectedOperationResultsArray[0] = new ExpectedAndAcceptedResults( StatusCode.Good );
        expectedOperationResultsArray[1] = new ExpectedAndAcceptedResults( StatusCode.BadSequenceNumberUnknown );
        checkPublishError( publishRequest, publishResponse, expectedOperationResultsArray );

        // remove acknowledged sequence numbers from list of unacknowledged SequenceNumbers
        // add acknowledged sequence numbers to list of acknowledged SequenceNumbers
        for( var i = 0; i < publishResponse.Results.length; i++ )
        {
            if( publishResponse.Results[i].isGood() )
            {
                unacknowledgedSequenceNumbers.remove( publishRequest.SubscriptionAcknowledgements[i].SequenceNumber );
                acknowledgedSequenceNumbers.insert( publishRequest.SubscriptionAcknowledgements[i].SequenceNumber );
            }
        }

        // add new sequence numbers to list of unacknowledged SequenceNumbers
        // add new sequence numbers to list of received SequenceNumbers
        for( var i = 0; i < publishResponse.AvailableSequenceNumbers.length; i++ )
        {
            unacknowledgedSequenceNumbers.insert( publishResponse.AvailableSequenceNumbers[i] );
            receivedSequenceNumbers.insert( publishResponse.AvailableSequenceNumbers[i] );
        }
    }
    else
    {
        addError( "Publish() status " + uaStatus, uaStatus );
    }

    // delete the items we added in this test
    var monitoredItemsIdsToDelete = new UaUInt32s();
    var j = 0;
    for( var i = 0; i< MonitoredItems.length; i++ )
    {
        if( MonitoredItems[i].IsCreated )
        {
            monitoredItemsIdsToDelete[j++] = MonitoredItems[i].MonitoredItemId;
        }
    }
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItemsIdsToDelete, SubscriptionId: basicSubscription } );
    // delete the subscription we added here 
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription } );
    return( true );
}

Test.Execute( { Procedure: publish5104Err003 } );