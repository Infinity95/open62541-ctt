/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org 
    Description: written is to the first element of the array. Write a value of += 11 and then call Publish() (#2).
                 Write a value += 5 and then call Publish() (#3). Write a value of -= 11 and then call Publish() (#4).
                 Write the same value again and then call Publish() (#5).
        Expectations: The createMonitoredItem is successful as are all status codes. All writes in this test are successful.
                      All data changes in received contain the entire array. Publish #1 yields the initial dataChange.
                      Publish #2 yields the dataChange; the data matches the value written. Publish #3 is a keep-alive.
                      Publish #4 yields the dataChange; the data matches the value written. Publish #5 is a keep-alive. */

Test.Execute( { Procedure: function test() {
    // get the Nodes to test with.. each node is of Type Array (defined in the Settings )
    var arrayItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.NumericSettings );
    if( arrayItems.length === 0 ) {
        addSkipped( SETTING_UNDEFINED_SCALARARRAYS );
        return( false );
    }

    // read the items first, because we will modify their values and write them back
    if( !ReadHelper.Execute( { NodesToRead: arrayItems, TimestampsToReturn: TimestampsToReturn.Both, SuppressMessaging: true } ) ) {
        return( false );
    }

    // define the deadbandAbs of 10
    var filter = Event.GetDataChangeFilter( DeadbandType.Absolute, 10, DataChangeTrigger.StatusValue );
    for( var i=0; i<arrayItems.length; i++ ) {
        arrayItems[i].Filter = filter;
    }//for i

    // create the monitored items
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: arrayItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription, SuppressMessaging: true } ) ) {
        do {
            PublishHelper.WaitInterval( { Items: arrayItems, Subscription: MonitorBasicSubscription } );
            PublishHelper.Execute( { FirstPublish: true } );

            // Expectation #1: dataChange value received?
            Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive initial values in our first Publish call." );
            
            // update our item objects with the values received in the publish
            PublishHelper.SetItemValuesFromDataChange( arrayItems, "vqstdt" );

            // allow for each write to fail with Bad_WriteNotSupported
            var expectedResults = [];
            // modify the first value of each array, just increment the value 
            addLog( "Writes #1 (of 4) - Increment element[0] by 11 (items: " + arrayItems.length + ")" );
            for( i=0; i<arrayItems.length; i++ ) {
                IncrementUaVariantArray( arrayItems[i].Value.Value, 0, 1, 11 );
                expectedResults[i] = new ExpectedAndAcceptedResults( StatusCode.Good );
                expectedResults[i].addExpectedResult( StatusCode.BadWriteNotSupported );
            }
            if( !WriteHelper.Execute( { NodesToWrite: arrayItems, OperationResults: expectedResults, SuppressMessaging: true, ReadVerification: false } ) ) {
                // if the write did fail then exit gracefully
                for( var r=0; r<WriteHelper.Response.Results.length; r++ ) {
                    if( WriteHelper.Response.Results[r] == StatusCode.BadWriteNotSupported ) {
                        addNotSupported( "Writing to Arrays." );
                    }
                }
                break;
            }

// Publish #2 - we expect a dataChange with our new values 
            PublishHelper.WaitInterval( { Items: arrayItems, Subscription: MonitorBasicSubscription } );
            PublishHelper.Execute();
            if( !Assert.True( PublishHelper.CurrentlyContainsData(), "Expected a dataChange containing the new values just written." ) )break;
            Assert.Equal( arrayItems.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive the same number of items in Publish as previously written." );

// Publish #3 - write values to be filtered by deadband
            addLog( "Writes #2 (of 4) - increment element[0] by 5 (items: " + arrayItems.length + ")" );
            for( i=0; i<arrayItems.length; i++ ) IncrementUaVariantArray( arrayItems[i].Value.Value, 0, 1, 5 );
            WriteHelper.Execute( { NodesToWrite: arrayItems, OperationResults: expectedResults, SuppressMessaging: true, ReadVerification: false } );
            PublishHelper.WaitInterval( { Items: arrayItems, Subscription: MonitorBasicSubscription } );
            PublishHelper.Execute();
            Assert.False( PublishHelper.CurrentlyContainsData(), "Did NOT expect a dataChange because values previously written should NOT have passed the deadband filter." );

// Publish #4 - write values of -11 to each array
            addLog( "Writes #3 (of 4) - decrement element[0] by 11 (items: " + arrayItems.length + ")" );
            for( i=0; i<arrayItems.length; i++ ) IncrementUaVariantArray( arrayItems[i].Value.Value, 0, 1, -16 ); // -16 because 10 + (5 previously added)
            WriteHelper.Execute( { NodesToWrite: arrayItems, OperationResults: expectedResults, SuppressMessaging: true, ReadVerification: false } );
            PublishHelper.WaitInterval( { Items: arrayItems, Subscription: MonitorBasicSubscription } );
            PublishHelper.Execute();
            !Assert.True( PublishHelper.CurrentlyContainsData(), "Expected a dataChange containing the new values just written." );
            Assert.Equal( arrayItems.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive the same number of items in Publish as previously written." );

// Publish #5 - write same values as previously written
            addLog( "Writes #4 (of 4) - element[0] unchanged values (items: " + arrayItems.length + ")");
            if( !WriteHelper.Execute( { NodesToWrite: arrayItems, OperationResults: expectedResults, SuppressMessaging: true, ReadVerification: false } ) )break;
            PublishHelper.WaitInterval( { Items: arrayItems, Subscription: MonitorBasicSubscription } );
            PublishHelper.Execute();
            Assert.False( PublishHelper.CurrentlyContainsData(), "Did NOT expect a dataChange because values previously written were unchanged (save values as before)." );
        }
        while( false );// do not loop, we want this so we can exit the routine easily
    }
    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: arrayItems, SubscriptionId: MonitorBasicSubscription, SuppressMessaging: true } );
    PublishHelper.Clear();
    return( true );
} } );