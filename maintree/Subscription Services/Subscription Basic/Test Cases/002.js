/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Creates a subscription passing the requestedPublishingInterval as 1. */

Test.Execute( { Procedure: function createSubscription5101002() {
    const REQUESTEDPUBLISHINGINTERVAL = 1;
    const PUBLISHINGENABLED = true;
    const REQUESTEDLIFTETIME = 15;
    const REQUESTEDMAXKEEPALIVE = 5;
    const MAXNOTIFICATIONS = 0;
    const PRIORITY = 0;
    //var subscription = new Subscription( REQUESTEDPUBLISHINGINTERVAL, PUBLISHINGENABLED, REQUESTEDLIFTETIME, REQUESTEDMAXKEEPALIVE, MAXNOTIFICATIONS, PRIORITY );
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription, RequestedPublishingInterval: 1, PublishingEnabled: true, RequestedLifetimeCount: 15, RequestedMaxKeepAliveCount: 5, MaxNotificationsPerPublish: 0, Priority: 0 } ) ) {
        /* check the value of the revisedPublishingInterval.... we're looking to see if it is still 1, or if it has been changed. */
        if( subscription.RevisedPublishingInterval == 0 ) addError( "Server revised the publishing interval to 0, which is not allowed." );
        else {
            // check that the subscription works anyway.
            if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: defaultStaticItem, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) {
                PublishHelper.WaitInterval( { Items: defaultStaticItem, Subscription: subscription } );
                PublishHelper.Execute( { FirstPublish: true } );
                Assert.True( PublishHelper.CurrentlyContainsData() );
                DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: defaultStaticItem, SubscriptionId: subscription } );
            }
        }
    }
    return( DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } ) );
} } );