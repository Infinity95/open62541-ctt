/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Create a monitored item of an array with an IndexRange of �2:4� (the array must currently have at least five elements).
        call Publish(). Write to the array such that the size changes to two elements (0:1). call Publish().
    ExpectedResults:
        All service and operation level results are Good. Second Publish response contains a DataChangeNotification
        with a value.statusCode of Bad_IndexRangeNoData. */

function createMonitoredItems591065() {
    // get the Nodes to test with.. each node is of Type Array (defined in the Settings )
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings, 1, Attribute.ValueRank, "", MonitoringMode.Reporting, true, null, 10, 1000, TimestampsToReturn.Both )[0];
    if( item == null ) {
        addSkipped( SETTING_UNDEFINED_SCALARARRAYS );
        return( false );
    }

    var item2 = MonitoredItem.Clone( item );
    item2.AttributeId = Attribute.ArrayDimensions;

    // read the item to determine if its array can change
    if( ReadHelper.Execute( { NodesToRead: [ item, item2 ], OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.Good ), new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadAttributeIdInvalid ] ) ] } ) ) {
        addLog( "Read results of ValueRank collection:\n\t" + item.NodeId + ".ValueRank=" + item.Value.Value + "\n\t" + item2.NodeId + ".ValueRank=" + item2.Value.Value );
        if( item.Value.Value < 0 ) { // -2=can be scalar and/or array, -3=scalar or 1d array
            addSkipped( "Array specified for test indicates that its dimensions cannot be changed. ValueRank: " + item.Value.Value.toString() );
            return( false );
        }
        // now to check the array...
        // if the response is good, then the server supports the ArrayDimensions attribute
        // if the response is bad, then we'll need to just read the Value attribute and determine the size of the array that way.
        if( ReadHelper.Response.Results[1].StatusCode.isGood() ) {
            // is the arrayDimensions value null? 
            if( item2.Value.Value.isEmpty() ) {
                addError( "ArrayDimensions is empty/null (NodeId: " + item2.NodeId + "; Setting: " + item2.NodeSetting + "). Aborting test." );
                return( false );
            }
            // extract the arrayDimensions value.
            var arrayDimensions = item2.Value.Value.toUInt32Array();
            if( arrayDimensions.length > 0 && arrayDimensions[0] > 0 ) {
                addSkipped( "Array specified for testing cannot be used. ArrayDimensions = " + item2.Value.Value.toString() + ". Need ArrayDimensions to be zero." );
                return( false );
            }
        }
        else {
            item.AttributeId = Attribute.Value;
            if( ReadHelper.Execute( { NodesToRead: item } ) ) {
                if( !Assert.GreaterThan( 4, item.Value.Value.getArraySize(), "Array size is " + item.Value.Value.getArraySize() + ", which is too short. Aborting test." ) ) return( false );
            }
            else {
                addError( "Unable to determine the size of the array. Aborting test." );
                return( false );
            }
        }
    }
           
    writeValueToValue( Test.Session.Session, item.NodeId, generateArrayWriteValue( 0, 4, UaNodeId.GuessType( item.NodeSetting ) ) );

    // Set the Attribute we're interested in back to Value
    item.AttributeId = Attribute.Value;
    item.IndexRange = "2:4";

    // create the monitored items
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
        // wait 1 publish cycle before calling publish()
        PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
        // call Publish() #1, and make sure we receive data for all MonitoredItems, and that each 
        // dataset received is of type array.
        if( PublishHelper.Execute() ) {
            // is dataChange value received of type array?
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange." ) ) {
                // now to re-write the array and cause its size to change like "[0,1]".
                item.IndexRange="";
                item.Value.Value = generateArrayWriteValue( 0, 1, UaNodeId.GuessType( item.NodeSetting ) );
                if( WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } ) ) {
                    // wait 1 publish cycle before calling publish()
                    PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
                    // now to see if the publish #2 confirms the array change
                    if( PublishHelper.Execute() &&
                        Assert.True( PublishHelper.CurrentlyContainsData(), "Expected a dataChange because we've re-written the array and changed its size!" ) ) {
                        Assert.Equal( StatusCode.BadIndexRangeNoData, PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.StatusCode.StatusCode, "StatusCode mismatch. Expected: BadIndexRangeNoData; Received: " + PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.StatusCode );
                    }// publish and contains data?
                }// write
            }// currentlyContainsData?
        }// publish?
    }
    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
    revertOriginalValuesScalarStatic();
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591065 } );