/*  Test prepared by compliance@opcfoundation.org; original work by: Anand Taparia; ataparia@kepware.com
      Description: Script specifies invalid linksToRemove. */

function setTriggering594Err005() {
    if( !MonitorTriggeringSubscription.SubscriptionCreated ) {
        addError( "Subscription for conformance unit Monitor Triggering was not created." );
        return( false );
    }
    var items = [ scalarItems[0].clone(), scalarItems[1].clone() ];
    for( var i=0; i<items.length; i++ ) { 
        items[i].QueueSize = 1;
        items[i].DiscardOldest = true;
        items[i].SamplingInterval = -1;
    }
    items[0].MonitoringMode = MonitoringMode.Reporting;
    items[1].MonitoringMode = MonitoringMode.Sampling;
    // add 2 monitored items using default parameters
    if( CreateMonitoredItemsHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, ItemsToCreate: items } ) ) {
        // set triggering with valid info
        if( SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: items[0], LinksToAdd: items[1] } ) ) {
            // now invoke again, but with invalid links-to-delete
            items[1].MonitoredItemId += 0x1234;
            SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: items[0], LinksToRemove: items[1], DeleteResults: new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid ) } );
            items[1].MonitoredItemId -= 0x1234;
        }
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorTriggeringSubscription } );
    }
    return( true );
}

Test.Execute( { Procedure: setTriggering594Err005 } );