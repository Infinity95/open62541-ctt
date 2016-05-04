/*  Test 5.10.5 Error Test 4 prepared by Anand Taparia; ataparia@kepwaare.com
    Description: Script calls republish retransmitSequenceNumber equal to 0. Expect BadMessageNotAvailable */

function republish5105Err004() {
    var subscription = new Subscription();
    CreateSubscriptionHelper.Execute( {  Subscription: subscription } );

    // create monitored items
    var monitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings );
    if( monitoredItems.length < 2 ) {
        addSkipped( "Static Scalar - 2 Nodes needed" );
        return( false );
    }

    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: monitoredItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) {
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
        return( false );
    }

    // call Publish() to get the first sequence number
    if( !PublishHelper.Execute() ) {
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
        return( false );
    }

    // call republish with the sequence number received above
    RepublishHelper.Execute( { RetransmitSequenceNumber: 0, SubscriptionId: subscription, ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.BadMessageNotAvailable, StatusCode.BadMessageNotAvailable ] ) } );

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItems, SubscriptionId: subscription } );
    DeleteSubscriptionsHelper.Execute ( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: republish5105Err004 } );