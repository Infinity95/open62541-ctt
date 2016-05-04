/*  Test 5.10.3 Test 11 prepared by Anand Taparia; ataparia@kepwaare.com
    Description: Script modifies the publishing mode for multiple subscriptions that were transferred. */

function transferSubscription5103011() {
    var nodeSetting = Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings;
    if( nodeSetting === undefined || nodeSetting === null ) {
        addSkipped( "Static Scalar (numeric)" );
        return( false );
    }
    // create session1
    Test.Session = new CreateSessionService( { Channel: Test.Channel } );
    if( !Test.Session.Execute() ) return( false );
    if( !ActivateSessionHelper.Execute( { 
            Session: Test.Session,
            UserIdentityToken: UaUserIdentityToken.FromUserCredentials( { 
                        Session: Test.Session, 
                        UserCredentials: UserCredentials.createFromSettings( PresetCredentials.AccessGranted1, UserTokenType.UserName ) } ) } ) ) {
        CloseSessionHelper.Execute( { Session: Test.Session, ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadSessionNotActivated ] ) } );
            return( false );
    }
    // create session2
    var session2 = new CreateSessionService( { Channel: Test.Channel } );
    if( !session2.Execute() || !ActivateSessionHelper.Execute( { 
                Session: session2,
                UserIdentityToken: UaUserIdentityToken.FromUserCredentials( { 
                        Session: session2, 
                        UserCredentials: UserCredentials.createFromSettings( PresetCredentials.AccessGranted1, UserTokenType.UserName ) } ) } ) ) {
        CloseSessionHelper.Execute( { Session: Test.Session } );
        CloseSessionHelper.Execute( { Session: session2, ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadSessionNotActivated ] ) } );
        addError( "Unable to add 2nd session." );
        return( false );
    }
    InstanciateHelpers( { Session: Test.Session } );
    var subscriptions = [ new Subscription(), new Subscription() ];
    // Create subscriptions in the first session
    var proceed = true;
    for( var s=0; s<subscriptions.length; s++ ) {
        if( CreateSubscriptionHelper.Execute( { Subscription: subscriptions[s] } ) ) {
            // add a monitoredItem to the subscription
            if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items[s], TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscriptions[s] } ) ) proceed = false;
        }
        else proceed = false;
    }
    if( proceed ) {
        // let's call Publish() on the new Subscriptions to make sure that we receive initial dataChanges
        // for BOTH subscriptions.
        var PublishHelperSession1 = PublishHelper;
        PublishHelperSession1.WaitInterval( { Items: items[0], Subscription: subscriptions[0] } );
        PublishHelperSession1.Execute();
        Assert.True( PublishHelperSession1.CurrentlyContainsData(), "Expected the initial dataChange on at least one of the two Subscriptions." );
        PublishHelperSession1.Execute();
        Assert.True( PublishHelperSession1.CurrentlyContainsData(), "Expected the initial dataChange on the other Subscription." );
    
        // Transfer the above subscription to the second session
        if( TransferSubscriptionsHelper.Execute( {
                SubscriptionIds: subscriptions,
                SourceSession: Test.Session,
                DestinationSession: session2,
                SendInitialValues: true
                } ) ) {
            // call Publish() on the OLD session, we don't expect dataChanges but DO EXPECT a statusChange
            // and clear the Publish stats to avoid ack'ing the last sequence (subscription is now moved).
            PublishHelperSession1.WaitInterval( { Items: items[0], Subscription: subscriptions[0] } );
            PublishHelperSession1.Clear();
            PublishHelperSession1.Execute();
            Assert.False( PublishHelperSession1.CurrentlyContainsData(), "Did not expect to receive a dataChange from any subscription in session #1." );
            Assert.GreaterThan( 0, PublishHelperSession1.ReceivedStatusChanges.length, "Expected a statusChange for subscriptions that were previously in session #1 to inform us that we no longer have the subscription." );
            
            // now to verify the subscription is not affected by calling publish from the other session
            var PublishHelperSession2 = new PublishService( session2 );
            for( var p=0; p<subscriptions.length; p++ ) {
                PublishHelperSession2.Execute();
                Assert.True( PublishHelperSession2.CurrentlyContainsData(), "Expected a dataChange from subscription # " + (1+p) + ", which is now in session #2." );
            }
    
            // Modify the publish mode for the subscription as was attached to the first session 
            var expectedResults = [];
            for( var i=0; i<subscriptions.length; i++ ) expectedResults.push( new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ) );
            SetPublishingModeHelper.Execute( { PublishingEnabled: false, SubscriptionIds: subscriptions, OperationResults: expectedResults } );
    
            // clean-up
            var deleteMonitoredItems2 = new DeleteMonitoredItemsService( { Session: session2 } );
            var deleteSubscriptions2  = new DeleteSubscriptionService( { Session: session2 } );
            for( var s=0; s<subscriptions.length; s++ ) deleteMonitoredItems2.Execute( { ItemsToDelete: items[s], SubscriptionId: subscriptions[s] } );
            deleteSubscriptions2.Execute( { SubscriptionIds: subscriptions } );
            // clear the publish object's properties...
        }
        else for( var s=0; s<subscriptions.length; s++ ) DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions } );
    }// proceed?
    CloseSessionHelper.Execute( { Session: Test.Session } );
    CloseSessionHelper.Execute( { Session: session2 } );
    return( true );
}

Test.Execute( { Procedure: transferSubscription5103011 } );