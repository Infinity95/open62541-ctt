/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description:
        Script specifies samplingInterval of -1 ms.
        Expected result: ServiceResult/OperationResult: Good
        The UA server should revise the SamplingInterval to the PublishingInterval of the subscription. */

function createMonitoredItems591037() {
    const INVALID_SAMPLING_INTERVAL = -1;
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, 0, Attribute.Value, "", MonitoringMode.Reporting, true, null, 1, INVALID_SAMPLING_INTERVAL, TimestampsToReturn.Both, true );
    if( items == null || items.length == 1 ) { addSkipped( SETTING_UNDEFINED_SCALARSTATIC ); return( false ); }

    if( !MonitorBasicSubscription.SubscriptionCreated ) addError( "Subscription for Monitor Basic was not created." );
    else {
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
            Assert.NotEqual( INVALID_SAMPLING_INTERVAL, items[0].RevisedSamplingInterval, "Invalid Sampling period was not revised!" );
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorBasicSubscription } );
        }
    }
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591037 } );