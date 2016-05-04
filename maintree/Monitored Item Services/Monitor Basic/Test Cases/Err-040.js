/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script specifies an invalid IndexRange of �0x2:0xF� (hex) for an array item. */

function createMonitoredItems591Err011() {
    if( !MonitorBasicSubscription.SubscriptionCreated ) addError( "Subscription for Monitor Basic was not created." );
    else {
        // Create a single monitored item using an invalid subscriptionID
        var createMonitoredItemsRequest = new UaCreateMonitoredItemsRequest();
        var createMonitoredItemsResponse = new UaCreateMonitoredItemsResponse();
        Test.Session.Session.buildRequestHeader( createMonitoredItemsRequest.RequestHeader );

        createMonitoredItemsRequest.SubscriptionId = MonitorBasicSubscription.SubscriptionId;
        createMonitoredItemsRequest.TimestampsToReturn = TimestampsToReturn.Both;
        createMonitoredItemsRequest.ItemsToCreate[0] = new UaMonitoredItemCreateRequest();
        createMonitoredItemsRequest.ItemsToCreate[0].ItemToMonitor.NodeId = scalarItems[0].NodeId;
        createMonitoredItemsRequest.ItemsToCreate[0].ItemToMonitor.IndexRange = "0x2:0xF"; 
        createMonitoredItemsRequest.ItemsToCreate[0].ItemToMonitor.AttributeId = Attribute.Value;
        createMonitoredItemsRequest.ItemsToCreate[0].MonitoringMode = MonitoringMode.Reporting;
        createMonitoredItemsRequest.ItemsToCreate[0].RequestedParameters.ClientHandle = 0x1234;
        createMonitoredItemsRequest.ItemsToCreate[0].RequestedParameters.SamplingInterval = -1;
        createMonitoredItemsRequest.ItemsToCreate[0].RequestedParameters.QueueSize = 1;
        createMonitoredItemsRequest.ItemsToCreate[0].RequestedParameters.DiscardOldest = true;

        addLog ( "Creating one monitored item with invalid index range of '0x2:0xF'" );
        var uaStatus = Test.Session.Session.createMonitoredItems( createMonitoredItemsRequest, createMonitoredItemsResponse );
        if( uaStatus.isGood() ) {
            var ExpectedServiceResultArray = [ new ExpectedAndAcceptedResults( StatusCode.BadIndexRangeInvalid ) ];
            checkCreateMonitoredItemsError( createMonitoredItemsRequest, createMonitoredItemsResponse, ExpectedServiceResultArray );
        }
        else addError( "CreateMonitoredItems() status " + uaStatus, uaStatus );
    }
    return( true );
}//function createMonitoredItems591Err011()

Test.Execute( { Procedure: createMonitoredItems591Err011 } );