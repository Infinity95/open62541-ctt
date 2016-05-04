/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create a subscription (no monitoredItems) with a RequestedPublishingInterval of 1000, 
    a RequestedMaxKeepAliveCount of 5, and PublishingEnabled = FALSE.
    Revision History
        2012-09-13 NP: Initial version. */

function CreateSubscription020() { 

    // create the subscription
    var subscription = new Subscription2( { 
        PublishingEnabled: false,
        MaxKeepAliveCount: 5,
        RequestedPublishingInterval: 1000 
        } );

    if( !CreateSubscriptionHelper.Execute( { 
            Subscription: subscription 
            } ) ) return( false );

    // call Publish twice, we expect keep alives only and SequenceNumber=1.
    for( var i=0; i<2; i++ ) { 

        PublishHelper.Execute();
        Assert.False( PublishHelper.CurrentlyContainsData(), "Publish().Response conains a data-change notification, even though the subscription is NOT enabled." );
        Assert.Equal( 1, PublishHelper.Response.NotificationMessage.SequenceNumber, "Publish().Response.NotificationMessage.SequenceNumber is not 1." );
        Assert.Equal( subscription.SubscriptionId, PublishHelper.Response.SubscriptionId, "Publish().Response.SubscriptionId does not match the subscription used in this test." );

    }//for i..

    // clean-up
    DeleteSubscriptionsHelper.Execute( { 
            SubscriptionIds: subscription
            } );
    return( true );
}//func

Test.Execute( { Procedure: CreateSubscription020 } );