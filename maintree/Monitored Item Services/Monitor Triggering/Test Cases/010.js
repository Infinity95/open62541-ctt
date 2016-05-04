/*    Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
      Description:
            Specify a valid SubscriptionId (subscription created with default parameters),
            TriggeringItemId (MonitoringMode is reporting) and one valid LinksToAdd (mode is reporting).
            call Publish(); Write a value to the triggeringItem. call Publish().
            Write another value to the triggering item and then call Publish().
            Write values to the linked (triggered) items only and then call Publish().
            Write to the triggering item and then call Publish().
            Note: the nodes for the linked items should be static and not dynamic.
      Expected Results:
            All service and operation level results are Good.
            The 1st Publish call yields data for all of the items.
            The 2nd Publish call yields data for the triggering Item only.
            The 3rd Publish call yields data for the triggering item only.
            The 4th Publish call yields a dataChange for the linked items only.
            The 5th Publish call yields a dataChange for the triggering item only. */

function setTriggering594010() {
    var triggeringItem = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings, 0, Attribute.Value, "", MonitoringMode.Reporting, true, undefined, undefined, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both )[0];
    var addLinkedItem  = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings, 1, Attribute.Value, "", MonitoringMode.Reporting, true, undefined, undefined, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both )[1];
    if( triggeringItem == null || addLinkedItem == null )    { addWarning( "Test aborted. Settings not correct. Check: '" + TRIGGERINGITEM_SETTING + "' and '" + TRIGGEREDITEM1_SETTING + "'" ); return( false ); }
    if( !MonitorTriggeringSubscription.SubscriptionCreated ) { addError( "Subscription for conformance unit Monitor Value Change was not created." ); return( false ); }

    // read the items first, then we can set new values for them reliably, i.e. value += 1
    addLog( "Reading the triggering and linked items first to obtain their current value." );
    ReadHelper.Execute( { NodesToRead: [triggeringItem, addLinkedItem] } );

    // add the monitored items to the subscription
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: [ triggeringItem, addLinkedItem ], TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorTriggeringSubscription } ) ) {
        if( SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: triggeringItem, LinksToAdd: addLinkedItem } ) ) {
            // First Publish call, expects to receive all items
            addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + " msecs' before calling 1st Publish..." );
            PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
            PublishHelper.Execute( { FirstPublish: true } );
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange for ALL items (triggering and linked)." ) ) {
                Assert.Equal( 2, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive 2 data changes only! 1 x Triggering item and 1 x Linked items." );
                Assert.True ( PublishHelper.HandleIsInCurrentDataChanges( triggeringItem.ClientHandle ), "Expected 1st Publish call to yield data changes for all items. TRIGGERING item not found!" );
                Assert.True ( PublishHelper.HandleIsInCurrentDataChanges(  addLinkedItem.ClientHandle ), "Expected 1st Publish call to yield data changes for all items. LINKED item '" + addLinkedItem.NodeSetting + "' not found!" );
            }

            // write to TRIGGERING item and call 2nd Publish. We do this twice.
            for( var r=0; r<2; r++ ) {
                triggeringItem.SafelySetValueTypeKnown( parseInt( triggeringItem.Value.Value ) + 1, UaNodeId.GuessType( triggeringItem.NodeSetting ) );
                if( Assert.True( WriteHelper.Execute( { NodesToWrite: triggeringItem } ), "Writes are needed in order to test the trigger." ) ) {
                    // 2nd Publish and we expect to receive triggering item ONLY
                    addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + " msecs' before calling 2nd/3rd Publish..." );
                    PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
                    PublishHelper.Execute();
                    if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange for ALL items (triggering and linked)." ) ) {
                        Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive 1 data changes only! 1 x Triggering item." );
                        Assert.True ( PublishHelper.HandleIsInCurrentDataChanges( triggeringItem.ClientHandle ), "TRIGGERING item not found!" );
                    }
                }
            }

            // now change the linked item values only and then call Publish() for 4th time
            addLinkedItem.SafelySetValueTypeKnown( parseInt( addLinkedItem.Value.Value ) + 1, UaNodeId.GuessType( addLinkedItem.NodeSetting ) );
            if( Assert.True( WriteHelper.Execute( { NodesToWrite: addLinkedItem } ), "Writes are needed in order to test the linked item." ) ) {
                // 2nd Publish and we expect to receive triggering item ONLY
                addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + " msecs' before calling 4th Publish..." );
                PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
                PublishHelper.Execute();
                if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange for the linked item only." ) ) {
                    Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive 1 data changes only! 1 x Linked item." );
                    Assert.True ( PublishHelper.HandleIsInCurrentDataChanges( addLinkedItem.ClientHandle ), "Linked item not found!" );
                }
            }

            // now to write to the triggering item and call Publish() for 5th time
            triggeringItem.SafelySetValueTypeKnown( parseInt( triggeringItem.Value.Value ) + 1, UaNodeId.GuessType( triggeringItem.NodeSetting ) );
            if( Assert.True( WriteHelper.Execute( { NodesToWrite: triggeringItem } ), "Writes are needed in order to test the trigger." ) ) {
                // 5th Publish and we expect to receive triggering item ONLY
                addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + " msecs' before calling 2nd/3rd Publish..." );
                PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
                PublishHelper.Execute();
                if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange for the triggering item only." ) ) {
                    Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive 1 data changes only! 1 x Triggering item." );
                    Assert.True ( PublishHelper.HandleIsInCurrentDataChanges( triggeringItem.ClientHandle ), "TRIGGERING item not found!" );
                }
            }
        }// setTriggering.Execute()
    }
    else addError( "CreateMonitoredItems() status " + uaStatus, uaStatus );

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: [triggeringItem, addLinkedItem], SubscriptionId: MonitorTriggeringSubscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: setTriggering594010 } );