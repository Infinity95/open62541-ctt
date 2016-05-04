/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create a monitoredItem for each configured numeric array type (int32[], double [] etc.) where the mode is reporting; 
        DeadbandAbsolute of 10; IndexRange of ��<full range>"; QueueSize=1.
        Vary the write the last element in the IndexRange; each time adjusting value by +/- 11, +/- 5, or +/- 16 */

function createMonitoredItem591073() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.NumericSettings, 0, Attribute.Value, "", MonitoringMode.Reporting, undefined, Event.GetDataChangeFilter( DeadbandType.Absolute, 10, DataChangeTrigger.StatusValue ), 1);
    if( !isDefined( items ) || items.length === 0 ) {
        addSkipped( SETTING_UNDEFINED_SCALARARRAYS );
        return( false );
    }

    // get the initial values of all nodes, we can then increment them by +/-10 per test-case requirements.
    ReadHelper.Execute( { NodesToRead: items } );

    // specify the indexRange as the FULL range of the array
    for( var i=0; i<items.length; i++ ) {
        if( items[i].Value.Value.getArraySize() >= 0 ) 
            items[i].IndexRange = "0:" + ( items[i].Value.Value.getArraySize() - 1 );
        else if( items[i].Value.Value.DataType == BuiltInType.ByteString )
            items[i].IndexRange = "0:" + ( items[i].Value.Value.toByteString().length - 1 );
    }

    // add items to existing subscription
    if( !CreateMonitoredItemsHelper.Execute( { 
            ItemsToCreate: items, 
            TimestampsToReturn: TimestampsToReturn.Server, 
            SubscriptionId: MonitorBasicSubscription } ) ){
        var msg = "";
        for( var i=0; i<items.length; i++ ) msg += "\n\t[" + i + "] " + items[i].NodeId + "; IndexRange='" + items[i].IndexRange + "'.";
        addError( "CreateMonitoredItems requested:" + msg );
        return( false );
    }

    // call Publish()() make sure we receive the initial data change
    PublishHelper.Execute( { FirstPublish: true } );
    Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() initial data-change expected.", "Publish() received initial data change notifications, as expected." );

    // change the indexRange to 1, read the value and then we can easily modify it
    for( var i=0; i<items.length; i++ ) items[i].IndexRange = "1";
    ReadHelper.Execute( { NodesToRead: items } );


    // test #1 - increment the first value in the IndexRange by +11
    var writeResultsExpected = [];
    for( var i=0; i<items.length; i++ ) {
        IncrementUaVariantArray( items[i].Value.Value, 0, 1, 11, true );
        items[i].WrittenValue = items[i].Value.Value.clone();
        writeResultsExpected[i] = new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadWriteNotSupported ] );
    }
    WriteHelper.Execute( { 
        NodesToWrite: items, 
        OperationResults: writeResultsExpected,
        ReadVerification: false } );

    // check if the write is not supported
    if( WriteHelper.Response.Results[0].StatusCode === StatusCode.BadWriteNotSupported ) {
        addNotSupported( "Write.Response.Results[0] is Bad_WriteNotSupported. Writing to an IndexRange is not supported by this server." );
    }
    else {
        PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
        PublishHelper.Execute();
        if( Assert.True( PublishHelper.CurrentlyContainsData(), "Test #1 Publish() expected a data change notification containing the new array values, although only the first element changed.", "Test #1 Publish() received data change notifications as expected." ) ) {
            Assert.Equal( items.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Test #1 Publish() received a different number of notifications than expected.", "Test #1 Publish() received the correct number of notifications." );
            for( var i=0; i<items.length; i++ ) {
                Assert.Equal( items[i].WrittenValue, items[i].Value.Value, "Test #1 Publish() received a different value than expected for item '" + items[i].Setting +"'." );
            }
        }


        // test #2 - increment the value by 5
        for( var i=0; i<items.length; i++ ) {
            IncrementUaVariantArray( items[i].Value.Value, 0, 1, 5 );
            items[i].WrittenValue = items[i].Value.Value.clone();
        }
        WriteHelper.Execute( { 
            NodesToWrite: items, 
            ReadVerification: false } );
        PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
        PublishHelper.Execute();
        Assert.False( PublishHelper.CurrentlyContainsData(), "Test #2 Publish() did not expect a data change notification because the value written did not exceed the deadband.", "Publish() Test #2 received a keep-alive notification as expected." );


        // test #3 - increment the value by -16
        for( var i=0; i<items.length; i++ ) IncrementUaVariantArray( items[i].Value.Value, 0, 1, -16, true );
        WriteHelper.Execute( { NodesToWrite: items, ReadVerification: false } );
        PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
        PublishHelper.Execute();
        if( Assert.True( PublishHelper.CurrentlyContainsData(), "Test #3 Publish() expected a data change notification containing the new array values because the written value exceded than the deadband.", "Test #3 Publish() received a dataChange as expected." ) ) {
            Assert.Equal( items.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Test #3 Publish() received a different number of notifications than expected.", "Test #3 Publish() received the correct number of notifications." );
        }


        // test #4; repeat last write
        WriteHelper.Execute( { 
            NodesToWrite: items, 
            ReadVerification: false } );
        PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
        PublishHelper.Execute();
        Assert.False( PublishHelper.CurrentlyContainsData(), "Test #4 Publish() did not expect a data change notification containing the new array values because the written value is the same as the last written value.", "Test #4 Publish() received a keep-alive as expected." );
    }

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { 
        ItemsToDelete: items, 
        SubscriptionId: MonitorBasicSubscription } );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItem591073 } );