/*  Test 5.10.5 Error Test 7 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Republish on a subscription that was previously deleted. Expected result: Bad_SubscriptionIdInvalid */

function republish5105Err007() {
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
        addError( "Deleting monitoredItems and subscription..." );
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItems, SubscriptionId: subscription } );
        DeleteSubscriptionsHelper.Execute ( { SubscriptionIds: subscription } );
        return( false );
    }
    else {
        // now delete the subscription now that we know that it WAS a living/breathing subscription
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItems, SubscriptionId: subscription } );
        DeleteSubscriptionsHelper.Execute ( { SubscriptionIds: subscription } );
    }

    // call republish with the sequence number received above
    RepublishHelper.Execute( { RetransmitSequenceNumber: PublishHelper.ReceivedSequenceNumbers.pop(), SubscriptionId: subscription, ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.BadSubscriptionIdInvalid, StatusCode.BadMessageNotAvailable ] ) } );

    // clean-up
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription, ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNothingToDo ] ) } );
    return( true );
}

Test.Execute( { Procedure: republish5105Err007 } );