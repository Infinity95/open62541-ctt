/*  Test 5.10.3 Test 10 prepared by Anand Taparia; ataparia@kepwaare.com
    Description: Script modifies the publishing mode for a subscription that was transferred. */

function setPublishingMode5103010() {
    // get an item needed for the testing
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( item === undefined || item === null ) { addSkipped( "Static Scalar (numeric)" ); return( false ); }
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
    var subscription = new Subscription();
    // Create subscription in the first session and add monitored items
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        if( CreateMonitoredItemsHelper.Execute( { 
                    ItemsToCreate: item, 
                    TimestampsToReturn: TimestampsToReturn.BothTimestampsToReturn,
                    SubscriptionId: subscription } ) ) {

            // lets call Publish() to make sure that we do receive an initial dataChange.
            PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
            PublishHelper.Execute();
            Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive the initial value (dataChange)." );

            // write a value so we can write a different value later
            GenerateScalarValue( item.Value.Value, UaNodeId.GuessType( item.NodeSetting ), 1 );
            WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } );


            // Transfer the above subscription to the second session
            if( TransferSubscriptionsHelper.Execute( {
                    SubscriptionIds: subscription,
                    SourceSession: Test.Session,
                    DestinationSession: session2,
                    SendInitialValues: true
                    } ) ) {
                // call Publish() on the OLD session, we don't expect dataChanges but DO EXPECT a statusChange
                // clear the publish() settings so that it doesn't ack the prev. change
                PublishHelper.Clear();
                PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
                PublishHelper.Execute();
                Assert.False( PublishHelper.CurrentlyContainsData(), "Did not expect to receive a dataChange on the old Session (we previously moved the subscription to another session)." );
                Assert.GreaterThan( 0, PublishHelper.ReceivedStatusChanges.length, "Expected a statusChange in the OLD session to inform us that we no longer have the subscription." );

                // now to verify the subscription is not affected by calling Publish from the other session
                var publishHelperSession2 = new PublishService( { Session: session2 } );
                // wait and then call Publish() (the subscription was created Enabled=True) - we should get an initial value.
                publishHelperSession2.WaitInterval( { Items: item, Subscription: subscription } );
                publishHelperSession2.Execute();
                Assert.Equal( true, publishHelperSession2.CurrentlyContainsData(), "Expected a dataChange from our transferred subscription." );
                Assert.Equal( 0, publishHelperSession2.ReceivedStatusChanges.length, "Incorrectly received a StatusChangeNotification in the NEW session." );

                publishHelperSession2.ClearServerNotifications();
                publishHelperSession2.Clear();

                // Modify the publish mode for the subscription on the old Session 
                if( SetPublishingModeHelper.Execute( { PublishingEnabled: false, 
                                                   SubscriptionIds: subscription,
                                                   OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ) } ) ) {
                    // write a new value to the item
                    GenerateScalarValue( item.Value.Value, UaNodeId.GuessType( item.NodeSetting ), 2 );
                    var writeHelper2 = new WriteService( session2 );
                    writeHelper2.Execute( { NodesToWrite: item, ReadVerification: false } );

                    // wait and then call Publish() (subscription state should now be Inactive).
                    publishHelperSession2.WaitInterval( { Items: item, Subscription: subscription } );
                    publishHelperSession2.Execute();
                    Assert.True( publishHelperSession2.CurrentlyContainsData(), "Expected a dataChange from our transferred subscription." );
                    Assert.Equal( 0, publishHelperSession2.ReceivedStatusChanges.length, "Incorrectly received a StatusChangeNotification in the NEW session." );
                }// set publishing mode
                // delete subscription added above
                var deleteMonitoredItems2 = new DeleteMonitoredItemsService( { Session: session2 } );
                deleteMonitoredItems2.Execute( { ItemsToDelete: item, 
                                                 SubscriptionId: subscription } );
                var deleteSubscription2 = new DeleteSubscriptionService( { Session: session2 } );
                deleteSubscription2.Execute( { SubscriptionIds: subscription } );
            }// transfer
        }// create subscription
    }
    else DeleteSubscriptionsHelper.Execute( { Subscription: subscription } );
    // clean up
    CloseSessionHelper.Execute( { Session: Test.Session } );
    CloseSessionHelper.Execute( { Session: session2 } );
    return( true );
}

Test.Execute( { Procedure: setPublishingMode5103010 } );