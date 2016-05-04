/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script creates multiple monitored items, with both valid and invalid nodeIds
        Expect "Good" for valid nodes, but "Bad_NodeIdUnknown" or "Bad_NodeIdInvalid" for the rest. */

function createMonitoredItems591Err044() {
    // Our array of valid nodes
    var validNodeNamesArray = Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings;
    // Our array of invalid nodes
    var invalidNodeNamesArray = Settings.Advanced.NodeIds.Invalid.Invalids;
    if( !MonitorBasicSubscription.SubscriptionCreated ) {
        addError( "Subscription for MonitoredItemsServiceSet was not created." );
    }
    else {
        print( "Attempting to create " + (validNodeNamesArray.length + invalidNodeNamesArray.length) + " monitored items." );
        // Create monitored items
        var createMonitoredItemsRequest = new UaCreateMonitoredItemsRequest();
        var createMonitoredItemsResponse = new UaCreateMonitoredItemsResponse();
        Test.Session.Session.buildRequestHeader( createMonitoredItemsRequest.RequestHeader );

        // Dynamically construct the IDs of the nodes
        var itemValue;
        var nCreatedMonitoredItemsCounter = 0;
        var nValidNodesCounter = 0;
        var nInvalidNodesCounter = 0;        
        var validNodesIndexArray = [];
        var invalidNodesIndexArray = [];
        for( var i=0; i<(validNodeNamesArray.length + invalidNodeNamesArray.length); i++ ) {
            // We will make alternate item valid/invalid
            if ( (i%2) === 0 ) {   
                // Sanity check
                if ( nValidNodesCounter >= validNodeNamesArray.length ) {
                    continue;
                }

                // Get the value of the setting, and make sure it contains a value
                itemValue = readSetting( validNodeNamesArray[nValidNodesCounter] );
                if( itemValue.toString() === "undefined" || itemValue.toString().length === 0) {
                    addLog( "Skipping valid item " + validNodeNamesArray[nValidNodesCounter] + " as it is invalid." );
                    nValidNodesCounter++;
                    continue;
                }

                print ( "Adding valid item " + itemValue + " to index " + nCreatedMonitoredItemsCounter);
                // Save our valid item index (index in the createMonitoredItemsRequest)
                validNodesIndexArray [nValidNodesCounter++] = nCreatedMonitoredItemsCounter;
            }
            else
            {    
                // Sanity check
                if ( nInvalidNodesCounter >= invalidNodeNamesArray.length)
                {
                    continue;
                }

                // Get the value of the setting, and make sure it contains a value
                itemValue = readSetting( invalidNodeNamesArray[nInvalidNodesCounter] );
                if( itemValue.toString() === "undefined" || itemValue.toString().length === 0)
                {
                    addLog ( "Skipping invalid item " + invalidNodeNamesArray[nInvalidNodesCounter] + " as it is invalid." );
                    nInvalidNodesCounter++;
                    continue;
                }

                addLog ( "Adding invalid item " + itemValue + " to index " + nCreatedMonitoredItemsCounter);
                // Save our invalid item index (index in the createMonitoredItemsRequest)
                invalidNodesIndexArray [nInvalidNodesCounter++] = nCreatedMonitoredItemsCounter;
            }

            createMonitoredItemsRequest.ItemsToCreate[nCreatedMonitoredItemsCounter] = new UaMonitoredItemCreateRequest();
            createMonitoredItemsRequest.ItemsToCreate[nCreatedMonitoredItemsCounter].ItemToMonitor.NodeId = UaNodeId.fromString( itemValue.toString() );
            createMonitoredItemsRequest.ItemsToCreate[nCreatedMonitoredItemsCounter].ItemToMonitor.AttributeId = Attribute.Value;
            createMonitoredItemsRequest.ItemsToCreate[nCreatedMonitoredItemsCounter].MonitoringMode = MonitoringMode.Reporting;
            createMonitoredItemsRequest.ItemsToCreate[nCreatedMonitoredItemsCounter].RequestedParameters.ClientHandle = i;
            createMonitoredItemsRequest.ItemsToCreate[nCreatedMonitoredItemsCounter].RequestedParameters.SamplingInterval = -1;
            createMonitoredItemsRequest.ItemsToCreate[nCreatedMonitoredItemsCounter].RequestedParameters.QueueSize = 1;
            createMonitoredItemsRequest.ItemsToCreate[nCreatedMonitoredItemsCounter].RequestedParameters.DiscardOldest = true;

            // Next item
            nCreatedMonitoredItemsCounter++;
        }

        createMonitoredItemsRequest.SubscriptionId = MonitorBasicSubscription.SubscriptionId;
        createMonitoredItemsRequest.TimestampsToReturn = TimestampsToReturn.Both;

        addLog( "Calling CreateMonitoredItems with '" + createMonitoredItemsRequest.ItemsToCreate.length + "' items being requested." );

        var uaStatus = Test.Session.Session.createMonitoredItems( createMonitoredItemsRequest, createMonitoredItemsResponse );
        if( uaStatus.isGood() )
        {
            addLog ( "The results are:" );
            var expectedServiceResult = [];
            // Expected results for valid items we added
            for ( var x=0; x<validNodesIndexArray.length; x++)
            {
                expectedServiceResult[validNodesIndexArray[x]] = new ExpectedAndAcceptedResults( StatusCode.Good); 
            }

            // Expected results for invalid items we added
            for ( x=0; x<invalidNodesIndexArray.length; x++)
            {
                expectedServiceResult[invalidNodesIndexArray[x]] = new ExpectedAndAcceptedResults();
                expectedServiceResult[invalidNodesIndexArray[x]].addExpectedResult( StatusCode.BadNodeIdUnknown );
                expectedServiceResult[invalidNodesIndexArray[x]].addExpectedResult( StatusCode.BadNodeIdInvalid );
            }

            // check the results and look for the above errors.
            checkCreateMonitoredItemsError( createMonitoredItemsRequest, createMonitoredItemsResponse, expectedServiceResult );

            // Cleanup
            // Delete the valid items we added in this test
            var monitoredItemsIdsToDelete = new UaUInt32s();
            var n = 0;
            for ( x=0; x<validNodesIndexArray.length; x++)
            {
                if( validNodesIndexArray[x] !== undefined )
                {
                    monitoredItemsIdsToDelete[n] = createMonitoredItemsResponse.Results[validNodesIndexArray[x]].MonitoredItemId;
                    n++;
                }
            }
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItemsIdsToDelete, SubscriptionId: MonitorBasicSubscription } );
        }
        else
        {
            addError( "CreateMonitoredItems() status " + uaStatus, uaStatus );
        }
    }
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591Err044 } );