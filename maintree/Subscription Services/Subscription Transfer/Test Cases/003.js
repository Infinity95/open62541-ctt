/*  Test 5.10.2 Test 23 prepared by Anand Taparia; ataparia@kepwaare.com
    Description: Script modifies a subscription that had been transferred to another session.
        The old/original session receives a statusChange notification. */

function modifySubscription5102023() {
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings );
    if( item === undefined || item === null ) { addSkipped( "Static Scalar (numeric)" ); return( false ); }
    var subscription = new Subscription();
    // create first session
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
    // create second session
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
    // Create subscription in the first session
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) return( false );
    // create the monitoredItem, wait and then call Publish() 
    if( !CreateMonitoredItemsHelper.Execute( { 
            ItemsToCreate: item, 
            TimestampsToReturn: TimestampsToReturn.Both, 
            SubscriptionId: subscription } ) ) {
        DeleteSubscriptionHelper.Execute( { SubscriptionIds: subscription } );
        return( false );
    }
    var PublishHelperSession1 = PublishHelper; // for easier reading: give our main publish helper a new name...
    PublishHelperSession1.WaitInterval( { Items: item, Subscription: subscription } );
    PublishHelperSession1.Execute();
    Assert.True( PublishHelperSession1.CurrentlyContainsData(), "Expected to receive the initial value (dataChange)." );

    // call Publish() once more, to acknowledge the initial dataChange
    PublishHelperSession1.Execute();

    // Transfer the above subscription to the second session
    if( !TransferSubscriptionsHelper.Execute( {
            SubscriptionIds: subscription,
            SourceSession: Test.Session,
            DestinationSession: session2,
            SendInitialValues: true
            } ) ) {
        // delete subscription added above
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
        return( false );
    }

    // Modify the subscription as was attached to the first session 
    if( ModifySubscriptionHelper.Execute( { PublishingInterval: 2000, 
                                            SubscriptionId: subscription,
                                            ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ) } ) ) {
        // call Publish() on the old session, we should get a statusChange notification
        PublishHelperSession1.WaitInterval( { Items: item, Subscription: subscription } );
        PublishHelperSession1.Execute( { ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoSubscription ] ) } );
        Assert.False( PublishHelperSession1.CurrentlyContainsData(), "Did not expect to receive dataChange notifications on this old session." );
        Assert.GreaterThan( 0, PublishHelperSession1, PublishHelperSession1.ReceivedStatusChanges.length, "Expected a StatusChange notification on the old session." );

        // call Publish() on the NEW session, we don't expect a statusChange, but do expect a dataChange
        var publishHelperSession2 = new PublishService( session2 );
        publishHelperSession2.Execute();
        Assert.True( publishHelperSession2.CurrentlyContainsData(), "Expected to receive the initial values of the data in the NEW session." );
        Assert.False( publishHelperSession2.ReceivedStatusChanges.length, "Incorrectly received a StatusChangeNotification in the NEW session." );

        // delete subscription added above and then clean-up.
        var deleteSubscriptionHelper2 = new DeleteSubscriptionService( { Session: session2 } );
        deleteSubscriptionHelper2.Execute( { SubscriptionIds: subscription } );
        publishHelperSession2 = null;
        ExpectedOperationResultsArray = null;
    }

    // clean-up
    CloseSessionHelper.Execute( { Session: Test.Session } );
    CloseSessionHelper.Execute( { Session: session2 } );
    return( true );
}

Test.Execute( { Procedure: modifySubscription5102023 } );