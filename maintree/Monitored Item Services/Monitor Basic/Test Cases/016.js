/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script deletes multiple monitored items from asubscription */

function setTriggering595002() {
    if( !MonitorBasicSubscription.SubscriptionCreated ) {
        addError( "Subscription for MonitoredItemsServiceSet was not created." );
        return( false );
    }

    addLog ( "Ready to create 6 monitored items." );
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    var items = MonitoredItem.GetRequiredNodes( { Settings: Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings, Number: 6 } )
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
        // delete some items, NOT ALL!
        var itemsToDelete = [ items[0], items[2], items[4] ];
        if( DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: itemsToDelete, SubscriptionId: MonitorBasicSubscription } ) ) {
            // verify the object is deleted by trying to change the monitoringMode.
            var expectedErrors = [];
            for( var m=0; m<itemsToDelete.length; m++ ) {
                expectedErrors[m] = new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid );
            }
            SetMonitoringModeHelper.Execute( { MonitoringMode: MonitoringMode.Disabled, MonitoredItemIds: itemsToDelete, SubscriptionId: MonitorBasicSubscription, OperationResults: expectedErrors } );

            // delete the remaining items
            itemsToDelete = [ items[1], items[3], items[5] ];
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: itemsToDelete, SubscriptionId: MonitorBasicSubscription } );
        }
    }
    return( true );
}

Test.Execute( { Procedure: setTriggering595002 } );