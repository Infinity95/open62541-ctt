/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script specifies an invalid IndexRange outside the bounds of the array item. for an array item. */

function createMonitoredItems591Err012() {
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( item == null ) { addError( "Test aborted. No item available for testing." ); return( false ); }
    if( !MonitorBasicSubscription.SubscriptionCreated ) addError( "Subscription for Monitor Basic was not created." );
    else {
        // Create a single monitored item using an invalid subscriptionID
        var createMonitoredItemsRequest = new UaCreateMonitoredItemsRequest();
        var createMonitoredItemsResponse = new UaCreateMonitoredItemsResponse();
        Test.Session.Session.buildRequestHeader( createMonitoredItemsRequest.RequestHeader );

        createMonitoredItemsRequest.SubscriptionId = MonitorBasicSubscription.SubscriptionId;
        createMonitoredItemsRequest.TimestampsToReturn = TimestampsToReturn.Both;
        createMonitoredItemsRequest.ItemsToCreate[0] = new UaMonitoredItemCreateRequest();
        createMonitoredItemsRequest.ItemsToCreate[0].ItemToMonitor.NodeId = item.NodeId;
        createMonitoredItemsRequest.ItemsToCreate[0].ItemToMonitor.IndexRange = "2147483646:2147483647";
        createMonitoredItemsRequest.ItemsToCreate[0].ItemToMonitor.AttributeId = Attribute.Value;
        createMonitoredItemsRequest.ItemsToCreate[0].MonitoringMode = MonitoringMode.Reporting;
        createMonitoredItemsRequest.ItemsToCreate[0].RequestedParameters.ClientHandle = item.ClientHandle;
        createMonitoredItemsRequest.ItemsToCreate[0].RequestedParameters.SamplingInterval = -1;
        createMonitoredItemsRequest.ItemsToCreate[0].RequestedParameters.QueueSize = 1;
        createMonitoredItemsRequest.ItemsToCreate[0].RequestedParameters.DiscardOldest = true;

        addLog ( "Creating one monitored item with invalid index range of '2147483646:2147483647'" );
        var uaStatus = Test.Session.Session.createMonitoredItems( createMonitoredItemsRequest, createMonitoredItemsResponse );
        if( uaStatus.isGood() ) {
            var ExpectedServiceResultArray = [ new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadIndexRangeNoData ] ) ];
            checkCreateMonitoredItemsError( createMonitoredItemsRequest, createMonitoredItemsResponse, ExpectedServiceResultArray );

            // update our item
            if( createMonitoredItemsResponse.Results[0].StatusCode.isGood() ) {
                // update the item
                item.MonitoredItemId = createMonitoredItemsResponse.Results[0].MonitoredItemId;
                // delete
                var expectedResults = [ new ExpectedAndAcceptedResults( [ StatusCode.BadNothingToDo, StatusCode.Good ] ) ];
                DeleteMonitoredItemsHelper.Execute( {
                        ItemsToDelete: item, 
                        SubscriptionId: MonitorBasicSubscription, 
                        OperationResults: expectedResults
                        } );
            }
        }
        else {
            addError( "CreateMonitoredItems() status " + uaStatus, uaStatus );
        }
    }
    return( true );
}//function createMonitoredItems591Err012()

Test.Execute( { Procedure: createMonitoredItems591Err012 } );