/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script specifies queueSize = 1 and discardOldest = true. Writes 5 unique values and calls Publish().
        Expected result: ServiceResult/OperationResults: Good - Only the last item should be received in the callback. */

function createMonitoredItems591040() {
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( !isDefined( item ) ) { addSkipped( "Static Scalar (numeric)" ); return( false ); }
    // read the initial value 
    if( !ReadHelper.Execute( { NodesToRead: item } ) ) return( false );
    // generate the values to write
    
    const QUEUE_SIZE = 1;

    PublishHelper.RegisterSubscription( MonitorQueueSize1Subscription );

    // now proceed with the test.
    if( !MonitorQueueSize1Subscription.SubscriptionCreated ) addError( "Subscription for conformance unit Monitor QueueSize_1 was not created." );
    else {
        // Create a monitored item of the node to write to and get dataChange notifications of
        item.SamplingInterval = 0;
        item.QueueSize = QUEUE_SIZE;
        item.DiscardOldest = DISCARDOLDEST_TRUE;

        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorQueueSize1Subscription } ) ) {
            // reset the value of the node so that this test can start cleanly
            // write a reset-value, e.g. 0 and then call Publish().
            ReadHelper.Execute( { NodesToRead: item } );
            UaVariant.Increment( { Value: item.Value } );
            WriteHelper.Execute( { NodesToWrite: item} );
            PublishHelper.WaitInterval( { Items: item } );
            PublishHelper.Execute();
            Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a DataChange notification containing our reset value previously written." );

            // call Publish() to clear anything in the Server's queue
            PublishHelper.ClearServerNotifications();
            PublishHelper.Clear();

            if( item.QueueSize !== QUEUE_SIZE && item.QueueSize !== 0 ) addLog( "The server revised the QueueSize to " + item.QueueSize );

            // Now perform NUMBER_WRITES unique writes
            print( "STEP 2: Writing 5 unique values to the item." );

            var valuesToWrite = [];
            for( var x=0; x<5; x++ ) {
                // for backward compatibility, allow writeValues to contain JavaScript numbers instead of UaVariants
                UaVariant.Increment( { Value: item.Value.Value } );
                valuesToWrite.push( item.Value.Value.clone() );
                if( WriteHelper.Execute( { NodesToWrite: item } ) === false ) break;

                // short delay after write
                PublishHelper.WaitInterval( { Items: item, Subscription: MonitorQueueSize1Subscription } );
            }// for x...

            print( "STEP 3 - call Publish() and check our received value." );
            var tries = 0;
            do {
                // Add a delay after the write, just to allow time for the write to physically take place
                print( "Waiting " + MonitorQueueSize1Subscription.RevisedPublishingInterval + "ms before publish to allowing write to commit within the Server (just in case Server responds too soon)." );
                PublishHelper.WaitInterval( { Items: item, Subscription: MonitorQueueSize1Subscription } );
                ++tries;
            } while(  PublishHelper.Execute() && PublishHelper.CurrentlyContainsData() && tries < valuesToWrite.length );

            Assert.GreaterThan( 0, PublishHelper.ReceivedDataChanges.length >= 1, "NO DATA RECEIVED! We expected dataChanges!" );
            if( PublishHelper.ReceivedDataChanges.length >= 1 ) {
                // Make sure that we have the number of items as specified to buffer (queueSize).
                // The first data change received should be the same size as the queue size. In
                // the case where a server is somewhat slow, multiple data changes may be 
                // recieved; the last data change may be smaller than the queue size, but all
                // prior data changes should be the same size as queue size.
                Assert.Equal( QUEUE_SIZE, PublishHelper.ReceivedDataChanges[0].MonitoredItems.length, "Checking the number of items first received matches the queue size" );
                for( x = 1; x < PublishHelper.ReceivedDataChanges.length - 1; x++ ) {
                    Assert.Equal( QUEUE_SIZE, PublishHelper.ReceivedDataChanges[x].MonitoredItems.length, "Checking the number of items received in data change " + x + " matches the queue size" );
                }
                if( PublishHelper.ReceivedDataChanges.length > 1 ) {
                    Assert.InRange( 1, QUEUE_SIZE, PublishHelper.ReceivedDataChanges[PublishHelper.ReceivedDataChanges.length-1].MonitoredItems.length, "Checking the number of items last received does not exceed the queue size" );
                }
                
                // check the handle is correct
                for( x = 0; x < PublishHelper.ReceivedDataChanges.length; x++ ) Assert.Equal( item.ClientHandle, PublishHelper.ReceivedDataChanges[x].MonitoredItems[0].ClientHandle, "Checking the ClientHandle of the item received matches what we expected." );
                
                var valueWritten;
                var valueReceived;
                var d;
                

                print( "DiscardOldest is FALSE... now to check the values and any events..." );
                print( "Values previously written: " + valuesToWrite.toString() );
                Assert.Equal( QUEUE_SIZE, PublishHelper.ReceivedDataChanges[0].MonitoredItems.length, "Expected to receive only 2 values since the queue size is 2; and we have previously written more than 2 values." );
                Assert.Equal( valuesToWrite[4], PublishHelper.ReceivedDataChanges[0].MonitoredItems[0].Value.Value, "Expected the first value in the DataChange queue to match the last value we wrote! Even though DiscardOldest=FALSE it makes no difference here because QueueSize=1." );
                Assert.NotEqual( StatusCode.Good | OVERFLOWBIT, PublishHelper.ReceivedDataChanges[0].MonitoredItems[0].Value.StatusCode.StatusCode, "StatusCode overflow bit is set for the last/newest item in the queue that was overwritten. Normally this would be good, but it is NOT applicable when QueueSize is 1." );


                // check if the timestamps requested were received AS requested!
                print( "\n\nTimestamps requested: Both" );
                for( d=0; d<PublishHelper.ReceivedDataChanges.length; d++ ) {
                    print( "DataChange # " + (1+d) );
                    PublishHelper.ValidateTimestampsInDataChange( PublishHelper.ReceivedDataChanges[d], TimestampsToReturn.Both );
                }
            }
            // Cleanup
            // Delete the items we added in this test
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorQueueSize1Subscription } );
            PublishHelper.Clear();
            PublishHelper.UnregisterSubscription( MonitorQueueSize1Subscription );
        }// if createMonItems
    }//if subCreated
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591040 } );