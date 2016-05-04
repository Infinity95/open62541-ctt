/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Create a MonitoredItem of type String. The value of the string is a number, e.g. �100�. Modify the monitoredItem and set a DeadbandAbsolute of 10.
    Expected result: ServiceResult = Good. Operation level results are Bad_FilterNotAllowed */

function modifyMonitoredItems592Err012() {
    if( !MonitorBasicSubscription.SubscriptionCreated ) { addError( "Subscription for Monitor Basic was not created" ); return( false ); }
    var item = MonitoredItem.fromSetting( "/Server Test/NodeIds/Static/All Profiles/Scalar/String", 0, Attribute.Value );
    if( item == null ) { _dataTypeUnavailable.store( "String" ); return( false ); }
    // create the monitoredItem
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
        const NUMBER_AS_STRING = "100";
        // write a value to the item, the string will receive a number.
        item.Value.Value.setString( NUMBER_AS_STRING );
        if( WriteHelper.Execute( { NodesToWrite: item } ) ) {
            // call Publish() to make sure the write got through
            print( "Waiting: " + MonitorBasicSubscription.RevisedPublishingInterval + " msecs, before calling Publish()" );
            PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
            Assert.True( PublishHelper.Execute() && PublishHelper.CurrentlyContainsData(), "Expected to receive a DataChange to occur because of the previous write." );
            // update the monitoredItem object with the value in the publishResponse
            PublishHelper.SetItemValuesFromDataChange( [ item ] );
            Assert.CoercedEqual( NUMBER_AS_STRING, item.Value.Value, "Expected to receive the same value as previously written." );

            // Now to MODIFY and specify a deadband, we're expecting error Bad_FilterNotAllowed
            var expectedResult = [ new ExpectedAndAcceptedResults( [ StatusCode.BadFilterNotAllowed, StatusCode.BadMonitoredItemFilterUnsupported ] ) ];
            item.Filter = Event.GetDataChangeFilter( DeadbandType.Absolute, 10, DataChangeTrigger.StatusValue );
            ModifyMonitoredItemsHelper.Execute( { ItemsToModify: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription, OperationResults: expectedResult } );
        }// write
    }// createMonitoredITems
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: modifyMonitoredItems592Err012 } );