/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create a monitoredItem for each configured numeric array type (int32[], double [] etc.) where the mode is reporting; 
        DeadbandAbsolute of 10; IndexRange of ��middle-two"; QueueSize=1.
        Vary the write the last element outside the IndexRange; each time adjusting value by +/- 11, +/- 5, or +/- 16 */

function getMiddleTwoAsIndexRange( vals ) {
    if( vals === undefined || vals === null || vals < 2 ) return( "" );
    var mid;
    // if the array size < 6, pick different array size to avoid overlap when we write a value and whn the publish is received.
    if ( vals === 5 ) mid = parseInt( ( vals / 2 ) + 1 );
    else mid = parseInt( ( vals / 2 ) - 1 ); // -1 because we have take 0-based index into consideration
    var ir =  mid + ":" + ( mid + 1 );
    return( ir );
}// function getMiddleTwoAsIndexRange( vals )

function getEndOfIndexRange( vals ) {
    if( vals === undefined || vals === null || vals < 2 ) return( "" );
    var end = parseInt( vals - 1 ); // -1 because we have take 0-based index into consideration
    return( end.toString() );
}// function getEndOfIndexRange( vals )

function createMonitoredItem591048() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.NumericSettings, 0, Attribute.Value, "", MonitoringMode.Reporting, undefined, Event.GetDataChangeFilter( DeadbandType.Absolute, 10, DataChangeTrigger.StatusValue ), 1);
    if( !isDefined( items ) || items.length === 0 ) {
        addSkipped( SETTING_UNDEFINED_SCALARARRAYS );
        return( false );
    }

    // get the initial values of all nodes, we can then increment them by +/-10 per test-case requirements.
    ReadHelper.Execute( { NodesToRead: items } );

    // identify the middle-two elements within each array 
    for( var i=0; i<items.length; i++ ) {
        if( items[i].Value.Value.DataType === BuiltInType.ByteString ) {
            var bsAsStr = items[i].Value.Value.toByteString().utf8ToString();
            items[i].ArraySize = bsAsStr.length;
        }
        else items[i].ArraySize = items[i].Value.Value.getArraySize();
        items[i].IndexRange = getMiddleTwoAsIndexRange( items[i].ArraySize ).toString();
        // since we're dealing with a ByteString we need use only a part of it, not all of it.
        if( items[i].Value.Value.DataType === BuiltInType.ByteString ) {
            var irl = items[i].IndexRange.substring( 0, items[i].IndexRange.indexOf( ":" ) );
            var irr = items[i].IndexRange.substring( items[i].IndexRange.indexOf( ":" ) + 1, items[i].IndexRange.length );
            items[i].Value.Value.setByteString( items[i].Value.Value.toByteString().getRange( irl, irr ) );
            print( "\n\n\tNew ByteString(2) is: " + items[i].Value.Value.toByteString() );
        }
    }
    if( true ) {
        var newItems = [];
        for( var i=0; i<items.length; i++ ) {
            if( items[i].IndexRange.indexOf( "0:" ) == 0 ) print( "Removed Item: " + items[i].NodeSetting + " because its range will conflict with the test. Middle-range: " + items[i].IndexRange );
            else {
                print( "Item: " + items[i].NodeSetting + " Middle-range: " + items[i].IndexRange );
                newItems.push( items[i] );
            }
        }
        items = newItems;
    }

    if( items.length === 0 ) { 
        addError( "None of the configured items are suitable for this test. The array size(s) are probably too small meaning a test of the first XX and middle XX elements will result in the same test!" ); 
        return( false );
    }

    // add items to existing subscription
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: MonitorBasicSubscription } ) ) return( false );

    // call Publish()() make sure we receive the initial data change
    PublishHelper.Execute( { FirstPublish: true } );
    Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() initial data-change expected.", "Publish() received initial data change notifications, as expected." );

    // read the items so we can have the correct array size
    ReadHelper.Execute( { NodesToRead: items } );

    // test #1 - increment the first value in the IndexRange by +11; also reset the indexRange so that an element OUTSIDE of the IndexRange is used
    var writeResultsExpected = [];
    for( var i=0; i<items.length; i++ ) {
        IncrementUaVariantArray( items[i].Value.Value, 0, 1, 11, true );
        items[i].IndexRange = "0:1";
        writeResultsExpected[i] = new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadWriteNotSupported ] );
    }
    WriteHelper.Execute( { NodesToWrite: items, OperationResults: writeResultsExpected,ReadVerification: false } );

    // check if the write is not supported
    if( WriteHelper.Response.Results[0].StatusCode === StatusCode.BadWriteNotSupported ) addNotSupported( "Write.Response.Results[0] is Bad_WriteNotSupported. Writing to an IndexRange is not supported by this server." );
    else {
        PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
        PublishHelper.Execute();
        Assert.False( PublishHelper.CurrentlyContainsData(), "Test #1 Publish() expected a keep-alive only. The previous write was to elements that are NOT being monitored.", "Test #1 Publish() received keep-alive as expected." );

        // test #2 - increment the value by 5
        for( var i=0; i<items.length; i++ ) IncrementUaVariantArray( items[i].Value.Value, 0, 1, 11, true );
        WriteHelper.Execute( { NodesToWrite: items, ReadVerification: false } );
        PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
        PublishHelper.Execute();
        Assert.False( PublishHelper.CurrentlyContainsData(), "Test #2 Publish() expected a keep-alive only. The previous write was to elements that are NOT being monitored.", "Test #2 Publish() received keep-alive as expected." );

        // test #3 - decrement the value by 11
        for( var i=0; i<items.length; i++ ) IncrementUaVariantArray( items[i].Value.Value, 0, 1, -11, true );
        WriteHelper.Execute( { NodesToWrite: items, ReadVerification: false } );
        PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
        PublishHelper.Execute();
        Assert.False( PublishHelper.CurrentlyContainsData(), "Test #3 Publish() expected a keep-alive only. The previous write was to elements that are NOT being monitored.", "Test #3 Publish() received keep-alive as expected." );
    }

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorBasicSubscription } );
    return( true );
}// function createMonitoredItem591048() 

Test.Execute( { Procedure: createMonitoredItem591048 } );