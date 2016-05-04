/*  Test 5.10.3 Test 19 prepared by Development; compliance@opcfoundation.org
    Description: Create a subscription (Enabled=False) monitoring a single Static monitoredItem.
        Specify the subscription 5 times in the call to SetPublishingMode where the Enabled=True.
        Write to the monitoredItem. call Publish()(). */

Test.Execute( { Procedure: function test() {
    // create a DISABLED subscriptiion...
    var basicSubscription1 = new Subscription( null, false );
    if( CreateSubscriptionHelper.Execute( { Subscription: basicSubscription1 } ) ) {
        var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
        // 4 params are: (1) items to monitor (2) timestamps (3) subscription (4) sesssion
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: basicSubscription1 } ) ) {
            // call Publish() to make sure that we do NOT receive data.
            addLog( "call Publish() to make sure that we DO NOT receive data." );
            if( PublishHelper.Execute() ) {
                if( Assert.Equal( false, PublishHelper.CurrentlyContainsData(), "We dot not expect dataChanges from a disabled subscription!" ) ) {
                    // set publishing mode    
                    addLog( "SetPublishMode to be disabled for subscriptionId: " + basicSubscription1.SubscriptionId );

                    var setPublishingModeRequest  = new UaSetPublishingModeRequest();
                    var setPublishingModeResponse = new UaSetPublishingModeResponse();
                    Test.Session.Session.buildRequestHeader( setPublishingModeRequest.RequestHeader );
                    setPublishingModeRequest.PublishingEnabled = true;
                    for( var s=0; s<5; s++ ) {
                        print( "\tSetting subscriptionId: " + basicSubscription1.SubscriptionId + " Enabled=" + setPublishingModeRequest.PublishingEnabled );
                        setPublishingModeRequest.SubscriptionIds[s] = basicSubscription1.SubscriptionId;
                    }
                    var uaStatus = Test.Session.Session.setPublishingMode( setPublishingModeRequest, setPublishingModeResponse );
                    if( uaStatus.isGood() ) {
                        if( checkSetPublishingModeValidParameter( setPublishingModeRequest, setPublishingModeResponse ) ) {
                            // we need to change the state of our subscription object
                            if( setPublishingModeResponse.Results[0].isGood() ) {
                                basicSubscription1.PublishingEnabled = setPublishingModeRequest.PublishingEnabled;
                            }
    
                            // Write a value to the item; the subscription is currently enabled.
                            GenerateScalarValue( item.Value.Value, UaNodeId.GuessType( item.NodeSetting ), new Date().getSeconds() );
                            WriteHelper.Execute( { NodesToWrite: item } );
    
                            // LAST STEP: call Publish() again, this time we expect data!
                            addLog( "call Publish() to make sure that we DO NOT receive data." );
                            if( PublishHelper.Execute() ) {
                                Assert.Equal( true, PublishHelper.CurrentlyContainsData(), "We expect the subscription to return dataChanges." );
                            }
                        }
                    }
                    else addError( "SetPublishingMode() status " + uaStatus );
                }
                else addError( "Publish() yielded dataChange notifictions when NONE were expected. NotificationMessage.NotificationData length: " + PublishHelper.Response.NotificationMessage.NotificationData.length );
            }
            // delete the monitoredItems
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: basicSubscription1 } );
        }
    }
    // delete subscription added above
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription1 } );
    return( true );
} } );