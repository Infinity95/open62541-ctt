/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script specifies some valid and some invalid monitoredItemIds. */

function modifyMonitoredItems592Err006() {
    var items = MonitoredItem.GetRequiredNodes( { Settings: Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings, Number: 6 } );
    if( !isDefined( items ) || items.length !== 6 ) { addSkipped( "Not enough Scalar items to test with." ); return( false ); }
    var i;
    if( !MonitorBasicSubscription.SubscriptionCreated ) {
        addError( "Subscription for Monitor Basic was not created" );
        return( false );
    }

    // Add 6 monitored items using default parameters
    var createMonitoredItemsRequest = new UaCreateMonitoredItemsRequest();
    var createMonitoredItemsResponse = new UaCreateMonitoredItemsResponse();
    Test.Session.Session.buildRequestHeader( createMonitoredItemsRequest.RequestHeader );

    createMonitoredItemsRequest.SubscriptionId = MonitorBasicSubscription.SubscriptionId;
    createMonitoredItemsRequest.TimestampsToReturn = TimestampsToReturn.Both;

    var numItemsToMonitor = 6;
    print( "Creating " + numItemsToMonitor + " monitored items." );
    for( i=0; i<numItemsToMonitor; i++ ) {
        createMonitoredItemsRequest.ItemsToCreate[i] = new UaMonitoredItemCreateRequest();
        createMonitoredItemsRequest.ItemsToCreate[i].ItemToMonitor.NodeId = items[i].NodeId;
        createMonitoredItemsRequest.ItemsToCreate[i].ItemToMonitor.AttributeId = Attribute.Value;
        createMonitoredItemsRequest.ItemsToCreate[i].MonitoringMode = MonitoringMode.Reporting;
        createMonitoredItemsRequest.ItemsToCreate[i].RequestedParameters.ClientHandle = i+1;
        createMonitoredItemsRequest.ItemsToCreate[i].RequestedParameters.SamplingInterval = -1;
        createMonitoredItemsRequest.ItemsToCreate[i].RequestedParameters.QueueSize = 1;
        createMonitoredItemsRequest.ItemsToCreate[i].RequestedParameters.DiscardOldest = true;
    }

    var uaStatus = Test.Session.Session.createMonitoredItems( createMonitoredItemsRequest, createMonitoredItemsResponse );
    if ( !uaStatus.isGood() ) {
        addError( "CreateMonitoredItems() status " + uaStatus, uaStatus );
    }

    if( checkCreateMonitoredItemsValidParameter( createMonitoredItemsRequest, createMonitoredItemsResponse ) ) {
        print( "Successfully created the " + numItemsToMonitor + " monitored items." );
        print( "Modifying monitored items. Specifying some valid and some invalid monitoredItemIds." );
        var modifyMonitoredItemsRequest = new UaModifyMonitoredItemsRequest();
        var modifyMonitoredItemsResponse = new UaModifyMonitoredItemsResponse();
        Test.Session.Session.buildRequestHeader( modifyMonitoredItemsRequest.RequestHeader );

        modifyMonitoredItemsRequest.SubscriptionId = MonitorBasicSubscription.SubscriptionId;        
        modifyMonitoredItemsRequest.TimestampsToReturn = TimestampsToReturn.Server;

        for( i = 0; i < numItemsToMonitor; i++ ) {
            // Only parameter being modified
            modifyMonitoredItemsRequest.ItemsToModify[i].RequestedParameters.QueueSize = 2;
            modifyMonitoredItemsRequest.ItemsToModify[i].RequestedParameters.ClientHandle = createMonitoredItemsRequest.ItemsToCreate[i].RequestedParameters.ClientHandle;
        }

        // Let's specify indices 1,3,5 as invalid MonitoredItemIds
        modifyMonitoredItemsRequest.ItemsToModify[0].MonitoredItemId = createMonitoredItemsResponse.Results[0].MonitoredItemId;
        modifyMonitoredItemsRequest.ItemsToModify[1].MonitoredItemId = 0x1234;
        modifyMonitoredItemsRequest.ItemsToModify[2].MonitoredItemId = createMonitoredItemsResponse.Results[2].MonitoredItemId;
        modifyMonitoredItemsRequest.ItemsToModify[3].MonitoredItemId = 0x1235;
        modifyMonitoredItemsRequest.ItemsToModify[4].MonitoredItemId = createMonitoredItemsResponse.Results[4].MonitoredItemId;
        modifyMonitoredItemsRequest.ItemsToModify[5].MonitoredItemId = 0x1236;

        uaStatus = Test.Session.Session.modifyMonitoredItems( modifyMonitoredItemsRequest, modifyMonitoredItemsResponse );
        if( !uaStatus.isGood() ) {
            addError( "ModifyMonitoredItems() status " + uaStatus, uaStatus );
        }

        print( "Modified the items. The results are:" );
        // Check results
        // Indices 1,3,5 should return 'BadMonitoredItemIdInvalid' rest all 'Good'
        var ExpectedOperationResultsArray = [];
        ExpectedOperationResultsArray [0] = new ExpectedAndAcceptedResults( StatusCode.Good );
        ExpectedOperationResultsArray [1] = new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid );
        ExpectedOperationResultsArray [2] = new ExpectedAndAcceptedResults( StatusCode.Good );
        ExpectedOperationResultsArray [3] = new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid );
        ExpectedOperationResultsArray [4] = new ExpectedAndAcceptedResults( StatusCode.Good );
        ExpectedOperationResultsArray [5] = new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid );
        checkModifyMonitoredItemsError( modifyMonitoredItemsRequest, modifyMonitoredItemsResponse, ExpectedOperationResultsArray );
    }//if checkCreateMonitoredItemsValidParameter

    // Cleanup
    // Delete the items we added in this test
    var monitoredItemsIdsToDelete = new UaUInt32s();
    for( i = 0; i< createMonitoredItemsResponse.Results.length; i++ ) {
        monitoredItemsIdsToDelete[i] = createMonitoredItemsResponse.Results[i].MonitoredItemId;
    }        
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItemsIdsToDelete, SubscriptionId: MonitorBasicSubscription } );
    return( true );
}

Test.Execute( { Procedure: modifyMonitoredItems592Err006 } );