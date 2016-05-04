/*  Test CloseSession 5.6.3 Test #3 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: CloseSession while specifying DeleteSubscriptions=FALSE. Create a subscription with 1 monitored item.
        When the session is closed, we are JUST going to close the Session. The subscription and monitoredItem will NOT be cleaned-up.
        We'll then create another session. We'll try to TRANSFER the subscription to the new session. We're expecting the subscription to be present!
        We ARE checking if TransferSubscription is Bad_NotImplemented. If so, then the test result is a Warning with a message of Inconclusive. */

function closeSession563003() {
    const DELAYBEFOREPUBLISH = 1500;
    var uaStatus;

    // the subscriptionId will be set by our subscription, and used to try and TransferSubscription
    var subscriptionId = -1;

    // Connect to the server 
    var session = new CreateSessionService( { Channel: Test.Channel } );
    if( !session.Execute() ) return( false );
    if( ActivateSessionHelper.Execute( {
                Session: session, 
                UserIdentityToken: UaUserIdentityToken.FromUserCredentials( { 
                        Session: session,
                        UserCredentials: UserCredentials.createFromSettings( PresetCredentials.AccessGranted1, UserTokenType.UserName ) } ) } ) ) {
        InstanciateHelpers( { Session: session } );
        // create a subscription...
        var basicSubscription = new Subscription();
        if( createSubscriptionDeprecated( basicSubscription, session ) ) {
            // record the subscriptionId, we'll need it later to transfer to another session
            subscriptionId = basicSubscription.SubscriptionId;

            // create a monitoredItem
            var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings );

            // add monitoredItem to subscription:
            if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: basicSubscription } ) ) {
                addLog( "Waiting '" + DELAYBEFOREPUBLISH + " msecs' before calling Publish." );
                wait( DELAYBEFOREPUBLISH );
                PublishHelper.Execute();
            }
        }

        if( CloseSessionHelper.Execute( { Session: session, DeleteSubscriptions: false } ) ) {
            // now to reconnect to the server and to try and transfer the subscription to the new session.
            var session2 = new CreateSessionService( { Channel: Test.Channel } );
            if( session2.Execute() && ActivateSessionHelper.Execute( { 
                        Session: session2, 
                        UserIdentityToken: UaUserIdentityToken.FromUserCredentials( { 
                                Session: session2,
                                UserCredentials: UserCredentials.createFromSettings( PresetCredentials.AccessGranted1, UserTokenType.UserName ) } ) } ) ) {
                InstanciateHelpers( { Session: session2 } );
                if( !TransferSubscriptionsHelper.Execute( {
                            SubscriptionIds: basicSubscription,
                            SourceSession: session,
                            DestinationSession: session2,
                            SendInitialValues: true
                            } ) ) {
                    // delete subscription added above
                    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription } );
                    CloseSessionHelper.Execute( { Session: session2 } );
                    return( false );
                }
                addLog( "Subscription transferred successfully" );
                PublishHelper.Execute( { FirstPublish: true } );
                Assert.True( PublishHelper.CurrentlyContainsData(), "Expect a dataChange from the subscription in the new session." );
                DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription } );
                // close this 2nd session
                CloseSessionHelper.Execute( { Session: session2 } );
            }
        }
    }
    else {
        CloseSessionHelper.Execute( { Session: session, ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadSessionNotActivated ] ) } );
        return( false );
    }
    return( true );
}

Test.Execute( { Procedure: closeSession563003 } );