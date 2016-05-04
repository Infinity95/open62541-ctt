/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create a monitoredItem for each configured numeric array type (int32[], double [] etc.) where the mode is reporting; 
        DeadbandAbsolute of 10; IndexRange of ��; QueueSize=1.
        Vary the write of each array: 1st element, 2nd element, last element; each time adjusting value by +/- 11. */

function createMonitoredItem591068() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.NumericSettings, 0, Attribute.Value, "", MonitoringMode.Reporting, undefined, Event.GetDataChangeFilter( DeadbandType.Absolute, 10, DataChangeTrigger.StatusValue ), 1);
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


    // test #1 - increment the first element of all arrays by 11
    print( "\n\nTest #1: increment [first element] +11\n\n" );
    for( var i=0; i<items.length; i++ ) IncrementUaVariantArray( items[i].Value.Value, 0, 1, 11 );
    WriteHelper.Execute( { NodesToWrite: items, ReadVerification: false } );
    PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
    PublishHelper.Execute();
    if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() expected a data change notification containing the new array values, although only the first element changed.", "Publish() received data change notifications as expected." ) ) {
        Assert.Equal( items.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Publish() received a different number of notifications than expected.", "Publish() received the correct number of notifications." );
    }


    // test #2 - increment the second element of all arrays by 11
    print( "\n\nTest #2: increment [second element] +11\n\n" );
    for( var i=0; i<items.length; i++ ) IncrementUaVariantArray( items[i].Value.Value, 1, 2, 11 );
    WriteHelper.Execute( { NodesToWrite: items, ReadVerification: false } );
    PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
    PublishHelper.Execute();
    if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() expected a data change notification containing the new array values, although only the second element changed.", "Publish() received data change notifications as expected." ) ) {
        Assert.Equal( items.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Publish() received a different number of notifications than expected.", "Publish() received the correct number of notifications." );
    }


    // test #3 - decrement the last element of all arrays by 11
    print( "\n\nTest #3: increment [last element] +11\n\n" );
    for( var i=0; i<items.length; i++ ) {
        var arraySize = items[i].Value.Value.getArraySize();
        if( arraySize == -1 ) {
            if( items[i].Value.Value.DataType === BuiltInType.ByteString ) arraySize = items[i].Value.Value.toByteString().utf8ToString().length;
        }
        IncrementUaVariantArray( items[i].Value.Value, (arraySize-1), arraySize, -11 );
    }
    WriteHelper.Execute( { NodesToWrite: items, ReadVerification: false } );
    PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
    PublishHelper.Execute();
    if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() expected a data change notification containing the new array values, although only the last element changed.", "Publish() received data change notifications as expected." ) ) {
        Assert.Equal( items.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Publish() received a different number of notifications than expected.", "Publish() received the correct number of notifications." );
    }


    // test #4 - decrement all elements of all arrays by 11 
    print( "\n\nTest #4: increment [all elements] +11\n\n" );
    for( var i=0; i<items.length; i++ ) {
        var arraySize = items[i].Value.Value.getArraySize();
        if( arraySize == -1 ) {
            if( items[i].Value.Value.DataType === BuiltInType.ByteString ) arraySize = items[i].Value.Value.toByteString().utf8ToString().length;
        }
        IncrementUaVariantArray( items[i].Value.Value, 0, arraySize, -11 );
    }
    WriteHelper.Execute( { NodesToWrite: items, ReadVerification: false } );
    PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
    PublishHelper.Execute();
    if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() expected a data change notification containing the new array values, although all elements changed.", "Publish() received data change notifications as expected." ) ) {
        Assert.Equal( items.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Publish() received a different number of notifications than expected.", "Publish() received the correct number of notifications." );
    }


    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorBasicSubscription } );
    revertToOriginalValues( items );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItem591068 } );