/*  Test 5.10.2 Test case 1 prepared by Development, compliance@opcfoundation.org
    Description: Modifies a subsription using the default parameter values. */

function modifySubscription5102001() {
    const NUMWRITES = 3;
    var subscription = new Subscription();
    var i;
    
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        // register the subscription with Publish.
        PublishHelper.RegisterSubscription( subscription );

        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: defaultStaticItem, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) {
            // call Publish(), as we want to consume the initial data values 
            PublishHelper.ClearServerNotifications();
            PublishHelper.Clear();

            // modify subscription
            subscription.SetParameters( 2000, true, 30, 10, 0, 0 );
            ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );

            // now to use the Publishing() service to check that the
            // publishing interval has changed            
            var startTime = UaDateTime.utcNow();
            for( i=0; i<NUMWRITES; i++ ) {
                GenerateScalarValue( defaultStaticItem.Value.Value, UaNodeId.GuessType( defaultStaticItem.NodeSetting ), i );
                WriteHelper.Execute( { NodesToWrite: defaultStaticItem } );
                PublishHelper.WaitInterval( { Items: defaultStaticItem, Subscription: subscription } );
                PublishHelper.Execute( { NoAcks: true } );
            }// while
            var stopTime = UaDateTime.utcNow();
            var mdifference = startTime.msecsTo( stopTime );
            addLog( "start: " + startTime + "; stop: " + stopTime + "; difference: " + mdifference + " milliseconds." );
            Assert.InRange( 5700, 7300, mdifference, "Expected a PublishingInterval of 2000 but actual interval was " + ( mdifference / NUMWRITES ) );
            Assert.Equal( NUMWRITES, PublishHelper.ReceivedDataChanges.length, "Expected " + ( 1 + NUMWRITES ) + " callbacks." );
        }
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: defaultStaticItem, SubscriptionId: subscription } );
    }
    // unregister the subscription with Publish 
    PublishHelper.UnregisterSubscription( subscription );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    PublishHelper.Clear();
    return( true );
}// function modifySubscription5102001() 

Test.Execute( { Debug: true, Procedure: modifySubscription5102001 } );