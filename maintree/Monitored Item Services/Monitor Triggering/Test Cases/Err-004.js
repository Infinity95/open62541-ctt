/*  Test prepared by compliance@opcfoundation.org; original work by: Anand Taparia; ataparia@kepware.com
      Description: Script specifies some valid linksToAdd and some invalid linksToAdd. */

function setTriggering594Err004() {
    if( !MonitorTriggeringSubscription.SubscriptionCreated ) {
        addError( "Subscription for conformance unit Monitor Triggering was not created." );
        return( false );
    }
    var items = [ scalarItems[0].clone(), scalarItems[1].clone(), scalarItems[2].clone(), scalarItems[3].clone(), scalarItems[4].clone(), scalarItems[5].clone() ];
    for( var i=0; i<items.length; i++ ) { 
        items[i].QueueSize = 1;
        items[i].DiscardOldest = true;
        items[i].SamplingInterval = -1;
    }
    items[0].MonitoringMode = MonitoringMode.Reporting;
    items[1].MonitoringMode = MonitoringMode.Sampling;
    // add 2 monitored items using default parameters
    if( CreateMonitoredItemsHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, ItemsToCreate: items } ) ) {
        // set triggering with an invalid triggering itemid by temporarily modifying our monitoreditemid
        var addResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ),
                           new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid ), 
                           new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid ), 
                           new ExpectedAndAcceptedResults( StatusCode.Good ) ];
        items[2].MonitoredItemId += 0x1234;
        items[3].MonitoredItemId += 0x1234;
        SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: items[0], LinksToAdd: [ items[1], items[2], items[3], items[4] ], AddResults: addResults } );
        items[2].MonitoredItemId -= 0x1234;
        items[3].MonitoredItemId -= 0x1234;
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorTriggeringSubscription } );
    }
    return( true );
}

Test.Execute( { Procedure: setTriggering594Err004 } );