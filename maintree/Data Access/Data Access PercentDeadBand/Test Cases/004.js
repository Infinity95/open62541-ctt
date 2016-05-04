/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description:
        Script specifies MonitoringMode = Reporting, QueueSize = 4, Filter = PercentDeadband, 
        DeadbandValue = 10. Issues 5 writes within the 10% range and 5 outside of this range. 
        Calls Publish to verify that only the dataChanges where the values are within the 10% 
        fluctuation are received.
        If the Server revises the queue length to something smaller than the requestedQueueSize 
        then the test must exit not as a warning, but as a skip.
    Expected results:
        All service and operation level results are Good.
        The 2nd Publish call yields a dataChange containing 4 values. 
        The 4 values received match the first 4 valid values written (valid = pass the 
        deadband filter criteria) and in the same order as written. Check the statusCode
        overflow bit� #7 that signals a value was lost due to the queue overflow, for each value.
*/

function createMonitoredItems612004() {
    const WRITE_VALUES_NEEDED = 5;
    const QUEUESIZE = 4;
    const DEADBANDVALUE = 10;
    const DISCARDOLDEST = false;

    var settings = Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings;
    var item = MonitoredItem.fromSettings( settings, 0, Attribute.Value, "", MonitoringMode.Reporting, DISCARDOLDEST, null, QUEUESIZE )[0];
    if( item === undefined ) {
        addSkipped( "Static Analog" );
        return( false );
    }
    item.Filter = Event.GetDataChangeFilter( DeadbandType.Percent, DEADBANDVALUE, DataChangeTrigger.StatusValue );

    var eurange = GetNodeIdEURange( item.NodeSetting );
    if( eurange === null || eurange === undefined ) {
        addError( "Test aborted: Setting '" + item.NodeSetting + "' did not yield a valid nodeId to test." );
        return( false );
    }
    // get the size of the EURange
    var getEURangeSize     = GetEURangeAsSize( eurange );
    var writesToPass       = GetEURangeWriteValues( WRITE_VALUES_NEEDED, eurange, 10, true, eurange.Low );
    var writesAfterPublish = GetEURangeWriteValues( WRITE_VALUES_NEEDED, eurange, 10, true, writesToPass[3] ); //eurange.Low );
    var writesToFail       = GetEURangeWriteValues( WRITE_VALUES_NEEDED, eurange, 10, false, writesToPass[writesToPass.length-1] );
    print( "\n\n\n\n\n" ); //print 5 blank lines so we can see the trace output from the numbers generated in 3 lines above.

    // do a read to get the initial data-type
    var detectedDataType;
    if( !ReadHelper.Execute( { NodesToRead: item } ) ) {
        addError( "Test aborted: Could not read the node (" + item.NodeSetting + ")." );
        return( false );
    }
    detectedDataType = item.Value.Value.DataType;

    // set the initial value to the max value supported by the range -1.
    // this will allow all writes we're about to do to succeed, since the generated values
    // start from the lower range
    print( "\tSetting the initial value of the node to be right in the middle of the EURange." );
    var initialSafeValue = eurange.Low + (getEURangeSize/2);
    item.SafelySetValueTypeKnown( initialSafeValue, detectedDataType );
    if( !WriteHelper.Execute( { NodesToWrite: item } ) ) {
        addError( "Test aborted: Could not set the initial value for the deadband testing (" + item.NodeSetting + ")." );
    }
    else {
        // create the monitoredItem
        if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) return( false );
        // check the revised queue length
        if( item.QueueSize < QUEUESIZE ) {
            addSkipped( "Skipping test. Server revised the QueueSize from '" + QUEUESIZE + "' to '" + item.QueueSize + "' on item '" + item.NodeSetting + "'. A QueueSize of " + QUEUESIZE + " is needed in this test." );
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
            return( false );
        }

        // wait one publishing cycle before calling publish
        PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );

        // call Publish(). Do we get initial values?
        PublishHelper.Execute();
        Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive initial dataChange." );

        // write the values - should cause the queue to overflow
        // 5 writes will pass
        var w;
        print( "\n\n\n\n-------------------------------------------------------" +
                "\nItem: " + item.NodeSetting +
                "\n\tWriting " + WRITE_VALUES_NEEDED + " values (to pass deadband): " + writesToPass.toString() +
                "\n\tStarting (safe) value: " + initialSafeValue +
                "\n-------------------------------------------------------" );
        for( w=0; w<WRITE_VALUES_NEEDED; w++ ) {
            item.SafelySetValueTypeKnown( writesToPass[w], detectedDataType );
            WriteHelper.Execute( { NodesToWrite: item } );
            // wait one cycle before moving on... i.e. let server POLL this value 
            PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
        }// for w...
        // 5 writes will fail
        print( "\n\n\n\n-------------------------------------------------------" + 
                "\nItem: " + item.NodeSetting +
                "\nWriting " + WRITE_VALUES_NEEDED + " values (to fail deadband): " + writesToFail.toString() +
                "\n\tCurrent value of node: " + item.Value.Value.toString() +
                "\n-------------------------------------------------------" );
        for( w=0; w<WRITE_VALUES_NEEDED; w++ ) {
            item.SafelySetValueTypeKnown( writesToFail[w], detectedDataType );
            WriteHelper.Execute( { NodesToWrite: item } );
            // wait one cycle before moving on... i.e. let server POLL this value 
            PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
        }

        // call Publish() (having issued 10 writes)
        print( "\n\n\n\n-------------------------------------------------------" +
               "\nItem: " + item.NodeSetting + " verification of received data from Publish" +
               "\n\tValues written to pass deadband: " + writesToPass.toString() +
               "\n\tValues written to fail deadband: " + writesToFail.toString() +
               "\n-------------------------------------------------------" );
        if( PublishHelper.Execute() ) {
            Assert.True( PublishHelper.CurrentlyContainsData(), "Expected 0% deadband to yield the dataChange results that echo the values written." );
            Assert.Equal( QUEUESIZE, PublishHelper.CurrentDataChanges[0].MonitoredItems.size, "Expected to receive the same number of dataChanges as our Queue is long!" );

            // now to compare the values received with those written
            print( "\n\n\n\n\nChecking Publish notifications match the writes. The values written include: " + writesToPass.toString() );
            PublishHelper.PrintDataChanges();

            for( var c=0; c<QUEUESIZE-1; c++ ) Assert.CoercedEqual( writesToPass[c], PublishHelper.CurrentDataChanges[0].MonitoredItems[c].Value.Value, "Expected the same value to be received as was written." );
            // check 4th item (newest) was overwritten with the 5th value 
            Assert.CoercedEqual( writesToPass[QUEUESIZE], PublishHelper.CurrentDataChanges[0].MonitoredItems[QUEUESIZE-1].Value.Value, "Expected the newest queued item (FIFO queue, so this means the last entry) to match the last value written." );

            // check the statusCode overflow bit
            var newestItemIndex = PublishHelper.CurrentDataChanges[0].MonitoredItems.length - 1;
            Assert.Equal( StatusCode.Good | OVERFLOWBIT, PublishHelper.CurrentDataChanges[0].MonitoredItems[newestItemIndex].Value.StatusCode.StatusCode, "StatusCode overflow bit is not active for the item in the queue that was overwritten; this would be the last item in the queue (the newest item added)." );
        }

        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
    }
    // clean-up
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems612004 } );