include( "./library/Base/Objects/event.js" );
include( "./library/Base/SettingsUtilities/NodeIdSetting.js" );

var deadbandTypesTested;
var undesirableTypes = [ BuiltInType.Boolean, BuiltInType.ByteString, BuiltInType.DateTime, DATATYPE_DURATION, BuiltInType.Guid, DATATYPE_INTEGER, 
                         DATATYPE_NUMERIC, BuiltInType.String, DATATYPE_TIME, DATATYPE_UTCTIME, DATATYPE_UINTEGER, BuiltInType.XmlElement,
                         BuiltInType.LocalizedText, BuiltInType.NodeId, BuiltInType.QualifiedName ];

/* writeToDeadbandAndCheckWithPublish( valuesToWrite, expectedToPass )
   Parameters:
      item           - a monitoredItem object that is being tested
      valuesToWrite  - an array of values to write
      expectedToPass - simple True/False to indicate if values should pass the deadband
      subscription   - a subscription object
      publishHelper - reference to a Publish object helper
      writeHelper   - reference to a Write object helper
      typeToTest     - BuiltInType of the node being tested
      */
function writeToDeadbandAndCheckWithPublish( item, valuesToWrite, expectedToPass, subscription, publishHelper, writeHelper, typeToTest ) {
    if( arguments.length !== 7 ) { throw( "writeToDeadbandAndCheckWithPublish() argument error. Expected 7 arguments but received: " + arguments.length ); }
    var initialDatachangeCount = publishHelper.ReceivedDataChanges.length;
    var i;
    print( "\n\n********* Testing with Values expected to " + (expectedToPass===true?"Pass":"FAIL") + " filtering *********" );
    print( "MonitoringMode=Reporting? = " + ( item.MonitoringMode === MonitoringMode.Reporting ) + "; expectedToPass=" + expectedToPass + "; override needed?=" + (item.MonitoringMode !== MonitoringMode.Reporting && expectedToPass ) );
    if( item.MonitoringMode !== MonitoringMode.Reporting && expectedToPass ) expectedToPass = false;
    print( "\tInitial DataChange count = " + initialDatachangeCount );
    for( i=0; i<valuesToWrite.length; i++ ) {
        // now set the item value and write it
        setValue( item, valuesToWrite[i], typeToTest );
        print( "\n\nWriting: " + valuesToWrite[i] );
        if( writeHelper.Execute( { NodesToWrite: item, ReadVerification: false } ) ) {
            // wait 1 sampling interval cycle
            publishHelper.WaitInterval( { Items: item } );
            if( publishHelper.Execute() ) {
                // did we receive a dataChange when we expected?
                publishHelper.PrintDataChanges();
                if( Assert.False( item.MonitoringMode !== MonitoringMode.Reporting && publishHelper.CurrentlyContainsData(), "Was NOT expecting a Publish since the MonitoringMode of the item is Disabled. Verification: MonitoringMode=" + item.MonitoringMode + "; DataChanges received=" + publishHelper.CurrentlyContainsData() ) ) {
                    if( Assert.Equal( expectedToPass, publishHelper.CurrentlyContainsData(), "Publish() did not yield the expected results per the Deadband configuration. Verification: expectedToPass=" + expectedToPass + "; dataReceived=" + publishHelper.CurrentlyContainsData() ) ) {
                        if( expectedToPass ) {
                            // we expect to receive the same value we wrote
                            if( Assert.Equal( item.ClientHandle, publishHelper.CurrentDataChanges[0].MonitoredItems[0].ClientHandle, "Expected to receive just the monitoredItem used in this test." ) ) {
                                Assert.CoercedEqual( valuesToWrite[i], publishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.Value, "Expected to receive the same value we wrote." );
                            }
                        }
                    }
                }
            }// publish
        }//write
    }
    // final check... make sure that the dataChange count increased by the same number
    // of writes we made.
    print( "\n\n\nChecking dataChange count. Initial count = " + initialDatachangeCount + " + length of " + valuesToWrite.length + "; and current count is: " + publishHelper.ReceivedDataChanges.length );
    if( expectedToPass ) Assert.Equal( initialDatachangeCount + valuesToWrite.length, publishHelper.ReceivedDataChanges.length, "Expected to receive a dataChange for each write." );
    else Assert.Equal( initialDatachangeCount, publishHelper.ReceivedDataChanges.length, "Expected to NOT receive any dataChanges for any of the writes." );
}

/* CreateMonitoredItemDeadbandAbsolute_VerifyWithPublish( nodeSettingName, publishHelper )
   Parameters:
      nodeSettingName       - a monitoredItem object that is being tested.
      absoluteDeadbandValue - the value to specify for the deadband.
      subscriptionObject    - a Subscription object.
      publishHelper         - a Publish helper object.
      writeHelper           - a Write helper object.
      writesToSucceed       - an array of integer values to write, which are expected to pass the filter.
      writesToFail          - an array of integer values to write, expected to be filtered out.
      typeToTest            - BuiltInType of the node being tested
*/
function CreateMonitoredItemDeadbandAbsolute_VerifyWithPublish( item, absoluteDeadbandValue, subscriptionObject, publishHelper, writeHelper, writesToSucceed, writesToFail, args ) {
    createMonitoredItemDeadbandXX_VerifyWithPublish( DeadbandType.Absolute, item, absoluteDeadbandValue, subscriptionObject, publishHelper, writeHelper, writesToSucceed, writesToFail, MonitoringMode.Reporting, 0, args );
}

