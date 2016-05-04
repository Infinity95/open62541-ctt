/*  Test 2, prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Create 5 subscriptions, one-per-session.
        This is executed by:
            a) creating 1 subscription per Session, with 5 sessions.
            b) creating 5 subscriptions per Session, with 1 session.
*/

function MultiSessionMultiSubscribeTest( SessionCount, SubscriptionCount, MonitoredItems ) {
        // check the incoming parameters first...
    if( SessionCount === undefined || SessionCount === null || SessionCount < 1 || SessionCount > 99999 ) throw( "MultiSessionMultiSubscribeTest() argument error: SessionCount" );
    if( SubscriptionCount === undefined || SubscriptionCount === null || SubscriptionCount < 1 || SubscriptionCount > 99999 ) throw( "MultiSessionMultiSubscribeTest() argument error: SubscriptionCount" );
    if( MonitoredItems === undefined || MonitoredItems === null ) throw( "MultiSessionMultiSubscribeTest() argument error: MonitoredItems" );
    if( MonitoredItems.MonitoredItemId !== undefined ) MonitoredItems = [MonitoredItems]; // turn the single monitoredItem into an Array
    if( MonitoredItems.length < 1 ) throw( "MultiSessionMultiSubscribeTest() argument error: MonitoredItems length < 1" );

    var items = [];                // stores the monitoredItems for each subscription
    var sessions = [];             // stores the session objects
    var PublishHelper = [];       // stores the publish objects
    var i;

    // STEP ONE - CREATE THE SESSIONS
    addLog( "Creating '" + SessionCount + "' Sessions, each with '" + SubscriptionCount + "' subscriptions." );
    for( var s=0; s<SessionCount; s++ ) {
        // define and instantiate the session/connection
        sessions[s] = new CreateSessionService( { Channel: Test.Channel } );
        if( !sessions[s].Execute() ) {
            addError( "Session #" + s + " Not connected." );
            return( false );
        }

        if( !ActivateSessionHelper.Execute( { Session: sessions[s] } ) ) {
            addError( "Unable to activateSession" );
            return( false );
        }

        // create a publish service object for this session
        PublishHelper[s] = new PublishService( { Session: sessions[s] } );
    }

    // STEP TWO - CREATE THE SUBSCRIPTIONS FOR EACH SESSION
    // STEP THREE ALSO - ADD THE MONITORED ITEM
    var subscriptionObject = [];
    for( s=0; s<SessionCount; s++ ) { // 's' for Session
        //inner loop = Subscriptions for a session
        for( i=0; i<SubscriptionCount; i++ ) {
            subscriptionObject[( s * SessionCount ) + i] = new Subscription(); //create the subscription object and set the priority to 500
            if( createSubscriptionDeprecated( subscriptionObject[( s * SessionCount ) + i], sessions[s] ) ) {
                items[ ( s * SessionCount ) + i ] = MonitoredItem.Clone( MonitoredItems );
                //createMonitoredItems( items[ ( s * SessionCount ) + i ], TimestampsToReturn.Both, subscriptionObject[( s * SessionCount ) + i], sessions[s] );
                var createMonitoredItemsHelper = new CreateMonitoredItemsService( { Session: sessions[s] } );
                createMonitoredItemsHelper.Execute( { 
                    SubscriptionId:     subscriptionObject[ ( s * SessionCount ) + i ],
                    ItemsToCreate:      items[ ( s * SessionCount ) + i ],
                    TimestampsToReturn: TimestampsToReturn.Both } );
            }
        }// for i...
    }// for s...

    // wait for just one publish cycle
    addLog( "Waiting " + subscriptionObject[0].RevisedPublishingInterval + " msec before invoking first Publish call." );
    wait( subscriptionObject[0].RevisedPublishingInterval );

    // STEP FOUR - call Publish()() AND VERIFY ALL SUBSCRIPTIONS CHECK-IN, FOR ALL SESSIONS
    print( "\n\n\t\tSESSION COUNT TO LOOP THROUGH IS: " + SessionCount );
    for( s=0; s<SessionCount; s++ ) {
        print( "\n\n\t\tSUBSCRIPTION COUNT TO LOOP THROUGH IS: " + SubscriptionCount + "; (session # " + (1+s) + " of " + SessionCount + ")" );
        for( i=0; i<SubscriptionCount; i++ ) {
            print( "Waiting the revised sampling interval of '" + items[0].RevisedSamplingInterval + " ms' before calling publish..." );
            wait( items[0].RevisedSamplingInterval );
            if( PublishHelper[s].Execute() ) {
                // find the subscription object that applies to this dataChange and then increment
                // the dataChangeCallbackCount.
                for( var x=0; x<SubscriptionCount; x++ ) {
                    if( subscriptionObject[( s * SessionCount ) + x].SubscriptionId == PublishHelper[s].SubscriptionIds[0] ) {
                        subscriptionObject[( s * SessionCount ) + x].DataChangeNotificationCount++;
                        break;
                    }
                }
            }
        }//for (inner)
    }//for (outer)

    // CLEAN-UP, while generating some stats
    var expectedCallbackCount = SessionCount * SubscriptionCount;
    var totalCallbackCount = 0;
    for( s=0; s<SessionCount; s++ ) { // 's' for Session
        for( var i=0; i<SubscriptionCount; i++ ) {
            var deleteMonitoredItemsHelper = new DeleteMonitoredItemsService( { Session: sessions[s] } );
            deleteMonitoredItemsHelper.Execute( { 
                    ItemsToDelete:  items[ ( s * SessionCount ) + i ], 
                    SubscriptionId: subscriptionObject[( s * SessionCount ) + i] } );
            var deleteSubscriptionsHelper = new DeleteSubscriptionService( sessions[s] );
            deleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptionObject[( s * SessionCount ) + i] } );
            PublishHelper[s].Clear();
            totalCallbackCount += subscriptionObject[( s * SessionCount ) + i].DataChangeNotificationCount;
        }
        CloseSessionHelper.Execute( { Session: sessions[s] } );
    }//for (inner)

    // Verdict? did all subscriptions yield a callback? the same # of callbacks for each subscription?
    Assert.GreaterThan( expectedCallbackCount - 1, totalCallbackCount, "Expected each subscription to make a callback." );
    for( s=0; s<SessionCount; s++ ) { // 's' for Session
        for( var i=0; i<SubscriptionCount; i++ ) {
            Assert.NotEqual( 0, subscriptionObject[( s * SessionCount ) + i].DataChangeNotificationCount, "Expected a callback from Subscription Id: " + subscriptionObject[( s * SessionCount ) + i].SubscriptionId );
        }
    }
}

function createSubscription5101019() {
    var sessionCount = 1;
    var subscriptionCount = 5;
    MultiSessionMultiSubscribeTest( sessionCount, subscriptionCount, monitoredItem );

    sessionCount = 5;
    subscriptionCount = 1;
    MultiSessionMultiSubscribeTest( sessionCount, subscriptionCount, monitoredItem );
    return( true );
}

Test.Execute( { Procedure: createSubscription5101019 } );