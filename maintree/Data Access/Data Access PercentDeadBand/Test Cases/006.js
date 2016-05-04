/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Modifies the first 2 monitoredItems to use a deadband filter of 100%, 
        where there are 5 monitoredItems in the subscription.
    Expected results:
        All ServiceResults are �Good�. The operation level results are Good for the
        subscription creation and modification. For the writes where the value exceeds the
        deadband: if the call is accepted then we expect to see the value(s) in the
        Publish response. Otherwise we expect the Publish response to be a KeepAlive. */

function modifyMonitoredItems612006() {
const INITIAL_DEADBAND = 100;

    if( !MonitorBasicSubscription.SubscriptionCreated ) {
        addError( "Test cannot be completed: Subscription for Monitor Basic was not created" );
        return( false );
    }

    var settings = Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.NumericSettings;
    var items = MonitoredItem.fromSettings( settings, 0 );
    if( items.length === 0 ) {
        addSkipped( "Static Analog" );
        return( false );
    }
    else if( items.length < 2 ) {
        addError( "Test cannot be completed: " + items.length + " of 5 required AnalogItem nodes configured in settings." );
        return( false );
    }
    else {
        // reduce the size down to 2 items, per the test case definition
        while( items.length > 2 ) {
            items.shift();
        }
    }


    // read all the items first, to get their data-types
    if( ! ReadHelper.Execute( { NodesToRead: items } ) ) {
        addError( "Test aborted: Could not read nodes specified by " + ArrayToFormattedString( MonitoredItem.GetSettingNames( items ), "and" ) + "." );
        return( false );
    }
    else {
        //store these initial values so that we can revert to them at the end
        for( var i=0; i<items.length; i++ ) {
            if( i > 2 ) continue;
            // store the initial value so we can revert to it later
            items[i].InitialValue = items[i].Value.Value.clone();
            // figure out the EURange etc.
            items[i].EURange = GetNodeIdEURange( items[i].NodeSetting );
            items[i].FutureFilter = Event.GetDataChangeFilter( DeadbandType.Percent, INITIAL_DEADBAND, DataChangeTrigger.StatusValue );
            // does the current value fall outside the range of the EURange
            print( "\tChecking if initial value is within the EURange. Value: " + items[i].Value.Value + "; EURange: " + items[i].EURange );
            var initialValue = UaVariantToSimpleType( items[i].Value.Value );
            var minValue = UaVariantToSimpleType( items[i].EURange.Low );
            var maxValue = UaVariantToSimpleType( items[i].EURange.High );
            if( !( initialValue >= minValue && initialValue <= maxValue ) ) {
                // reset the value to the middle of the EURange
                var midwayValue = GetEURangeMidPoint( items[i].EURange.Low, items[i].EURange.High );
                addWarning( "Initial value for item '" + items[i].NodeSetting + "' is: " + items[i].Value.Value + "; which is outside the range: " + 
                    items[i].EURange.Low + "-" + items[i].EURange.High + ". Resetting to Value: " + midwayValue );
                items[i].SafelySetValueTypeKnown( midwayValue, items[i].DataType );
                if( WriteHelper.Execute( { NodesToWrite: items[i] } ) ) {
                    initialValue = midwayValue;
                }
            }
            // get the size of the EURange
            var eURangeAsSize = GetEURangeAsSize( items[i].EURange );
            items[i].writesToPass = [items[i].EURange.High + 1, items[i].EURange.Low - 1 ];
            items[i].writesToFail = [items[i].EURange.Low + 1, items[i].EURange.High - 1];

            // is the item an unsigned int? are we going to write a negative number?
            items[i].DataType = UaNodeId.GuessType( items[i].NodeSetting );
            if( items[i].DataType === BuiltInType.UInt16 || items[i].DataType === BuiltInType.UInt32 || items[i].DataType === BuiltInType.UInt64 ) {
                if( items[i].writesToPass[0] < 0 ) {
                    items[i].writesToPass[0] = items[i].EURange.High + ( eURangeAsSize * 2 );
                }
            }

            print( "Item (" + items[i].NodeSetting + ") EURange: " + items[i].EURange + "; Writes to Pass: " + items[i].writesToPass + "; Writes to Fail: " + items[i].writesToFail );
        }
    }

    // for control purposes, set the initial value to something that we can guarantee will permit the test to execute correctly.
    // in this case, set the initial value to EURange.Low.
    for( var i=0; i<items.length; i++ ) {
        items[i].SafelySetValueTypeKnown( items[i].EURange.Low, items[i].DataType );
    }
    WriteHelper.Execute( { NodesToWrite: items, ReadVerification: false } );


    // now to test.
    var expectedResults = [
        new ExpectedAndAcceptedResults( StatusCode.Good ),
        new ExpectedAndAcceptedResults( StatusCode.Good )
        ];
    if( ! CreateMonitoredItemsHelper.Execute( { 
                ItemsToCreate: items, 
                TimestampsToReturn: TimestampsToReturn.Both, 
                SubscriptionId: MonitorBasicSubscription, 
                OperationResults: expectedResults
                } ) ) return( false );

    // wait one publishing cycle before calling publish
    PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );

    // call Publish(), to get the initial values for all nodes.
    PublishHelper.Execute( { FirstPublish: true } );
    if( !Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() Expected to receive initial values.", "Publish() received initial values as expected." ) )
    {
        DeleteMonitoredItemsHelper.Execute( { 
                ItemsToDelete: items,
                SubscriptionId: MonitorBasicSubscription } );
        return( false );
    }


    // now to modify the first two items
    for( var i=0; i<2; i++ )
    {
        items[i].Filter = items[i].FutureFilter;
    }
    // modify the first two items so that they contain a dataChange filter
    if (!ModifyMonitoredItemsHelper.Execute( {
                ItemsToModify: [items[0], items[1]], 
                TimestampsToReturn: TimestampsToReturn.Both, 
                SubscriptionId: MonitorBasicSubscription } ) )
    {
        addError( "Aborting test. Unable to modify the first 2 items." );
        DeleteMonitoredItemsHelper.Execute( { 
                    ItemsToDelete: items, 
                    SubscriptionId: MonitorBasicSubscription } );
        return( false );
    }

    // wait one publishing cycle before calling publish
    PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
    PublishHelper.Execute();

    // issue the writes for the items with the deadband set
    // first: issue writes that MIGHT pass...
    var expectedErrors = [
        new ExpectedAndAcceptedResults( StatusCode.BadOutOfRange ),
        new ExpectedAndAcceptedResults( StatusCode.BadOutOfRange )
        ];
    expectedErrors[0].addAcceptedResult( StatusCode.Good );
    expectedErrors[1].addAcceptedResult( StatusCode.Good );
    var expectPublishDataChangeResponse = false;
    // store the number of writes, we will compare to publish notifications shortly
    print( "\n\nWrite Tests to PASS Deadband testing -->" );
    for( i=0; i<2; i++ )
    {
        print( "\tWrite #" + ( 1+i ) + " of 2: writing values expected to pass deadband [0=" + items[0].writesToPass[i] + "; 1=" + items[1].writesToPass[i] + "]." );
        items[0].SafelySetValueTypeKnown( items[0].writesToPass[i], items[0].DataType );
        items[1].SafelySetValueTypeKnown( items[1].writesToPass[i], items[1].DataType );
        WriteHelper.Execute( { 
                NodesToWrite: [items[0], items[1]],
                OperationResults: expectedErrors, 
                ReadVerification: false } );
        // check the results. If a value was accepted then we'lll check it in the publish response
        if( WriteHelper.Response.Results[0].StatusCode === StatusCode.Good ||
            WriteHelper.Response.Results[1].StatusCode === StatusCode.Good )
        {
            addLog( "A write OUTSIDE the bounds of the EURange WAS ACCEPTED. We will check to see if it is received in the Publish response." );
            PublishHelper.Execute();
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() is empty. Expected to receive the data change notifications where WriteService.Results[*]=Good. Otherwise writes should have returned Bad_OutOfRange.", "Publish() received expected notifications." ) )
            {
                var expectedNotfications = WriteHelper.Response.Results[0].StatusCode === StatusCode.Good && WriteHelper.Response.Results[1].StatusCode === StatusCode.Good? 2 : 1;
                Assert.Equal( expectedNotfications, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Publish() Expected to receive the same # of items in Publish() as nodes written in the prior Write().", "Publish() received expected # of monitoredItems within the data change notification." );
            }
        }
        else
        {
            addLog( "Server DOES NOT permit writing out of the bounds of the EURange. This is perfectly legal. Will not expect to receive the previous writes in the upcoming Publish call." );
            PublishHelper.Execute();
            Assert.False( PublishHelper.CurrentlyContainsData(), "Did not expect to receive any data change notifications because the prior WriteService.Results[*]=" + WriteHelper.Response.Results[0].StatusCode + "." );
        }
        PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
    }


    // intermediate write: put the value at the EURange.Low; this way we can guarantee that
    // the next set of writes will fail
    var checkResetValuePublish = true
    for( i=0; i<2; i++ )
    {
        if( items[i].Value.Value !== items[i].writesToPass[1] ) checkResetValuePublish=false;
    }
    print( "\n\nRevert the items value to the EURange.Low value -->" );
    for( i=0; i<2; i++ )
    {
        items[i].SafelySetValueTypeKnown( items[i].EURange.Low, items[i].DataType );
    }
    WriteHelper.Execute( {
                NodesToWrite: items,
                ReadVerification: false } );
    PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
    PublishHelper.Execute();
    // potential for unsigned types to "wrap" and cause a data change
    if( checkResetValuePublish )
    {
        Assert.False( PublishHelper.CurrentlyContainsData(), "Did not expect Publish() to yield the previous Write() call - which set the values to EURange.Low; which should not have passed the deadband filter.", "Publish() did not receive notifications, as expected." );
    }


    // second: write values we expect to fail... although the writes themselves may succeed
    print( "\n\nWrite Tests to FAIL Deadband testing -->" );
    expectedErrors = [
        new ExpectedAndAcceptedResults( StatusCode.Good ),
        new ExpectedAndAcceptedResults( StatusCode.Good )
        ];
    for( i=0; i<2; i++ )
    {
        print( "\tWrite #" + ( 1+i ) + " of 2: writing values expected to be filtered by the deadband." );
        items[0].SafelySetValueTypeKnown( items[0].writesToFail[i], items[0].DataType );
        items[1].SafelySetValueTypeKnown( items[1].writesToFail[i], items[1].DataType );
        WriteHelper.Execute( {
                    NodesToWrite: [items[0], items[1]], 
                    OperationResults: expectedErrors, 
                    ReadVerification: false } );
        PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
    }

    // call Publish()
    PublishHelper.Execute();
    Assert.False( PublishHelper.CurrentlyContainsData(), ( "Did not expect Publish() to yield any data change notifications since the previous Write() calls specified values expected to be filtered by the deadband.", "Publish() yielded no notifications, as expected." ) );

    // clean up
    DeleteMonitoredItemsHelper.Execute( { 
                ItemsToDelete: items, 
                SubscriptionId: MonitorBasicSubscription } );
    PublishHelper.Clear();

    // revert the values back to their original state
    print( "Reverting items back to their original values..." );
    for( var i=0; i<items.length; i++ )
    {
        items[i].Value.Value = items[i].InitialValue;
    }
    WriteHelper.Execute( { 
            NodesToWrite: items,
            ReadVerification: false } );
    return( true );
}

Test.Execute( { Procedure: modifyMonitoredItems612006 } );