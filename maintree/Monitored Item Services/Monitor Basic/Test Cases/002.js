/*  Test prepared by Development; compliance@opcfoundation.org
    Description:
        Modifies a single monitoredItem to use another unique Client Handle, otherwise using default parameters.
        subscription is created and deleted in initialize and cleanup scripts */

function modifyMonitoredItem592001() {
    var items = MonitoredItem.GetRequiredNodes( { Settings: Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings, Number: 3 } );
    if( !isDefined( items ) || items.length !== 3 ) { addSkipped( "Not enough Scalar items to test with." ); return( false ); }
    var timestamps = TimestampsToReturn.Both;
    if(!MonitorBasicSubscription.SubscriptionCreated) addError( "Subscription for MonitoredItemsServiceSet was not created." );
    else {
        // add 3 monitored items using default parameters
        var createMonitoredItemsRequest = new UaCreateMonitoredItemsRequest();
        var createMonitoredItemsResponse = new UaCreateMonitoredItemsResponse();
        Test.Session.Session.buildRequestHeader( createMonitoredItemsRequest.RequestHeader );

        createMonitoredItemsRequest.SubscriptionId = MonitorBasicSubscription.SubscriptionId;
        createMonitoredItemsRequest.TimestampsToReturn = timestamps;

        var numItemsToMonitor = 3;
        for( var i = 0; i< numItemsToMonitor; i++ ) {
            createMonitoredItemsRequest.ItemsToCreate[i] = new UaMonitoredItemCreateRequest();
            createMonitoredItemsRequest.ItemsToCreate[i].ItemToMonitor.NodeId = items[i].NodeId;
            createMonitoredItemsRequest.ItemsToCreate[i].ItemToMonitor.AttributeId = Attribute.Value;
            createMonitoredItemsRequest.ItemsToCreate[i].MonitoringMode = MonitoringMode.Reporting;
            createMonitoredItemsRequest.ItemsToCreate[i].RequestedParameters.ClientHandle = MonitoredItem.GetNextClientHandle();
            createMonitoredItemsRequest.ItemsToCreate[i].RequestedParameters.SamplingInterval = -1;
            createMonitoredItemsRequest.ItemsToCreate[i].RequestedParameters.QueueSize = 1;
            createMonitoredItemsRequest.ItemsToCreate[i].RequestedParameters.DiscardOldest = true;
        }

        var uaStatus = Test.Session.Session.createMonitoredItems( createMonitoredItemsRequest, createMonitoredItemsResponse );
        if ( uaStatus.isGood() ) {
            checkCreateMonitoredItemsValidParameter( createMonitoredItemsRequest, createMonitoredItemsResponse );

            // modify a single monitored item
            var modifyMonitoredItemsRequest = new UaModifyMonitoredItemsRequest();
            var modifyMonitoredItemsResponse = new UaModifyMonitoredItemsResponse();
            Test.Session.Session.buildRequestHeader( modifyMonitoredItemsRequest.RequestHeader );

            modifyMonitoredItemsRequest.SubscriptionId = MonitorBasicSubscription.SubscriptionId;
            modifyMonitoredItemsRequest.TimestampsToReturn = TimestampsToReturn.Server;

            modifyMonitoredItemsRequest.ItemsToModify[0].MonitoredItemId = createMonitoredItemsResponse.Results[0].MonitoredItemId;
            modifyMonitoredItemsRequest.ItemsToModify[0].RequestedParameters.ClientHandle = 0x1234;
            modifyMonitoredItemsRequest.ItemsToModify[0].RequestedParameters.DiscardOldest = true;
            modifyMonitoredItemsRequest.ItemsToModify[0].RequestedParameters.QueueSize = 2;
            modifyMonitoredItemsRequest.ItemsToModify[0].RequestedParameters.SamplingInterval = -1;

            uaStatus = Test.Session.Session.modifyMonitoredItems( modifyMonitoredItemsRequest, modifyMonitoredItemsResponse );
            if( uaStatus.isGood() ) checkModifyMonitoredItemsValidParameter( modifyMonitoredItemsRequest, modifyMonitoredItemsResponse );
            else addError( "ModifyMonitoredItems() status " + uaStatus, uaStatus );

            // delete the items we added in this test
            var monitoredItemsIdsToDelete = new UaUInt32s();
            for( var i = 0; i< createMonitoredItemsResponse.Results.length; i++ ) monitoredItemsIdsToDelete[i] = createMonitoredItemsResponse.Results[i].MonitoredItemId;
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItemsIdsToDelete, SubscriptionId: MonitorBasicSubscription } );
        }
        else addError( "CreateMonitoredItems() status " + uaStatus, uaStatus );
    }
    return( true );
}

Test.Execute( { Procedure: modifyMonitoredItem592001 } );