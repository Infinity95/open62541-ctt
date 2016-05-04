/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:  SetTriggering: Remove a link specifying a NodeId that was previously deleted from the subscription. */

function SetTriggering024() { 
    var triggeringItem = MonitoredItem.Clone( scalarItems[0] );
    var linkedItem = MonitoredItem.Clone( scalarItems[1] );
    linkedItem.MonitoringMode = MonitoringMode.Disabled;
    // Read both items, to get their current values 
    ReadHelper.Execute( { NodesToRead: [ triggeringItem, linkedItem ] } );
    // add both items to a subscription and setup the triggering
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: [ triggeringItem, linkedItem ], SubscriptionId: MonitorTriggeringSubscription } ) ) return( false );
    if( SetTriggeringHelper.Execute( { TriggeringItemId: triggeringItem, LinksToAdd: linkedItem, SubscriptionId: MonitorTriggeringSubscription } ) ) { 
        // Delete the triggering item from the subscriptiion
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: linkedItem, SubscriptionId: MonitorTriggeringSubscription } );
        SetTriggeringHelper.Execute( { TriggeringItemId: triggeringItem, LinksToRemove: linkedItem, SubscriptionId: MonitorTriggeringSubscription, DeleteResults: new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid ) } );
    }//if SetTriggering
    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: triggeringItem, SubscriptionId: MonitorTriggeringSubscription } );
    return( true );
}//func

Test.Execute( { Procedure: SetTriggering024 } );