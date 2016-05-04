/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: CreateMonitoredItems: QueueSize=MaxUInt32 */
        
function CreateMonitoredItems001() { 
const MIN_QUEUE_SIZE = 5;

    // define the item with the required parameters
    var item = MonitoredItem.Clone( staticItems[0] );
    item.MonitoringMode = MonitoringMode.Sampling;
    item.QueueSize = Constants.UInt32_Max;

    // create a sinscription
    var subscription = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) return( false );

    // add to a subscription
    CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, SubscriptionId: subscription } );

    // check the revised queuesize is different
    Assert.NotEqual( item.RevisedQueueSize, item.QueueSize, "CreateMonitoredItems().Response.Results[0].RevisedQueueSize was not modified as expected." );
    if( item.RevisedQueueSize < MIN_QUEUE_SIZE ) addError( "Revised QueueSize is LESS than the required minimum of " + MIN_QUEUE_SIZE + ". QueueSize revised to: " + item.RevisedQueueSize );

    // call Publish and check that we DO NOT receive an initial data-change 
    PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
    PublishHelper.Execute();
    Assert.False( PublishHelper.CurrentlyContainsData(), "Publish().Response did not return the initial data-change, as expected", "Publish().Response returned the initial data-change notification, for an item  whose mode is set to SAMPLING." );

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}// func

Test.Execute( { Procedure: CreateMonitoredItems001 } );