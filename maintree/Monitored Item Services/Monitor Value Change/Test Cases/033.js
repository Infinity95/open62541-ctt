/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create one monitored item with Filter = DataChangeFilter( deadbandType =
        None, trigger = StatusValue ). call Publish(). Write a value to the Value
        attribute. call Publish(). Write a status code to the Value attribute
        (don�t change the value of the Value attribute). call Publish(). Write the
        existing value and status code to the Value attribute. call Publish().
    Expected results: All service and operation level results are Good. The second Publish
        contains a DataChangeNotification with a value.value matching the
        written value. The third Publish contains a DataChangeNotification with
        a value.statusCode matching the written value (and value.value matching
        the value before the write). The fourth Publish contains no
        DataChangeNotifications. */

function createMonitoredItems591061() {
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( item == null ) { addError( "Test aborted. No item available for testing." ); return( false ); }
    
    // create a subscription
    var subscription = MonitorBasicSubscription;
    
    // specify our deadband filter
    item.Filter = Event.GetDataChangeFilter( DeadbandType.None, 0, DataChangeTrigger.StatusValue );

    // if the server doesn't support filters then permit it to return Bad_MonitoredItemFilterNotSupported.
    var expectedResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];

    // create the monitoredItem and add it to our existing subscription (initialize script)
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription, OperationResults: expectedResults } ) ) {
        // wait, allowing the UA Server to poll the item so we can call Publish() on it
        PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
        // call Publish()
        if( PublishHelper.Execute( { FirstPublish: true } ) && Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange notification for the initial value(s)" ) ) {
            // get the current Value and then set a new value
            PublishHelper.SetItemValuesFromDataChange( [item] );
            var initialValueAsRead  = UaVariantToSimpleType( item.Value.Value );
            var initialValueQuality = item.Value.StatusCode;

            var maxValue = getMaxValueDataType(item.Value.Value.DataType);
            var initialValueOverride;

            if( initialValueAsRead < maxValue ) initialValueOverride = ( initialValueAsRead + 1 );
            else initialValueOverride = ( initialValueAsRead - 1 );

            // set a new Value and then write it (WRITE # 1)
            item.SafelySetValueTypeKnown( initialValueOverride, item.Value.Value.DataType );
            // expected write results
            expectedResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];
            expectedResults[0].addExpectedResult( StatusCode.BadWriteNotSupported );
            if( WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectedResults, CheckNotSupported: true } ) ) {
                // if we received a Bad_NotSupported then don't proceed
                if( WriteHelper.Response.Results[0].StatusCode !== StatusCode.BadWriteNotSupported ) {
                    // wait, allowing the UA Server to poll the item so we can call Publish() on it
                    PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
                    // call Publish() again, do we get the new dataChange?
                    if( PublishHelper.Execute() ) {
                        if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected a dataChange because we just wrote a new value to the item." ) ) {
                            PublishHelper.SetItemValuesFromDataChange( [item] );
                            // new value contain the same value as just written?
                            addLog("Expected " + initialValueOverride + " received " + item.Value.Value)
                            Assert.True( ( initialValueOverride == item.Value.Value ), "Expected the item in the dataChange to contain the same value as was first read." );
    
                            // write a new quality code, we'll toggle from Good <> Bad
                            var initialStatusCodeAsRead = item.Value.StatusCode.StatusCode;
                            var statusCodeOverride = initialStatusCodeAsRead == StatusCode.Good? StatusCode.GoodClamped: StatusCode.Good;
                            // write the new quality code to the server (WRITE #2)
                            item.Value.StatusCode.StatusCode = statusCodeOverride;
                            item.Value.Set = "Value, StatusCode";
                            if( WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectedResults, SuppressMessaging: true, CheckNotSupported: true } ) ) {
                                if( WriteHelper.Response.Results[0].StatusCode !== StatusCode.BadWriteNotSupported ) {
                                    // wait, allowing the UA Server to poll the item so we can call Publish() on it
                                    PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
                                    // call Publish() again, do we get the new dataChange?
                                    if( PublishHelper.Execute() ) {
                                        PublishHelper.SetItemValuesFromDataChange( [item] );
                                        if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected a DataChange to occur when we overrode the StatusCode of the monitoredItem." ) ) {
                                            Assert.True( ( initialValueOverride == item.Value.Value ), "Expected the item in the dataChange to contain the same value as was first read because we haven't changed the Value yet." );
                                            Assert.Equal( statusCodeOverride, item.Value.StatusCode.StatusCode, "Expected the received statusCode to match the one we just wrote." );
                                        }//containsData?
        
                                        // last test, write the unchanged data! (WRITE #3)
                                        if( WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectedResults, CheckNotSupported: true } ) ) {
                                            // wait, allowing the UA Server to poll the item so we can call Publish() on it
                                            PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
                                            // call Publish(), no dataChanges expected
                                            PublishHelper.Execute();
                                            Assert.False( PublishHelper.CurrentlyContainsData(), "No dataChanges expected because the values we just wrote were no different to those we just read!" );
                                        }// write

                                        // clean-up; put the original value and quality back
                                        item.Value.StatusCode = initialValueQuality;
                                        WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectedResults, CheckNotSupported: true } );
                                    }// publish #3
                                } // write not supported
                            }// write new statuscode
                        }// currentlyContainsData?
                    }// publish #2
                }//not bad_writeNotSupported
            }// write #1
        }// publish #1
            
        // clean-up
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: subscription } );
    }// createMonitoredItems
    else {
        if( createMonItemsResp.Results[0].StatusCode.StatusCode === StatusCode.BadMonitoredItemFilterUnsupported ) {
            addError( "CreateMonitoredItems() failed with error Bad_MonitoredItemFilterUnsupported. The behavior specified in the filter is NORMAL behavior for a subscription, therefore this filter should not be rejected even though the server might not support filters." );
        }
    }
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591061 } );