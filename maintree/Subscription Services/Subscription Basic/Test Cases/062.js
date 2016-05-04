/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create a subscription and call Publish(). Republish and request a sequence number that is greater than what is current. */

function republish5105008() {
    var subscription = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) return( false );

    // define an item to subscribe to (monitor).
    var result = CreateMonitoredItemsHelper.Execute( { ItemsToCreate: defaultStaticItem, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } );
    if( !result ) {
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
        return( false );
    }

    PublishHelper.Execute( { FirstPublish: true } );
    Assert.True( PublishHelper.CurrentlyContainsData(), "Publish().Response.NotificationData expected a data-change; received nothing." );

    RepublishHelper.Execute( { SubscriptionId: subscription, RetransmitSequenceNumber: PublishHelper.ReceivedSequenceNumbers[0] + 10, ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadMessageNotAvailable ) } );

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: defaultStaticItem, SubscriptionId: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    PublishHelper.UnregisterSubscription( subscription );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: republish5105008 } );