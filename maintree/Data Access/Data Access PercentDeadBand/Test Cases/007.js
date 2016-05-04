/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: 
        Modifies the first 2 monitoredItems to use a deadband filter of 99% 
        where there are 2 monitoredItems in the subscription.
        Write the EURange.High, EURange.Low and a number in the middle.
        The filtered items expect to pass the EURange.Low and EURange.High values. */
 
function modifyMonitoredItems612007()
{
    const INITIAL_DEADBAND = 99;

    if( !MonitorBasicSubscription.SubscriptionCreated )
    {
        addError( "Subscription for Monitor Basic was not created" );
        return( false );
    }

    var settings = Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings;
    var items = MonitoredItem.fromSettings( settings, 0 ) ;
    if( items.length === 0 )
    {
        addSkipped( "Static Analog" );
        return( false );
    }
    
    // read all the items first, to get their data-types
    if( ! ReadHelper.Execute( {
                NodesToRead: items
                } ) ) return( false );

    // now get the EURanges for each AnalogItem type; record the original value, and prepare to write the EURange.High
    var i;
    for( i=0; i<items.length; i++ )
    {
        items[i].EURange = GetNodeIdEURange( items[i].NodeSetting );
        items[i].OriginalValue = items[i].Value.Value.clone();
        items[i].SafelySetValueTypeKnown( items[i].EURange.High, items[i].Value.Value.DataType );
    }

    // trim items that do not have an EURange.
    i=0;
    do{
        if( !isDefined( items[i].EURange ) ) 
        {
            items.splice( i );
        }
        else i++;
    } while( i < items.length );

    // reduce the size down to 5 items, per the test case definition
    while( items.length > 2 )
    {
        items.pop();
    }
    if( items.length < 2 ) 
    {
        addSkipped( "Not enough nodes to test. Aborting test." );
        return( false );
    }


    // reset the value of all nodes to the EURange.High 
    WriteHelper.Execute( { 
                NodesToWrite: items } );

    // we are expected a return of Good or Bad_MonitoredItemFilterInvalid, unfortunately
    // because the server MAY or MAY NOT support this. Server dependant!
    if( !CreateMonitoredItemsHelper.Execute( {
                ItemsToCreate: items, 
                TimestampsToReturn: TimestampsToReturn.Both, 
                SubscriptionId: MonitorBasicSubscription } ) )
    {
        addError( "Test aborted: Could not monitor the nodes specified by " + ArrayToFormattedString( MonitoredItem.GetSettingNames( items ), "and" ) + "." );
        return( false );
    }


    // call Publish() to make sure we get an initial dataChange
    PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
    PublishHelper.Execute( { FirstPublish: true } );
    if( PublishHelper.CurrentlyContainsData() == false )
    {
        addError( "Test aborted. Initial dataChange not received." );
        DeleteMonitoredItemsHelper.Execute( { 
                    ItemsToDelete: items, 
                    SubscriptionId: MonitorBasicSubscription } );
        return( false );
    }

    // now to modify the first 2 items to use a DeadbandFilter
    // define the first 2 items with deadband = 99%
    PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } ); // insert waiting time
    for( i=0; i<2; i++ )
    {
        items[i].Filter = Event.GetDataChangeFilter( DeadbandType.Percent, INITIAL_DEADBAND, DataChangeTrigger.StatusValue );
    }
    if( !ModifyMonitoredItemsHelper.Execute( {
                ItemsToModify: [items[0], items[1]], 
                TimestampsToReturn: TimestampsToReturn.Both, 
                SubscriptionId: MonitorBasicSubscription } ) )
    {
        addError( "Aborting test. Unable to modify the first two items to use a Deadband." );
        DeleteMonitoredItemsHelper.Execute( { 
                    ItemsToDelete: items, 
                    SubscriptionId: MonitorBasicSubscription } );
    }

    // call Publish() to get any dataChanges
    PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
    if( !PublishHelper.Execute() )
    {
        addError( "Publish failed after modifying items: '" + items[0].NodeId + "' and '" + items[1].NodeId + "'" );
    }





    // ~~~~~~~~~ TEST ONE ~~~~~~~~~~~~~~~~
    // we will now write the EURange.LOW to each item that as EURange defined,
    // and will then call Publish().
    // check all items are returned and their values are the EURange.Low.
    addLog( "Writing the EURange.Low to all items. Expect to receive these values in the next call to Publish()." );
    for( i=0; i<items.length; i++ ) items[i].SafelySetValueTypeKnown( items[i].EURange.Low, items[i].Value.Value.DataType );
    WriteHelper.Execute( {
            NodesToWrite: items,
            ReadVerification: false 
            } );
    PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
    PublishHelper.Execute();
    if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() expected the EURange.Low value for all monitored items.", "Publish() received the initial data-change, we anticipate receiving the EURange.Low for all items." ) )
    {
        PublishHelper.SetItemValuesFromDataChange( items, "vqt" );
        for( i=0; i<items.length; i++ )
        {
            Assert.CoercedEqual( items[i].EURange.Low, items[i].Value.Value, "Expected to receive the EURange.Low value for item: " + items[i].NodeSetting, "EURange.Low correctly received for item: " + items[i].NodeSetting );
        }
    }



    // ~~~~~~~~~ TEST TWO ~~~~~~~~~~~~~~~~
    // we will now write the EURange.<middle value> to each item that as EURange defined,
    // and will then call Publish().
    // check a keep-alive is returned.
    addLog( "Writing the EURange.<middle> to all items. Expect to receive a KeepAlivein the next call to Publish()." );
    for( i=0; i<items.length; i++ )
    {
        var diff = Math.abs( items[i].EURange.High - items[i].EURange.Low );
        if( items[i].EURange.High > items[i].EURange.Low )
        {
            items[i].SafelySetValueTypeKnown( items[i].EURange.High - (diff/2), items[i].Value.Value.DataType );
        }
        else
        {
            items[i].SafelySetValueTypeKnown( items[i].EURange.High + (diff/2), items[i].Value.Value.DataType );
        }
    }
    WriteHelper.Execute( {
            NodesToWrite: items,
            ReadVerification: false 
            } );
    PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
    PublishHelper.Execute();
    Assert.False( PublishHelper.CurrentlyContainsData(), "Publish() expected a KeepAlive only.", "Publish() returned a KeepAlive as expected." );



