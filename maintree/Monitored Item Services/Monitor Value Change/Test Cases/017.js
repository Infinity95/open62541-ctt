/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description:
        Script specifies a samplingInterval of 0 ms.
        Expected result: ServiceResult/OperationResult: Good
        The UA server should revise the SamplingInterval to > 0. */

function createMonitoredItems591036() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, 0, Attribute.Value, "", MonitoringMode.Reporting, true, null, 1, SAMPLING_INTERVAL, TimestampsToReturn.Both, true );
    if( items == null || items.length == 1 ) { addSkipped( SETTING_UNDEFINED_SCALARSTATIC ); return( false ); }
    if( !MonitorBasicSubscription.SubscriptionCreated ) addError( "Subscription for Monitor Basic was not created." );
    else {
        const SAMPLING_INTERVAL = 0;

        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
            if( SAMPLING_INTERVAL === items[0].SamplingInterval ) addLog( "Server supports a samplingInterval of zero." );
            else addLog( "Server DOES NOT support a samplingInterval of zero." );
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorBasicSubscription } );
        }
    }
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591036 } );