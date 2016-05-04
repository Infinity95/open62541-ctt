/*  Test 5.10.5 Error Test 6 prepared by Anand Taparia; ataparia@kepwaare.com
    Description: Script calls republish using a sequenceNumber that had been previously acknowledged in a publish call.
    Expects BadMessageNotAvailable. */

function republish5105Err006() {
    var subscription = new Subscription();
    CreateSubscriptionHelper.Execute( { Subscription: subscription } );

    // create monitored items
    var monitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings );
    if( monitoredItems.length === 0 ) {
        addSkipped( "Static Scalar - 2 Nodes needed" );
        return( false );
    }

    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: monitoredItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) return( false );

    PublishHelper.WaitInterval( { Items: monitoredItems, Subscription: subscription } );

    // call Publish() to get the first sequence number
    if( !PublishHelper.Execute() ) {
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
        return( false );
    }
    
    // call Publish()() to acknowledge the first sequence
    PublishHelper.Execute();

    // call republish with the sequence number received above
    RepublishHelper.Execute( { RetransmitSequenceNumber: PublishHelper.ReceivedSequenceNumbers.pop(), SubscriptionId: subscription, ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.BadMessageNotAvailable, StatusCode.BadMessageNotAvailable ] ) } );

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItems, SubscriptionId: subscription } );
    DeleteSubscriptionsHelper.Execute ( { SubscriptionIds: subscription } );
    return( true );
}

Test.Execute( { Procedure: republish5105Err006 } );