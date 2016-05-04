/*    Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
      Description: Specify a valid SubscriptionId (subscription created with default parameters), 
            TriggeringItemId (MonitoringMode is disabled) and one valid LinksToAdd (items  are disabled).
            Write a value to the triggeringItem. call Publish()(). Note: the nodes for the linked items should be static and not dynamic.
      Expected Results: All service and operation level results are Good. Publish() yields data for triggeringItem only. */

function setTriggering594019() {
    const TRIGGERINGITEM_SETTING = "/Server Test/NodeIds/Static/All Profiles/Scalar/Int32";
    const TRIGGEREDITEM1_SETTING = "/Server Test/NodeIds/Static/All Profiles/Scalar/UInt32";
    // create the monitoredItems
    var triggeringItem = MonitoredItem.fromSetting( TRIGGERINGITEM_SETTING, 0, Attribute.Value, "", MonitoringMode.Disabled, true, undefined, undefined, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both );
    var addLinkedItem  = MonitoredItem.fromSetting( TRIGGEREDITEM1_SETTING, 1, Attribute.Value, "", MonitoringMode.Disabled, true, undefined, undefined, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both );
    if( triggeringItem == null || addLinkedItem == null ) {
        _dataTypeUnavailable.store( [ "Int32", "UInt32" ] );
        addSkipped( SETTING_UNDEFINED_SCALARSTATIC );
        return( false );
    }
    if( !MonitorTriggeringSubscription.SubscriptionCreated ) {
        addError( "Subscription for conformance unit Monitor Value Change was not created." );
        return( false );
    }
    // add the monitored items to the subscription
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: [ triggeringItem, addLinkedItem ], TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorTriggeringSubscription } ) ) {
        // set-up the triggering service call
        if( SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: triggeringItem, LinksToAdd: addLinkedItem } ) ) {
            // read the triggeringItem value, and then we'll increment it.
            if( ReadHelper.Execute( { NodesToRead: [triggeringItem, addLinkedItem] } ) ) {
                // call Publish() first, we expect a keep alive
                PublishHelper.Execute();
                Assert.False( PublishHelper.CurrentlyContainsData(), "Expected to receive no data changes since the triggering item is disabled (therefore should not ever trigger!)." );

                // write to the triggeringItem
                triggeringItem.SafelySetValueTypeKnown( parseInt( triggeringItem.Value.Value ) + 1, triggeringItem.DataType );
                if( WriteHelper.Execute( { NodesToWrite: triggeringItem } ) ) {
                    // wait one publishing cycle before calling publish
                    PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
                    // call Publish() first, we expect a keep alive
                    PublishHelper.Execute();
                    Assert.False( PublishHelper.CurrentlyContainsData(), "Expected to receive no data changes since the triggering item is disabled (therefore should not ever trigger!)." );
                }// write.Execute()
            }
        }// setTriggering.Execute()
    }
    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: [triggeringItem, addLinkedItem], SubscriptionId: MonitorTriggeringSubscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: setTriggering594019 } );