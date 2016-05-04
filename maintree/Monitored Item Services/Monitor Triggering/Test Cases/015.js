/*    Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
      Description:
        Specify a valid SubscriptionId (subscription created with default parameters),
        TriggeringItemId (MonitoringMode is sampling). Specify an item (monitoring the same
        NodeId as the triggering item) in the linksToAdd, and it is reporting.
        call Publish(). Write a value to the triggeringItem and call Publish(). call Publish() again.
        Write a value to the all items and call Publish().
        Note: This is essentially an over-complicated subscription!
      Expected Results:
        All service and operation level results are Good.
        The 1st Publish yields data for all items.
        The 2nd Publish yields a keep-alive.
        The 3rd Publish call yields a keep-alive.
        The 4th Publish call yields data for the linked item. */

function setTriggering594015() {
    const NODE_SETTING = "/Server Test/NodeIds/Static/All Profiles/Scalar/Int32";
    // create the monitoredItems
    var triggeringItem = MonitoredItem.fromSetting( NODE_SETTING, 0, Attribute.Value, "", MonitoringMode.Sampling,  true, undefined, 1, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both );
    var addLinkedItem  = MonitoredItem.fromSetting( NODE_SETTING, 1, Attribute.Value, "", MonitoringMode.Reporting, true, undefined, 1, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both );
    if( triggeringItem == null || addLinkedItem == null ) {
        _dataTypeUnavailable.store( "Int32" );
        addSkipped( SETTING_UNDEFINED_SCALARSTATIC );
        return( false );
    }

    if( !MonitorTriggeringSubscription.SubscriptionCreated ) {
        addError( "Subscription for conformance unit Monitor Value Change was not created." );
        return( false );
    }

    // add the monitored items to the subscription
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: [ triggeringItem, addLinkedItem ], TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorTriggeringSubscription } ) ) {
        // read all items so that we can get their current values
        addLog( "Reading the triggering and linked items first to obtain their current value." );
        ReadHelper.Execute( { NodesToRead: [triggeringItem, addLinkedItem] } );
        // set-up the triggering service call
        if( SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: triggeringItem, LinksToAdd: addLinkedItem } ) ) {
            // Publish #1 - expecting all items returned
            // wait one publishing cycle before calling publish
            addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + " msecs' before calling Publish (first time)." );
            PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
            PublishHelper.Execute( { FirstPublish: true } );
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected First Publish to yield no data-changes for any items." ) ) {
                Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive 1 notifications: 1 x linked." );
                Assert.True( PublishHelper.HandleIsInCurrentDataChanges(  addLinkedItem.ClientHandle ), "Did not find LINKED item '" + addLinkedItem.NodeSetting + "' in Publish response (mode=Reporting)." );
            }

            // Publish #2 - write to trigger first
            addLinkedItem.SafelySetValueTypeKnown( parseInt( addLinkedItem.Value.Value ) + 1, addLinkedItem.DataType );
            if( WriteHelper.Execute( { NodesToWrite: addLinkedItem, ReadVerification: false } ) ) {
                // wait one publishing cycle before calling publish
                addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + "' msecs before calling Publish #2." );
                PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
                // call Publish()() and see what we receive....
                PublishHelper.Execute();
                if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a data change for the linked item (because it is mapped to the same NodeId as the triggering item)." ) ) {
                    Assert.True( PublishHelper.HandleIsInCurrentDataChanges(  addLinkedItem.ClientHandle ), "Did not find LINKED item '" + addLinkedItem.NodeSetting + "' in Publish response (mode=Reporting)." );
                }
            }// write.Execute()
            
            // Publish #3 - no changes
            // wait one publishing cycle before calling publish
            addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + "' msecs before calling Publish #3." );
            PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
            // call Publish()() and see what we receive....
            PublishHelper.Execute();
            Assert.False( PublishHelper.CurrentlyContainsData(), "Did NOT expect to receive a dataChange since no values were modified." );
            
            // Publish #4 - write to all items
            triggeringItem.SafelySetValueTypeKnown( parseInt( triggeringItem.Value.Value ) + 1, triggeringItem.DataType );
            addLinkedItem.SafelySetValueTypeKnown ( parseInt( addLinkedItem.Value.Value ) + 1, addLinkedItem.DataType );
            if( WriteHelper.Execute( { NodesToWrite: [triggeringItem, addLinkedItem], ReadVerification: false } ) ) {
                // wait one publishing cycle before calling publish
                addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + "' msecs before calling Publish #4." );
                PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
                // call Publish()() and see what we receive....
                PublishHelper.Execute();
                Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange for the linked item which is REPORTING (not relying on a Trigger)." );
                Assert.True( PublishHelper.HandleIsInCurrentDataChanges( addLinkedItem.ClientHandle ),  "Did not find LINKED item '" + addLinkedItem.NodeSetting  + "' in Publish response (mode=Reporting)." );
            }// write.Execute()
        }// setTriggering.Execute()
    }
    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: [triggeringItem, addLinkedItem], SubscriptionId: MonitorTriggeringSubscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: setTriggering594015 } );