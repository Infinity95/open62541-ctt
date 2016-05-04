/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create one monitored item with Filter = DataChangeFilter( deadbandType = None, trigger = Status ).
        call Publish(). Write a value to the Value attribute. call Publish(). Write a status code to the
        Value attribute (don�t change the value of the Value attribute). call Publish(). Write the existing
        status code to the Value attribute. call Publish().
    Expected results: All service and operation level results are Good. The second Publish contains is empty.
        The third Publish contains a DataChangeNotification with a value.statusCode matching the written
        value (and value.value matching the value before the write). The fourth Publish contains
        no DataChangeNotifications. */

function createMonitoredItems591062() {
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( item == null ) { addError( "Test aborted. No item available for testing." ); return( false ); }
    
    // create a subscription
    var subscription = MonitorBasicSubscription;

    // specify our deadband filter
    item.Filter = Event.GetDataChangeFilter( DeadbandType.None, 0, DataChangeTrigger.Status );

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
            // call Publish() (FIRST)
            if( PublishHelper.Execute( { FirstPublish: true } ) && Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange notification for the initial value(s)" ) ) {
                // get the current Value and then set a new value
                PublishHelper.SetItemValuesFromDataChange( [item] );
                var initialValueAsRead  = UaVariantToSimpleType( item.Value.Value );
                print( "\tPublish #1 received a value of: " + initialValueAsRead );
                
                var maxValue = getMaxValueDataType(item.Value.Value.DataType);
                var initialValueOverride;
                
                if( initialValueAsRead < maxValue ) initialValueOverride = ( initialValueAsRead + 1 );
                else initialValueOverride = ( initialValueAsRead - 1 );
                
                // set a new Value and then write it (WRITE #1)
                item.SafelySetValueTypeKnown( initialValueOverride, item.Value.Value.DataType );
                print( "\tWRITE #1 - NEW VALUE." );
                // define our expected results
                var expectedResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];
                expectedResults[0].addExpectedResult( StatusCode.BadWriteNotSupported );
                if( WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectedResults, CheckNotSupported: true } ) ) {
                    // if we received a Bad_NotSupported then don't proceed
                    if( WriteHelper.Response.Results[0].StatusCode !== StatusCode.BadWriteNotSupported ) {
                        // wait, allowing the UA Server to poll the item so we can call Publish() on it
                        PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
                        // call Publish() again, do we get the new dataChange? (PUBLISH #2)
                        if( PublishHelper.Execute() ) {
                            if( Assert.False( PublishHelper.CurrentlyContainsData(), "NOT expected a dataChange because the DataChangeTrigger is set to STATUS!" ) ) {
                                // write a new quality code, we'll toggle from Good <> Bad
                                var initialStatusCodeAsRead = item.Value.StatusCode.StatusCode;
                                var statusCodeOverride = initialStatusCodeAsRead == StatusCode.Good? StatusCode.GoodClamped: StatusCode.Good;
                                // write the new quality code to the server (WRITE #2)
                                item.Value.StatusCode.StatusCode = statusCodeOverride;
                                item.Value.Set = "Value, StatusCode";
                                print( "\tWRITE #2 - NEW STATUSCODE" );
                                if( WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectedResults, CheckNotSupported: true } ) ) {
                                    if( WriteHelper.Response.Results[0].StatusCode !== StatusCode.BadWriteNotSupported ) {
                                        // wait, allowing the UA Server to poll the item so we can call Publish() on it
                                        PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
                                        // call Publish() again, do we get the new dataChange? (PUBLISH #3)
                                        if( PublishHelper.Execute()  && Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange notification because we changed the quality code!" ) ) {
                                            PublishHelper.SetItemValuesFromDataChange( [item] );
                                            Assert.Equal( statusCodeOverride, item.Value.StatusCode.StatusCode, "Expected the received statusCode to match the one we just wrote." );
                                            Assert.True( initialValueOverride == item.Value.Value, "Expected the item in the dataChange to contain the same value as was first read because we haven't changed the Value yet." );
                                            // last test, write the unchanged data!
                                            print( "\tWRITE #3 - EXISTING VALUE AND STATUSCODE" );
                                            if( WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectedResults, CheckNotSupported: true } ) ) {
                                                // wait, allowing the UA Server to poll the item so we can call Publish() on it
                                                PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
                                                // call Publish(), no dataChanges expected (PUBLISH #4)
                                                PublishHelper.Execute();
                                                Assert.False( PublishHelper.CurrentlyContainsData(), "No dataChanges expected because the values we just wrote were no different to those we just read!" );
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

Test.Execute( { Procedure: createMonitoredItems591062 } );