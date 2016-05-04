/*  Test 5.10.5 Test 3 prepared by Anand Taparia; ataparia@kepwaare.com
    Description:
        Script calls republish multiple X times, to obtain the last 3 X updates. The script accomplished this by:
        - create subscription/monitor items
        - call Publish() first time to get sequence number
        - repeat three times
            - send ack to the first seqeunce no. we received (only once in this loop)
            - write value
            - call Publish()
            - save received NotificationMessage and sequence number. Don't acknowledge.
        - repeat three times
            - call republish, with the saved sequence numbers from above (in the same order)
            - compare the published NotificationMessage to the republished NotificationMessage (should equal). */

Test.Execute( { Procedure: function test() {
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    // read the item to get the initial value. This helps the script to set the correct value (type) when we make writes to force dataChange invocations.
    if( !ReadHelper.Execute( { NodesToRead: item } ) ) { addError( "Aborting test. Unable to ReadHelper the item. Therefore we can't WRITE to the item which is how we were going to invoke dataChange notifications." ); return( false ); }
    // Values we will write
    var writeValueArray = [];
    // Flag to check if the subscription/monitored items were created successfully
    var monitorItemsCreated = false;
    // ~~~~~~~~~~ STEP 1 - CREATE THE SUBSCRIPTION ~~~~~~~~~~
    print( "\nSTEP 1 - Create the Subscription" );
    basicSubscription = new Subscription();
    if ( !CreateSubscriptionHelper.Execute( { Subscription: basicSubscription } ) ) return( false );

    PublishHelper.RegisterSubscription( basicSubscription );

    // 4 params are: (1) items to monitor (2) timestamps (3) subscription (4) sesssion
    if ( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: basicSubscription } ) ) {
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription } );
        return( false );
    }

    // we've subscribed to monitored items, delay to give server time to fetch initial value(s)...
    print( "Waiting '" + basicSubscription.RevisedPublishingInterval + " msecs' before calling Publish." );
    PublishHelper.WaitInterval( { Items: item, Subscription: basicSubscription } );

    // ~~~~~~~~~~ STEP 2 - INITIAL PUBLISH ~~~~~~~~~~
    // call Publish() to get the first sequence number
    print( "\nSTEP 2 - call Publish() (our first call) and initial data collection" );
    if( !PublishHelper.Execute( { FirstPublish: true } ) ) {
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription } );
        return( false );
    }
    PublishHelper.PrintDataChanges();

    // ~~~~~~~~~~ STEP 3 - WRITE VALUE, call Publish() (DON'T ACKNOWLEDGE): DO THIS THREE TIMES ~~~~~~~~~~
    var retransmitSequenceNoToAck = [];
    var SendAck = true;
    var notifications = []; // the NotificationMessages from Publish for later comparison
    var writeFailed = false;
    for( var x=0; x<3; x++ ) {
        // prepare the write call
        print( "\nSTEP 3 (iteration #" + (x+1) + ") - Write a value" );

        // set the write value
        writeValueArray.push( UaVariant.Increment( { Value: item.Value } ) );
        if( !WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } ) ) {
            // the write failed. There's no need to continue with this test.
            addError( "The Write failed, therefore we cannot control the dataChange notifications. This test cannot be conducted. Please reconfigure the settings to use Static Read/Write nodes." );
            writeFailed = true;
            break;
        }

        // add a delay after the write, just to allow time for the write to physically take place
        print( "Waiting '" + basicSubscription.RevisedPublishingInterval + " msecs' before to allow Write to commit within the Server (just in case Server responds too soon)." );
        PublishHelper.WaitInterval( { Items: item, Subscription: basicSubscription } );

        print( "\nSTEP 4 (iteration #" + (x+1) + ") - call Publish(), do we get our Write value?" );
        PublishHelper.Execute( { NoAcks: true } ); // do not acknowledge anything!
        if( PublishHelper.CurrentlyContainsData() ) {
            PublishHelper.PrintDataChanges();
            notifications[x] = PublishHelper.Response.NotificationMessage;
            // make sure that we received a valueChange and that the value we received matches what we wrote in Step #4.
            Assert.CoercedEqual( writeValueArray[x], item.Value.Value, "Expected to receive the same value previously wrote." );
        }
   }
    
    // At this point we should have three unacknowledged sequence numbers. 
    // (the three unacknowledged sequence numbers respectively correspond to the three write items of writeValueArray[])
    // HOWEVER WE MIGHT NOT!!!! In the case of Embedded devices with limited resources some messages may have been
    // purged from the queue. Let's check the number of AvailableSequenceNumbers; if 3 then we're set!
    var availableSeqs = PublishHelper.Response.AvailableSequenceNumbers.length;
    if( availableSeqs !== 4 ) addSkipped( "Server PURGED notification messages from the queue; therefore we can't call REPUBLISH to obtain them. Expected 4 but received: " + availableSeqs );
    else {
        // Now call republish to get the three numbers
        // ~~~~~~~~~~ STEP 5 - CALL REPUBLISH WITH THE UNACKNOWLEDGED SEQUENCE NUMBERS~~~~~~~~~~
        if( writeFailed === false ) {
            for (x=0; x<3; x++ ) {
                var seqId = PublishHelper.ReceivedSequenceNumbers[ (PublishHelper.ReceivedSequenceNumbers.length - 3) + x ];
                print( "\nSTEP 5 - Calling republish #" + x + " Retransmitsequence no. is: " + seqId + ". The response should have write value: " + writeValueArray[x] );
                var republishRequest = new UaRepublishRequest();
                var republishResponse = new UaRepublishResponse();
                Test.Session.Session.buildRequestHeader( republishRequest.RequestHeader );

                republishRequest.RetransmitSequenceNumber = seqId;
                republishRequest.SubscriptionId = basicSubscription.SubscriptionId;

                var uaStatus = Test.Session.Session.republish( republishRequest, republishResponse );
                if( uaStatus.isGood() ) {
                    if( checkRepublishValidParameter( republishRequest, republishResponse ) ) {
                        Assert.Equal( notifications[x], republishResponse.NotificationMessage, "Published NotificationMessage did not match Republished NotificationMessage." );
                        if( republishResponse.NotificationMessage.NotificationData.length > 0 ) {
                            var dataChangeNotification = republishResponse.NotificationMessage.NotificationData[0].toDataChangeNotification();
                            if( dataChangeNotification.MonitoredItems.length > 0 ) {
                                var expectedDataChange = notifications[x].NotificationData[0].toDataChangeNotification();
                                Assert.Equal( expectedDataChange, dataChangeNotification, "Published DataChangeNotification did not match Republished DataChangeNotification." );
    
                                var newDataValue = dataChangeNotification.MonitoredItems[0].Value.Value;
                                for( var i  = 0; i < dataChangeNotification.MonitoredItems.length; i++ ) print( "datachangeNotification.MonitoredItems[" + i + "] = " + dataChangeNotification.MonitoredItems[i] );
                            }
                            else addError( "republish: no monitored items in DataChangeNotification" );
                        }
                        else addError( "republish: no NotificationData in NotificationMessage" );
                    }
                    else {
                        if( republishResponse.ResponseHeader.ServiceResult.StatusCode === StatusCode.BadMessageNotAvailable ) notImplemented( "Republish" );
                        else addError( "Republish did not return any results. ServiceResult: " + republishResponse.ResponseHeader.ServiceResult );
                        break;
                    }
                }
                else addError( "Republish() status " + uaStatus, uaStatus );
            }
        }//if writeFailed
    }//purged messages?
    //Now Delete the MonitoredItems
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: basicSubscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription } );
    PublishHelper.UnregisterSubscription( basicSubscription );
    return( true );
} } );