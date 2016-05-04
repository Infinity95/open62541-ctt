/*  Test prepared by compliance@opcfoundation.org; original work by: Anand Taparia; ataparia@kepware.com
    Description: Specify valid subscriptionId and triggeringItemId , and one valid linksToAdd. We expect all calls to succeed. */

function setTriggering594001() {
    var items = MonitoredItem.GetRequiredNodes( { Settings: Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, Number: 2 } );
    if( !MonitorTriggeringSubscription.SubscriptionCreated ) addError( "Subscription for conformance unit Monitor Triggering was not created." );
    else {
        items[0].MonitoringMode = MonitoringMode.Reporting;
        items[1].MonitoringMode = MonitoringMode.Sampling;

        if( CreateMonitoredItemsHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, ItemsToCreate: [ items[0], items[1] ] } ) ) {
            SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: items[0], LinksToAdd: [ items[1] ] } );
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: [ items[0], items[1] ], SubscriptionId: MonitorTriggeringSubscription } );
        }
    }
    return( true );
}

Test.Execute( { Procedure: setTriggering594001 } );