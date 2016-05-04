/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script specifies a valid subscriptionId, and multiple monitoredItemIds of which some are valid and some are invalid. */

function deleteMonitoredItems595Err004() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.HAProfile.Scalar.Settings, 0 );
    if( items == null || items.length < 5 ) {
        addSkipped( SETTING_UNDEFINED_SCALARSTATIC );
        return( false );
    }
    while( items.length > 5 ) items.pop();
    if( !MonitorBasicSubscription.SubscriptionCreated ) addError( "Subscription for MonitoredItemsServiceSet was not created." );
    else {    
        if( CreateMonitoredItemsHelper.Execute( { SubscriptionId: MonitorBasicSubscription, ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both } ) ) {
            items[0].MonitoredItemId += 0x1234;
            items[1].MonitoredItemId += 0x1234;
            items[4].MonitoredItemId += 0x1234;
            var expectedOperationResultsArray = [
                new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid ),
                new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid ),
                new ExpectedAndAcceptedResults( StatusCode.Good ),
                new ExpectedAndAcceptedResults( StatusCode.Good ),
                new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid ) ];
            DeleteMonitoredItemsHelper.Execute( { SubscriptionId: MonitorBasicSubscription, ItemsToDelete: items, OperationResults: expectedOperationResultsArray } );
            // delete the items we added in this test (ones that have not been deleted yet)
            items[0].MonitoredItemId -= 0x1234;
            items[1].MonitoredItemId -= 0x1234;
            items[4].MonitoredItemId -= 0x1234;
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: [ items[0], items[1], items[4] ], SubscriptionId: MonitorBasicSubscription } );
        }
    }
    return( true );
}

Test.Execute( { Procedure: deleteMonitoredItems595Err004 } );