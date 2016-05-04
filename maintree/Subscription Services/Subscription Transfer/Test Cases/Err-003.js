/*  Test prepared by nathan.pocock@opcfoundation.org (based on prior work by: Anand Taparia; ataparia@kepwaare.com)
    Description: Script sets monitoring mode on a subscription that has been transfered to another session. */

function setMonitoringMode593Err009() {
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
    var testSubscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: testSubscription } ) ) {
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, SubscriptionId: testSubscription } ) ) {
            // lets call Publish() on this (original) session to make sure the subscription is alive.
            var publishHelperSession1 = PublishHelper;
            publishHelperSession1.WaitInterval( { Subscription: testSubscription } );
            publishHelperSession1.Execute();
            Assert.True( publishHelperSession1.CurrentlyContainsData(), "Expected to receive a DataChange on the subscription." );

            // Now transfer MonitorBasicSubscription to the second session
            addLog ( "STEP 2: Transferring the subscription from the first session to the second session." );
            if( !TransferSubscriptionsHelper.Execute( { SubscriptionIds: testSubscription,
                                                        SourceSession: Test.Session,
                                                        DestinationSession: session2,
                                                        SendInitialValues: true } ) ) {
                // The TRANSFER call FAILED! Clean up and Delete the items we added in this test
                DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: testSubscription } );
                DeleteSubscriptionHelper.Execute( { SubscriptionId: testSubscription } );
            }// transfer subscription failed
            else {
                // call Publish() on the original session to make sure that we received a statusChange notification
                publishHelperSession1.WaitInterval( { Items: item, Subscription: testSubscription } );
                publishHelperSession1.Execute( { noAcks: true } );
                Assert.False( publishHelperSession1.CurrentlyContainsData(), "Did NOT expect to receive a dataChange notification on the old session." );
                Assert.GreaterThan( 0, publishHelperSession1.ReceivedStatusChanges.length, "Expected to receive a StatusChange notification on the old session to indicate that the subscription was moved." );

                // SetMonitorMode on the subscription as was atttached to the first session.
                addLog ( "STEP 3: Calling SetMonitoringMode on the subscription assuming it is still attached to the first session." );
                SetMonitoringModeHelper.Execute( { MonitoringMode: MonitoringMode.Disabled,
                                                   SubscriptionId: testSubscription,
                                                   MonitoredItemIds: item,
                                                   ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ) } );
                // Clean up
                // Delete the items we added in this test
                var deleteMonitoredItems2 = new DeleteMonitoredItemsService( { Session: session2 } );
                deleteMonitoredItems2.Execute( { ItemsToDelete: item, 
                                                 SubscriptionId: testSubscription } );
            }// transfer subscription success
        }// create monitored items
        // clean-up
        var deleteSubscriptions2 = new DeleteSubscriptionService( { Session: session2 } );
        deleteSubscriptions2.Execute( { SubscriptionIds: testSubscription } );
    }// create subscription
    // clean-up
    CloseSessionHelper.Execute( { Session: session2 } );
    CloseSessionHelper.Execute( { Session: Test.Session } );
    return( true );
}

Test.Execute( { Procedure: setMonitoringMode593Err009 } );