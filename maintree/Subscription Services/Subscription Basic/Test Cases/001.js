/*  Test 5.10.1 test 1 prepared by Development; compliance@opcfoundation.org
    Description:
        Creates a subscription using the default parameters.
*/

Test.Execute( { Procedure: function test() {
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: defaultStaticItem, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) {
            PublishHelper.WaitInterval( { Items: defaultStaticItem, Subscription: subscription } );
            Assert.True( PublishHelper.Execute( { FirstPublish: true } ) && PublishHelper.CurrentlyContainsData(), "Expected Publish to yield a DataChange notification (initial value for the monitoredItem." );
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: defaultStaticItem, SubscriptionId: subscription } );
        }
    }
    return( DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } ) );
} } );