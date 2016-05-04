/*  Test prepared by compliance@opcfoundation.org; original work by: Anand Taparia; ataparia@kepware.com
      Description: Script does multiple LinksToRemove where each link was previously added in linksToAdd. */

function setTriggering594004() {
    var items = MonitoredItem.GetRequiredNodes( { Settings: Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, Number: 5 } );
    if( !MonitorTriggeringSubscription.SubscriptionCreated ) addError( "Subscription for conformance unit Monitor Triggering was not created." );
    else {
        // configure our items such that the first is reporting, the rest are sampling
        items[0].MonitoringMode = MonitoringMode.Reporting;
        for( var i=1; i<items.length; i++ ) items[i].MonitoringMode = MonitoringMode.Sampling;
        if( CreateMonitoredItemsHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, ItemsToCreate: items } ) ) {
            var triggeringItem = items.pop();
            if( SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: triggeringItem, LinksToAdd: items } ) ) {
                SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: triggeringItem, LinksToRemove: items } );
            }
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items.concat( triggeringItem ), SubscriptionId: MonitorTriggeringSubscription } );
        }
    }
    return( true );
}

Test.Execute( { Procedure: setTriggering594004 } );