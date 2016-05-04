/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Specify an item of type array. Do this for all configured supported data types.
        Specify an IndexRange that equates to the last 3 elements of the array.
        Write values to each data-type within the index range specified and then 
        call Publish(). We expect to receive data in the Publish response.
        Write to each data-type outside of the index range (e.g. elements 0 and 1) and then call Publish().
        We do not expect to receive data in the Publish response. */

function createMonitoredItems591025() {
    const NUM_LAST_ELEMENTS = 3;

    // get the Nodes to test with.. each node is of Type Array (defined in the Settings )
    var readItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings, 0, Attribute.Value, "", MonitoringMode.Reporting, true, undefined, 10, undefined, TimestampsToReturn.Both );
    if( readItems.length === 0 ) {
        addSkipped( SETTING_UNDEFINED_SCALARARRAYS );
        return( false );
    }

    var monitoredItems = [];
    var m;

    // before we create monitoredItems etc. lets do a read of the nodes so that we can 
    // get their array bounds. We can populate the arrays if necessary.
    if( ReadHelper.Execute( { NodesToRead: readItems } ) ) {
        print( "\n\nAbout to populate arrays, where necessary." );
        // populate the arrays (if necessary)
        for( m=0; m<readItems.length; m++ ) {
            if( readItems[m].ArrayUpperBound <= NUM_LAST_ELEMENTS ) {
                SetArrayWriteValuesInMonitoredItems( [ readItems[m] ], NUM_LAST_ELEMENTS + 2 );
                WriteHelper.Execute( { NodesToWrite: [ readItems[m] ] } );
            }
        }// for m...
    }

    // before we create monitoredItems etc. lets do a read of the nodes so that we can 
    // get their array bounds. If the arrays are not too short, we'll fail the test
    // (since the data type should be testable, but something isn't working).
    if( ReadHelper.Execute( { NodesToRead: readItems } ) ) {
        // now to look at our results, we'll throw out any NON-array types and will then
        // reconfigure the monitoredItems IndexRange property to equate to the 'last 3
        // elements'.
        for( m=0; m<readItems.length; m++ ) {
            // an array? and big enough if so? if good then add to monitoredItems
            // while also changing the indexRange.
            if( readItems[m].ArrayUpperBound > NUM_LAST_ELEMENTS ) {
                readItems[m].IndexRange = "" + (readItems[m].ArrayUpperBound - NUM_LAST_ELEMENTS) + ":" + (readItems[m].ArrayUpperBound - 1) + "";
                monitoredItems.push( readItems[m] );
                print( "added mi: " + readItems[m].NodeId + "; MaxBound: " + readItems[m].ArrayUpperBound + "; with indexRange: " + readItems[m].IndexRange );
            }
            else {
                // is this a ByteString)?
                var detectedType = readItems[m].DataType;
                var detectedLength = readItems[m].Value.Value.toByteString().length;
                print( "\n\n\n\tType is: " + BuiltInType.toString( detectedType ) + "; length: " + detectedLength + "\n\n" );
                if( detectedType === BuiltInType.ByteString && ( detectedLength > NUM_LAST_ELEMENTS ) ) {
                    monitoredItems.push( readItems[m] );
                    print( "added mi: " + readItems[m].NodeId + "; MaxBound: " + readItems[m].ArrayUpperBound + "; with indexRange: " + readItems[m].IndexRange );
                }
                else {
                    addError( "Item '" + readItems[m].NodeId + "' (setting: '" + readItems[m].NodeSetting + "') DOES NOT contain at least " + ( NUM_LAST_ELEMENTS + 1 ) + " elements, but instead has: " + readItems[m].ArrayUpperBound );
                    // remove this item from the collection
                    readItems.splice( m, 1 );
                }
            }
        }// for m...


        //~~~~~~~~~~~~ NOW TO SUBSCRIBE, WRITE AND VERIFY ~~~~~~~~~~~~~~~~~~~~~

        // create the monitored items
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: monitoredItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
            // wait one publishing cycle before calling publish
            PublishHelper.WaitInterval( { Items: monitoredItems, Subscription: MonitorBasicSubscription } );

            // call Publish(), and make sure we receive data for all MonitoredItems, and that each 
            // dataset received is of type array.
            if( PublishHelper.Execute( { FirstPublish: true } ) ) {
                // is dataChange value received of type array?
                if( PublishHelper.CurrentlyContainsData() ) {
                    // Now, WRITE to the items in range
                    // first, lets' create set some values within the MonitoredItems 
                    SetArrayWriteValuesInMonitoredItems( monitoredItems, 3 );

                    var expectedResults = [];
                    for( var e=0; e<monitoredItems.length; e++ ) expectedResults[e] = new ExpectedAndAcceptedResults( StatusCode.Good );
                    if( WriteHelper.Execute( { NodesToWrite: monitoredItems, OperationResults: expectedResults, CheckNotSupported: true } ) ) {
                        // check if the writesAreNotSupported, if the first one fails then its highly
                        // likely that the rest did too.
                        if( WriteHelper.Response.Results[0].StatusCode !== StatusCode.BadWriteNotSupported ) {
                            // wait one publishing cycle before calling publish
                            PublishHelper.WaitInterval( { Items: monitoredItems, Subscription: MonitorBasicSubscription } );
                            // call Publish()(), we do expect data changes!
                            PublishHelper.Execute();
                            Assert.True( PublishHelper.CurrentlyContainsData(), "We expected a DataChange within the Publish response." );
                            // Now, WRITE to the items out of range
                            for( m=0; m<monitoredItems.length; m++ ) {
                                monitoredItems[m].OriginalIndexRange = monitoredItems[m].IndexRange;
                                monitoredItems[m].IndexRange = "0:1";
                            }// for m...
                            SetArrayWriteValuesInMonitoredItems( monitoredItems, 2 );
                            if( WriteHelper.Execute( { NodesToWrite: monitoredItems } ) ) {
                                // wait one publishing cycle before calling publish
                                PublishHelper.WaitInterval( { Items: monitoredItems, Subscription: MonitorBasicSubscription } );
                                // call Publish()(), we do NOT expect any data changes!
                                PublishHelper.Execute();
                                if( Assert.False( PublishHelper.CurrentlyContainsData(), "We expected NO DataChange within the Publish response. For example, CreateMonitoredItems item #1 setup with IndexRange: " + monitoredItems[0].OriginalIndexRange + "; but we just wrote to IndexRange: " + monitoredItems[0].IndexRange ) ) {
                                    addLog( "Publish Received: " + PublishHelper.PrintDataChanges() );
                                }
                            }
                        }
                        else addNotSupported( "Write IndexRange" );
                    }//if write
                }//if( p.CurrentlyContainsData )
                else addError( "No data received in callback, we expected data!" );

            }// if( p.InvokePublish( Test.Session.Session ) )
            // clean-up
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItems, SubscriptionId: MonitorBasicSubscription } );
        }
    }//if( reader.Read() )
    revertOriginalValuesScalarStatic();
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591025 } );