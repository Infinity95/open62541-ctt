/*  Test prepared by compliance@opcfoundation.org; original work by: Anand Taparia; ataparia@kepware.com
      Description:
        Create an infinite loop, i.e. triggeringItem (reporting) �item1� contains a link to (sampling)
        �item2�; then triggering (sampling) �item2� contains a link to (reporting) �item1�.
        Invoke a write to triggering node: �item1� and call Publish().
        Write to both the triggering and linked Items and call Publish().
        call Publish() again.
      Expected Results:
        All service and operation level results are Good.
        The 1st Publish yields data for both items.
        The 2nd Publish yields data for both items.
        The 3rd Publish yields no data changes. */

function setTriggering594007() {
    const PUBLISHCOUNT = 5;
    // create the monitoredItems
    var triggeringItem = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings, 0, Attribute.Value, "", MonitoringMode.Reporting,true, undefined, undefined, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both )[0];
    var addLinkedItem  = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings, 1, Attribute.Value, "", MonitoringMode.Sampling, true, undefined, undefined, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both )[1];
    // read the items first, then we can set new values for them reliably, i.e. value += 1
    addLog( "Reading the triggering and linked items first to obtain their current value." );
    ReadHelper.Execute( { NodesToRead: [triggeringItem, addLinkedItem] } );
    // add the monitored items to the subscription
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: [ triggeringItem, addLinkedItem ], TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorTriggeringSubscription } ) ) {
        if( SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: triggeringItem, LinksToAdd: addLinkedItem } ) ) {
            // set-up the triggering between Item2 -> Item1 (reverse of the previous)
            if( SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: addLinkedItem, LinksToAdd: triggeringItem } ) ) {
                // invoke a write to first triggered item
                triggeringItem.SafelySetValueTypeKnown( parseInt( triggeringItem.Value.Value ) + 1, UaNodeId.GuessType( triggeringItem.NodeSetting ) );
                if( Assert.True, WriteHelper.Execute( { NodesToWrite: triggeringItem } ), "Writes are needed in order to test the trigger." ) {
                    addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + " msecs' before calling 1st Publish..." );
                    PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
                    // first publish, we expect data for both items
                    PublishHelper.Execute( { FirstPublish: true } );
                    if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected 1st Publish to yield data." ) ) {
                        Assert.True( PublishHelper.HandleIsInCurrentDataChanges( triggeringItem.ClientHandle ), "Expected 1st Publish call to yield data changes for all items. TRIGGERING item not found!" );
                        Assert.True( PublishHelper.HandleIsInCurrentDataChanges( addLinkedItem.ClientHandle  ), "Expected 1st Publish call to yield data changes for all items. LINKED item not found!" );
                    }
                    addLog( "Publish 1 called, completed check for Triggering and Linked items." );

                    // write to both triggered and linked items
                    triggeringItem.SafelySetValueTypeKnown( parseInt( triggeringItem.Value.Value ) + 1, UaNodeId.GuessType( triggeringItem.NodeSetting ) );
                    addLinkedItem.SafelySetValueTypeKnown (  parseInt( addLinkedItem.Value.Value ) + 1, UaNodeId.GuessType( addLinkedItem.NodeSetting ) );
                    Assert.True( WriteHelper.Execute( { NodesToWrite: [triggeringItem, addLinkedItem] } ), "Expected write to succeed." );

                    // second Publish, expected data for both items
                    addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + " msecs' before calling 2nd Publish..." );
                    PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
                    PublishHelper.Execute();
                    if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected 2nd Publish to yield data." ) ) {
                        Assert.True( PublishHelper.HandleIsInCurrentDataChanges( triggeringItem.ClientHandle ), "Expected 2nd Publish call to yield data changes for all items. TRIGGERING item not found!" );
                        Assert.True( PublishHelper.HandleIsInCurrentDataChanges( addLinkedItem.ClientHandle  ), "Expected 2nd Publish call to yield data changes for all items. LINKED item not found!" );
                    }
                    addLog( "Publish 2 called, completed check for Triggering and Linked items." );

                    // third publish, keep alive!
                    addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + " msecs' before calling 3rd Publish..." );
                    PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
                    PublishHelper.Execute();
                    Assert.False( PublishHelper.CurrentlyContainsData(), "Expected to receive a keep-alive and NO data since neither the trigger or linked item were updated!" );
                    addLog( "Publish 3 called, completed check for KeepAlive." );
                }//write
            }// setTriggering.Execute() Item2 -> Item1
        }// setTriggering.Execute() Item1 -> Item2
    }
    else addError( "CreateMonitoredItems status " + uaStatus, uaStatus );
    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: [triggeringItem, addLinkedItem], SubscriptionId: MonitorTriggeringSubscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: setTriggering594007 } );