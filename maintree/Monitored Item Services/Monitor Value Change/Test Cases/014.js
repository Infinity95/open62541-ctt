/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specify an item of type array. Do this for all configured data types. Specify an IndexRange of "2:4".
        write values to each data-type within the index range specified and then call Publish(). Write to each data-type outside 
        of the index range (e.g. elements 0, 1 and 5) and then call Publish(). We do not expect to receive data in the Publish response. */

function createMonitoredItems591024() {
    // get the Nodes to test with.. each node is of Type Array (defined in the Settings )
    var monitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings );
    var items = [];
    var m;
    if( monitoredItems.length === 0 ) {
        addSkipped( SETTING_UNDEFINED_SCALARARRAYS );
        return( false );
    }

    // capture the initial values first
    ReadHelper.Execute( { NodesToRead: monitoredItems } );
    for( var i=0; i<monitoredItems.length; i++ ) {
        // check the array length and skip arrays that are less than 5 elements 
        var nativeValue = UaVariantToSimpleType( monitoredItems[i].Value.Value );
        if( nativeValue.length < 5 ) {
            addWarning( "Skipping Node '" + monitoredItems[i].NodeSetting + "' array length is too short." );
            continue;
        }
        else {
            monitoredItems[i].IndexRange = "2:4";
            items.push( monitoredItems[i] );
        }
    }

    // create the monitored items
    if( CreateMonitoredItemsHelper.Execute( { 
            ItemsToCreate: items, 
            TimestampsToReturn: TimestampsToReturn.Both, 
            SubscriptionId: MonitorBasicSubscription 
            } ) ) {
        // wait 1 publish cycle
        PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
        
        // call Publish(), and make sure we receive data for all MonitoredItems, and that each 
        // dataset received is of type array.
        if( PublishHelper.Execute( { FirstPublish: true } ) ) {
            // is dataChange value received of type array?
            if( PublishHelper.CurrentlyContainsData() ) {
                print( "\nThere are " + PublishHelper.CurrentDataChanges.length + " DataChanges in the Publish Helper." );
                var d;
                for( d=0; d<PublishHelper.CurrentDataChanges.length; d++ ) {
                    var currentDataChange = PublishHelper.CurrentDataChanges[d];
                    print( "There are " + currentDataChange.MonitoredItems.length + " MonitoredItems in the array." );
                    for( m=0; m<currentDataChange.MonitoredItems.length; m++ ) {
                        // is the value an array?
                        if( currentDataChange.MonitoredItems[m].Value.Value.getArraySize() === -1 ) {
                            var currentType = currentDataChange.MonitoredItems[m].Value.Value.DataType;
                            switch( currentType ) {
                                case BuiltInType.Byte:       break;
                                case BuiltInType.ByteString: break;
                                case BuiltInType.String:     break;
                                default:
                                    addError( "Type: " + BuiltInType.toString( currentType ) + "; Non array value received on item: " + currentDataChange.MonitoredItems[m].Value.toString() + 
                                        "; ClientHandle: " + currentDataChange.MonitoredItems[m].ClientHandle );
                                    break;
                            }
                        }
                    }// for m...
                }//for d...

                // using the publish() data, use it to populate our monitoredItems with their
                // data type.
                PublishHelper.SetMonitoredItemTypesFromDataChange( items );

                // allow for each write to fail with Bad_WriteNotSupported
                var expectedResults = [];
                for( var z=0; z<items.length; z++ ) {
                    expectedResults[z] = new ExpectedAndAcceptedResults( StatusCode.Good );
                    expectedResults[z].addExpectedResult( StatusCode.BadWriteNotSupported );
                }

                // set some initial values 
                SetArrayWriteValuesInMonitoredItems( items, 3, 24, true );
                if( WriteHelper.Execute( { 
                            NodesToWrite: items, 
                            OperationResults: expectedResults,
                            ReadVerification: false
                            } ) ) {
                    // Now, WRITE to the items
                    // first, lets' create set some values within the MonitoredItems 
                    SetArrayWriteValuesInMonitoredItems( items, 3, 24 );

                    WriteHelper.Execute( { NodesToWrite: items, OperationResults: expectedResults, ReadVerification: false } );
                    // we'll check the first result because if its bad, then the remainder will 
                    // likely be bad too...
                    if( WriteHelper.Response.Results[0].isGood() ) {
                        // wait 1 publish cycle
                        PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
                        // verify that a DataChangeNotification occurred after writing
                        // to the monitored indexes
                        PublishHelper.Execute();
                        Assert.True( PublishHelper.CurrentlyContainsData(), "We expected a DataChange within the Publish response (after writing to the monitored IndexRange)." );

                        // first, we are going to change the indexRange defined in our 
                        // monitoredItem objects to "0:1", and then populate the values 
                        // so that we can call write. This will write the values to a 
                        // different segment of the array, which SHOULD NOT be 
                        // received when we call Publish().
                        for( m=0; m<monitoredItems.length; m++ ) {
                            monitoredItems[m].IndexRange = "0:1";
                        }// for m...

                        // create some values to write
                        SetArrayWriteValuesInMonitoredItems( items, 2, 25 );

                        // write the values
                        if( WriteHelper.Execute( { 
                                    NodesToWrite: items,
                                    ReadVerification: false
                                    } ) ) {
                            // wait 1 publish cycle
                            PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
                            // second, now to call Publish(). We DO NOT expect to receive 
                            // any dataChange callbacks because the values written are 
                            // outside of the IndexRange specified.
                            PublishHelper.Execute();
                            Assert.False( PublishHelper.CurrentlyContainsData(), "We expected NO DataChange within the Publish response." );
                        }
                    }
                }//if write
            }//if( p.CurrentlyContainsData )
            else {
                addError( "No data received in callback, we expected data!" );
            }//else...if( p.CurrentlyContainsData )
        }
    }
    // clean-up
    DeleteMonitoredItemsHelper.Execute( { 
            ItemsToDelete: items, 
            SubscriptionId: MonitorBasicSubscription
            } );
    revertOriginalValuesScalarStatic();
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591024 } );