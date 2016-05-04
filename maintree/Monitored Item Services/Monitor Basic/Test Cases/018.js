/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description:
        Script modifies the monitoring mode of 10 items (initial monitoring mode: reporting) 
        with multiple items being set to each of the three modes (Disabled, Reporting, Sampling)
        Calls publish before and after changing the mode and verifies that datachange notifications 
        are received only for the reporting items. */

function setMonitoringMode593011() {
    // The 10 items used for this test. The test can use the same NodeIds,
    // which saves us the trouble of finding 10 nodes that exist.
    var itemsTmp = MonitoredItem.GetRequiredNodes( { Settings: Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings, Number: 2 } );

    var items = [ itemsTmp[0], itemsTmp[1],
        MonitoredItem.Clone( itemsTmp[0] ), MonitoredItem.Clone( itemsTmp[1] ),
        MonitoredItem.Clone( itemsTmp[0] ), MonitoredItem.Clone( itemsTmp[1] ),
        MonitoredItem.Clone( itemsTmp[0] ), MonitoredItem.Clone( itemsTmp[1] ),
        MonitoredItem.Clone( itemsTmp[0] ), MonitoredItem.Clone( itemsTmp[1] ) ];
    // set the Client handles
    var x;
    for( x=0; x<items.length; x++ ) {
        items[x].ClientHandle = x;
    }

    if( !MonitorBasicSubscription.SubscriptionCreated ) {
        addError( "Subscription for Monitor Basic was not created" );
        return( false );
    }

    // Add the 10 monitored items (all Reporting)
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
        addError( "CreateMonitoredItems() status " + uaStatus, uaStatus );
    }
    else {
        // wait one publishing cycle before calling publish
        PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );

        // call Publish(), we should receive datachange notification
        addLog( "Calling Publish (first call) and initial data collection" );
        PublishHelper.Execute( { FirstPublish: true } );
        
        // Make sure we received datachange notification - should contain INITIAL values
        if( Assert.True( PublishHelper.CurrentlyContainsData(), "NotificationData not received (first publish call) when expected for the 10 monitored items" ) ) {
            Assert.Equal( 10, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected a dataChange for all items!" );

            // update our items with the values in the Publish response
            PublishHelper.SetItemValuesFromDataChange( items, "v" );

            // Now change the monitoring mode as below:
            // Disabled: 3 (indices 0,4,6 in createMonitoredItemsResponse)
            // Sampling: 3 (indices 2,8,9 in createMonitoredItemsResponse)
            // Reporting: 4 (indices 1,3,5,7 in createMonitoredItemsResponse)
            addLog ( "Changing monitoring mode for the items." );

            // i=0: DISABLED; i=1: SAMPLING; i=2: REPORTING
            for ( i=0; i<3; i++) {
                var setMonitoringModeRequest = new UaSetMonitoringModeRequest ();
                var setMonitoringModeResponse = new UaSetMonitoringModeResponse();
                Test.Session.Session.buildRequestHeader( setMonitoringModeRequest.RequestHeader );
                setMonitoringModeRequest.SubscriptionId = MonitorBasicSubscription.SubscriptionId;    
                switch (i) {
                    // DISABLED
                    case 0:
                        setMonitoringModeRequest.MonitoringMode = MonitoringMode.Disabled;            
                        // Items
                        setMonitoringModeRequest.MonitoredItemIds[0] = items[0].MonitoredItemId;
                        setMonitoringModeRequest.MonitoredItemIds[1] = items[4].MonitoredItemId;
                        setMonitoringModeRequest.MonitoredItemIds[2] = items[6].MonitoredItemId;
                        break;

                    // SAMPLING
                    case 1:
                        setMonitoringModeRequest.MonitoringMode = MonitoringMode.Sampling;
                        // Items
                        setMonitoringModeRequest.MonitoredItemIds[0] = items[2].MonitoredItemId;
                        setMonitoringModeRequest.MonitoredItemIds[1] = items[8].MonitoredItemId;
                        setMonitoringModeRequest.MonitoredItemIds[2] = items[9].MonitoredItemId;
                        break;  

                    // REPORTING
                    case 2:
                        setMonitoringModeRequest.MonitoringMode = MonitoringMode.Reporting;
                        // Items
                        setMonitoringModeRequest.MonitoredItemIds[0] = items[1].MonitoredItemId;
                        setMonitoringModeRequest.MonitoredItemIds[1] = items[3].MonitoredItemId;
                        setMonitoringModeRequest.MonitoredItemIds[2] = items[5].MonitoredItemId;
                        setMonitoringModeRequest.MonitoredItemIds[3] = items[7].MonitoredItemId;
                        break;            
                    
                    default:
                        addError( "Unexpected error. Unable to specify the monitoringMode request. Test script implementation problem!" );
                }

                uaStatus = Test.Session.Session.setMonitoringMode( setMonitoringModeRequest, setMonitoringModeResponse );        
                if( !uaStatus.isGood() ) addError( "SetMonitoringMode() status " + uaStatus, uaStatus );

                checkSetMonitoringModeValidParameter( setMonitoringModeRequest, setMonitoringModeResponse );
                switch (i) {
                    // DISABLED
                    case 0:
                        addLog( "Monitoring mode set to 'Disabled' successfully for 3 items." );
                        break;            
                    // SAMPLING
                    case 1:
                        addLog( "Monitoring mode set to 'Sampling' successfully for 3 items." );
                        break;            
                    // REPORTING
                    case 2:
                        addLog( "Monitoring mode set to 'Reporting' successfully for 4 items." );
                        break;            
                    default:
                        addError( "Unexpected error. Verification implementation problem in test-script." );
                }
            }

            // Write to ALL items, incl. those that are disabled etc.
            for( x=0; x<items.length; x++ ) items[x].SafelySetValueTypeKnown( 1 + parseInt( items[x].Value.Value ), items[x].Value.Value.DataType );
            if( Assert.True( WriteHelper.Execute( { NodesToWrite: items } ), "This test requires the ability to Write to the Nodes in order to achieve a value change in the item so that the Publish call can receive a dataChange notification." ) ) {
                // call Publish() again to verify that we receive datachange notification only for 4 items
                // wait one publishing cycle before calling publish
                PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
                addLog ( "Calling publish again. We should receivse NotificationData this time only for 4 items." );
                PublishHelper.Execute();
                // Make sure we received datachange notification
                if( Assert.Equal( true, PublishHelper.CurrentlyContainsData(), "NotificationData not received (second publish call) when expected for the 4 'Reporting' monitored items", "Publish() #2 correctly received the dataChange notifications as expected." ) ) {
                    // Check that notification was received only for 4 items
                    if( Assert.Equal( 4, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, ( "Datachange notification received for " + PublishHelper.CurrentDataChanges[0].MonitoredItems.length + " items when expected for 4 items" ), "Publish() #2 received the 4 dataChange notifications as expected, since the other 6 monitoredItems are set to Disabled/Sampling." ) )
                    {
                        var expectedItems = [1, 3, 5, 7 ];
                        for( x=0; x<expectedItems.length; x++ ) Assert.True( PublishHelper.HandleIsInCurrentDataChanges( items[expectedItems[x]].ClientHandle ), ( "Expected item[" + expectedItems[x] + "] (Node: " + items[expectedItems[x]].NodeSetting + ") to send an update." ), "Item[" + expectedItems[x] + "] successfully received a dataChange notification. Mode=" + MonitoringMode.toString( items[x].MonitoringMode ) );
                    }//received correct # of notifications
                }//publish #2 contains data
            }//write successful
        }//publish #1 contains data
    }//create monitoredItems successful
    // Cleanup
    // Delete the items we added in this test
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorBasicSubscription } );
    return( true );
}

Test.Execute( { Procedure: setMonitoringMode593011 } );