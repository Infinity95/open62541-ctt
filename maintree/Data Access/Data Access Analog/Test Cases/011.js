/*  Test prepared by Anand Taparia; ataparia@kepware.com    
    Description: Add monitored items of analog type (each supported datatype) to an enabled subscription.
        Wait for a publishing interval and call Publish() to verify the values received match the expected datatype of each node. */

function subscribe613011() {
    var monitoredItems = [];

    // Get accees to the analog items for this test
    var analogMonitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings );
    if( analogMonitoredItems.length == 0 ) _warning.store( "Setting not configured: '/Server Test/NodeIds/Static/DA Profile/AnaloyType/Double'." );
    else for( var n=0; n<analogMonitoredItems.length; n++ ) monitoredItems.push( analogMonitoredItems[n] );

    // Get accees to the TwoStateDiscrete items for this test
    var twoStateDiscreteMonitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DiscreteType.TwoStateDiscretes );
    if( twoStateDiscreteMonitoredItems.length == 0 ) _warning.store( "Setting not configured: '/Server Test/NodeIds/Static/DA Profile/DiscreteType/TwoStateDiscrete001'." );
    else for( var n=0; n<twoStateDiscreteMonitoredItems.length; n++ ) monitoredItems.push( twoStateDiscreteMonitoredItems[n] );
    
    // Get accees to the MultiStateDiscrete items for this test
    var multiStateDiscreteMonitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DiscreteType.MultiStateDiscretes );
    if( multiStateDiscreteMonitoredItems.length == 0 ) _warning.store( "Setting not configured: '/Server Test/NodeIds/Static/DA Profile/DiscreteType/MultiStateDiscrete001'." );
    else for( var n=0; n<multiStateDiscreteMonitoredItems.length; n++ ) monitoredItems.push( multiStateDiscreteMonitoredItems[n] );

    // check the MaxSupportedMonitoredItems setting and reduce our item count accordingly
    var maxItems = gServerCapabilities.MaxSupportedMonitoredItems;
    if( maxItems !== 0 ) {
        // 0 means unlimited, so we have a restriction here...
        while( maxItems < monitoredItems.length ) {
            // reduce the monitoredItems to match the setting size requirements
            monitoredItems.pop();
        }
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
    print ( "Calling publish." );
    if ( PublishHelper.Execute( { FirstPublish: true } ) ) {
        if( PublishHelper.CurrentlyContainsData() ) {
            var nNumSuccess = 0;
            var nNumFailure = 0;
            for( var d=0; d<PublishHelper.CurrentDataChanges.length; d++ ) {
                for( var m=0; m<PublishHelper.CurrentDataChanges[d].MonitoredItems.length; m++ ) {
                    var mi = 0;
                    // search item in monitored items list
                    for( mi=0; mi<monitoredItems.length; mi++ ) {
                        if( PublishHelper.CurrentDataChanges[d].MonitoredItems[m].ClientHandle == monitoredItems[mi].ClientHandle )
                            break;
                    }
                    if( mi == monitoredItems.length ) {
                        addLog( "no Data received for analog node '" + monitoredItems[mi].NodeSetting + "'");
                        nNumFailure++;
                    }
                    else {
                        var currentNodeDataType = UaNodeId.GuessType( monitoredItems[mi].NodeSetting );
                        // We we are not able to determine the datatype above, use this alternative method 
                        if( currentNodeDataType == "undefined" || currentNodeDataType == "") {
                            if( ReadHelper.Execute( { 
                                    NodesToRead: monitoredItems[mi] 
                                    } ) ) {
                                currentNodeDataType = monitoredItems[mi].DataType;        
                            }
                        }
                        if( PublishHelper.CurrentDataChanges[d].MonitoredItems[m].Value.Value.DataType == currentNodeDataType ) {
                            addLog ( "DataType received for monitored item '" + monitoredItems[mi].NodeSetting + "' matches the expected type of '" + BuiltInType.toString ( currentNodeDataType ) + "'." );
                            nNumSuccess++;
                        }
                        else {
                            addError ( "DataType received for monitored item '" + monitoredItems[mi].NodeSetting + "' does not match the expected type.\n\t Expected datatype: " + BuiltInType.toString ( currentNodeDataType ) + "\n\t Received datatype: " + BuiltInType.toString ( PublishHelper.CurrentDataChanges[d].MonitoredItems[m].Value.Value.DataType ) );
                            nNumFailure++;
                        }
                    }
                }
            }
            // Just check if we received responses for all our nodes
            if( ( nNumSuccess + nNumFailure ) !== monitoredItems.length ) {
                addError( "Datatypes of all the nodes was not verified.\n\tNum of nodes: " + monitoredItems.length + "\n\tSuccessfull verification: " + nNumSuccess + "\n\tFailed verification: " + nNumFailure );
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
}// function subscribe613011() 

Test.Execute( { Procedure: subscribe613011 } );