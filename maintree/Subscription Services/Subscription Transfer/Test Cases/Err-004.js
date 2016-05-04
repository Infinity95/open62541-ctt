/*  Test prepared by nathan.pocock@opcfoundation.org (based on prior work by: Anand Taparia; ataparia@kepwaare.com)
    Description: Script deletes multiple subscriptions where some are valid subscriptionIds and others have been transferred to other sessions. */

function transferSubscription5106Err009() {
const SUBSCRIPTIONSTOCREATE = 5;
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
    var subscriptions = [];
    // Create subscriptions here
    var proceed = true;
    for( x=0; x<SUBSCRIPTIONSTOCREATE; x++ ) {
        subscriptions[x] = new Subscription2( { RequestedPublishingInterval: ( 1 + x ) * 100 } );
        if( !CreateSubscriptionHelper.Execute( { Subscription: subscriptions[x] } ) ) proceed = false;
    }

    // Transfer subscriptions here
    var transferedSubscriptions = [ subscriptions[0], subscriptions[2], subscriptions[4] ];
    if( TransferSubscriptionsHelper.Execute( {  SubscriptionIds: transferedSubscriptions,
                                                SourceSession: Test.Session,
                                                DestinationSession: session2,
                                                SendInitialValues: true } ) ) {
        // call Publish() 
        // we don't care about dataChanges, we just need to make sure a StatusChange was received.
        var publishHelperSession1 = PublishHelper;
        publishHelperSession1.WaitInterval( { Subscription: subscriptions[0] } );
        for( x=0; x<transferedSubscriptions.length; x++) {
            publishHelperSession1.Execute();
            Assert.GreaterThan( 0, publishHelperSession1.ReceivedStatusChanges.length, "Expected to receive a statusChange notification that one or more subscriptions have been lost." );
        }// for x...
        // Now delete all the subscriptions. Some should succeed and some should fail
        var expectedResults = [];
        for( var i=0; i<subscriptions.length; i++ ) {
            if( i % 2 === 1 ) expectedResults.push( new ExpectedAndAcceptedResults( StatusCode.Good ) );
            else expectedResults.push( new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ) );
        }// for i..
        if( DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions, OperationResults: expectedResults } ) ) {
            // Verify that the subscriptions aren't deleted from the second session!
            // We will do this by calling ModifySubscription for each subscription (that 
            // was transfered) on the second session. Each call should succeed.
            var modifySubscription2 = new ModifySubscriptionService( { Session: session2 } );
            for( x=0; x<transferedSubscriptions.length; x++ ) {
                modifySubscription2.Execute( {  MaxNotificationsPerPublish: 1,
                                                SubscriptionId: transferedSubscriptions[x],
                                                RequestedPublishingInterval: 1000,
                                                RequestedLifetimeCount: 60,
                                                RequestedMaxKeepAliveCount: 15 } );
            }//for x...
            // cleanup the remaining subscriptions in the 2ns session
            var deleteSubscriptions2 = new DeleteSubscriptionService( { Session: session2 } );
            deleteSubscriptions2.Execute( { SubscriptionIds: transferedSubscriptions } );
        }// delete subscriptions
    }
    else DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions } );
    // clean-up
    CloseSessionHelper.Execute( { Session: session2 } );
    CloseSessionHelper.Execute( { Session: Test.Session } );
    return( true );
}

Test.Execute( { Procedure: transferSubscription5106Err009 } );