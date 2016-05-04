/*  Test CloseSession 5.6.3 Test #2 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        CloseSession using default parameters (deleteSubscriptions=TRUE)
        Create a subscription with 1 monitored item.
        When the session is closed, we are JUST going to close the Session.
        The subscription and monitoredItem will NOT be cleaned-up via script.
        We'll then create another session.
        We'll try to TRANSFER the subscription to the new session.
        We're expecting the subscription to be non-existent!

        We ARE checking if TransferSubscription is Bad_NotImplemented. If so, then
        the test result is a Warning with a message of Inconclusive. */

function closeSession563002() {
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
        if( CreateSubscriptionHelper.Execute( { Subscription: basicSubscription } ) ) {
            // create a monitoredItem
            var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings );

            // add monitoredItem to subscription:
            if( CreateMonitoredItemsHelper.Execute( { 
                        ItemsToCreate: items, 
                        TimestampsToReturn: TimestampsToReturn.Both, 
                        SubscriptionId: basicSubscription } ) ) {
                addLog( "Waiting '" + DELAYBEFOREPUBLISH + " msecs' before calling Publish." );
                wait( DELAYBEFOREPUBLISH );
                
                if( PublishHelper.Execute( { FirstPublish: true } ) ) PublishHelper.PrintDataChanges();
            }
        }

        addLog( "Now to close the session." );
        if( CloseSessionHelper.Execute( { Session: session, DeleteSubscriptions: true } ) ) {
            // now to reconnect to the server and to try and transfer the subscription
            // to the new session.
            var session2 = new CreateSessionService( { Channel: Test.Channel } );
            if( session2.Execute() && ActivateSessionHelper.Execute( { 
                        Session: session2, 
                        UserIdentityToken: UaUserIdentityToken.FromUserCredentials( { 
                                Session: session2, 
                                UserCredentials: UserCredentials.createFromSettings( PresetCredentials.AccessGranted1, UserTokenType.UserName ) } ) } ) ) {
                var expectedOperationResults = new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid );
                TransferSubscriptionsHelper.Execute( { 
                            SubscriptionIds: basicSubscription,
                            SourceSession: session,
                            DestinationSession: session2,
                            SendInitialValues: true,
                            OperationResults: expectedOperationResults
                            } );
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

Test.Execute( { Procedure: closeSession563002 } );