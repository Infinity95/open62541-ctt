/*  Test 5.10.5 Test 2 prepared by Anand Taparia; ataparia@kepwaare.com
    Description: Script calls republish after the subscriptions had been transferred to a different session */

function republish5105002() {
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
    // create subscription
    var basicSubscription = new Subscription();
    if ( CreateSubscriptionHelper.Execute( { Subscription: basicSubscription } ) ) {
        var MonitoredItems = [ items[0].clone(), items[1].clone() ];
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: MonitoredItems, 
                                                  TimestampsToReturn: TimestampsToReturn.Both,
                                                  SubscriptionId: basicSubscription } ) ) {
            // wait and call Publish(), make sure we receive initial dataChanges
            var publishHelperSession1 = PublishHelper;
            publishHelperSession1.WaitInterval( { Items: MonitoredItems, Subscription: basicSubscription } );
            publishHelperSession1.Execute();
            Assert.True( publishHelperSession1.CurrentlyContainsData(), "Expected to receive the initial dataChange." );

            // Flag to check if the subscription was successfully transferred
            var subscriptionTransferred = false;
            if( TransferSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription, 
                                                       SourceSession: Test.Session, 
                                                       DestinationSession: session2, 
                                                       SendInitialValues: true } ) ) {
                // make sure the OLD session sees a StatusChange notification
                publishHelperSession1.Execute({ noAcks: true } );
                Assert.GreaterThan( 0, publishHelperSession1.ReceivedStatusChanges.length, "Expected to receive a StatusChange notification on the OLD session." );

                subscriptionTransferred = true;

                // call republish with the sequence number received above (on the first session)
                if( RepublishHelper.Execute( { SubscriptionId: basicSubscription, 
                                               RetransmitSequenceNumber: publishHelperSession1.ReceivedSequenceNumbers[0],
                                               SubscriptionId: basicSubscription.SubscriptionId,
                                               ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.BadSubscriptionIdInvalid, StatusCode.BadMessageNotAvailable ] ) } ) ) {
                    if( RepublishHelper.Response.ResponseHeader.ServiceResult.StatusCode === StatusCode.BadMessageNotAvailable ) {
                        notImplemented( "Republish" );
                        subscriptionTransferred = false;
                    }
                }// republish
            }// transfer subscription

            // On cleanup, delete items/subscription from the correct session
            if( subscriptionTransferred ) {
                var deleteMonitoredItems2 = new DeleteMonitoredItemsService( { Session: session2 } );
                deleteMonitoredItems2.Execute( { ItemsToDelete: MonitoredItems, 
                                                 SubscriptionId: basicSubscription } );
                // delete the subscription we added here 
                var deleteSubscriptions2 = new DeleteSubscriptionService( { Session: session2 } );
                deleteSubscriptions2.Execute( { SubscriptionIds: basicSubscription } );
            }
            else {
                DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: MonitoredItems, 
                                                      SubscriptionId: basicSubscription } );
                // delete the subscription we added here 
                DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription } );
            }
        }
    }
    // clean-up
    CloseSessionHelper.Execute( { Session: session2 } );
    CloseSessionHelper.Execute( { Session: Test.Session } );
    return( true );
}// function republish5105002() 

Test.Execute( { Procedure: republish5105002 } );