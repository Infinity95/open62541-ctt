/*  Test 5.10.1 Test 17, prepared by Development; compliance@opcfoundation.org
    Description:
          Create two subscriptions with their priorities being equal.
          The test will be performed 3 times to vary the priority as:
              100, 200, 0
*/

function createSubscription5101017() {
    const SUBSCRIPTION_WAIT_DELTA = 50;
    var summaryInformation = []; // will store text to say "priority x subscription callback count received X, expected to be in range of Y and Z." etc.
    var priorities = [ 100, 200, 0 ];
    var subscriptions = [ new Subscription(), new Subscription() ];
    var subscriptionItems  = [];
    var publishCallCount = ( subscriptions.length * 5 );
    var i;
    for( i=0; i<subscriptions.length; i++ ) subscriptionItems[i] = MonitoredItem.Clone( defaultStaticItem );

    // get the initial values for all items
    ReadHelper.Execute( { NodesToRead:subscriptionItems } );

    for( var p=0; p<priorities.length; p++ ) {
        var s;
        //create the subscription object and set the priority
        for( s=0; s<subscriptions.length; s++ ) {
            subscriptions[s].MaxKeepAliveCount = publishCallCount;
            subscriptions[s].Priority = priorities[p];
            if( !CreateSubscriptionHelper.Execute( { Subscription: subscriptions[s] } ) ) return( false );

            if( !CreateMonitoredItemsHelper.Execute( {
                        ItemsToCreate: subscriptionItems[s], 
                        TimestampsToReturn: TimestampsToReturn.Both, 
                        SubscriptionId: subscriptions[s] } ) ) {
                DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions[s] } );
                return( false );
            }
        }

        PublishHelper.WaitInterval( { Items: subscriptionItems[s], Subscription: subscriptions[0] } );

        // register subscriptions with Publish 
        PublishHelper.RegisterSubscription( subscriptions );

        // Publish a number of times, to build a list of callbacks
        for( s=0; s<publishCallCount; s++ ) {
            // write a value to ALL items
            for( i=0; i<subscriptions.length; i++ ) subscriptionItems[i].SafelySetValueTypeKnown( 1 + UaVariantToSimpleType(subscriptionItems[i].Value.Value), subscriptionItems[i].Value.Value.DataType ); 
            WriteHelper.Execute( {
                        NodesToWrite: subscriptionItems, 
                        ReadVerification: false } );

            // wait the applicable time before issuing publish call(s)
            wait( subscriptions[0].RevisedPublishingInterval + SUBSCRIPTION_WAIT_DELTA );
            // call Publish() twice, once per subscription!
            PublishHelper.Execute( { NoAcks: true } ); //do not acknowledge anything! this is being called for subscription 1 of 2
            PublishHelper.Execute( { NoAcks: true } ); //do not acknowledge anything! this is being called for subscription 2 of 2
        }// for s...
        // now cycle through the received subscriptionIds to compare the counts
        for( var r=0; r<PublishHelper.SubscriptionIds.length; r++ ) {
            for( var s=0; s<subscriptions.length; s++ ) {
                if( subscriptions[s].SubscriptionId == PublishHelper.SubscriptionIds[r] ) {
                    subscriptions[s].DataChangeNotificationCount++;
                    break;
                }
            }// for s...
        }// for r...
        summaryInformation.push( "Priority " + priorities[p] + ":\n\tSubscription 1 callback count: " + subscriptions[0].DataChangeNotificationCount + "\n\tSubscription 2 callback count: " + subscriptions[1].DataChangeNotificationCount + "\n" );
        addLog( "Callback counts: Subscription1=" + subscriptions[0].DataChangeNotificationCount + "; Subscription2=" + subscriptions[1].DataChangeNotificationCount );
        Assert.Equal( subscriptions[0].DataChangeNotificationCount, subscriptions[1].DataChangeNotificationCount, "Expected the same number of dataChanges for both subscriptions. Priority tested: " + priorities[p] );

        //clean-up
        for( var i=0; i<subscriptions.length; i++ )
        {
            DeleteMonitoredItemsHelper.Execute( {
                        ItemsToDelete: subscriptionItems[i], 
                        SubscriptionId: subscriptions[i] } );
            DeleteSubscriptionsHelper.Execute( {
                        SubscriptionIds: subscriptions[i] } );
        }

        // unregister subscriptions with Publish 
        PublishHelper.UnregisterSubscription( subscriptions );

    }//for p...

    PublishHelper.Clear();
    addLog( summaryInformation.toString() );
    return( true );
}

Test.Execute( { Procedure: createSubscription5101017 } );