/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Create a subscription using default parameters. 
        Create a monitored item of AnalogItemType type, using default parameters except requesting a Deadband Absolute of 10. 
        call Publish()() #1. Write to the EURange property and change the range by +/- 1 for the high and low range. 
        call Publish()() #2. */

function write613008() {
    // Create the subscription
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) == false ) {
        print( "Test aborted: Unable to create subscription." );
        return( false );
    }
    // the item to be used in testing
    var item1 = AnalogItems[0];
    item1.Filter =  Event.GetDataChangeFilter( DeadbandType.Absolute, 10, DataChangeTrigger.StatusValue );
    // get the EURange property of the item
    if( !TranslateBrowsePathsToNodeIdsHelper.Execute( { Node: item1, BrowsePaths: [ "EURange" ] } ) ) return( false );
    if( !Assert.True( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].StatusCode.isGood(), "TranslateBrowsePathToNodeIds().Response.Results[0].StatusCode is Bad, but expected Good because EURange is a mandatory property and therefor must exist." ) ) return( false );
    // memorize the EURange nodeId
    var euRange = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets[0].TargetId.NodeId )[0];
    ReadHelper.Execute( { NodesToRead: euRange } );
    var euRangeValue = euRange.Value.Value.toExtensionObject().toRange();
    euRange.OriginalValue = { Low: euRangeValue.Low, High: euRangeValue.High };
    euRangeValue.Low = ( 1 - euRangeValue.Low );
    euRangeValue.High = ( 1 + euRangeValue.High );
    // add a monitored item to the subscription
    if ( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item1, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) == false ) {
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
        return( false );
    }
    // call Publish(), expect the initial data
    PublishHelper.WaitInterval( { Items: item1, Subscription: subscription } );
    PublishHelper.Execute( { FirstPublish: true } );
    Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() received a keep-alive, except the initial data change was expected.", "Publish() returned the initial data-change as expected." );
    // write to the EURange property and change the high/low values by +1 and -1 respectively
    // we'll accept Good, BadUserAccessDenied, or Bad_NotSupported 
    var extObject = new UaExtensionObject();
    extObject.setRange( euRangeValue );
    euRange.Value.Value.setExtensionObject( extObject );
    var expectedResults = [ new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotSupported, StatusCode.BadUserAccessDenied, StatusCode.BadNotWritable ] ) ];
    WriteHelper.Execute( { NodesToWrite: euRange, OperationResults: expectedResults, ReadVerification: false } );
    // we can exit gracefully if the write failed 
    if( WriteHelper.Response.Results[0].isGood() ) {
        // call Publish(), we expect the SemanticsBit to be TRUE 
        PublishHelper.Execute();
        if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() returned a keep-alive, but a data-change with the semanticChanged bit = TRUE was expected!", "Publish() received a data-change as expected." ) ) {
            Assert.Equal( StatusCode.Good | SEMANTICCHANGE_BIT, PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.StatusCode.StatusCode, "Expected the SemanticChanged bit = TRUE because the semantic (EngineeringUnits) has changed.", "SemanticChange bit changed as expected."  );
        }
    }
    else addSkipped( "Skipping test, can't write to EURange. Write().Response.Results[0] returned " + WriteHelper.Response.Results[0] );
    // Clean up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item1, SubscriptionId: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    PublishHelper.Clear();
    // revert the EURange back to the original value 
    print( "***OriginalValue: Low: " + euRange.OriginalValue.Low + "; High: " + euRange.OriginalValue.High );
    euRangeValue.Low = euRange.OriginalValue.Low;
    euRangeValue.High = euRange.OriginalValue.High;
    extObject.setRange( euRangeValue );
    euRange.Value.Value.setExtensionObject( extObject );
    WriteHelper.Execute( { NodesToWrite: euRange, OperationResults: expectedResults, ReadVerification: false } );
    return( true );
}//function write613008() 

Test.Execute( { Procedure: write613008 } );