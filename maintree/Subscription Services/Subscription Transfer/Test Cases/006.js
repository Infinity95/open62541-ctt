/*  Test 5.10.4 Test 5 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Script calls publish after the subscription has been transferred 
        to a different session.
*/

function publish5104005() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings );
    if( !isDefined( items ) || items.length === 0 ) { addSkipped( "Dynamic Scalar" ); return( false ); }
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

    // create subscription and monitored items
    var basicSubscription = new Subscription();
    if ( CreateSubscriptionHelper.Execute( { Subscription: basicSubscription } ) ) {
        var monitoredItems = [ items[0].clone(), items[1].clone() ];
        if ( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: monitoredItems, 
                                                   Timestamp: TimestampsToReturn.Both, 
                                                   SubscriptionId: basicSubscription } ) ) {
            // call Publish() to get the first sequence number
            var publishHelperSession1 = PublishHelper;
            publishHelperSession1.WaitInterval( { Items: monitoredItems, Subscription: basicSubscription } );
            if( publishHelperSession1.Execute() ) {
                // we should've received something
                Assert.True( publishHelperSession1.CurrentlyContainsData(), "Expected an initial dataChange in the first Publish call." );
                // transfer the subscription to another session
                if( TransferSubscriptionsHelper.Execute( {
                        SubscriptionIds: basicSubscription,
                        SourceSession: Test.Session,
                        DestinationSession: session2,
                        SendInitialValues: true
                        } ) ) {
                    // call Publish() on the subscription. make the call from session #0 (where it was created)
                    // although the subscription should now be owned to session #1. first Publish expects a StatusChange
                    // we actually need to prevent the call from acknowledging the subscription which no longer exists
                    publishHelperSession1.Clear();
                    publishHelperSession1.Execute();
                    Assert.False( publishHelperSession1.CurrentlyContainsData(), "Did NOT expect to receive dataChange notifications on the OLD session." );
                    Assert.Equal( 1, publishHelperSession1.ReceivedStatusChanges.length, "Did NOT receive a StatusChangeNotification in the OLD session." );

                    // second Publish expects service failure (BadNoSubscription)
                    publishHelperSession1.Execute( { ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadNoSubscription ) } );

                    // call Publish() on the NEW session to make sure the subscription survived the transfer.
                    var publishHelperSession2 = new PublishService( { Session: session2 } );
                    publishHelperSession2.WaitInterval( { Items: monitoredItems, Subscription: basicSubscription } );
                    publishHelperSession2.Execute();
                    Assert.True( publishHelperSession2.CurrentlyContainsData(), "Expected to received the initial dataChange on the NEW session." );
                    Assert.Equal( 0, publishHelperSession2.ReceivedStatusChanges.length, "Did NOT expect to receive a StatusChange notification on the NEW session." );

                    // clean-up
                    publishHelperSession2.ClearServerNotifications();
                }
            }
            // delete the items we added in this test
            var deleteMonitoredItems2 = new DeleteMonitoredItemsService( { Session: session2 } );
            deleteMonitoredItems2.Execute( { ItemsToDelete: monitoredItems, SubscriptionId: basicSubscription } );
        }// create monitored items
        var deleteSubscription2 = new DeleteSubscriptionService( { Session: session2 } );
        deleteSubscription2.Execute( { SubscriptionIds: basicSubscription } );
    }// create subscription
    // clean-up
    CloseSessionHelper.Execute( { Session: session2 } );
    CloseSessionHelper.Execute( { Session: Test.Session } );
    return( true );
}

Test.Execute( { Procedure: publish5104005 } );