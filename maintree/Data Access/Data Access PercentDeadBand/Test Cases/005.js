/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Create a subscription with an initial deadbandPercent set to 10%. 
        Call ModifyMonitoredItems to change the deadbandPercent to 25% and then issue Write()
        and Publish() calls to verify the accuracy of the deadband. */

function createMonitoredItems612005() {
    const WRITE_VALUES_NEEDED = 2;
    const DEADBAND_INITIAL = 10;
    const DEADBAND_NEW     = 25;
    var settings = Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings;
    var item = MonitoredItem.fromSettings( settings, 0, Attribute.Value, "", MonitoringMode.Reporting, true, null, 0 )[0];
    if( item === undefined ) {
        addSkipped( "Static Analog" );
        return( false );
    }
    item.Filter = Event.GetDataChangeFilter( DeadbandType.Percent, DEADBAND_INITIAL, DataChangeTrigger.StatusValue );

    var eurange = GetNodeIdEURange( item.NodeSetting );
    if( eurange === null || eurange === undefined ) {
        addError( "Test aborted: Setting '" + item.NodeSetting + "' did not yield a valid nodeId containing an EURange to test." );
        return( false );
    }

    // do a read to get the initial data-type
    var detectedDataType;
    if( !ReadHelper.Execute( { NodesToRead: item } ) ) {
        addError( "Test aborted: Could not read the node (" + item.NodeSetting + ")." );
        return( false );
    }
    detectedDataType = item.Value.Value.DataType;

    // create the monitoredItem
    if( !CreateMonitoredItemsHelper.Execute( { 
                ItemsToCreate: item, 
                TimestampsToReturn: TimestampsToReturn.Both, 
                SubscriptionId: MonitorBasicSubscription } ) ) return( false );

    // get the size of the EURange
    //var getEURangeSize = GetEURangeAsSize( eurange );
    var writesToPass = GetEURangeWriteValues( WRITE_VALUES_NEEDED, eurange, DEADBAND_NEW, true, eurange.Low );
    var writesToFail = GetEURangeWriteValues( WRITE_VALUES_NEEDED, eurange, DEADBAND_NEW, false, eurange.Low );

    // modify the monitoredItem
    item.Filter = Event.GetDataChangeFilter( DeadbandType.Percent, DEADBAND_NEW, DataChangeTrigger.StatusValue );
    if( !ModifyMonitoredItemsHelper.Execute( { 
                ItemsToModify: item, 
                TimestampsToReturn: TimestampsToReturn.Both, 
                SubscriptionId: MonitorBasicSubscription } ) ) {
        addError( "Test aborted. Could not modify the monitored item to use another filter!" );
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
        return( false );
    }

    // write the values that we expect to pass
    // but, set the value to the max Range first, to guarantee a success with the first item
    item.SafelySetValueTypeKnown( eurange.High, detectedDataType );
    if( !WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } ) ) {
        addError( "Test aborted. Could not set the initial value of " + eurange.High + " to guarantee the first write as a success." );
        DeleteMonitoredItemsHelper.Execute( { 
                    ItemsToDelete: item, 
                    SubscriptionId: MonitorBasicSubscription } );
        return( false );
    }
    
    PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
    PublishHelper.Execute();

    var w;
    for( w=0; w<WRITE_VALUES_NEEDED; w++ ) {
        item.SafelySetValueTypeKnown( writesToPass[w], detectedDataType );
        WriteHelper.Execute( { NodesToWrite: item, CheckNotSupported: true, ReadVerification: false } );
        PublishHelper.WaitInterval( { Items: item } );
        PublishHelper.Execute();
        if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected a dataChange for the value written." ) ) {
            PublishHelper.SetItemValuesFromDataChange( [ item ] );
            Assert.CoercedEqual( writesToPass[w], item.Value.Value, "Expected to receive the same value as written." );
        }
    }// for w...


    print( "\n\n\n\n\nNow part 2, test values we expect to be filtered by the deadband...\n\n\n" );
    // now to reset the items value, and to then write values that we expect to be
    // filtered by the deadband
    item.SafelySetValueTypeKnown( eurange.Low, detectedDataType );
    if( !WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } ) ) {
        addError( "Test aborted. Could not set the initial value of " + eurange.Low + " to guarantee the first write as a FAIL." );
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
        return( false );
    }
    PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
    PublishHelper.Execute();
    for( w=0; w<WRITE_VALUES_NEEDED; w++ ) {
        item.SafelySetValueTypeKnown( writesToFail[w], detectedDataType );
        WriteHelper.Execute( { NodesToWrite: item, CheckNotSupported: true, ReadVerification: false } );
        PublishHelper.WaitInterval( { Items: item } );
        PublishHelper.Execute();
        Assert.False( PublishHelper.CurrentlyContainsData(), "DataChange not expected for the value written." );
    }

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems612005 } );