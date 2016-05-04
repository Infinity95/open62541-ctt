/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create a monitoredItem for each configured numeric array type (int32[], double [] etc.) where the mode is reporting; 
        DeadbandAbsolute of 10; IndexRange of ��:3"; QueueSize=1.
        Vary the write the last element in the IndexRange; each time adjusting value by +/- 11 or +/- 5. */

function createMonitoredItem591067() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.NumericSettings, 0, Attribute.Value, "1:3", MonitoringMode.Reporting, undefined, Event.GetDataChangeFilter( DeadbandType.Absolute, 10, DataChangeTrigger.StatusValue ), 1);
    if( !isDefined( items ) || items.length === 0 ) {
        addSkipped( SETTING_UNDEFINED_SCALARARRAYS );
        return( false );
    }

    // get the initial values of all nodes, we can then increment them by +/-10 per test-case requirements.
    ReadHelper.Execute( { NodesToRead: items } );
    captureOriginalValues( items );

    // add items to existing subscription
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: MonitorBasicSubscription } ) ) return( false );

    // call Publish()() make sure we receive the initial data change
    PublishHelper.Execute( { FirstPublish: true } );
    Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() initial data-change expected.", "Publish() received initial data change notifications, as expected." );

    // test #1 - increment the value 11
    print( "\n\nTest #1: increment +11\n\n" );
    var writeResultsExpected = [];
    for( var i=0; i<items.length; i++ ) {
        IncrementUaVariantArray( items[i].Value.Value, 2, 3, 11 );
        writeResultsExpected[i] = new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadWriteNotSupported ] );
    }

    // invoke the write and the check the results 
    var testComplete = false;
    WriteHelper.Execute( { NodesToWrite: items, OperationResults: writeResultsExpected, ReadVerification: false } );
    if( WriteHelper.Response.Results[0].StatusCode === StatusCode.BadWriteNotSupported ) {
        addNotSupported( "Write.Response.Results[0] is Bad_WriteNotSupported. Writing to an IndexRange is not supported by this server." );
    }
    else {
        PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
        PublishHelper.Execute();
        if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() expected a data change notification containing the new array values, although only the first element changed.", "Publish() received data change notifications as expected." ) )
            Assert.Equal( items.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Publish() received a different number of notifications than expected.", "Publish() received the correct number of notifications." );

        // test #2 - increment the value by 5
        print( "\n\nTest #2: increment +5\n\n" );
        for( var i=0; i<items.length; i++ ) IncrementUaVariantArray( items[i].Value.Value, 2, 3, -5 );
        WriteHelper.Execute( { NodesToWrite: items, ReadVerification: false } );
        PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
        PublishHelper.Execute();
        Assert.False( PublishHelper.CurrentlyContainsData(), "Publish() did not expect a data change notification containing the new array values because the written value is less than the deadband.", "Publish() received a keep-alive as expected." );

        // test #3 - decrement the value by 11
        print( "\n\nTest #3: increment -11\n\n" );
        for( var i=0; i<items.length; i++ ) IncrementUaVariantArray( items[i].Value.Value, 2, 3, -11 );
        WriteHelper.Execute( { NodesToWrite: items, ReadVerification: false } );
        PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
        PublishHelper.Execute();
        if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() expected a data change notification containing the new array values, although only the last element changed.", "Publish() received data change notifications as expected." ) ) {
            Assert.Equal( items.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Publish() received a different number of notifications than expected.", "Publish() received the correct number of notifications." );
        }

        // test #4; repeat last write
        print( "\n\nTest #4: repeat last write\n\n" );
        WriteHelper.Execute( { NodesToWrite: items, ReadVerification: false } );
        PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
        PublishHelper.Execute();
        Assert.False( PublishHelper.CurrentlyContainsData(), "Publish() did not expect a data change notification containing the new array values because the written value is the same as the last written value.", "Publish() received a keep-alive as expected." );
        testComplete = true;
    }

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorBasicSubscription } );
    if( testComplete ) revertToOriginalValues( items );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItem591067 } );