// ~~~~~~~~~ TEST THREE ~~~~~~~~~~~~~~~~
    // we will now write the EURange.High to each item that as EURange defined,
    // and will then call Publish().
    // check all items are returned and their values are the EURange.Low.
    addLog( "Writing the EURange.Low to all items. Expect to receive these values in the next call to Publish()." );
    for( i=0; i<items.length; i++ ) items[i].SafelySetValueTypeKnown( items[i].EURange.High, items[i].Value.Value.DataType );
    WriteHelper.Execute( {
            NodesToWrite: items,
            ReadVerification: false 
            } );
    PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
    PublishHelper.Execute();
    if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() expected the EURange.High value for all monitored items.", "Publish() received the initial data-change, we anticipate receiving the EURange.High for all items." ) )
    {
        PublishHelper.SetItemValuesFromDataChange( items, "vqt" );
        for( i=0; i<items.length; i++ )
        {
            Assert.CoercedEqual( items[i].EURange.High, items[i].Value.Value, "Expected to receive the EURange.High value for item: " + items[i].NodeSetting, "EURange.High correctly received for item: " + items[i].NodeSetting );
        }
    }



    // revert the values of all nodes back to their original value.
    for( var i=0; i<items.length; i++ ) items[i].Value.Value = items[i].OriginalValue;
    WriteHelper.Execute( {
            NodesToWrite: items,
            ReadVerification: false 
            } );

    // clean up
    DeleteMonitoredItemsHelper.Execute( { 
            ItemsToDelete: items, 
            SubscriptionId: MonitorBasicSubscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: modifyMonitoredItems612007 } );