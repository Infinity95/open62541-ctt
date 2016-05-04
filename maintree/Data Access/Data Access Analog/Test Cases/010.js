/*  Test prepared by Anand Taparia; ataparia@kepware.com    
   Description: Add monitored items of analog type (each supported datatype) to an enabled subscription. Wait for a publishing interval and call Publish()
                to verify the values received match the expected datatype of each node. */

function subscribe613010() {
    // Get accees to the analog items for this test
    var monitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.NumericSettings, 1 );
    if( monitoredItems.length == 0 ) {
        addSkipped( "Static Analog" );
        return( false );
    }

    // Create the subscription
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) == false ) {
        print( "Test aborted: Unable to create subscription." );
        return( false );
    }

    // Create and add monitored items to the subscription
    if ( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: monitoredItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) == false ) {
        print( "Test aborted: Unable to add the monitored items to the subscription." );
        return( false );
    }

    // Wait for one publishing interval
    PublishHelper.WaitInterval( { Items: monitoredItems, Subscription: subscription } );

    // call Publish()
    print( "Calling publish." );
    if ( PublishHelper.Execute( { FirstPublish: true } ) ) {
        if( PublishHelper.CurrentlyContainsData ) {
            var nNumSuccess = 0;
            var nNumFailure = 0;
            for( var d=0; d<PublishHelper.CurrentDataChanges.length; d++ ) {
                for( var m=0; m<PublishHelper.CurrentDataChanges[d].MonitoredItems.length; m++ ) {
                    var mi = 0;
                    // search item in current data changes
                    for (mi = 0; mi < PublishHelper.CurrentDataChanges[d].MonitoredItems.length; mi++) {
                        if (monitoredItems[m].ClientHandle == PublishHelper.CurrentDataChanges[d].MonitoredItems[mi].ClientHandle)
                            break;
                    }
                    if( mi == PublishHelper.CurrentDataChanges[d].MonitoredItems.length ) {
                        addLog( "no Data received for analog node '" + monitoredItems[m].NodeSetting + "'");
                        nNumFailure++;
                    }
                    else {
                        var currentNodeDataType = UaNodeId.GuessType( monitoredItems[m].NodeSetting );
                        if ( PublishHelper.CurrentDataChanges[d].MonitoredItems[mi].Value.Value.DataType == currentNodeDataType ) {
                            addLog( "DataType received for analog node '" + monitoredItems[m].NodeSetting + "' matches the expected type of '" + BuiltInType.toString ( currentNodeDataType ) + "'." );
                            nNumSuccess++;
                        }
                        else {
                            addError( "DataType received for analog node '" + monitoredItems[m].NodeSetting + "' does not match the expected type.\n\t Expected datatype: " + BuiltInType.toString ( currentNodeDataType ) + "\n\t Received datatype: " + BuiltInType.toString ( PublishHelper.CurrentDataChanges[d].MonitoredItems[mi].Value.Value.DataType) );
                            nNumFailure++;
                        }
                    }
                }
            }
            // Just check if we received responses for all our analog nodes
            if ( ( nNumSuccess + nNumFailure ) != monitoredItems.length ) {
                addError( "Datatypes of all the analog nodes was not verified.\n\tNum of analog nodes: " + monitoredItems.length + "\n\tSuccessfull verification: " + nNumSuccess + "\n\tFailed verification: " + nNumFailure );
            }
            else {
                addLog( "All data-types received and are correct!" );
            }
        }
        else {
            addError( "No dataChange received after the publish as was expected." );
        }
    }

    // Clean up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItems, SubscriptionId: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    PublishHelper.Clear();
    return( true );
}// function subscribe613010() 

Test.Execute( { Procedure: subscribe613010 } );