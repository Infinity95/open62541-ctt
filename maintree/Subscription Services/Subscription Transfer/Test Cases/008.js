/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create a subscription, make some changes, do not acknowledge any sequence numbers. Close the session but do not delete subscription.
        Create a new session, transfer the subscription, call republish(). */

function republish5105009() {
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

    // define the item and get the initial value
    var defaultStaticItem = items[0].clone();
    ReadHelper.Execute( { NodesToRead: defaultStaticItem } );

    // create the subscription
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        // creeate the monitored item
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: defaultStaticItem, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) {
            // call Publish(); get initial data-change.
            PublishHelper.Execute( { FirstPublish: true } );
            Assert.True( PublishHelper.CurrentlyContainsData(), "Publish().Response.NotificationData expected a data-change; received nothing." );
    
            // change the value to invoke some data-changes, but do not ack any sequences 
            for( var i=0; i<3; i++ ) {
                UaVariant.Increment( { Value: defaultStaticItem.Value } );
                WriteHelper.Execute( { NodesToWrite: defaultStaticItem, ReadVerification: false } );
                PublishHelper.Execute( { NoAcks: true } );
                Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() did not return a data-change." );
            }//for i
    
            // now close the session
            CloseSessionHelper.Execute( { Session: Test.Session, DeleteSubscriptions: false } );
    
            // now transfer the old subscription to the other session
            // fix all of our helper objects to use the new session
            InstanciateHelpers( { Session: session2 } );
            if( TransferSubscriptionsHelper.Execute( { SubscriptionIds: subscription, 
                                                       SourceSession: Test.Session, 
                                                       DestinationSession: session2,
                                                       SendInitialValues: true } ) ) {
                // call Publish()() and then REPUBLISH all remaining sequence numbers 
                PublishHelper.Execute();
                if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() expected an initial data-change that contains the initial data for the subscription that was transferred from the previous session. Skipping checks for Republish() on previously unacknowledged sequenceNumbers." ) ) {
                    const INITIAL_DC = 1;
                    const NEW_INITIAL_DC = 1;
                    const NUM_WRITES = 3;
                    var expectedSequences = INITIAL_DC + NEW_INITIAL_DC + NUM_WRITES;
                    Assert.Equal( expectedSequences, PublishHelper.Response.AvailableSequenceNumbers.length, "Publish().Response.AvailableSequenceNumbers expected to be 3, one for each previous Write() operation." );
                    for( var i=0; i<PublishHelper.Response.AvailableSequenceNumbers.length; i++ ) {
                        if( RepublishHelper.Execute( { SubscriptionId: subscription, RetransmitSequenceNumber: PublishHelper.Response.AvailableSequenceNumbers[i], ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadMessageNotAvailable ] ) } ) ) {
                            if( Assert.StringNotNullOrEmpty( RepublishHelper.Response.NotificationMessage, "Republish().Response.NotificationMessage is empty, but a dataChange notification was expected." ) ) {
                                Assert.Equal( PublishHelper.Response.AvailableSequenceNumbers[i], RepublishHelper.Response.NotificationMessage.SequenceNumber, "Repubish().Response.NotificationMessage.SequenceNumber does not match the request." );
                            }
                        }// republish
                    }//for i...
                }//publish contains data?
            }// transfer subscription
            else addError( "Unable to re-open session #1." );
            // clean-up
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: defaultStaticItem, 
                                                  SubscriptionId: subscription } );
            DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
        }// create monitored items
    }// create subscription
    // clean-up
    CloseSessionHelper.Execute( { Session: session2 } );
    return( true );
}

Test.Execute( { Procedure: republish5105009 } );