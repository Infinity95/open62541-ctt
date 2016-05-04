/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: CreateMonitoredItems: filter=VQT; no deadband. Write a VQT. Call Publish. */

function CreateMonitoredItems038() { 
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( !isDefined( item ) ) { 
        addError( "No Scalar numeric types configured. Please check Settings. Aborting test." );
        return( false );
    }
    else item.Filter = Event.GetDataChangeFilter( DeadbandType.None, 0, DataChangeTrigger.StatusValueTimestamp );

    // read the item, to get the initial value 
    ReadHelper.Execute( { NodesToRead: item } );

    // create a subscription
    var subscription = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        addError( "Unable to conduct this test because CreateSubscription() failed." );
        return( false );
    }

    // add the item to a subscription and then call Publish, and make sure we receive a value
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, SubscriptionId: subscription } ) ) return( false );

    PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
    PublishHelper.Execute( { FirstPublish: true } );
    Assert.True( PublishHelper.CurrentlyContainsData(), "Publish().Response contains the initial data-change as expected.", "Publish().Response does not contain the initial data-change. Expected a data-change." );

    // now to write a value, statuscode, and source-timestamp
    UaVariant.Increment( { Value: item.Value } );
    item.Value.Set = "Value,StatusCode,SourceTimestamp";
    item.Value.StatusCode.StatusCode = StatusCode.GoodLocalOverride;
    item.Value.SourceTimestamp = UaDateTime.utcNow();

    WriteHelper.Execute( { NodesToWrite: item, OperationResults: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadWriteNotSupported ] ) } );

    // did the server report that the write was not supported? if so then skip the publish check 
    if( WriteHelper.Response.Results[0].StatusCode !== StatusCode.BadWriteNotSupported ) { 
        PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
        PublishHelper.Execute();
        Assert.True( PublishHelper.CurrentlyContainsData(), "Publish().Response contains the second data-change as expected.", "Publish().Response does not contain the second data-change. Expected a data-change." );
    }
    else addSkipped( "Skipping Publish() check since the server does not support writing to the VQT." );

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    PublishHelper.Clear();
    return( true );
} // func

Test.Execute( { Procedure: CreateMonitoredItems038 } );