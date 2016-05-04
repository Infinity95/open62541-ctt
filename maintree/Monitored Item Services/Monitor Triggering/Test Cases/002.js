/*  Test prepared by compliance@opcfoundation.org; original work by: Anand Taparia; ataparia@kepware.com
      Description: Script adds multiple items as LinksToAdd. We expect all calls to succeed. */

function setTriggering594002() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    while( items.length > 5 ) items.pop();
    if( !MonitorTriggeringSubscription.SubscriptionCreated ) addError( "Subscription for conformance unit Monitor Triggering was not created." );
    else {
        // configure our items such that the first is reporting, the rest are sampling
        items[0].MonitoringMode = MonitoringMode.Reporting;
        for( var i=1; i<items.length; i++ ) items[i].MonitoringMode = MonitoringMode.Sampling;
        if( CreateMonitoredItemsHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, ItemsToCreate: items } ) ) {
            var triggeringItem = items.pop();
            SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: triggeringItem, LinksToAdd: items } );
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items.concat( triggeringItem ), SubscriptionId: MonitorTriggeringSubscription } );
        }
    }
    return( true );
}

Test.Execute( { Procedure: setTriggering594002 } );