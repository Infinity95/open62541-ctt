/*  Test prepared by compliance@opcfoundation.org; original work by: Anand Taparia; ataparia@kepware.com
      Description: Script adds single item as LinksToRemove, where the item was previously added in linksToAdd. */

function setTriggering594003() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    if( !MonitorTriggeringSubscription.SubscriptionCreated ) addError( "Subscription for conformance unit Monitor Triggering was not created." );
    else {
        items[0].MonitoringMode = MonitoringMode.Reporting;
        items[1].MonitoringMode = MonitoringMode.Sampling;
        if( CreateMonitoredItemsHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, ItemsToCreate: [ items[0], items[1] ] } ) ) {
            if( SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: items[0], LinksToAdd: items[1] } ) ) {
                SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: items[0], LinksToRemove: items[1] } );
            }
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: [ items[0], items[1] ], SubscriptionId: MonitorTriggeringSubscription } );
        }
    }
    return( true );
}

Test.Execute( { Procedure: setTriggering594003 } );