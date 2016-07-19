/*  Test prepared by Nathan Pocock nathan.pocock@opcfoundation.org
    Description:
        Create multiple MonitoredItems where each node is of /derives from type
        MultiStateDiscrete (DA Profile).
        In a loop: write a value to each Node, call Publish() and compare the
        value received to the value written.
    Expectations:
        All service and operation level results are Good.
        The values received in Publish() match the values written, and the
        quality is Good with a valid timestamp.
*/

function subscription65005() {
    // We need multiple MultiStateDiscrete items for this tets. Clone the Item if the server does not support mltiple MultiStateDiscrete items
    if( multiStateItems.length < 5 ){
        var Items =[];
        for( var a=0; a<5; a++ ) {
            Items.push( MonitoredItem.Clone( multiStateItems[0] ) );
        }
    } 
    else Items = multiStateItems;
    
    // create the subscription
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) {       
        //create the monitored item within the subscription
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: Items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) {
            // wait and get the initial publish out of the way...
            PublishHelper.WaitInterval( { Items: Items, Subscription: subscription } );
            PublishHelper.Execute( { FirstPublish: true } );
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive the initial values for all monitored items." ) ) {
                PublishHelper.SetItemValuesFromDataChange( Items, "v" );
                for( var i=0; i<5; i++ ) {
                    // set the new values
                    for( var m=0; m<PublishHelper.CurrentDataChanges[0].MonitoredItems.length; m++ ) {
                        // search the item with the matching ClientHandle
                        for( j=0; j<Items.length; j++ ) {
                            if( PublishHelper.CurrentDataChanges[0].MonitoredItems[m].ClientHandle == Items[j].ClientHandle ) {
                                var initialValue = UaVariantToSimpleType( PublishHelper.CurrentDataChanges[0].MonitoredItems[m].Value.Value );
                                var newValue = initialValue === 0? 1: 0;
                                addLog( "Setting initial value for Node '" + Items[j].NodeSetting +
                                    "' to value: '" + newValue + "'; the initial reading was: '" + initialValue + "'" );
                                Items[j].SafelySetValueTypeKnown( newValue, Items[j].Value.Value.DataType );
                                Items[j].InitialState = initialValue;
                            }
                        }
                    }

                    if( WriteHelper.Execute( { NodesToWrite: Items } ) ) {
                        // wait
                        PublishHelper.WaitInterval( { Items: Items, Subscription: subscription } );
                        // publish
                        if( PublishHelper.Execute() ) {
                            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive DataChange notifications. Since we changed the state of the MultiStateDiscrete type items." ) ) {
                                // we expect to receive the same value we wrote
                                for( var r=0; r<PublishHelper.CurrentDataChanges[0].MonitoredItems.length; r++ ) {
                                    // we expect a data change
                                    Assert.True( PublishHelper.CurrentlyContainsData(), "Expected a DataChange!" );
                                    // we expect the data-type to be a UInteger (according to UA Spec part 8: Table 5.
                                    Assert.True( IsUInteger( { Value: Items[i].Value.Value } ), "Data Type of .Value attribute should be UInteger, but is: " + BuiltInType.toString( Items[i].Value.Value.DataType ) );
                                    var writeVal =  Items[r].Value.Value.toUInt32();
                                    var readVal;
                                    // Find the item with matching ClientHandle
                                    for( var j=0; j<PublishHelper.CurrentDataChanges[0].MonitoredItems.length; j++ ) {
                                        if( PublishHelper.CurrentDataChanges[0].MonitoredItems[j].ClientHandle == Items[r].ClientHandle ) {
                                            readVal = PublishHelper.CurrentDataChanges[0].MonitoredItems[j].Value.Value.toUInt32();
                                            break;
                                        }
                                    }
                                    Assert.Equal( writeVal, readVal, "Expected to receive the same value we previously wrote!" ); 
                                }// for r...
                            }// currently contains data
                        }// publish
                    }// write
                }
                // put the enum values back to their original state
                addLog( "Putting EnumValues back to their original states..." );
                for( var i=0; i<Items.length; i++ ) {
                    Items[i].SafelySetValueTypeKnown( Items[i].InitialState, Items[i].Value.Value.DataType );
                }
                WriteHelper.Execute( { NodesToWrite: Items } );
            }//initial value received
        }// createmonitoreditems
    }// createsubscription
    // clean-up
    DeleteMonitoredItemsHelper.Execute( { 
		ItemsToDelete: Items, 
		SubscriptionId: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    PublishHelper.Clear();
    return( true );
}// function subscription65005()

Test.Execute( { Procedure: subscription65005 } );