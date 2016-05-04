/*    Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
      Description:
        Create a triggering item whose MonitoringMode is Reporting. Specify the one item in LinksToAdd (mode=reporting) and LinksToRemove, the item is the SAME item for both parameters.
        call Publish(). Write a value to the triggering item and call Publish().
      Expected Results:
        Service result = �Good�. Operation level result is �Good�.
        The 1st Publish yields a dataChange for both items.
        The 2nd Publish yields a dataChange for the triggering item. */

function setTriggering594012() {
    const TRIGGERINGITEM_SETTING = "/Server Test/NodeIds/Static/All Profiles/Scalar/Int32";
    const TRIGGEREDITEM1_SETTING = "/Server Test/NodeIds/Static/All Profiles/Scalar/UInt32";

    // create the monitoredItems
    var triggeringItem   = MonitoredItem.fromSetting( TRIGGERINGITEM_SETTING, 0, Attribute.Value, "", MonitoringMode.Reporting, true, undefined, 1, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both );
    var addLinkedItem    = MonitoredItem.fromSetting( TRIGGEREDITEM1_SETTING, 1, Attribute.Value, "", MonitoringMode.Reporting, true, undefined, 1, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both );
    var deleteLinkedItem = addLinkedItem;
    if( triggeringItem == null || addLinkedItem == null || deleteLinkedItem == null ) {
        addSkipped( "Static Scalar (UInt32, Float)" );
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
        ReadHelper.Execute( { NodesToRead: [addLinkedItem, triggeringItem ] } );

        // set-up the triggering service call
        var expectedResultsAdd    = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];
        var expectedResultsDelete = [ new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid ) ];
        if( SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: triggeringItem, LinksToAdd: addLinkedItem, LinksToRemove: deleteLinkedItem, AddResults: expectedResultsAdd, DeleteResults: expectedResultsDelete } ) ) {
            // publish #1
            addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + "' msecs before calling Publish #1." );
            PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
            PublishHelper.Execute( { FirstPublish: true } );
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a data-change for both items since the trigger is now invalidated and both itemns should be operating as normal." ) ) {
                Assert.Equal( 2, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive 2 notifications since the trigger should be 'empty'." );
                Assert.True( PublishHelper.HandleIsInCurrentDataChanges( triggeringItem.ClientHandle ), "Did not find TRIGGERING item '" + triggeringItem.NodeSetting + "' in Publish response (mode=Reporting)." );
                Assert.True( PublishHelper.HandleIsInCurrentDataChanges( addLinkedItem.ClientHandle ),  "Did not find LINKED item '" + addLinkedItem.NodeSetting  + "' in Publish response (mode=Sampling)." );
            }
            addLog( "Publish 1 received and checked for both triggering and linked node." );

            // write to the triggeringItem and call Publish(), expect Trigger only
            triggeringItem.SafelySetValueTypeKnown( parseInt( triggeringItem.Value.Value ) + 1, triggeringItem.DataType );
            Assert.True( WriteHelper.Execute( { NodesToWrite: triggeringItem } ), "Expected write to succeed in order to test triggering." );

            // publish #2
            addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + "' msecs before calling Publish #2." );
            PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
            PublishHelper.Execute();
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a data-change for both items since the trigger is now invalidated and both itemns should be operating as normal." ) ) {
                Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive 1 notifications: 1 x triggering item." );
                Assert.True( PublishHelper.HandleIsInCurrentDataChanges( triggeringItem.ClientHandle ), "Did not find TRIGGERING item '" + triggeringItem.NodeSetting + "' in Publish response (mode=Reporting)." );
            }
            addLog( "Publish 2 received and checked for triggering only." );

            // write to all items and call Publish(), expect all items in publish
            triggeringItem.SafelySetValueTypeKnown( parseInt( triggeringItem.Value.Value ) + 1, triggeringItem.DataType );
            addLinkedItem.SafelySetValueTypeKnown (  parseInt( addLinkedItem.Value.Value ) + 1,  addLinkedItem.DataType );
            Assert.True( WriteHelper.Execute( { NodesToWrite: [ triggeringItem, addLinkedItem ] } ), "Expected write to succeed in order to test triggering." );
            // publish #3
            addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + "' msecs before calling Publish #2." );
            PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
            PublishHelper.Execute();
            addLog( "Checking if Publish #3 yielded 2 dataChanges (trigger + linked). Actually received: " + PublishHelper.CurrentDataChanges[0].MonitoredItems.length );
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a data-change for both items." ) ) {
                Assert.Equal( 2, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive 1 notifications: 1 x triggering item." );
                Assert.True( PublishHelper.HandleIsInCurrentDataChanges( triggeringItem.ClientHandle ), "Did not find TRIGGERING item '" + triggeringItem.NodeSetting + "' in Publish response (mode=Reporting)." );
                Assert.True( PublishHelper.HandleIsInCurrentDataChanges(  addLinkedItem.ClientHandle ), "Did not find LINKED item '" + addLinkedItem.NodeSetting + "' in Publish response (mode=Reporting)." );
            }
            addLog( "Publish 3 received and checked for triggering and linked items." );
        }// setTriggering.Execute()
    }
    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: [triggeringItem, addLinkedItem], SubscriptionId: MonitorTriggeringSubscription } );
    return( true );
}

Test.Execute( { Procedure: setTriggering594012 } );