/*  Test 5.10.5 Error Test 2 prepared by compliance@opcfoundation.org
    Description: Script calls republish with subscriptionId equal to 0. */

function republish5105Err002() {
    var subscription = new Subscription();
    CreateSubscriptionHelper.Execute( { Subscription: subscription } );
    // create monitored items
    var MonitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings );
    if( MonitoredItems.length === 0 ) {
        addSkipped( "Static Scalar - 2 Nodes needed" );
        return( false );
    }
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: MonitoredItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) return( false );

    // call Publish() to get the first sequence number
    PublishHelper.WaitInterval( { Items: MonitoredItems, Subscription: subscription, SuppressMessaging: true } );
    if( !PublishHelper.Execute() ) {
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
        return( false );
    }

    // call republish with the sequence number received above
    RepublishHelper.Execute( { RetransmitSequenceNumber: PublishHelper.ReceivedSequenceNumbers.pop(), SubscriptionId: { SubscriptionId: 0 }, ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.BadMessageNotAvailable, StatusCode.BadSubscriptionIdInvalid ] ) } );

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: MonitoredItems, SubscriptionId: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );

    return( true );
}

Test.Execute( { Debug: true, Procedure: republish5105Err002 } );