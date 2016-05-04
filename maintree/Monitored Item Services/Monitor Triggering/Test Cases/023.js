/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:  Setup a trigger. Delete the triggering item. Write to triggering item. Verify no linked items (disabled) are received. */

function SetTriggering023() { 
    var triggeringItem = MonitoredItem.Clone( scalarItems[0] );
    var linkedItem = MonitoredItem.Clone( scalarItems[1] );
    linkedItem.MonitoringMode = MonitoringMode.Disabled;
    // Read both items, to get their current values 
    ReadHelper.Execute( { NodesToRead: [ triggeringItem, linkedItem ] } );
    // add both items to a subscription and setup the triggering
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: [ triggeringItem, linkedItem ], SubscriptionId: MonitorTriggeringSubscription } ) ) return( false );
    if( SetTriggeringHelper.Execute( { TriggeringItemId: triggeringItem, LinksToAdd: linkedItem, SubscriptionId: MonitorTriggeringSubscription } ) ) { 
        // Delete the triggering item from the subscriptiion
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: triggeringItem, SubscriptionId: MonitorTriggeringSubscription } );
        // Now write to the triggering item (just deleted, but the node still exists in the address-space
        // and then call Publish() and make sure that no data-changes are received.
        UaVariant.Increment( { Value: triggeringItem.Value } );
        WriteHelper.Execute( { NodesToWrite: triggeringItem } );
        PublishHelper.Execute();
        Assert.False( PublishHelper.CurrentlyContainsData(), "Publish().Response.NotificationMessage contains a data-change notification; not expected!", "Publish().Response.NotificationMessages is empty, as expected." );
    }//if SetTriggering
    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: linkedItem, SubscriptionId: MonitorTriggeringSubscription } );
    return( true );
}

Test.Execute( { Procedure: SetTriggering023 } );