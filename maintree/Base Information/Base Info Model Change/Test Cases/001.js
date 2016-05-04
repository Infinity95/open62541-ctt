/*  Test 001 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Generate multiple events to cause a queue (size=1) overflow.

    IMPORTANT:
        This script uses a 30-second delay to provide the human 
        with time to trigger any kind of event.
*/

function eventQueueOverflow001() {
    
    const WAITPERIOD = 30000; // 30-seconds

    var serverNode = new MonitoredItem.fromNodeIds( new UaNodeId( Identifier.Server ), 1, Attribute.EventNotifier );
    var subscription = new Subscription2( { 
            MaxNotificationsPerPublish: 1,
            RequestedPublishingInterval: 1000,
            RequestedLifetimeCount: WAITPERIOD / 100
        });
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        if( CreateMonitoredItemsHelper.Execute( { 
                    ItemsToCreate: serverNode, 
                    SubscriptionId: subscription } ) )
        {
            // call Publish() to make sure that we receive nothing
            PublishHelper.Execute();
            if( PublishHelper.CurrentlyContainsEvents() ) {
                addLog( "Publish.Response.NotificationMessage.NotificationData contains information, which was not expected." );
                // call Publish again, hopefully no events this time
                PublishHelper.Execute();
                if( PublishHelper.CurrentlyContainsEvents() ) addWarning( "More events received, which were not expected. Test will continue, but may be unreliable." );
            }

            // TEST ONE: wait 30-secs while HUMAN causes ONE event.
            addLog( "HUMAN: Please trigger ONE event now! you have: " + ( WAITPERIOD / 1000 ) + " seconds to comply" );
            wait( WAITPERIOD );
            PublishHelper.Execute();
            Assert.True( PublishHelper.CurrentlyContainsEvents(), "(Test #1) Publish.Response.NotificationMessage.NotificationData did not contain any Events.\nOne event was expected.\nConsider increasing the delay (" + WAITPERIOD + ") in this script." );

            // TEST TWO: wait 30-secs while HUMAN causes TWO events.
            addLog( "HUMAN: Please trigger TWO events now! you have: " + ( WAITPERIOD / 1000 ) + " seconds to comply" );
            wait( WAITPERIOD );
            PublishHelper.Execute();
            Assert.True( PublishHelper.CurrentlyContainsEvents(), "(Test #2) Publish.Response.NotificationMessage.NotificationData did not contain any Events.\nOne event was expected.\nConsider increasing the delay (" + WAITPERIOD + ") in this script." );
notImplemented( "Check the event received is EventQueueOverflowEventType." );

            DeleteMonitoredItemsHelper.Execute( {
                    ItemsToDelete: serverNode, 
                    SubscriptionId: subscription } );
        }
    }
    DeleteSubscriptionsHelper.Execute( { 
            SubscriptionIds: subscription } );
}// function eventQueueOverflow001

safelyInvoke( eventQueueOverflow001 );