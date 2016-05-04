/*    Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
      Description: Specify a valid SubscriptionId (subscription created with default parameters),
        TriggeringItemId (MonitoringMode is disabled). Specify an item (monitoring the same NodeId
        as the triggering item) in the linksToAdd, and it is Reporting and call Publish(); Write a
        value to the triggeringItem and call Publish(). Write a value to the linked item and call Publish().
      Expected Results: All service and operation level results are Good. ALL Publish calls yield a value of the linked item. */

function setTriggering594018() {
    var triggeringItem = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings, 0, Attribute.Value, "", MonitoringMode.Disabled,  true, undefined, undefined, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both )[0];
    var addLinkedItem  = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings, 1, Attribute.Value, "", MonitoringMode.Reporting, true, undefined, undefined, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both )[0];
    if( triggeringItem == null || addLinkedItem == null ) { addSkipped( SETTING_UNDEFINED_SCALARSTATIC ); return( false ); }
    if( !MonitorTriggeringSubscription.SubscriptionCreated ) { addError( "Subscription for conformance unit Monitor Value Change was not created." ); return( false ); }

    // the triggering item is Disabled
    triggeringItem.MonitoringMode = MonitoringMode.Disabled;
    // add the monitored items to the subscription
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: [ triggeringItem, addLinkedItem ], TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorTriggeringSubscription } ) ) {
        // set-up the triggering service call
        if( SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: triggeringItem, LinksToAdd: addLinkedItem } ) ) {
            // read the triggeringItem value, and then we'll increment it.
            if( ReadHelper.Execute( { NodesToRead: triggeringItem } ) ) {
                // call Publish(), we expect one datachange for the linked item wait one publishing cycle before calling publish
                addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + " msecs' before calling Publish (1st time - expecting data change for the linked item!" );
                PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
                if( PublishHelper.Execute( { FirstPublish: true } ) ) {
                    Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a data change for the linked item." );
                    Assert.True( PublishHelper.HandleIsInCurrentDataChanges( addLinkedItem.ClientHandle ), "Expected 1st Publish call to yield data change for the linked item." );
                }// PublishHelper.Execute()
                // write to the triggeringItem
                UaVariant.Increment( { Value: triggeringItem.Value } );
                if( WriteHelper.Execute( { NodesToWrite: triggeringItem, ReadVerification: false } ) ) {
                    // wait one publishing cycle before calling publish
                    addLog( "Waiting '" + MonitorTriggeringSubscription.RevisedPublishingInterval + " msecs' before calling Publish (3rd time) - expecting no data even though we previously wrote to the Triggering item!" );
                    PublishHelper.WaitInterval( { Items: triggeringItem, Subscription: MonitorTriggeringSubscription } );
                    // call Publish()() and see what we receive....
                    if( PublishHelper.Execute() ) {
                        Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a data change for the linked item." );
                        Assert.True( PublishHelper.HandleIsInCurrentDataChanges( addLinkedItem.ClientHandle ), "Expected 2nd Publish call to yield data change for the linked item." );
                    }// PublishHelper.Execute()
                }// write.Execute()
            }// read
        }// setTriggering.Execute()
    }
    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: [triggeringItem, addLinkedItem], SubscriptionId: MonitorTriggeringSubscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: setTriggering594018 } );