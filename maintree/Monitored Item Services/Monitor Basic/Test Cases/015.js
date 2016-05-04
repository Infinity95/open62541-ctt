/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script deletes all monitored items from a subscription. */

function setTriggering595004() {
    if( !MonitorBasicSubscription.SubscriptionCreated ) {
        addError( "Subscription for MonitoredItemsServiceSet was not created." );
        return( false );
    }

    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, 0, Attribute.Value, "", MonitoringMode.Reporting, true, null, 1, -1, TimestampsToReturn.Both );
    if( items == null || items.length < 3 ) {
        addSkipped( SETTING_UNDEFINED_SCALARSTATIC );
        return( false );
    }

    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
        if( DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorBasicSubscription } ) ) {
            // verify the object is deleted by trying to change the monitoringMode.
            var expectedErrors = []
            for( var m=0; m<items.length; m++ ) {
                expectedErrors[m] = new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid );
            }
            Assert.Equal( true, SetMonitoringModeHelper.Execute( { MonitoringMode: MonitoringMode.Disabled, MonitoredItemIds: items, SubscriptionId: MonitorBasicSubscription, OperationResults: expectedErrors } ), "Expected SetPublishingMode() call to fail because the specified monitoredItem was previously deleted." );
        }
    }
    return( true );
}

Test.Execute( { Procedure: setTriggering595004 } );