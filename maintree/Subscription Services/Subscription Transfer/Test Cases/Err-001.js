/*  Test 5.10.6 Error Test 7 prepared by nathan.pocock@opcfoundation.org (based on work by: Anand Taparia; ataparia@kepwaare.com)
    Description: Script deletes a subscription that has been transferred to another session */

function deleteSubscription5106Err007() {
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

    var item = items[0].clone();
    var subscription = new Subscription();

    // Create subscription in the first session
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, 
                                                  TimestampsToReturn: TimestampsToReturn.Both, 
                                                  SubscriptionId: subscription } ) ) {

            // call Publish() on the OLD session to make sure the subscription is alive
            var publishHelperSession1 = PublishHelper;
            publishHelperSession1.WaitInterval( { Items: item, Subscription: subscription } );
            publishHelperSession1.Execute();
            Assert.True( publishHelperSession1.CurrentlyContainsData(), "Expected to receive the initial dataChanges for the subscription." );

            // Transfer the above subscription to the second session
            if( TransferSubscriptionsHelper.Execute( {
                    SubscriptionIds: subscription,
                    SourceSession: Test.Session,
                    DestinationSession: session2,
                    SendInitialValues: true
                    } ) ) {

                // call Publish() on the OLD session and make sure that we:
                //  (a) Receive a StatusChange notification
                //  (b) DON'T receive a DataChange notification
                publishHelperSession1.WaitInterval( { Items: item, Subscription: subscription } );
                publishHelperSession1.Execute( { NoAcks: true } );
                Assert.False( publishHelperSession1.CurrentlyContainsData(), "Did NOT expect to receive a DataChange notification in the OLD session since the subscription was moved to a new session." );
                Assert.GreaterThan( 0, publishHelperSession1.ReceivedStatusChanges.length, "Expected to receive a StatusChange notification that our Subscription was moved from our session." );

                // Delete the subscription as was attached to the first session - we EXPECT THIS TO FAIL!
                if( DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription, 
                                                         OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ) } ) ) {

                    // Verify that the subscription isn't deleted from the second session!
                    // We will do this by calling ModifySubscription on the second session. This
                    // call should succeed.
                    var modifySubscription2 = new ModifySubscriptionService( { Session: session2 } );
                    if( modifySubscription2.Execute( { MaxNotificationsPerPublish: 1,
                                                       SubscriptionId: subscription } ) ) { 
                        // delete subscription added above
                        var deleteSubscription2 = new DeleteSubscriptionService( { Session: session2 } );
                        deleteSubscription2.Execute( { SubscriptionIds: subscription } );
                    }// modify subscription
                }// delete subscriptions
            }// transfer subscriptions
        }// create monitored items
    }// create subscription
    // clean-up
    CloseSessionHelper.Execute( { Session: session2 } );
    CloseSessionHelper.Execute( { Session: Test.Session } );
    return( true );
}

Test.Execute( { Procedure: deleteSubscription5106Err007 } )