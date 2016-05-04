/*  Test prepared by compliance@opcfoundation.org; original work by: Anand Taparia; ataparia@kepware.com
    Description: Script deletes an item that is configured for triggering. */

function setTriggering595003() {
    if( !MonitorTriggeringSubscription.SubscriptionCreated ) addError( "Subscription for MonitoredItemsServiceSet was not created." );
    // create the 2 items where: item #1 is the TRIGGERING item (monitoringMode = reporting); item #2 is the LINKED item (monitoringMode = disabled)
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    if( items == null || items.length < 2 ) {
        addSkipped( SETTING_UNDEFINED_SCALARSTATIC );
        return( false );
    }
    items[1].MonitoringMode = MonitoringMode.Disabled;
    // read the item to get its value and data-type
    ReadHelper.Execute( { NodesToRead: items } );
    // add the items to the subscription
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorTriggeringSubscription } ) ) {
        // add a triggered link
        if( SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: items[0], LinksToAdd: [ items[1] ] } ) ) {
            if( DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorTriggeringSubscription } ) ) {
                // we are now to WRITE a value to the node that was previously used in the
                // monitoredItem that we just deleted
                items[0].SafelySetValueTypeKnown( ( parseInt( items[0].Value ) + 1 ), UaNodeId.GuessType( items[0].NodeSetting ) );
                if( WriteHelper.Execute( { NodesToWrite: items[0] } ) ) {
                    Assert.Equal( true,  PublishHelper.Execute(), "Publish() expected to succeed." );
                    Assert.Equal( false, PublishHelper.CurrentlyContainsData(), "No datachanges expected." );
                }
            }// deleteMonitoredItems
        }// setTriggering
        else DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorTriggeringSubscription } );
    }// createMonitoredItems
    return( true );
}

Test.Execute( { Procedure: setTriggering595003 } );