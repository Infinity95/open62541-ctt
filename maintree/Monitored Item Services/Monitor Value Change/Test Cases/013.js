/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specify an item of type array. Do this for all supported data types: 
            a. Bool         b. Byte         c. SByte        d. ByteString
            e.              f. DateTime     g.              h. Double
            i. Float        j. Guid         k. Int16        l. UInt16
            m. Int32        n. UInt32       o. Int64        p. UInt64
            q. String       r. XmlElement
        Create a subscription and call Publish(). Verify that all data coming back is of type Array. */

function createMonitoredItems591023() {
    PublishHelper.Clear();

    // get the Nodes to test with.. each node is of Type Array (defined in the Settings )
    var monitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings );
    if( monitoredItems.length === 0 ) { addSkipped( SETTING_UNDEFINED_SCALARARRAYS ); return( false ); }

    // create the monitored items
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: monitoredItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
        // wait one publishing cycle before calling publish
        PublishHelper.WaitInterval( { Items: monitoredItems, Subscription: MonitorBasicSubscription } );
        // call Publish(), and make sure we receive data for all MonitoredItems, and that each dataset received is of type array.
        PublishHelper.Execute( { FirstPublish: true } );
        // is dataChange value received of type array?
        if( PublishHelper.CurrentlyContainsData ) {
            for( var d=0; d<PublishHelper.CurrentDataChanges.length; d++ ) { // 'd' for DataChange 
                for( var m=0; m<PublishHelper.CurrentDataChanges[d].MonitoredItems.length; m++ ) { // 'm' for MonitoredItem
                    if( Assert.StatusCodeIs( StatusCode.Good, PublishHelper.CurrentDataChanges[d].MonitoredItems[m].Value.StatusCode, "Expected only GOOD quality data but got" ) ) {
                        // is the value an array?
                        if( PublishHelper.CurrentDataChanges[d].MonitoredItems[m].Value.Value.getArraySize() === -1 ) {
                            var currentType = PublishHelper.CurrentDataChanges[d].MonitoredItems[m].Value.Value.DataType;
                            switch( currentType ) {
                                case BuiltInType.ByteString: break;
                                case BuiltInType.String:     break;
                                default:
                                    addError( "Type: " + BuiltInType.toString( currentType ) + "; Non array value received: " + p.CurrentDataChanges[d].MonitoredItems[m].Value.toString() );
                                    break;
                            }
                        }
                    }// if good quality
                }// for m...
            }//for d...
        }//if( p.CurrentlyContainsData )
        else addError( "No data received in callback, we expected data!" );
    }
    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItems, SubscriptionId: MonitorBasicSubscription } );
    revertOriginalValuesScalarStatic();
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591023 } );