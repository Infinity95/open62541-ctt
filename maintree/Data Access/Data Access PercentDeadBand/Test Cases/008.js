/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create a subscription with a deadband set to deadbandPercent=10%. Write numerous values to the item where some exceed the deaband value
        nd others don�t. call Publish(). Modify the MonitoredItem to have a deadbandPercent=0%, i.e. remove the deadband. Issue the same writes and
        Publish() calls to verify the deadband is disabled.
    Expected results:
        All service and operation level results are successful. The initial calls to Publish() will yield only the data that has changed within the
        deadband threshold. After the MonitoredItem is modified the Publish() calls will return all values written */

function createMonitoredItems612008() {
    var settings = Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings;
    var item = MonitoredItem.fromSettings( settings )[0];
    if( item === undefined ) { addSkipped( "Static Analog" ); return( false ); }

    var deadbandValue = 10;

    // before we do the test, read the analogType so that we can figure out
    // the data-type of the node. We'll need this information so that we can
    // properly specify the value that we'll WRITE to when seeing if the deadband
    // filters the write or not.
    if( ReadHelper.Execute( { NodesToRead: item } ) ) {
        // get the EURange, and generate some values to write to test the deadband
        var eurange = GetNodeIdEURange( item.NodeSetting );
        if( eurange === null || eurange === undefined ) { addError( "Test aborted: Setting '" + item.NodeSetting + "' did not yield a valid nodeId to test." ); return( false ); }
        //var getEURangeSize = GetEURangeAsSize( eurange );
        var writesToPass = GetEURangeWriteValues( 4, eurange, deadbandValue, true,  eurange.Low );
        var writesToFail = GetEURangeWriteValues( 3, eurange, deadbandValue, false, writesToPass[writesToPass.length-1] );

        // write initial value to analog item
        item.SafelySetValueTypeKnown( writesToPass[0], item.Value.Value.DataType );
        WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } );

        // create the monitoredItem
        item.Filter = Event.GetDataChangeFilter( DeadbandType.Percent, deadbandValue, DataChangeTrigger.StatusValue );
        if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
            addError( "Test aborted: Could not monitor the node specified by " + item.NodeSetting + "." );
            return( false );
        }

        // test the 10% deadband by writing our values expect to PASS
        print( "\n\n\n~~~~~~~~~~~~~ Deadband testing: values expected to PASS filter ~~~~~~~~~~~~~~~~~" );
        var w;
        for( w=1; w<writesToPass.length; w++ ) {
            // set the value, wait to allow UA server to poll the new value
            item.SafelySetValueTypeKnown( writesToPass[w], item.Value.Value.DataType );
            WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } );
            PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
            PublishHelper.Execute();
            PublishHelper.SetItemValuesFromDataChange( [ item ] );
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange for the written value '" + writesToPass[w] + "' expected to exceed the deadband." ) ) {
                Assert.CoercedEqual( writesToPass[w], item.Value.Value, "Expected to receive the value '" + writesToPass[w] + "' that was just written." );
            }
        }

        var publishCountBeforeFailTest = PublishHelper.ReceivedDataChanges.length;
        // test the 10% deadband by writing our values expect to FAIL
        print( "\n\n\n~~~~~~~~~~~~~ Deadband testing: values expected to FAIL (get filtered) ~~~~~~~~~~~~~~~~~" );
        for( w=0; w<writesToFail.length; w++ ) {
            // set the value, wait to allow UA server to poll the new value
            item.SafelySetValueTypeKnown( writesToFail[w], item.Value.Value.DataType );
            WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } );
            PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
            PublishHelper.Execute();
            PublishHelper.SetItemValuesFromDataChange( [ item ] );
            Assert.False( PublishHelper.CurrentlyContainsData(), "Unexpected dataChange for the written value '" + writesToFail[w] + "' which should have been inside the bounds of the deadband, and therefore get filtered." );
        }
        Assert.Equal( publishCountBeforeFailTest, PublishHelper.ReceivedDataChanges.length, "Expected the number of DataChanges to remain the same since the values written should've filtered by the deadband." );

        // now switch it all over to 0% deadband
        deadbandValue = 0;
        item.Filter = Event.GetDataChangeFilter( DeadbandType.Percent, deadbandValue, DataChangeTrigger.StatusValue );

        // modify the monitoredItem to use 0% deadband
        if( ModifyMonitoredItemsHelper.Execute( { ItemsToModify: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
            // test the 0% deadband by writing our values expect to PASS
            print( "\n\n\n~~~~~~~~~~~~~ Deadband testing: values expected to PASS (previously would've failed) ~~~~~~~~~~~~~~~~~" );
            for( w=0; w<writesToFail.length; w++ ) {
                // set the value, wait to allow UA server to poll the new value
                item.SafelySetValueTypeKnown( writesToFail[w], item.Value.Value.DataType );
                WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } );
                PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
                PublishHelper.Execute();
                PublishHelper.SetItemValuesFromDataChange( [ item ] );
                if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected  a dataChange for written a value of '" + writesToFail[w] + "'. The item was previously modified with a DeadbandPercent of 0, so the value should have been returned." ) ) {
                    Assert.CoercedEqual( writesToFail[w], item.Value.Value, "Expected to receive the value we just written." );
                }
            }
        }
    }// read
    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems612008 } );