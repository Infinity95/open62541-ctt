/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script creates a monitored item with index range where the specified attribute 
        is not an array or structure for the following data types: Bool, Byte, SByte, DateTime, Double, Float, Guid
            Int16, UInt16, Int32, UInt32, Int64, UInt64, XmlElement */

function createMonitoredItems591Err013()
{
    // Nodes for all of the data types for this test
    var nodeNames = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );

    // examing the ValueRank for all items to make sure that -1 is received for each; omit any non -1 items.
    for( var i=0; i<nodeNames.length; i++ )nodeNames[i].AttributeId = Attribute.ValueRank;
    ReadHelper.Execute( { NodesToRead: nodeNames } );

    // check each items' result 
    var items = [];
    for( var i=0; i<nodeNames.length; i++ )
    {
        if( nodeNames[i].Value.Value.toInt32() === -1 )
        {
            items.push( nodeNames[i] );
        }
    }

    if( items.length === 0 )
    {
        addSkipped( "Not enough items to test. All configured nodes have a ValueRank that indicates that each node could become, or is, an Array." );
        return( false );
    }

    // revert the attributes back to Value 
    for( var i=0; i<items.length; i++ )items[i].AttributeId = Attribute.Value;

    if( !MonitorBasicSubscription.SubscriptionCreated )
    {
        addError( "Subscription for MonitoredItemsServiceSet was not created." );
    }
    else
    {
        var createMonitoredItemsRequest = new UaCreateMonitoredItemsRequest();
        var createMonitoredItemsResponse = new UaCreateMonitoredItemsResponse();
        Test.Session.Session.buildRequestHeader( createMonitoredItemsRequest.RequestHeader );
        
        var nCounter = 0;
        // Create our items one by one here
        for( var i=0; i<items.length; i++ )
        {
            createMonitoredItemsRequest.ItemsToCreate[nCounter] = new UaMonitoredItemCreateRequest();
            createMonitoredItemsRequest.ItemsToCreate[nCounter].ItemToMonitor.NodeId = items[i].NodeId;
            // Our non-array attribute for this test
            createMonitoredItemsRequest.ItemsToCreate[nCounter].ItemToMonitor.AttributeId = Attribute.DisplayName;
            createMonitoredItemsRequest.ItemsToCreate[nCounter].MonitoringMode = MonitoringMode.Reporting;
            createMonitoredItemsRequest.ItemsToCreate[nCounter].ItemToMonitor.IndexRange = "0:1";
            createMonitoredItemsRequest.ItemsToCreate[nCounter].RequestedParameters.ClientHandle = i;
            createMonitoredItemsRequest.ItemsToCreate[nCounter].RequestedParameters.SamplingInterval = 1000;
            createMonitoredItemsRequest.ItemsToCreate[nCounter].RequestedParameters.QueueSize = 1;
            createMonitoredItemsRequest.ItemsToCreate[nCounter].RequestedParameters.DiscardOldest = true;
            
            // Next index
            nCounter++;
        }
        
        // This better be equal
        Assert.Equal( nCounter, createMonitoredItemsRequest.ItemsToCreate.length, "No. of items to create:" );
        
        createMonitoredItemsRequest.SubscriptionId = MonitorBasicSubscription.SubscriptionId;
        createMonitoredItemsRequest.TimestampsToReturn = TimestampsToReturn.Both;
        
        addLog( "Calling CreateMonitoredItems with '" + createMonitoredItemsRequest.ItemsToCreate.length + "' items being requested. Specifying index range for the non-array attribute 'DisplayName'." );
        
        var uaStatus = Test.Session.Session.createMonitoredItems( createMonitoredItemsRequest, createMonitoredItemsResponse );
        addLog ( "The results are:" );
        if( uaStatus.isGood() )
        {
            var expectedServiceResult = [];
            for( var i=0; i<createMonitoredItemsRequest.ItemsToCreate.length; i++ )
            {
                expectedServiceResult[i] = new ExpectedAndAcceptedResults( StatusCode.BadIndexRangeNoData);
                expectedServiceResult[i].addExpectedResult(StatusCode.Good);
            }
            
            // check the results and look for the above errors.
            checkCreateMonitoredItemsError( createMonitoredItemsRequest, createMonitoredItemsResponse, expectedServiceResult );
            
            // if the server failed and did in fact the create the monitored items, clean them up
            for( i = 0; i < createMonitoredItemsResponse.Results.length; i++ )
            {
                if( createMonitoredItemsResponse.Results[i].StatusCode.isGood() )
                {
                    DeleteMonitoredItemsHelper.Execute( {
						ItemsToDelete: [ createMonitoredItemsResponse.Results[i].MonitoredItemId ], 
						SubscriptionId: MonitorBasicSubscription } );
                }
            }
        }
        else
        {
            addError( "CreateMonitoredItems() returned bad status: " + uaStatus, uaStatus );
        }
    }
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591Err013 } );