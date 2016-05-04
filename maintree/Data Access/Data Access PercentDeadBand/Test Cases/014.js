/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: With QueueSize=1 and deadband=0; make sure no Queue overflow occurs. */

function CreateMonitoredItems014() { 
    // get an item
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings )[0];
    if( !isDefined( item ) ) { 
        addSkipped( "No static Analog items defined. Check settings. Skipping test." );
        return( false );
    }

    // read item to get initial value and then keep it for later...
    ReadHelper.Execute( { NodesToRead: item } );
    item.OriginalValue = item.Value.Value.clone();

    // does the item have an EURange?
    var analogNodeEURange = GetNodeIdEURange( item.NodeSetting );

    // setup item characteristics
    item.QueueSize = 1;
    item.DiscardOldest = false;
    item.MonitoringMode = MonitoringMode.Reporting;
    item.Filter = Event.GetDataChangeFilter( DeadbandType.Percent, 0, DataChangeTrigger.StatusValue );

    // add item to a subscription 
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, SubscriptionId: MonitorBasicSubscription } ) ) return( false );

    // get the initial data-change
    PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
    PublishHelper.Execute( { FirstPublish: true } );
    Assert.True( PublishHelper.CurrentlyContainsData(), "Publish().Response does not contain the initial data-change!" );

    // issue 2 writes, delayed by the RevisedSamplingInterval 
    for( var i=0; i<2; i++ ) {
        // increment value, wait, and write, we expect success!
        UaVariant.Increment( { Value: item.Value, Range: analogNodeEURange } );
        PublishHelper.WaitInterval( { Items: item } );
        WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } );
    }//for i...
    var lastWrittenValue = item.Value.Value.clone();

    // now call Publish. We expect one data-change, with only the last value, and no Overflow bit!
    PublishHelper.WaitInterval( { Items: item } );
    PublishHelper.Execute();
    if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish().Response did not return the data-change after writing to the node." ) ) { 
        Assert.Equal( lastWrittenValue, PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.Value, "Publish().Response.NotificationMessages[0].MonitoredItems[0] did not return the value that was written in the last Write(). Even though DiscardOldest=false, it should be ignored when QueueSize=1." );
        Assert.NotEqual( StatusCode.Good | OVERFLOWBIT, PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.StatusCode.StatusCode, "Publish().Response.NotificationMessages[0].MonitoredItems[0].StatusCode overflow bit is active. Overflow bit should not be set when the QueueSize=1." );
    }

    // clean up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );

    // revert the item's value back to the original 
    item.Value.Value = item.OriginalValue.clone();
    WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } );
    return( true );
}// function CreateMonitoredItems014()

Test.Execute( { Procedure: CreateMonitoredItems014 } );