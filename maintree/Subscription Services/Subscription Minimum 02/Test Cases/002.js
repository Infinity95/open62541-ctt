/*  Test 5.10.1 Test 18, prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create 2 subscriptions per session. Create 1 session. */

function session5101018() {
    // detach the session created in "initialize.js"
    CloseSessionHelper.Execute( { Session: Test.Session } );

    var SessionCount = 1;
    var SubscriptionCount = 2;

    var MonitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings );
    if( MonitoredItems === undefined || MonitoredItems === null ) return( false );

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
                createMonitoredItems( items[ ( s * SessionCount ) + i ], TimestampsToReturn.Both, subscriptionObject[( s * SessionCount ) + i], sessions[s] );
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
            deleteMonitoredItems( items[ ( s * SessionCount ) + i ], subscriptionObject[( s * SessionCount ) + i] , sessions[s] );
            var DeleteSubscriptionsHelper = new DeleteSubscriptionService( sessions[s] );
            //deleteSubscriptionDeprecated( subscriptionObject[( s * SessionCount ) + i], sessions[s] );
            DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptionObject[( s * SessionCount ) + i] } );
            DeleteSubscriptionsHelper = null;
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

    // reconnect the session defined in "initialize.js"
    Test.Disconnect( { SkipCloseSession: true } );
    Test.Connect();
    return( true );
}

Test.Execute( { Procedure: session5101018 } );