/*    Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
      Description:
            Specify a valid SubscriptionId (subscription created with default parameters),
            TriggeringItemId (MonitoringMode is sampling). Specify 2 or more items in linksToAdd which are reporting.
            call Publish(). Write to the triggering node and call Publish().
            Write to 1 linked item and call Publish(). Write to the triggering node and call Publish().
            Write to all items and call Publish().
      Expected Results:
            All service and operation level results are Good.
            The 1st Publish yields data for all linked items.
            The 2nd publish yields a keep-alive.
            The 3rd Publish call yields a data change for the linked item previously written to.
            The 4th Publish call yields a keep-alive.
            The 5th Publish call yields data for all linked items.
*/

function setTriggering594014() {
    const TRIGGERINGITEM_SETTING = "/Server Test/NodeIds/Static/All Profiles/Scalar/Int32";
    const TRIGGEREDITEM1_SETTING = ["/Server Test/NodeIds/Static/All Profiles/Scalar/UInt32",
                                    "/Server Test/NodeIds/Static/All Profiles/Scalar/Int16"];

    // create the monitoredItems
    var triggeringItem = MonitoredItem.fromSetting ( TRIGGERINGITEM_SETTING, 0, Attribute.Value, "", MonitoringMode.Sampling,  true, undefined, 1, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both );
    var addLinkedItems = MonitoredItem.fromSettings( TRIGGEREDITEM1_SETTING, 1, Attribute.Value, "", MonitoringMode.Reporting, true, undefined, 1, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both );
    if( triggeringItem == null || addLinkedItems == null || addLinkedItems.length < 2 ) {
        addSkipped( "Static Scalar (Int16, Int32, UInt32)" );
        return( false );
    }

    if( !MonitorTriggeringSubscription.SubscriptionCreated ) {
        addError( "Subscription for conformance unit Monitor Value Change was not created." );
        return( false );
    }

    // consolidate ALL of the monitoredItems into 1 collection to pass to Create/DeleteMonitoredItems
    var monitoredItems = [ triggeringItem ];
    monitoredItems = monitoredItems.concat( addLinkedItems );

    // read all items so that we can get their current values
    addLog( "Reading the triggering and linked items first to obtain their current value." );
    ReadHelper.Execute( { NodesToRead: monitoredItems } );

    // add the monitored items to the subscription
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: monitoredItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorTriggeringSubscription } ) ) {
        if( SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: triggeringItem, LinksToAdd: addLinkedItems } ) ) {
            // Publish #1 - expecting all items returned
            // wait one publishing cycle before calling publish
            addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + " msecs' before calling Publish." );
            PublishHelper.WaitInterval( { Items: monitoredItems, Subscription: MonitorTriggeringSubscription } );
            PublishHelper.Execute( { FirstPublish: true } );
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected First Publish to yield data-changes for all LINKED items." ) ) {
                Assert.Equal( addLinkedItems.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive " + addLinkedItems.length + " notifications." );
                for( var l=0; l<addLinkedItems.length; l++ ) {
                    Assert.True( PublishHelper.HandleIsInCurrentDataChanges( addLinkedItems[l].ClientHandle ),  "Did not find LINKED item '" + addLinkedItems[l].NodeSetting  + "' (Setting: " + addLinkedItems[l].NodeSetting + ") in Publish response (mode=Sampling)." );
                }
            }

            // Publish #2; write to the triggeringItem
            triggeringItem.SafelySetValueTypeKnown( (parseInt( triggeringItem.Value.Value ) + 1), UaNodeId.GuessType( triggeringItem.NodeSetting ) );
            if( WriteHelper.Execute( { NodesToWrite: triggeringItem } ) ) {
                // wait one publishing cycle before calling publish
                addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + "' msecs before calling Publish #2." );
                PublishHelper.WaitInterval( { Items: monitoredItems, Subscription: MonitorTriggeringSubscription } );
                // call Publish()() and see what we receive....
                PublishHelper.Execute();
                if( !Assert.False( PublishHelper.CurrentlyContainsData(), "Expected to receive a keep alive." ) ) {
                    addError( "Received the following datachanges: " + PublishHelper.PrintDataChanges( true ) );
                }

            }// write.Execute()
            
            // Publish #3; write to a linked item
            for( var l=0; l<addLinkedItems.length; l++ ) addLinkedItems[l].SafelySetValueTypeKnown( (parseInt( addLinkedItems[l].Value.Value ) + 1), UaNodeId.GuessType( addLinkedItems[l].NodeSetting ) );
            if( WriteHelper.Execute( { NodesToWrite: addLinkedItems } ) ) {
                // wait one publishing cycle before calling publish
                addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + "' msecs before calling Publish #3." );
                PublishHelper.WaitInterval( { Items: monitoredItems, Subscription: MonitorTriggeringSubscription } );
                // call Publish()() and see what we receive....
                PublishHelper.Execute();
                if( !Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive the linked item because it is set to REPORTING." ) ) {
                    Assert.Equal( addLinkedItems.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive notifications for all linked items." );
                    for( var l=0; l<addLinkedItems.length; l++ ) {
                        Assert.True( PublishHelper.HandleIsInCurrentDataChanges( addLinkedItems[l].ClientHandle ), "Did not find LINKED item '" + addLinkedItems[l].NodeSetting + "' in Publish response (mode=REPORTING)." );
                    }
                }
            }// write.Execute()
            
            // Publish #4; write to triggering
            triggeringItem.SafelySetValueTypeKnown( (parseInt( triggeringItem.Value.Value ) + 1), triggeringItem.DataType );
            if( WriteHelper.Execute( { NodesToWrite: triggeringItem } ) ) {
                // wait one publishing cycle before calling publish
                addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + "' msecs before calling Publish #4." );
                PublishHelper.WaitInterval( { Items: monitoredItems, Subscription: MonitorTriggeringSubscription } );
                // call Publish()() and see what we receive....
                PublishHelper.Execute();
                Assert.False( PublishHelper.CurrentlyContainsData(), "Did not expect to receive data since linked items have not changed!" );
            }// write.Execute()
            
            // publish #5; write to everything
            triggeringItem.SafelySetValueTypeKnown( (parseInt( triggeringItem.Value.Value ) + 1), UaNodeId.GuessType( triggeringItem.NodeSetting ) );
            for( var l=0; l<addLinkedItems.length; l++ ) {
                addLinkedItems[l].SafelySetValueTypeKnown( (parseInt( addLinkedItems[l].Value.Value ) + 1), UaNodeId.GuessType( addLinkedItems[l].NodeSetting ) );
            }
            if( WriteHelper.Execute( { NodesToWrite: monitoredItems } ) ) {
                // wait one publishing cycle before calling publish
                addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + "' msecs before calling Publish #5." );
                PublishHelper.WaitInterval( { Items: monitoredItems, Subscription: MonitorTriggeringSubscription } );
                // call Publish()() and see what we receive....
                PublishHelper.Execute();
                if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive data since linked item and triggered item both changed!" ) ) {
                    var allFound = true;
                    Assert.Equal( addLinkedItems.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive " + addLinkedItems.length + " notifications containing the linked items only." );
                    for( var l=0; l<addLinkedItems.length; l++ ) {
                        if( !Assert.True( PublishHelper.HandleIsInCurrentDataChanges( addLinkedItems[l].ClientHandle ), "Did not find LINKED item '" + addLinkedItems[l].NodeSetting + "' in Publish response (mode=REPORTING)." ) ) {
                            allFound = false;
                        }
                    }
                    if( !allFound ) {
                        addError( "Received the following datachanges: " + PublishHelper.PrintDataChanges( true ) );
                    }
                }
            }
        }// setTriggering.Execute()
    }

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItems, SubscriptionId: MonitorTriggeringSubscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: setTriggering594014 } );