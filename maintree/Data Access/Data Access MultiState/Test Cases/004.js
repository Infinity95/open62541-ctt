/*  Test prepared by Nathan Pocock nathan.pocock@opcfoundation.org
    Description: Create a MonitoredItem where the node is of /derives from type MultiStateDiscrete (DA Profile).
        In a loop: write a value to the Node, call Publish()() and compare the value received to the value written.
    Expectations:
        All service and operation level results are Good. The values received in Publish() match the values written, and the
        quality is Good with a valid timestamp. Any writes that exceed the bounds of the array are permitted to return `Bad_OutOfRange`. */

function subscription65004() {
    // get the enumStrings first
    var enumStrings = GetMultiStateDiscreteEnumStrings( multiStateItems[0].NodeSetting, Test.Session.Session, ReadHelper );
    if( enumStrings === undefined || enumStrings === null || enumStrings.length === 0 ) {
        addWarning( "Test aborted. MultiState item '" + multiStateItems[0].NodeSetting + "' does not have any EnumStrings defined." );
        return( false );
    }
    // now get the initial value of the enum so that we can revert it at the end
    ReadHelper.Execute( { NodesToRead: multiStateItems[0] } );
    multiStateItems[0].InitialValue = multiStateItems[0].Value.Value.clone();

    var NUM_WRITES = ( enumStrings.length * 2 );
    // create the subscription
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {
        //create the monitored item within the subscription
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: multiStateItems[0], TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) {
            // wait and get the initial publish out of the way...
            PublishHelper.WaitInterval( { Items: multiStateItems[0], Subscription: subscription } );
            PublishHelper.Execute( { FirstPublish: true } );
            // now to set the value to something different than what was just received (save initial value for later...)
            multiStateItems[0].InitialValue = multiStateItems[0].Value.Value.clone();
                // here's the loop, write a value; wait; publish; compare
                for( var i=0; i<NUM_WRITES; i++ ) {
                    // we expect the values to succeed while within the bounds of the enum
                    // but some servers may support writes that exceed the bounds!
                   var newValue = UaVariant.Increment( { Value: multiStateItems[0].Value } );
                   var expectedResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];
                   if( UaVariant.FromUaType( { Value: newValue } ) >= enumStrings.length ) expectedResults[0].addExpectedResult( StatusCode.BadOutOfRange );
                    // write
                    if( WriteHelper.Execute( { NodesToWrite: multiStateItems[0], OperationResults: expectedResults, ReadVerification: false } ) ) {
                        // we only expect data changes if the written value is not out of range
                        if( WriteHelper.Response.Results[0].StatusCode !== StatusCode.BadOutOfRange ) {
                            // wait
                            PublishHelper.WaitInterval( { Items: multiStateItems[0], Subscription: subscription } );
                            // publish
                            if( PublishHelper.Execute() ) {
                                // we expect a data change
                                Assert.True( PublishHelper.CurrentlyContainsData(), "Expected a DataChange!" );
                                // we expect 1 notification
                                Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected only 1 notification!" );
                                // we expect the data-type to be a UInteger (according to UA Spec part 8: Table 5
                                Assert.True( IsUInteger( { Value: PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.Value } ), "Nodes of this type should be UInteger (Byte, UInt16, UInt32, or UInt64) but is currently: " + BuiltInType.toString( PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.Value.DataType ) );
                                // we expect to receive the same value we wrote
                                var writeVal = UaVariantToSimpleType ( multiStateItems[0].Value.Value );
                                var readVal = UaVariantToSimpleType ( PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.Value );
                                Assert.Equal( writeVal, readVal, "Expected to receive the same value we previously wrote!" ); 
                            }// publish
                        }
                        else addLog( "Could not write value " + multiStateItems[0].Value.Value + " to item " + multiStateItems[0].NodeSetting + " (BadOutOfRange)" );
                    }// write
                    else {
                        addError( "Aborting test. Write failed!" );
                        break;
                    }
                }// for i...
                // now revert to the original value
                multiStateItems[0].Value.Value = multiStateItems[0].InitialValue; //multiStateItems[0].Value.Value = multiStateItems[0].InitialValue.clone();
                expectedResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];
                WriteHelper.Execute( { NodesToWrite: multiStateItems[0], ExpectedErrors: expectedResults, ExpectError: true } );
        }// createmonitoreditems
    }// createsubscription
    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: multiStateItems[0], SubscriptionId: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: subscription65004 } );