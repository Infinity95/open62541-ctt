/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create one monitored item. call Publish(). Write a status code to the Value  attribute (don�t change the value of the Value attribute). call Publish().
        Write the existing value and status code to the Value attribute. call Publish().
    Expected results: All service and operation level results are Good. The second Publish contains a DataChangeNotification with a value.statusCode matching 
        the written value (and value.value matching the value before the write). The third Publish contains no DataChangeNotifications. */

function createMonitoredItems591060() {
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( item == null ) { addError( "Test aborted. No item available for testing." ); return( false ); }

    // create a subscription
    var subscription = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        addError( "Unable to conduct this test because createSubscription failed." );
        return( false );
    }

    // define our expected results
    var expectedResults = [ new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadWriteNotSupported ] ) ];
    // create the monitoredItem and add it to our existing subscription (initialize script)
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) {
        // wait, allowing the UA Server to poll the item so we can call Publish() on it
        PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
        // call Publish()
        if( PublishHelper.Execute( { FirstPublish: true } ) ) {
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected an initial dataChange for the monitoredItem" ) ) {
                // get the current Value into our item and then store the quality
                // code, but the quality will toggle from GOOD to GoodCLAMPED.
                PublishHelper.SetItemValuesFromDataChange( [item] );
                var initialValueAsRead  = item.Value.Value;
                var statusCodeToOverride = item.Value.StatusCode.StatusCode;
                if( statusCodeToOverride == StatusCode.Good ) statusCodeToOverride = StatusCode.GoodClamped;
                else statusCodeToOverride = StatusCode.Good;
                // now to write a StatusCode only to the item's value
                addLog( "Publish call received StatusCode '" + item.Value.StatusCode + "', will override to '" + statusCodeToOverride + "'" );
                item.Value.StatusCode.StatusCode = statusCodeToOverride;
                if( item.Value.Value.isEmpty() ) {
                    addSkipped( "Initial value is null; cannot write only quality" );
                    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: subscription } );
                    PublishHelper.Clear();
                    return( false );
                }
                item.Value.Set = "Value,StatusCode";
                if( !WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectedResults, ReadVerification: false, SuppressMessaging: true, CheckNotSupported: true } ) ) {
                    addError( "Write(): status " + WriteHelper.UaStatus, WriteHelper.UaStatus );
                }
                else {
                    // if we received a Bad_NotSupported then don't proceed
                    if( WriteHelper.Response.Results[0].StatusCode !== StatusCode.BadWriteNotSupported ) {
                        // wait, allowing the UA Server to poll the item so we can call Publish() on it
                        PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
                        // call Publish() again, do we get the new dataChange?
                        if( PublishHelper.Execute() ) {
                            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected a dataChange when we overrode the StatusCode." ) ) {
                                PublishHelper.SetItemValuesFromDataChange( [item] );
                                // new value contain the same statusCode as just written?
                                Assert.Equal( StatusCode.toString( statusCodeToOverride ), StatusCode.toString( item.Value.StatusCode ), "Expected the item in the dataChange to contain the same StatusCode as was previously written." );
                                Assert.CoercedEqual( initialValueAsRead, item.Value.Value, "Expected the item in the dataChange to contain the same value as was first read. Expected: " + initialValueAsRead + "; but received: " + item.Value.Value + "." );
                                // last test, write back the current Value and StatusCode
                                item.Value.Value = initialValueAsRead;
                                item.Value.StatusCode.StatusCode = statusCodeToOverride;
                                if( WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectedResults, CheckNotSupported: true } ) ) {
                                    // wait, allowing the UA Server to poll the item so we can call Publish() on it
                                    PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
                                    // call Publish() to get the readings. We expect no change!
                                    if( PublishHelper.Execute() ) {
                                        Assert.False( PublishHelper.CurrentlyContainsData(), "Did not expect a dataChange since the values written were the same, i.e. unchanged." );
                                    }
                                }
                                else addError( "Write(): status " + WriteHelper.UaStatus, WriteHelper.UaStatus );
                            }// currentlyContainsData?
                        }// publish
                    }
                }//write..else
            }
        }// publish #1
    }// createMonitoredItems

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591060 } );