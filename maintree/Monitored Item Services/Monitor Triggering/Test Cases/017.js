/*    Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
      Description: Specify a valid SubscriptionId (subscription created with default parameters), TriggeringItemId
            (MonitoringMode is disabled) and multiple valid LinksToAdd (2 items are sampling and 2 are disabled).
            call Publish(). Write a value to the triggeringItem only and call Publish().
            Write a value to 1xsampling and 1xdisabled linked nodes and then call Publish().
      Expected Results: All service and operation level results are Good. ALL Publish calls yield a Keep alive. */

function setTriggering594017() {
    const TRIGGERINGITEM_SETTING = "/Server Test/NodeIds/Static/All Profiles/Scalar/Int32";
    const TRIGGEREDITEM_SETTINGS = [
        "/Server Test/NodeIds/Static/All Profiles/Scalar/Int16",
        "/Server Test/NodeIds/Static/All Profiles/Scalar/UInt16",
        "/Server Test/NodeIds/Static/All Profiles/Scalar/Float",
        "/Server Test/NodeIds/Static/All Profiles/Scalar/UInt32"
        ];
    // create the monitoredItems
    var triggeringItem = MonitoredItem.fromSetting ( TRIGGERINGITEM_SETTING, 0, Attribute.Value, "", MonitoringMode.Disabled,  true, undefined, undefined, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both );
    var addLinkedItems = MonitoredItem.fromSettings( TRIGGEREDITEM_SETTINGS, 1, Attribute.Value, "", MonitoringMode.Sampling, true, undefined, undefined, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both );
    if( triggeringItem == null || addLinkedItems == null || addLinkedItems.length < 4 ) {
        addSkipped( "Static Scalar (Int16, UInt16, Int32, UInt32, Float)" );
        return( false );
    }
    if( !MonitorTriggeringSubscription.SubscriptionCreated ) {
        addError( "Subscription for conformance unit Monitor Value Change was not created." );
        return( false );
    }
    addLinkedItems[0].MonitoringMode = MonitoringMode.Disabled;
    addLinkedItems[1].MonitoringMode = MonitoringMode.Disabled;
    // consolidate ALL of the monitoredItems into 1 collection to pass to Create/DeleteMonitoredItems
    var monitoredItems = [ triggeringItem ];
    monitoredItems = monitoredItems.concat( addLinkedItems );
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: monitoredItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorTriggeringSubscription } ) ) {
        // call Publish() to get any data changes out of the way
        addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + " msecs' before calling Publish to get the initial data-changes out of the way (we haven't setup Triggering yet)." );
        PublishHelper.WaitInterval( { Items: monitoredItems, Subscription: MonitorTriggeringSubscription } );
        PublishHelper.Execute();
        // set-up the triggering service call
        if( SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: triggeringItem, LinksToAdd: addLinkedItems } ) ) {
            // read the triggeringItem value, and then we'll increment it.
            if( ReadHelper.Execute( { NodesToRead: monitoredItems } ) ) {
                // call Publish() first, we expect a keep alive
                PublishHelper.Execute();
                Assert.False( PublishHelper.CurrentlyContainsData(), "Expected to receive no data changes since the triggering item is disabled (therefore should not ever trigger!)." );

                // write to the triggeringItem
                triggeringItem.SafelySetValueTypeKnown( parseInt( triggeringItem.Value.Value ) + 1, triggeringItem.DataType );
                if( WriteHelper.Execute( { NodesToWrite: triggeringItem } ) ) {
                    // wait one publishing cycle before calling publish
                    addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + " msecs' before calling Publish (2nd time)." );
                    PublishHelper.WaitInterval( { Items: monitoredItems, Subscription: MonitorTriggeringSubscription } );
                    if( PublishHelper.Execute() ) {
                        Assert.False( PublishHelper.CurrentlyContainsData(), "Expected to receive no data changes since the triggering item is disabled (therefore should not ever trigger!)." );
                    }// PublishHelper.Execute()

                    // write to the linked items, 1xsampling and 1xdisabled...
                    addLinkedItems[0].SafelySetValueTypeKnown( parseInt( addLinkedItems[0].Value.Value ) + 1, addLinkedItems[0].DataType );                    
                    addLinkedItems[3].SafelySetValueTypeKnown( parseInt( addLinkedItems[3].Value.Value ) + 1, addLinkedItems[3].DataType );                    
                    if( WriteHelper.Execute( { NodesToWrite: triggeringItem } ) ) {
                        addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + " msecs' before calling Publish (3rd time)." );
                        PublishHelper.WaitInterval( { Items: monitoredItems, Subscription: MonitorTriggeringSubscription } );
                        if( PublishHelper.Execute() ) {
                            Assert.False( PublishHelper.CurrentlyContainsData(), "Expected to receive no data changes since the triggering item is disabled (therefore should not ever trigger!)." );
                        }// PublishHelper.Execute()
                    }
                }// write.Execute()
            }//ReadHelper.Execute();
        }// setTriggering.Execute()
    }
    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItems, SubscriptionId: MonitorTriggeringSubscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: setTriggering594017 } );