/* CreateMonitoredItemDeadbandPercent_VerifyWithPublish( nodeSettingName, publishHelper )
   Parameters:
      nodeSettingName       - a monitoredItem object that is being tested.
      monitoringmode        - the monitoringMode for the item being tested
      percentDeadbandValue  - the value to specify for the deadband.
      subscriptionObject    - a Subscription object.
      publishHelper         - a Publish helper object.
      writeHelper           - a Write helper object.
      typeToTest            - BuiltInType of the node being tested
      queueSize             - monitoredItem queueSize
*/
function CreateMonitoredItemDeadbandPercent_VerifyWithPublish( nodeSettingName, monitoringMode, percentDeadbandValue, subscriptionObject, publishHelper, writeHelper, typeToTest, queueSize, args ) {
    var eurange = GetNodeIdEURange( nodeSettingName );
    if( eurange == null ) {
        addWarning( "Test aborted. Setting '" + nodeSettingName + "' did not yield a valid nodeId to test." );
        return( false );
    }
    print( "\n\tLo = " + eurange.Low + "\n\tHi = " + eurange.High );
    // get the size of the EURange
    var getEURangeSize = GetEURangeAsSize( eurange );
    print( "getEURangeSize = " + getEURangeSize );
    // determine the values to test against the deadband
    // get any range of numbers to start with
    var writesToPass = GetEURangeWriteValues( 5, eurange, 10, true,  eurange.Low );
    // start the number where the last write takes place
    var writesToFail = GetEURangeWriteValues( 5, eurange, 10, false, writesToPass[writesToPass.length-1] );
    // issue the test
    if( !isDefined( args ) ) args = new Object();
    args.EURange = eurange;
    createMonitoredItemDeadbandXX_VerifyWithPublish( DeadbandType.Percent, nodeSettingName, percentDeadbandValue, 
        subscriptionObject, publishHelper, writeHelper, writesToPass, writesToFail, monitoringMode, queueSize, args );
}

