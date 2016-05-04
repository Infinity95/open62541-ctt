/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create a MonitoredItem using a ByteStringArray node and a StringArray node while specifying invalid IndexRange as being outside of the bounds of the array.
        Expected Results: ServiceResult = Good. Operation level result = Bad_IndexRangeNoData */

function createMonitoredItems591Err028() {
    var iByteString = UaNodeId.fromString( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.ByteString );
    var iString     = UaNodeId.fromString( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.String );
    if( iByteString == null || iString == null ) {
        addSkipped( "Byte and/or String nodeIds are not configured in Static > AllProfiles > Arrays. Skipping test." );
        return( false );
    }
    var monitoredItems = MonitoredItem.fromNodeIds( [ iByteString, iString ], 
        Attribute.Value, "99995:99999", MonitoringMode.Reporting, true, null, 1, 1000, TimestampsToReturn.Both );
    if( !isDefined( monitoredItems ) || monitoredItems.length < 2 ) { addError( "Test aborted because the monitoredItems are not correctly configured, or are too few." ); return( false ); }
    if( !MonitorBasicSubscription.SubscriptionCreated ) {
        addError( "Subscription for MonitoredItemsServiceSet was not created." );
        return( false );
    }

    // we expect the call to fail, Bad_IndexRangeInvalid
    var expectedResults = [ new ExpectedAndAcceptedResults( StatusCode.BadIndexRangeNoData ), new ExpectedAndAcceptedResults( StatusCode.BadIndexRangeNoData ) ];
    // however, we acknowledge that the calls may succeed too:
    expectedResults[0].addExpectedResult( StatusCode.Good );
    expectedResults[1].addExpectedResult( StatusCode.Good );
    // go ahead and create the monitoredItems and then wait
    CreateMonitoredItemsHelper.Execute( { ItemsToCreate: monitoredItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription,  OperationResults: expectedResults } );
    
    PublishHelper.WaitInterval( { Items: monitoredItems, Subscription: MonitorBasicSubscription } );
    // call Publish() if applicable... if GOOD then publish, otherwise skip publish
    if( createMonItemsResp.Results[0].StatusCode.isGood() ) {
        if( PublishHelper.Execute( { FirstPublish: true } ) ) {
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange notification." ) ) {
                var receivedCode = PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.StatusCode.StatusCode;
                if( receivedCode === StatusCode.Good || receivedCode === StatusCode.BadIndexRangeNoData ) {
                    addLog( "Received expected StatusCode in PublishResponse dataChange notification message: " + receivedCode );
                }
                else {
                    addError( "Expected to receive StatusCode GOOD or BAD_INDEXRANGENODATA in PublishResponse, but received: " + receivedCode );
                }
            }
        }
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItems, SubscriptionId: MonitorBasicSubscription } );
    }
    else {
        addLog( "Skipping Publish call since Server did not create the monitored item." );
    }
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591Err028 } );