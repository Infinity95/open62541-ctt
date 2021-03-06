/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Script specifies queueSize = 2 and discardOldest = true. Writes 5 unique values and calls Publish().
        Expected result: ServiceResult/OperationResults: Good - Only the last item should be received in the callback. */

Test.Execute( { Procedure: function test() {
    const QUEUE_SIZE  = 2;
    const TIMES = TimestampsToReturn.Both;

    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( !isDefined( item ) ) { addSkipped( "Static Scalar (numeric)" ); return( false ); }
    var valuesToWrite = [];
    
    //read the initial value, and then prepare some new values...
    if( !ReadHelper.Execute( { NodesToRead: item } ) ) return( false );
    for( var i=0; i<5; i++ ) valuesToWrite.push( UaVariant.Increment( { Value: item.Value.Value } ) );

    var MonitorQueueSize2Subscription = new Subscription();
    CreateSubscriptionHelper.Execute( { Subscription: MonitorQueueSize2Subscription } );

    PublishHelper.RegisterSubscription( MonitorQueueSize2Subscription );

    if( !MonitorQueueSize2Subscription.SubscriptionCreated ) addError( "Subscription for conformance unit Monitor QueueSize_1 was not created." );
    else {
        // Create a monitored item of the node to write to and get dataChange notifications of
        item.SamplingInterval = 0;
        item.QueueSize = QUEUE_SIZE;
        item.DiscardOldest = DISCARDOLDEST_TRUE;

        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TIMES, SubscriptionId: MonitorQueueSize2Subscription } ) ) {
            // call Publish() to clear anything in the Server's queue
            PublishHelper.Execute();

            if( item.QueueSize !== QUEUE_SIZE && item.QueueSize !== 0 ) addLog( "The server revised the QueueSize to " + item.QueueSize );

            // Now perform NUMBER_WRITES unique writes
            print( "STEP 2: Writing " + valuesToWrite.length + " unique values to the item." );

            var x;
            for( x=0; x<valuesToWrite.length; x++ ) {
                // for backward compatibility, allow writeValues to contain JavaScript numbers instead of UaVariants
                if( valuesToWrite[x].DataType === undefined ) {
                    // set the value to write, make it type safe
                    item.SafelySetValueTypeKnown( valuesToWrite[x], UaNodeId.GuessType( item.NodeSetting ) );
                }
                else item.Value.Value = valuesToWrite[x];
                if( WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } ) === false ) break;

                // short delay after write
                PublishHelper.WaitInterval( { Items: item, Subscription: MonitorQueueSize2Subscription } );
            }// for x...

            print( "STEP 3 - call Publish() and check our received value." );
            var tries = 0;
            do {
                // Add a delay after the write, just to allow time for the write to physically take place
                print( "Waiting " + MonitorQueueSize2Subscription.RevisedPublishingInterval + "ms before publish to allowing write to commit within the Server (just in case Server responds too soon)." );
                PublishHelper.WaitInterval( { Items: item, Subscription: MonitorQueueSize2Subscription } );
                ++tries;
            } while(  PublishHelper.Execute() && PublishHelper.CurrentlyContainsData() && tries < valuesToWrite.length );

            Assert.GreaterThan( 0, PublishHelper.ReceivedDataChanges.length >= 1, "NO DATA RECEIVED! We expected dataChanges!" );
            if( PublishHelper.ReceivedDataChanges.length >= 1 ) {
                // Make sure that we have the number of items as specified to buffer (queueSize).
                // The first data change received should be the same size as the queue size. In
                // the case where a server is somewhat slow, multiple data changes may be 
                // recieved; the last data change may be smaller than the queue size, but all
                // prior data changes should be the same size as queue size.
                Assert.Equal( QUEUE_SIZE, PublishHelper.ReceivedDataChanges[1].MonitoredItems.length, "Checking the number of items first received matches the queue size" );
                for( x = 1; x < PublishHelper.ReceivedDataChanges.length - 1; x++ ) Assert.Equal( QUEUE_SIZE, PublishHelper.ReceivedDataChanges[x].MonitoredItems.length, "Checking the number of items received in data change " + x + " matches the queue size" );
                if( PublishHelper.ReceivedDataChanges.length > 1 ) Assert.InRange( 1, QUEUE_SIZE, PublishHelper.ReceivedDataChanges[PublishHelper.ReceivedDataChanges.length-1].MonitoredItems.length, "Checking the number of items last received does not exceed the queue size" );
                
                // check the handle is correct
                for( x = 0; x < PublishHelper.ReceivedDataChanges.length; x++ ) Assert.Equal( item.ClientHandle, PublishHelper.ReceivedDataChanges[x].MonitoredItems[0].ClientHandle, "Checking the ClientHandle of the item received matches what we expected." );
                
                var valueWritten;
                var valueReceived;
                var d;
                

                print( "DiscardOldest is " + DISCARDOLDEST_TRUE + "... now to check the values and any events..." );
                print( "Values written include: " + valuesToWrite.toString() );
                if( Assert.Equal( QUEUE_SIZE, PublishHelper.ReceivedDataChanges[1].MonitoredItems.length, "Expected to receive only 2 values since the queue size is 2; and we have previously written more than 2 values." ) ) {
                    Assert.Equal( valuesToWrite[3], PublishHelper.ReceivedDataChanges[1].MonitoredItems[0].Value.Value, "Expected the first value in the DataChange to match the last value we wrote! DiscardOldest=TRUE means that the oldest value gets purged." );
                    Assert.Equal( valuesToWrite[4], PublishHelper.ReceivedDataChanges[1].MonitoredItems[1].Value.Value, "Expected the second value in the DataChange to match the 4th (of 5) value we wrote! DiscardOldest=TRUE caused the oldest value to get purged, which just happened to be the 2nd queued entry in this case." );
                    Assert.Equal( StatusCode.Good | OVERFLOWBIT, PublishHelper.ReceivedDataChanges[1].MonitoredItems[0].Value.StatusCode.StatusCode, "StatusCode overflow bit is NOT set for the last/newest item in the queue that was overwritten." );
                }


                // check if the timestamps requested were received AS requested!
                for( d=0; d<PublishHelper.ReceivedDataChanges.length; d++ ) {
                    print( "DataChange # " + (1+d) );
                    PublishHelper.ValidateTimestampsInDataChange( PublishHelper.ReceivedDataChanges[d], TIMES );
                }
            }
            // Cleanup
            // Delete the items we added in this test
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorQueueSize2Subscription } );
        }// if createMonItems
    }//if subCreated

    //clean-up
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: MonitorQueueSize2Subscription } );
    return( true );
} } );