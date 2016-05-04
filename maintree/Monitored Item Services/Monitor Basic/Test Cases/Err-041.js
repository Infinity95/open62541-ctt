/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Script specifies an invalid IndexRange of �2:3,1:2� which is specified for a 2-dimensional array, but the node being tested is a single dimension array.
        The ValueRank and ArrayDimensions attributes are checked beforehand. IF THE SERVER RETURNS GOOD, then a Publish must be called and the initial status code must be Bad_IndexRangeNoData.
        Otherwise, Server can reject the CreateMonitoredItems with BadIndexRangeNoData. */

function createMonitoredItems591Err019() {
    if( !MonitorBasicSubscription.SubscriptionCreated ) {
        addError( "Test aborted. Subscription for 'Monitor Value Change' was not created." );
        return( false );
    }
    var nodeId = UaNodeId.FromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings )[0];
    if( nodeId === null || nodeId === undefined ) {
        addSkipped( SETTING_UNDEFINED_SCALARARRAYS );
        return( false );
    }

    const ISARRAY = 1;
    const INVALIDINDEXRANGE = "2:3,1:2";

    // create 2 nodes, one to read each attribute of interest
    var valueRankNode = MonitoredItem.fromNodeIds( [nodeId], Attribute.ValueRank )[0];
    if( ReadHelper.Execute( { NodesToRead: valueRankNode } ) ) {
        // we desire "1" (meaning the dimensions are 1 dimensional) but we will accept
        // "0" because that means the server doesn't know itself and therefore may be a valid node to test with.
        if( !( 0 == valueRankNode.Value.Value || 1 == valueRankNode.Value.Value ) ) {
            addSkipped( "valueRank doesn't match the single-dimension array criteria. This test requires a valueRank of " + ISARRAY + ", but received " + valueRankNode.Value.Value.toString() );
            return( false );
        }
    }// readSetting

    // now to specify the indexRange and to call createMonitoredItems
    valueRankNode.AttributeId = Attribute.Value;
    valueRankNode.IndexRange  = INVALIDINDEXRANGE;
    
    var expectedError = [ new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadIndexRangeNoData ] ) ];
    CreateMonitoredItemsHelper.Execute( { ItemsToCreate: valueRankNode, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription, OperationResults: expectedError } );
    if( createMonItemsResp.Results[0].StatusCode.isGood() ) {
        // it was good, so lets wait and call Publish() and then check the status in the response 
        PublishHelper.WaitInterval( { Items: valueRankNode, Subscription: MonitorBasicSubscription } );
        PublishHelper.Execute( { FirstPublish: true } );
        if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive an initial dataChange notification, even though we do not expect to receive any valid data." ) ) {
            if( Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected 1 monitored Item in the Publish response." ) ) {
                Assert.StatusCodeIs( StatusCode.BadIndexRangeNoData, PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.StatusCode, "Initial status code is different.", "Publish received StatusCode of '" + PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.StatusCode + "' which matches Bad_IndexRangeNoData" );
            }
            else addError( "Subscription callback received: " + PublishHelper.PrintDataChanges() );
        }
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: valueRankNode, SubscriptionId: MonitorBasicSubscription } );
    }
    else if( createMonItemsResp.Results[0].StatusCode.StatusCode !== StatusCode.BadIndexRangeNoData ) addError( "CreateMonitoredItems().Response.Results[0] received: '" + createMonItemsResp.Results[0].StatusCode + "'; but was expected to succeed, even though an invalid IndexRange was specified. The server should accept the request, but return Bad_IndexRangeNoData in the initial dataChange of a Publish() response." );
    return( true );
}// function createMonitoredItems591Err019() 

Test.Execute( { Procedure: createMonitoredItems591Err019 } );