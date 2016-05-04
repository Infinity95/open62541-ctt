/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description:
        Script specifies samplingInterval of max duration (max real value)
        Expected result: ServiceResult/OperationResult: Good
        The UA server should revise the SamplingInterval to the maximum value(slowest) it can support. */

function createMonitoredItems591038() {
    const LARGE_SAMPLING_INTERVAL = Constants.Double_Max;
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, 0, Attribute.Value, "", MonitoringMode.Reporting, true, null, 1, LARGE_SAMPLING_INTERVAL, TimestampsToReturn.Both, true );
    if( items == null || items.length == 1 ) { addSkipped( SETTING_UNDEFINED_SCALARSTATIC ); return( false ); }
    if( !MonitorBasicSubscription.SubscriptionCreated ) addError( "Subscription for Monitor Basic was not created." );
    else {
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
            Assert.NotEqual( LARGE_SAMPLING_INTERVAL, items[0].RevisedSamplingInterval, "Large Sampling period was not revised!" );
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorBasicSubscription } );
        }
    }
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591038 } );