function createMonitoredItemDeadbandXX_VerifyWithPublish( deadbandType, item, deadbandValue, subscriptionObject, publishHelper, writeHelper, writesToSucceed, writesToFail, monitoringMode, queueSize, args ) {
    const SAMPLING_RATE = 0;
    var i;
    if( item == null || deadbandValue == null || subscriptionObject == null || publishHelper == null || writeHelper == null || writesToSucceed == null || 
        writesToSucceed.length === 0 || writesToFail == null || writesToFail.length === 0 || monitoringMode == null || queueSize == null ) {
        var errMsg = "createMonitoredItemDeadbandXX_VerifyWithPublish() argument error." +
            "\nitem: " + item.UserReadableName +
            "\ndeadbandValue: " + deadbandValue + 
            "\nsubscriptionObject: " + (subscriptionObject == null ? "<null>" : "ok") +
            "\npublishHelper: " + (publishHelper == null ? "<null>" : "ok") +
            "\nwriteHelper: " + (writeHelper == null ? "<null>" : "ok") +
            "\nwritesToSucceed: " + writesToSucceed +
            "\nwritesToFail: " + writesToFail +
            "\nmonitoringMode: " + monitoringMode +
            "\nqueueSize: " + queueSize;
        throw( errMsg );
    }

    // check the item parameter and fix it to be a 'monitoredItem' object
    if( !isDefined( item.NodeSetting ) ) {
        item = MonitoredItem.fromSetting( item );
        ReadHelper.Execute( { NodesToRead: item } );
    }

    for( i=0; i<undesirableTypes.length; i++ ) {
        if( item.Value.Value.DataType === undesirableTypes[i] ) {
            addLog( "Skipping test of node setting '" + item.UserReadableName + "' because it appears to be of a data-type '" + BuiltInType.toString( undesirableTypes[i] ) + "' that is not applicable for testing Deadbands." );
            return( false );
        }
    }
    // any other undesirable types specified?
    if( isDefined( args ) && isDefined( args.UndesirableTypes ) ) {
        for( i=0; i<args.UndesirableTypes.length; i++ ) {
            if( item.Value.Value.DataType === args.UndesirableTypes[i] ) {
                addLog( "Skipping test of node setting '" + item.UserReadableName + "' because it appears to be of a data-type (' " + BuiltInType.toString( args.UndesirableTypes[i] ) + "' that was flagged inappropriate for this testing of a Deadband." );
                return( false );
            }
        }//for i
    }

    if( deadbandTypesTested == null ) deadbandTypesTested = [];

    deadbandTypesTested.push( BuiltInType.toString( item.Value.Value.DataType ) );
    print( "\n\n\n\n\nType: " + BuiltInType.toString( item.Value.Value.DataType ) );
    var deadbandTypeName = "None";
    if( deadbandType === DeadbandType.Absolute ) { deadbandTypeName = "Absolute"; }
    if( deadbandType === DeadbandType.Percent  ) { deadbandTypeName = "Percent"; }
    print( "********* Testing Deadband" + deadbandTypeName + ".Value = " + deadbandValue + " *********" );
    addLog( "Testing Deadband on Node: " + item.UserReadableName + "; deadband Type: " + deadbandTypeName + "; deadband value: " + deadbandValue );

    // clear the publish statistics
    publishHelper.Clear();

    var filter = Event.GetDataChangeFilter( deadbandType, deadbandValue, DataChangeTrigger.StatusValue );

    // get the Nodes to test with..
    item.MonitoringMode = monitoringMode;
    item.Filter = filter;
    item.QueueSize = queueSize;
    item.SamplingInterval = SAMPLING_RATE;
    item.TimestampsToReturn = TimestampsToReturn.Both;
    
    // Set the Value to 0 (or euRange.Low if appropriate), just to guarantee a starting point
    var zeroValue = 0;
    // If the node has an euRange then set zeroValue = euRange.Low
    if( !isDefined( args ) ) args = new Object();
    if( isDefined( args.EURange ) ) zeroValue = args.EURange.Low;

    print( "\tResetting value to " + zeroValue );
    setValue( item, zeroValue, item.Value.Value.DataType );
    writeHelper.Execute( { NodesToWrite: item } );

    // create the monitored items - we this will succeed
    var expectedResults = new ExpectedAndAcceptedResults( StatusCode.Good );
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscriptionObject, OperationResults: [ expectedResults ] } ) ) {
        // did the call truly succeed?
        if( createMonItemsResp.Results[0].StatusCode.isGood() ) {
            // call Publish()(), just to get the initial sequenceNumber of "1" out of the way
            publishHelper.WaitInterval( { Items: item } );
            publishHelper.Execute();

            // Do the writes that we DO expect to pass through the deadband
            // [NEW] monitoringMode parameter causes us to rethink HOW to verify the
            // deadband is working. This can ONLY be tested if the monitoringMode
            // is REPORTING. Otherwise, we'll never get a dataChange to verify.
            writeToDeadbandAndCheckWithPublish( item, writesToSucceed, monitoringMode === MonitoringMode.Reporting, subscriptionObject, publishHelper, writeHelper, item.Value.Value.DataType );

            // do the writes that we expect to FAIL (not pass the deadband)
            // [NEW] the deadbandValue of 0 essentially means NO DEADBAND! so adjust
            // our expectations of success/fail accordingly.
            var expectToPass = deadbandValue === 0;
            writeToDeadbandAndCheckWithPublish( item, writesToFail, expectToPass, subscriptionObject, publishHelper, writeHelper, item.Value.Value.DataType );
        }
        else addError( "DeadbandAbsolute doesn't appear to be supported. Deadband is REQUIRED." );
    }
    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: subscriptionObject } );
}

function DeadbandAbsoluteFiltering_WritePublishTesting( subscriptionObject, readHelper, writeHelper, publishHelper, integerDeadband, integerWritesPass, integerWritesFail, floatDeadband, floatWritesPass, floatWritesFail, args ) {
    // argument check
    if( arguments.length < 10 ) {
        var errMessage = "DeadbandAbsoluteFiltering_WritePublishTesting() argument error." +
            "\nsubscriptionObject=" + ( subscriptionObject === null ? "<null>" : "ok" ) +
            "\nreadHelper=" + ( readHelper === null ? "<null>" : "ok" ) +
            "\nwriteHelper=" + ( writeHelper === null ? "<null>" : "ok" ) +
            "\npublishHelper=" + ( publishHelper === null ? "<null>" : "ok" ) +
            "\nintegerDeadband="  + ( integerDeadband === null ? "<null>" : "ok" ) +
            "\nintegerWritesPass=" + ( integerWritesPass === null ? "<null>" : "ok" ) +
            "\nintegerWritesFail=" + ( integerWritesFail === null ? "<null>" : "ok" ) +
            "\nfloatDeadband=" + ( floatDeadband === null ? "<null>" : "ok" ) +
            "\nfloatWritesPass=" + ( floatWritesPass === null ? "<null>" : "ok" ) +
            "\nfloatWritesFail=" + ( floatWritesFail === null ? "<null>" : "ok" );
        throw( errMessage );
    }

    // clear the array that we will use to record (and subsequently display) for the data-types tested
    deadbandTypesTested = [];

    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings );
    // do a read of the items to get their data-types
    if( readHelper.Execute( { NodesToRead:items } ) ) {
        for( var i=0; i<items.length; i++ ) {
            CreateMonitoredItemDeadbandAbsolute_VerifyWithPublish(
                    items[i],
                    integerDeadband,
                    subscriptionObject,
                    publishHelper,
                    writeHelper,
                    integerWritesPass,
                    integerWritesFail,
                    args );
        }
        // now to print a "report" of the data-types tested.
        addLog( "\nThe following data-types were tested with a Deadband Absolute:\n" + deadbandTypesTested + "\n" );
    }
}