/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script sets monitoring mode to 'Reporting' for an already 'Reporting' monitor item. Calls publish each time to verify that notifications were received. */

function setMonitoringMode593009() {
    var items = MonitoredItem.GetRequiredNodes( { Settings: Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings, Number: 1 } );
    if( items == null || items.length == 0 ) {
        addWarning( "Not enough nodes configured in Static Scalar!" );
        return( false );
    }
    if( !MonitorBasicSubscription.SubscriptionCreated ) {
        addError( "Subscription for Monitor Basic was not created" );
        return( false );
    }
    // Initialize an item (above) first:
    InitializeValue( items[0].Value.Value, UaNodeId.GuessType( items[0].NodeSetting ) );
    if( !WriteHelper.Execute( { NodesToWrite: items[0] } ) ) {
        addWarning( "Write failed. Aborting test." );
        return( false );
    }
    // Add 1 monitored item (Reporting)
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items[0], TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
        // wait, to allow sampling engine (in UA Server) to initialize
        print( "\tWaiting " + items[0].RevisedSamplingInterval + " msecs before calling Publish..." );
        PublishHelper.WaitInterval( { Items: items[0], Subscription: MonitorBasicSubscription } );
        // call Publish(), we should receive datachange notification
        addLog( "Calling Publish (first call) and initial data collection." );
        PublishHelper.Execute( { FirstPublish: true } );
        // Make sure we received datachange notification
        if( Assert.Equal( true, PublishHelper.CurrentlyContainsData(), "NotificationData not received (first publish call) when expected for the 'Reporting' monitored item" ) ) {
            addLog( "NotificationData was received as expected. Setting the monitoring mode to 'Reporting' again." );
            // Set the monitoring mode to 'Reporting'
            if( SetMonitoringModeHelper.Execute( { MonitoringMode: MonitoringMode.Reporting, MonitoredItemIds: items[0], SubscriptionId: MonitorBasicSubscription } ) ) {
                // now WRITE some new values to the static nodes, to check for a dataChange
                addLog( "Writing new Value to Node. Will check for a DataChange after." );
                GenerateScalarValue( items[0].Value.Value, UaNodeId.GuessType( items[0].NodeSetting ) );
                WriteHelper.Execute( { NodesToWrite: items[0] } );
                // wait, to allow the sampling Engine (in UA Server) to detect the change
                print( "\tWaiting " + MonitorBasicSubscription.RevisedPublishingInterval + " msecs before calling Publish..." );
                PublishHelper.WaitInterval( { Items: items[0], Subscription: MonitorBasicSubscription } );
                // call Publish() again to verify that receive datachange notification this time as well
                addLog ( "Calling publish again. We should receive NotificationData this time as well." );
                PublishHelper.Execute();
                // Make sure we received datachange notification
                Assert.Equal( true, PublishHelper.CurrentlyContainsData(), "NotificationData not received (second publish call) when expected for the 'Reporting' monitored item" );
            }
        }
    }
    // delete the items we added in this test
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items[0], SubscriptionId: MonitorBasicSubscription } );
    return( true );
}

Test.Execute( { Procedure: setMonitoringMode593009 } );