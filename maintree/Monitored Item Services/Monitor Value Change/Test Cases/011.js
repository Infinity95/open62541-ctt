/*  Test 011: prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        CreateMonitoredItems uses the following parameter values:
            MODE   = MonitoringMode.Reporting;
            FILTER = null;
            QUEUE  = 1;
            TIMES  = TimestampsToReturn.Both;
        Expected to succeed. subscription is created and deleted in initialize and cleanup scripts */

Test.Execute( { Procedure: function test() {
    const QUEUE_SIZE  = 1;
    const TIMES  = TimestampsToReturn.Both;

    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( item === undefined || item === null ) { addSkipped( "Static Scalar (numeric)" ); return( false ); }
    var valuesToWrite = [];
    // read the initial value and then generate some new values 
    if( !ReadHelper.Execute( { NodesToRead: item } ) ) return( false );
    for( var i=0; i<2; i++ ) valuesToWrite.push( UaVariant.Increment( { Value: item.Value } ) );

    PublishHelper.RegisterSubscription( MonitorBasicSubscription );
    if( !MonitorBasicSubscription.SubscriptionCreated ) {
        addError( "Subscription for conformance unit Monitor QueueSize_1 was not created." );
    }
    else {
        // Create a monitored item of the node to write to and get dataChange notifications of
        item.SamplingInterval = 0;
        item.QueueSize = QUEUE_SIZE;
        item.DiscardOldest = DISCARDOLDEST_TRUE;

        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
            // call Publish() to clear anything in the Server's queue
            PublishHelper.ClearServerNotifications();
            PublishHelper.Clear();

            // Now perform NUMBER_WRITES unique writes
            print( "STEP 2: Writing " + valuesToWrite.length + " unique values to the item." );

            var x;
            for( x=0; x<valuesToWrite.length; x++) {
                // for backward compatibility, allow writeValues to contain JavaScript numbers instead of UaVariants
                item.Value.Value = valuesToWrite[x];
                if( WriteHelper.Execute( { NodesToWrite: item } ) === false ) break;
                // short delay after write
                PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
            }// for x...

            print( "STEP 3 - call Publish() and check our received value." );
            var tries = 0;
            do {
                // Add a delay after the write, just to allow time for the write to physically take place
                print( "Waiting " + MonitorBasicSubscription.RevisedPublishingInterval + "ms before publish to allowing write to commit within the Server (just in case Server responds too soon)." );
                PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
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
                for( x=0; x<PublishHelper.ReceivedDataChanges.length; x++ ) {
                    Assert.Equal( item.ClientHandle, PublishHelper.ReceivedDataChanges[x].MonitoredItems[0].ClientHandle, "Checking the ClientHandle of the item received matches what we expected." );
                }
                
                var valueWritten;
                var valueReceived;
                var d;
                

                print( "DiscardOldest is TRUE... now to check the values and any events..." );
                Assert.Equal( QUEUE_SIZE, PublishHelper.ReceivedDataChanges[0].MonitoredItems.length, "Expected to receive only 2 values since the queue size is 2; and we have previously written more than 2 values." );
                Assert.Equal( valuesToWrite[1], PublishHelper.ReceivedDataChanges[0].MonitoredItems[0].Value.Value, "Expected the first value in the DataChange queue to match the last value we wrote! Even DiscardOldest=TRUE it makes no difference here because QueueSize=1." );
                Assert.NotEqual( StatusCode.Good | OVERFLOWBIT, PublishHelper.ReceivedDataChanges[0].MonitoredItems[0].Value.StatusCode.StatusCode, "StatusCode overflow bit is set for the last/newest item in the queue that was overwritten. Normally this would be good, but it is NOT applicable when QueueSize is 1." );


                // check if the timestamps requested were received AS requested!
                for( d=0; d<PublishHelper.ReceivedDataChanges.length; d++ ) {
                    print( "DataChange # " + (1+d) );
                    PublishHelper.ValidateTimestampsInDataChange( PublishHelper.ReceivedDataChanges[d], TIMES );
                }
            }
            // Cleanup
            // Delete the items we added in this test
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
            PublishHelper.Clear();
        }// if createMonItems
    }//if subCreated
    return( true );
} } );