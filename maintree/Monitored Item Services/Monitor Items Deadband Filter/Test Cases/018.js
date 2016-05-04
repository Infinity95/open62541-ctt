/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
     Description: Monitor array items setting DeadbandAbsolute=10; QueueSize=1; IndexRange="" */

function CreateMonitoredItems018() {
    // get the Nodes to test with.. each node is of Type Array (defined in the Settings )
    var arrayItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.NumericSettings );
    if( arrayItems.length === 0 ) { 
        addSkipped( SETTING_UNDEFINED_SCALARARRAYS );
        return( false );
    }

    // read the items first, because we will modify their values and write them back
    if( !ReadHelper.Execute( { NodesToRead: arrayItems, TimestampsToReturn: TimestampsToReturn.Both } ) ) return( false );
    captureOriginalValues( arrayItems );

    // define the deadbandAbs of 10
    var filter = Event.GetDataChangeFilter( DeadbandType.Absolute, 10, DataChangeTrigger.StatusValue );
    for( i=0; i<arrayItems.length; i++ ) {
        arrayItems[i].Filter = filter;
        arrayItems[i].QueueSize = 1;
        arrayItems[i].IndexRange = "";
    }//for i

    // create the monitored items
    if( CreateMonitoredItemsHelper.Execute( { 
                ItemsToCreate: arrayItems, 
                TimestampsToReturn: TimestampsToReturn.Both, 
                SubscriptionId: MonitorBasicSubscription } ) ) { 
        do { 
            // wait 1 publish cycle and then call Publish()
            PublishHelper.WaitInterval( { Items: arrayItems, Subscription: MonitorBasicSubscription } );
            PublishHelper.Execute( { FirstPublish: true } );

            // Expectation #1: dataChange value received?
            if( !Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive initial values in our first Publish call." ) ) break;

            // update our item objects with the values received in the publish
            PublishHelper.SetItemValuesFromDataChange( arrayItems, "vqstdt" );


// TEST ONE - Increment the first element of ALL arrays by 11

            // allow for each write to fail with Bad_WriteNotSupported
            var expectedResults = [];
            // modify the first value of each array, just increment the value 
            addLog( "Writes #1 (of 4) - Increment [0] by 11" );
            for( var i=0; i<arrayItems.length; i++ )
            {
                IncrementUaVariantArray( arrayItems[i].Value.Value, 0, 1, 11 );
                addLog( arrayItems[i].NodeSetting + " values to write: " + arrayItems[i].Value.Value.toString() );
                expectedResults[i] = new ExpectedAndAcceptedResults( StatusCode.Good );
                expectedResults[i].addExpectedResult( StatusCode.BadWriteNotSupported );
            }
            if( !WriteHelper.Execute( { 
                        NodesToWrite: arrayItems, 
                        OperationResults: expectedResults } ) ) { 
                // if the write did fail then exit gracefully
                for( var r=0; r<WriteHelper.Response.Results.length; r++ ) {
                    if( WriteHelper.Response.Results[r] == StatusCode.BadWriteNotSupported ) {
                        addNotSupported( "Writing to Arrays." );
                    }
                }//for r...
                break;
            }//if write

            // Publish #2 - we expect a dataChange with our new values 
            PublishHelper.WaitInterval( { Items: arrayItems, Subscription: MonitorBasicSubscription } );
            PublishHelper.Execute();
            if( !Assert.True( PublishHelper.CurrentlyContainsData(), "Expected a dataChange containing the new values just written." ) )break;
            Assert.Equal( arrayItems.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive the same number of items in Publish as previously written." );



// TEST TWO - Increment the first element of ALL arrays by 5

            addLog( "Writes #2 (of 4) - increment [0] by 5" );
            for( i=0; i<arrayItems.length; i++ )  {
                IncrementUaVariantArray( arrayItems[i].Value.Value, 0, 1, 5 );
                addLog( arrayItems[i].NodeSetting + " values to write: " + arrayItems[i].Value.Value.toString() );
            }// for i..
            if( !WriteHelper.Execute( { 
                    NodesToWrite: arrayItems, 
                    OperationResults: expectedResults } ) ) break;

            // call Publish, we expect a keep-alive since the data did not exceed the deadband
            PublishHelper.WaitInterval( { Items: arrayItems, Subscription: MonitorBasicSubscription } );
            PublishHelper.Execute();
            Assert.False( PublishHelper.CurrentlyContainsData(), "Did NOT expect a dataChange because values previously written should NOT have passed the deadband filter." );



// TEST THREE - Decrement the first element of ALL arrays by 11

            addLog( "Writes #3 (of 4) - decrement [0] by 11" );
            for( i=0; i<arrayItems.length; i++ ) {
                IncrementUaVariantArray( arrayItems[i].Value.Value, 0, 1, -16 ); // -16 because 10 + (5 previously added)
                addLog( arrayItems[i].NodeSetting + " values to write: " + arrayItems[i].Value.Value.toString() );
            }// for i...
            if( !WriteHelper.Execute( { 
                        NodesToWrite: arrayItems,
                        OperationResults: expectedResults } ) ) break;
            PublishHelper.WaitInterval( { Items: arrayItems, Subscription: MonitorBasicSubscription } );

            // call Publish() - we expect a notification because the writes exceeded the deadband
            PublishHelper.Execute();
            if( !Assert.True( PublishHelper.CurrentlyContainsData(), "Expected a dataChange containing the new values just written." ) ) break;
            Assert.Equal( arrayItems.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive the same number of items in Publish as previously written." );


// TEST FOUR - Write same vaues as last time

            addLog( "Writes #4 (of 4) - unchanged values" );
            if( !WriteHelper.Execute( { 
                        NodesToWrite: arrayItems, 
                        OperationResults: expectedResults } ) ) break;

            // call Publish() - should be a keep-alive only
            PublishHelper.WaitInterval( { Items: arrayItems, Subscription: MonitorBasicSubscription } );
            PublishHelper.Execute();
            Assert.False( PublishHelper.CurrentlyContainsData(), "Did NOT expect a dataChange because values previously written were unchanged (save values as before)." );
        }
        while( false );// do not loop, we want this so we can exit the routine easily
    }
    // clean-up
    DeleteMonitoredItemsHelper.Execute( {
            ItemsToDelete: arrayItems, 
            SubscriptionId: MonitorBasicSubscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: CreateMonitoredItems018 } );