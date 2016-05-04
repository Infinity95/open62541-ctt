/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: 
        Script specifies MonitoringMode = Reporting, Filter = PercentDeadband,DeadbandValue = 0. Issue 2 writes and call Publish() for each write to verify that the written value is received.
    Expectation:
        ServiceResult = �Good�. Verify that only the last value is retrieved.Check the statusCode �overflow bit� #7 DOES NOT signal a value was lost due to the queue overflow. */

function createMonitoredItems612003() {
    const WRITE_VALUES_NEEDED = 2;

    const DEADBANDVALUE = 0;
    const QUEUESIZE = 1;
    const DISCARDNEWEST = false;

    var settings = Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings;
    var item = MonitoredItem.fromSettings( settings, 0, Attribute.Value, "", MonitoringMode.Reporting, DISCARDNEWEST, null, QUEUESIZE )[0];
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
    var writesToPass = GetEURangeWriteValues( WRITE_VALUES_NEEDED, eurange, 10, false, 0 );

    // do a read to get the initial data-type
    var detectedDataType;
    if( !ReadHelper.Execute( { NodesToRead: item } ) ) {
        addError( "Test aborted. Could not read the item that we're about to test writing to!" );
        return( false );
    }
    detectedDataType = item.Value.Value.DataType;

    // create the monitoredItem
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) return( false );

    // write the values - should cause the queue to overflow
    for( var w=0; w<WRITE_VALUES_NEEDED; w++ ) {
        item.SafelySetValueTypeKnown( writesToPass[w], detectedDataType );
        WriteHelper.Execute( { NodesToWrite: item } );
        // delay the write to allow the sampling engine to detect the change
        PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
    }// for w...

    // call Publish()
    if( PublishHelper.Execute() ) {
        if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected 0% deadband to yield the dataChange results that echo the values written." ) ) {
            // check the last value was received
            var lastValidValueIndex = writesToPass.length - 1;
            Assert.CoercedEqual( writesToPass[lastValidValueIndex], PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.Value, "Value received does not match the LAST value written." );

            // check the overflow bit is absent
            var lastItemIndex = PublishHelper.CurrentDataChanges[0].MonitoredItems.length - 1;
            Assert.NotEqual( StatusCode.Good | OVERFLOWBIT, PublishHelper.CurrentDataChanges[0].MonitoredItems[lastItemIndex].Value.StatusCode.StatusCode, "StatusCode overflow bit is active after a value was lost from the queue. Overflow bit should not be set when the QueueSize=1." );
        }
    }

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems612003 } );