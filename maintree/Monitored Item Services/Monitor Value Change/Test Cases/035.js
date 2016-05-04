/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Create one monitored item with Filter = DataChangeFilter( deadbandType = None,
        trigger = StatusValueTimestamp ). call Publish(). Write a value to the Value attribute.
        call Publish(). Write a status code to the Value attribute (don�t change the value of the
        Value attribute). call Publish(). Write the existing value and status code to the Value
        attribute. call Publish().
    Expected results:
        All service and operation level results are Good. The second Publish contains a
        DataChangeNotification with a value.value matching the written value. The third Publish
        contains a DataChangeNotification with a value.statusCode matching the written value 
        (and value.value matching the value before the write). The fourth Publish is empty. */

function createMonitoredItems591063() {
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( item == null ) { addError( "Test aborted. No item available for testing." ); return( false ); }

    // create a subscription
    var subscription = MonitorBasicSubscription;
    
    // specify our filter
    item.Filter = Event.GetDataChangeFilter( DeadbandType.None, 0, DataChangeTrigger.StatusValueTimestamp );

    // if the server doesn't support filters then permit it to return Bad_MonitoredItemFilterNotSupported.
    var expectedResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];
    expectedResults[0].addExpectedResult( StatusCode.BadMonitoredItemFilterUnsupported );

    // create the monitoredItem and add it to our existing subscription (initialize script)
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription, OperationResults: expectedResults } ) ) {
        // did we get BadMonitoredItemFilterUnsupported?
        if( createMonItemsResp.Results[0].StatusCode.StatusCode === StatusCode.BadMonitoredItemFilterUnsupported ) addNotSupported( "DataChangeEventFilter" );
        else {
            // wait, allowing the UA Server to poll the item so we can call Publish() on it
            PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
            // call Publish() #1
            if( PublishHelper.Execute( { FirstPublish: true } ) && Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange notification for the initial value(s)" ) ) {
                // get the current Value and then set a new value
                PublishHelper.SetItemValuesFromDataChange( [item] );
                var initialQuality       = item.Value.StatusCode.StatusCode;
                var initialValueAsRead   = UaVariantToSimpleType( item.Value.Value );
                
                var maxValue = getMaxValueDataType(item.Value.Value.DataType);
                var initialValueOverride;
                
                if( initialValueAsRead < maxValue ) initialValueOverride = ( initialValueAsRead + 1 );
                else initialValueOverride = ( initialValueAsRead - 1 );
                
                // define our expected results
                expectedResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];
                expectedResults[0].addExpectedResult( StatusCode.BadWriteNotSupported );

                // set a new Value and then write it (WRITE #1)
                item.SafelySetValueTypeKnown( initialValueOverride, item.Value.Value.DataType );
                print( "\n\nWRITE #1 - new Value" );
                if( !WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectedResults, CheckNotSupported: true } ) ) addError( "Write(): status " + WriteHelper.UaStatus, WriteHelper.UaStatus );
                else {
                    // if we received a Bad_NotSupported then don't proceed
                    if( WriteHelper.Response.Results[0].StatusCode !== StatusCode.BadWriteNotSupported ) {
                        // wait, allowing the UA Server to poll the item so we can call Publish() on it
                        PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
                        // call Publish() #2
                        print( "\n\nPUBLISH #2 - Expecting dataChange containing last value written." );
                        if( PublishHelper.Execute() ) {
                            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected a dataChange because the node is configured to notify upon any kind of change (value, quality, timestamps)!" ) ) {
                                //check the quality and value just written, match those just received
                                Assert.Equal( initialQuality, item.Value.StatusCode.StatusCode, "Expected the StatusCode to remain unchanged." );
                                if( Assert.CoercedEqual( initialValueOverride, item.Value.Value, "Expected the same value to be received as just written." ) ) addLog( "Publish received the value previously written (we changed the Value only)." );
                                // write a new quality code, we'll toggle from Good <> Bad
                                var initialStatusCodeAsRead = item.Value.StatusCode.StatusCode;
                                var statusCodeOverride = initialStatusCodeAsRead;
                                if( statusCodeOverride == StatusCode.Good ) statusCodeOverride = StatusCode.GoodClamped;
                                else statusCodeOverride = StatusCode.Good;
                                // write the new quality code to the server (WRITE #2)
                                item.Value.StatusCode.StatusCode = statusCodeOverride;
                                item.Value.Set = "Value, StatusCode";
                                print( "\n\nWRITE #2 - New StatusCode, but same Value." );
                                if( WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectedResults, CheckNotSupported: true } ) ) {
                                    if( WriteHelper.Response.Results[0].StatusCode !== StatusCode.BadWriteNotSupported ) {
                                        // wait, allowing the UA Server to poll the item so we can call Publish() on it
                                        PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
                                        // call Publish() #3 again, do we get the new dataChange?
                                        print( "\n\nPUBLISH #3 - Expecting dataChange with new StatusCode" );
                                        if( PublishHelper.Execute()  && Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange notification because the quality code changed!" ) ) {
                                            PublishHelper.SetItemValuesFromDataChange( [item] );
                                            if( Assert.Equal( statusCodeOverride, item.Value.StatusCode.StatusCode, "Expected the received statusCode to match the one we just wrote." ) ) addLog( "Publish received the same StatusCode as previously written." );
                                            if( Assert.CoercedEqual( initialValueOverride, item.Value.Value, "Expected the item in the dataChange to contain the same value as was first read because we haven't changed the Value yet." ) ) addLog( "Publish received the same Value as previously written." );
                                            // store the SourceTimestamp - we will check it at the last Publish...
                                            var lastSourceTimestamp = item.Value.SourceTimestamp.clone();
                                            // last test, write the unchanged data!
                                            print( "\n\nWRITE #3 - Unchanged Data" );
                                            if( WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectedResults, CheckNotSupported: true } ) ) {
                                                // wait, allowing the UA Server to poll the item so we can call Publish() on it
                                                PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
                                                // call Publish() #4, dataChanges ARE expected
                                                print( "\n\nPUBLISH #4 - We MIGHT see a DataChange although the Value and StatusCode did not change!" );
                                                PublishHelper.Execute();
                                                PublishHelper.SetItemValuesFromDataChange( [item] );
                                                // WE MIGHT GET A DATACHANGE HERE!
                                                if( PublishHelper.CurrentlyContainsData() ) {
                                                    addLog( "Received a DataChange. The device MUST support timestamps! Comparing the timestamp received now '" + item.Value.SourceTimestamp + "' with the timestamp received previously '" + lastSourceTimestamp + "'." );
                                                    Assert.NotEqual( lastSourceTimestamp, item.Value.SourceTimestamp, "Expected an updated Source timestamp, although we previously wrote the same value and statuscode, the device was expected to receive these values and therefore update its timestamp." );
                                                }
                                                else addLog( "Did not receive a DataChange. The underlying device must NOT support timestamps. This is acceptable behavior. " );
                                            }// write
                                        }// publish #3
                                    }// write not supported
                                }// write new statuscode
                            }// currentlyContainsData?
                        }// publish #2
                    }
                }// write #1
            }// publish #1

            // clean-up
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: subscription } );
        }
        revertOriginalValuesScalarStatic();
    }// createMonitoredItems
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591063 } );