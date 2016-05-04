/*  Test 5.10.6 Error Test 8 prepared by nathan.pocock@opcfoundation.org (based on prior work by: Anand Taparia; ataparia@kepwaare.com)
    Description: Script deletes multiple subscriptions that have been transferred to other sessions. */

function transferSubscription5106Err008() {
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

    var subscriptions = [], allItems = [];
    // Create subscriptions here
    for( var x=0; x<SUBSCRIPTIONSTOCREATE; x++ ) {
        subscriptions[x] = new Subscription2( { RequestedPublishingInterval: ( 1 + x ) * 100 } );
        CreateSubscriptionHelper.Execute( { Subscription: subscriptions[x] } );
        // add a monitoredItem to the subscription
        var item = items[0].clone();
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, 
                                                  TimestampsToReturn: TimestampsToReturn.Both,
                                                  SubscriptionId: subscriptions[x] } ) ) allItems.push( item );
    }//for x...
    if( allItems.length > 0 ) {
        // let's call Publish() on the new Subscriptions to make sure that we receive initial dataChanges for BOTH subscriptions.
        var publishHelperSession1 = PublishHelper;
        publishHelperSession1.WaitInterval( { Items: item, Subscription: subscriptions[0] } );
        for( x=0; x>SUBSCRIPTIONSTOCREATE; x++ ) {
            publishHelperSession1.Execute();
            Assert.True( publishHelperSession1.CurrentlyContainsData(), "Expected the initial dataChange on at least one of the " + SUBSCRIPTIONSTOCREATE + " Subscriptions." );
        }//for x...

        // Transfer the above subscriptions to the second session
        if( TransferSubscriptionsHelper.Execute( {
                SubscriptionIds: subscriptions,
                SourceSession: Test.Session,
                DestinationSession: session2,
                SendInitialValues: true } ) ) {
            // call Publish() on the OLD session, we don't expect dataChanges but DO EXPECT a statusChange
            PublishHelper.WaitInterval( { Items: item, Subscription: subscriptions[0] } );
            for( x=0; x<subscriptions.length; x++ ) {
                publishHelperSession1.Execute();
                Assert.False( publishHelperSession1.CurrentlyContainsData(), "Did not expect to receive a dataChange on the old Session." );
                Assert.GreaterThan( 0, publishHelperSession1.ReceivedStatusChanges.length, "Expected a statusChange in the OLD session to inform us that we no longer have the subscription." );
            }// for x...
            // Delete the subscriptions that were attached to the first session 
            var expectedResults = [];
            for( var i=0; i<SUBSCRIPTIONSTOCREATE; i++ ) expectedResults.push( new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ) );
            if( DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions, 
                                                     OperationResults: expectedResults } ) ) {
                // Verify that the subscriptions aren't deleted from the second session!
                // We will do this by calling ModifySubscription for each subscription on the second session. Each call should succeed.        
                for( x = 0; x < SUBSCRIPTIONSTOCREATE; x++ ) {
                    var modifySubscription2 = new ModifySubscriptionService( { Session: session2 } );
                    modifySubscription2.Execute( { MaxNotificationsPerPublish: 1,
                                                      SubscriptionId: subscriptions[x],
                                                      RequestedPublishingInterval: 1000,
                                                      RequestedLifetimeCount: 60,
                                                      RequestedMaxKeepAliveCount: 15 } );
                }// modify each sub
                // cleanup the subscriptions etc.
                var deleteSubscriptions2 = new DeleteSubscriptionService( { Session: session2 } );
                deleteSubscriptions2.Execute( { SubscriptionId: subscriptions } );
            }// delete subscriptions (session 1 )
        }// transfer subscriptions
    }// items available for testing?
    // clean-up
    CloseSessionHelper.Execute( { Session: session2 } );
    CloseSessionHelper.Execute( { Session: Test.Session } );
    return( true );
}

Test.Execute( { Procedure: transferSubscription5106Err008 } );