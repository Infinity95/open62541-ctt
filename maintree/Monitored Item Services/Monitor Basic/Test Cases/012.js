/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script modifies the queueSize of the first item to max UInt32. We expect that no server will accept a queue of this size, so we are checking 
        to make usre the size != max UInt32. */

function modifyMonitoredItems592012() {
    var items = MonitoredItem.GetRequiredNodes( { Settings: Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings, Number: 3 } );
    if( !isDefined( items ) || items.length !== 3 ) { addSkipped( "Not enough Scalar items to test with." ); return( false ); }
    if( !MonitorBasicSubscription.SubscriptionCreated ) {
        addError( "Subscription for Monitor Basic was not created" );
        return( false );
    }

    // Add 3 monitored items using default parameters
    var createMonitoredItemsRequest = new UaCreateMonitoredItemsRequest();
    var createMonitoredItemsResponse = new UaCreateMonitoredItemsResponse();
    Test.Session.Session.buildRequestHeader(createMonitoredItemsRequest.RequestHeader);

    createMonitoredItemsRequest.SubscriptionId = MonitorBasicSubscription.SubscriptionId;
    createMonitoredItemsRequest.TimestampsToReturn = TimestampsToReturn.Both;

    var clientHandle = 1;
    var numItemsToMonitor = 3;
    print( "Creating " + numItemsToMonitor + " monitored items." );
    for( var i = 0; i< numItemsToMonitor; i++ ) {
        createMonitoredItemsRequest.ItemsToCreate[i] = new UaMonitoredItemCreateRequest();
        createMonitoredItemsRequest.ItemsToCreate[i].ItemToMonitor.NodeId = items[i].NodeId;
        createMonitoredItemsRequest.ItemsToCreate[i].ItemToMonitor.AttributeId = Attribute.Value;
        createMonitoredItemsRequest.ItemsToCreate[i].MonitoringMode = MonitoringMode.Reporting;
        createMonitoredItemsRequest.ItemsToCreate[i].RequestedParameters.ClientHandle = clientHandle++;
        createMonitoredItemsRequest.ItemsToCreate[i].RequestedParameters.SamplingInterval = -1;
        createMonitoredItemsRequest.ItemsToCreate[i].RequestedParameters.QueueSize = 1;
        createMonitoredItemsRequest.ItemsToCreate[i].RequestedParameters.DiscardOldest = true;
    }

    var uaStatus = Test.Session.Session.createMonitoredItems( createMonitoredItemsRequest, createMonitoredItemsResponse );
    if ( !uaStatus.isGood() ) {
        addError( "CreateMonitoredItems() status " + uaStatus, uaStatus );
        return( false );
    }

    checkCreateMonitoredItemsValidParameter( createMonitoredItemsRequest, createMonitoredItemsResponse );
    print( "Successfully created the " + numItemsToMonitor + " monitored items." );
    print( "Modifying the " + numItemsToMonitor + " monitored items. Setting the 'QueueSize' of the first item to max unsigned int value('" + Constants.UInt32_Max + "')." );
    // Modify the three monitoredItems; Specify MAX UINT32 for the QueueSize of the first item
    var modifyMonitoredItemsRequest = new UaModifyMonitoredItemsRequest();
    var modifyMonitoredItemsResponse = new UaModifyMonitoredItemsResponse();
    Test.Session.Session.buildRequestHeader( modifyMonitoredItemsRequest.RequestHeader );

    modifyMonitoredItemsRequest.SubscriptionId = MonitorBasicSubscription.SubscriptionId;
    modifyMonitoredItemsRequest.TimestampsToReturn = TimestampsToReturn.Server;

    modifyMonitoredItemsRequest.ItemsToModify[0].MonitoredItemId = createMonitoredItemsResponse.Results[0].MonitoredItemId;
    modifyMonitoredItemsRequest.ItemsToModify[0].RequestedParameters.QueueSize = Constants.UInt32_Max;
    modifyMonitoredItemsRequest.ItemsToModify[0].RequestedParameters.ClientHandle = createMonitoredItemsRequest.ItemsToCreate[0].RequestedParameters.ClientHandle;
    modifyMonitoredItemsRequest.ItemsToModify[1].MonitoredItemId = createMonitoredItemsResponse.Results[1].MonitoredItemId;
    modifyMonitoredItemsRequest.ItemsToModify[1].RequestedParameters.DiscardOldest = false;
    modifyMonitoredItemsRequest.ItemsToModify[1].RequestedParameters.ClientHandle = createMonitoredItemsRequest.ItemsToCreate[1].RequestedParameters.ClientHandle;
    modifyMonitoredItemsRequest.ItemsToModify[2].MonitoredItemId = createMonitoredItemsResponse.Results[2].MonitoredItemId;
    modifyMonitoredItemsRequest.ItemsToModify[2].RequestedParameters.DiscardOldest = false;
    modifyMonitoredItemsRequest.ItemsToModify[2].RequestedParameters.ClientHandle = createMonitoredItemsRequest.ItemsToCreate[2].RequestedParameters.ClientHandle;

    uaStatus = Test.Session.Session.modifyMonitoredItems( modifyMonitoredItemsRequest, modifyMonitoredItemsResponse );        
    if( !uaStatus.isGood() ) {
        addError( "ModifyMonitoredItems() status " + uaStatus, uaStatus );
        return( false );
    }
   
    print( "Modified the items. The results are:" );
    // Check the results of the modification.
    checkModifyMonitoredItemsValidParameter( modifyMonitoredItemsRequest, modifyMonitoredItemsResponse );

    // make sure the revisedQueueSize != maxInt32
    Assert.NotEqual( Constants.UInt32_Max, modifyMonitoredItemsResponse.Results[0].RevisedQueueSize, "Server did not revise the maxInt value of the queueSize. Servers must put a cap on the max size of queue they support to avoid consuming too many resources." );

    // Cleanup
    // Delete the items we added in this test
    var monitoredItemsIdsToDelete = new UaUInt32s();
    for( i=0; i<createMonitoredItemsResponse.Results.length; i++ ) {
        monitoredItemsIdsToDelete[i] = createMonitoredItemsResponse.Results[i].MonitoredItemId;
    }
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItemsIdsToDelete, SubscriptionId: MonitorBasicSubscription } );
    return( true );
}

Test.Execute( { Procedure: modifyMonitoredItems592012 } );