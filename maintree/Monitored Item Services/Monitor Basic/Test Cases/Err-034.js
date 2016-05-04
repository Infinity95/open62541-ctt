/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script specifies a valid subscriptionId and multiple invalid monitoredItemIds. */

function deleteMonitoredItems595Err003() {
    if( !MonitorBasicSubscription.SubscriptionCreated ) {
        addError( "Subscription for MonitoredItemsServiceSet was not created." );
    }
    addLog ( "Ready to create 6 monitored items." );
    var items = MonitoredItem.GetRequiredNodes( { Settings: Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, Number: 6 } );
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
        // break some of the monitoredItems Ids
        items[0].MonitoredItemId += 0x123;
        items[2].MonitoredItemId += 0x123;
        var expectedErrors = [
            new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid ),
            new ExpectedAndAcceptedResults( StatusCode.Good ),
            new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid ),
            new ExpectedAndAcceptedResults( StatusCode.Good ),
            new ExpectedAndAcceptedResults( StatusCode.Good ),
            new ExpectedAndAcceptedResults( StatusCode.Good ) ];

        // delete the item, some results SHOULD FAIL!
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorBasicSubscription, OperationResults: expectedErrors } );

        // correct the itemIds we broke earlier, and then delete them
        items[0].MonitoredItemId -= 0x123;
        items[2].MonitoredItemId -= 0x123;
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: [ items[0], items[2] ], SubscriptionId: MonitorBasicSubscription } );
    }
    return( true );
}

Test.Execute( { Procedure: deleteMonitoredItems595Err003 } );