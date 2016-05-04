/*  Test prepared by compliance@opcfoundation.org; original work by: Anand Taparia; ataparia@kepware.com
      Description:
          Script creates a triggered item with a filter and verifies that the trigger 
          is invoked when the data changes and passes the filter criteria.
   writeToDeadbandAndCheckWithPublish( valuesToWrite, expectedToPass )
   ACTUALLY WRITES A VALUE, CALLS PUBLISH, AND COMPARES THE VALUE WRITTEN TO THE VALUE RECEIVED.
   Parameters:
      item           - a monitoredItem object that is being tested
      valuesToWrite  - an array of values to write
      expectedToPass - simple True/False to indicate if values should pass the deadband
      subscription   - a subscription object
      PublishHelper - reference to a Publish object helper
      WriteHelper   - reference to a Write object helper
      typeToTest     - BuiltInType of the node being tested
      triggeredItems - The array of MonitoredItem objects representing Nodes being TRIGGERED (we're looking for THESE!) */

var clientHandle = 1;
const INTEGER_DEADBAND_VALUE = 5;
const INTEGER_WRITE_PASS     = [50, 100, 10, 20, 26];
const INTEGER_WRITE_FAIL     = [26, 24, 29, 23, 28];

const FLOAT_DEADBAND_VALUE = 0.501;
const FLOAT_WRITE_PASS     = [24.998, 24.01, 99.52, 33.33, 0.0];
const FLOAT_WRITE_FAIL     = [0.1, -0.5, 0.5, -0.2, 0.002];

function writeToDeadbandAbsoluteAndCheckWithPublish594006( item, valuesToWrite, expectedToPass, subscription, PublishHelper, WriteHelper, typeToTest, triggeredItems ) {
    if( arguments.length !== 8 ) { throw( "writeToDeadbandAndCheckWithPublish() argument error." ); }
    var initialDatachangeCount = PublishHelper.ReceivedDataChanges.length;
    var i;
    print( "\n\n********* Testing with Values expected to " + (expectedToPass===true?"Pass":"FAIL") + " filtering *********" );
    print( "\tInitial DataChange count = " + initialDatachangeCount );
    for( i=0; i<valuesToWrite.length; i++ ) {
        // now set the item value and write it
        setValue( item, valuesToWrite[i], typeToTest );
        print( "\n\nWriting: " + valuesToWrite[i] );
        if( WriteHelper.Execute( { NodesToWrite: item } ) ) {
            // wait 1 sampling cycle
            PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
            if( PublishHelper.Execute( { FirstPublish: true } ) ) {
                // did we receive a dataChange when we expected?
                PublishHelper.PrintDataChanges();
                if( Assert.Equal( expectedToPass, PublishHelper.CurrentlyContainsData(), "Publish() did not yield the expected results per the Deadband configuration." ) ) {
                    if( expectedToPass ) {
                        // we expect to receive the same value we wrote
                        if( Assert.Equal( item.ClientHandle, PublishHelper.CurrentDataChanges[0].MonitoredItems[0].ClientHandle, "Expected to receive just the monitoredItem used in this test." ) ) {
                            Assert.CoercedEqual( valuesToWrite[i], PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.Value, "Expected to receive the same value we wrote." );
                        }                        
                        // find the triggering item
                        Assert.True( PublishHelper.HandleIsInCurrentDataChanges( item.ClientHandle ), "Expected the TRIGGERING node to be present in the dataChanges because its mode is REPORTING." );
                    }
                }
            }// publish
        }//write
    }
    // final check... make sure that the dataChange count increased by the same number
    // of writes we made.
    print( "\n\n\nChecking dataChange count. Initial count = " + initialDatachangeCount + " + length of " + valuesToWrite.length + "; and current count is: " + PublishHelper.ReceivedDataChanges.length );
    if( expectedToPass ) Assert.Equal( initialDatachangeCount + valuesToWrite.length, PublishHelper.ReceivedDataChanges.length, "Expected to receive a dataChange for each write." );
    else Assert.Equal( initialDatachangeCount, PublishHelper.ReceivedDataChanges.length, "Expected to NOT receive any dataChanges for any of the writes." );
}

/* CreateMonitoredItemDeadbandAbsolute_VerifyWithPublish( nodeSettingName, publishHelper )
   FUNDAMENTALLY PERFORMS THE WHOLE TEST OF ONE DATA TYPE, I.E. CREATEMONITOREDITEM, DO TEST, CLEAN-UP ETC.
   Parameters:
      nodeSettingName       - a monitoredItem object that is being tested.
      absoluteDeadbandValue - the value to specify for the deadband.
      subscriptionObject    - a Subscription object.
      publishHelper         - a Publish helper object.
      WriteHelper           - a Write helper object.
      writesToSucceed       - an array of integer values to write, which are expected to pass the filter.
      writesToFail          - an array of integer values to write, expected to be filtered out.
      typeToTest            - BuiltInType of the node being tested
*/

function CreateMonitoredItemDeadbandAbsolute_VerifyWithPublish594006( triggeringSetting, addLinks, absoluteDeadbandValue, subscriptionObject, publishHelper, WriteHelper, writesToSucceed, writesToFail, typeToTest ) {
    if( triggeringSetting == null || triggeringSetting.length === 0 || triggeringSetting == "" || 
        addLinks == null || addLinks == "" || addLinks.length === 0 ||
        absoluteDeadbandValue == null ||
        subscriptionObject == null ||
        publishHelper == null ||
        WriteHelper == null ||
        writesToSucceed == null || writesToSucceed.length === 0 ||
        writesToFail == null || writesToFail.length === 0 ||
        typeToTest == null ) throw( "CreateMonitoredItemDeadbandAbsolute_VerifyWithPublish() argument error." );
    print( "\n\nType: " + BuiltInType.toString( typeToTest ) );
    print( "********* Testing AbsoluteDeadband.Value = " + absoluteDeadbandValue + " *********" );
    // get the Nodes to test with..
    var triggeringItem = MonitoredItem.fromSetting( triggeringSetting, clientHandle++, Attribute.Value, "", MonitoringMode.Reporting, true, undefined, undefined, SAMPLING_RATE_FASTEST, TimestampsToReturn.Both );
    if( triggeringItem == null ) return( false );
    var triggeredItems = MonitoredItem.fromSettings( addLinks, clientHandle++, Attribute.Value, "", MonitoringMode.Sampling, true, undefined, undefined, SAMPLING_RATE_FASTEST );
    if( triggeredItems == null || triggeredItems.length === 0 ) {
        _warning.store( "Setting not configured: '" + addLinks.toString() + "'." );
        return( false );
    }

    // the triggering node will have a deadband filter
    var filter = Event.GetDataChangeFilter( DeadbandType.Absolute, absoluteDeadbandValue, DataChangeTrigger.StatusValue );
    triggeringItem.Filter = filter;

    // create the monitored items - we expect this to succeed
    var allItems = [ triggeringItem ];
    allItems = allItems.concat( triggeredItems );
    
    // set the Value to 0, just to guarantee a starting point
    print( "\tResetting value to ZERO..." );
    setValue( triggeringItem, 0, typeToTest );
    WriteHelper.Execute( { NodesToWrite: triggeringItem } );
        
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: allItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscriptionObject } ) ) {
        // now to setup the triggering
        if( SetTriggeringHelper.Execute( { SubscriptionId: subscriptionObject, TriggeringItemId: triggeringItem, LinksToAdd: triggeredItems } ) ) {        
            PublishHelper.WaitInterval( { Items: allItems, Subscription: subscriptionObject } );
            // call Publish()(), just to get the initial sequenceNumber of "1" out of the way
            publishHelper.Execute();
            // check if we received a dataChange for all nodes
            var bReceivedLinkedItem = false;
            Assert.True( publishHelper.HandleIsInCurrentDataChanges( triggeringItem.ClientHandle ), "Expected the TRIGGERING node to be present in the dataChanges because its mode is REPORTING." );
            bReceivedLinkedItem = publishHelper.HandleIsInCurrentDataChanges( triggeredItems[0].ClientHandle );
            // if we didn't receive all linked items in the first publish we have to write the triggering item again and receive another publish
            if( !bReceivedLinkedItem ) {
                setValue( triggeringItem, writesToSucceed[0], typeToTest );
                WriteHelper.Execute( { NodesToWrite: triggeringItem } );
                // we have to get the initial value for the linked item if we didn't get it before
                PublishHelper.WaitInterval( { Items: allItems, Subscription: subscriptionObject } );
                // call Publish()
                publishHelper.Execute();
                // now we should receive both items
                Assert.True( publishHelper.HandleIsInCurrentDataChanges( triggeringItem.ClientHandle ), "Expected the TRIGGERING node to be present in the dataChanges because its mode is REPORTING." );
                Assert.True( publishHelper.HandleIsInCurrentDataChanges( triggeredItems[0].ClientHandle ), "Expected the LINKED node to be present in the dataChanges." );
                // write 0 again
                setValue( triggeringItem, 0, typeToTest );
                WriteHelper.Execute( { NodesToWrite: triggeringItem } );
                // call Publish()
                publishHelper.Execute();
            }
            // do the writes that we DO expect to pass through the deadband
            writeToDeadbandAbsoluteAndCheckWithPublish594006( triggeringItem, writesToSucceed, true, subscriptionObject, publishHelper, WriteHelper, typeToTest, triggeredItems );
            // do the writes that we expect to FAIL (not pass the deadband)
            writeToDeadbandAbsoluteAndCheckWithPublish594006( triggeringItem, writesToFail, false, subscriptionObject, publishHelper, WriteHelper, typeToTest, triggeredItems );
        }
        // clean-up
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: allItems, SubscriptionId: subscriptionObject } );
    }
    PublishHelper.Clear();
}

function DeadbandAbsoluteFiltering_SetPublishTesting594006( integerDeadband, integerWritesPass, integerWritesFail, floatDeadband, floatWritesPass, floatWritesFail ) {
    // argument check
    if( arguments.length !== 6 ) throw( "DeadbandFiltering_WritePublishTesting() argument error." );

    CreateMonitoredItemDeadbandAbsolute_VerifyWithPublish594006(
        "/Server Test/NodeIds/Static/All Profiles/Scalar/SByte",
        ["/Server Test/NodeIds/Static/All Profiles/Scalar/Int16"],
        integerDeadband,
        MonitorTriggeringSubscription,
        PublishHelper,
        WriteHelper,
        integerWritesPass,
        integerWritesFail,
        BuiltInType.SByte );

    CreateMonitoredItemDeadbandAbsolute_VerifyWithPublish594006(
        "/Server Test/NodeIds/Static/All Profiles/Scalar/Int16",
        ["/Server Test/NodeIds/Static/All Profiles/Scalar/Int32"],
        integerDeadband,
        MonitorTriggeringSubscription,
        PublishHelper,
        WriteHelper,
        integerWritesPass,
        integerWritesFail,
        BuiltInType.Int16 );

    CreateMonitoredItemDeadbandAbsolute_VerifyWithPublish594006(
        "/Server Test/NodeIds/Static/All Profiles/Scalar/Int32",
        ["/Server Test/NodeIds/Static/All Profiles/Scalar/Int16"],
        integerDeadband,
        MonitorTriggeringSubscription,
        PublishHelper,
        WriteHelper,
        integerWritesPass,
        integerWritesFail,
        BuiltInType.Int32 );

    CreateMonitoredItemDeadbandAbsolute_VerifyWithPublish594006(
        "/Server Test/NodeIds/Static/All Profiles/Scalar/Int64",
        ["/Server Test/NodeIds/Static/All Profiles/Scalar/Byte"],
        integerDeadband,
        MonitorTriggeringSubscription,
        PublishHelper,
        WriteHelper,
        integerWritesPass,
        integerWritesFail,
        BuiltInType.Int64 );

    CreateMonitoredItemDeadbandAbsolute_VerifyWithPublish594006(
        "/Server Test/NodeIds/Static/All Profiles/Scalar/Byte",
        ["/Server Test/NodeIds/Static/All Profiles/Scalar/UInt16"],
        integerDeadband,
        MonitorTriggeringSubscription,
        PublishHelper,
        WriteHelper,
        integerWritesPass,
        integerWritesFail,
        BuiltInType.Byte );

    CreateMonitoredItemDeadbandAbsolute_VerifyWithPublish594006(
        "/Server Test/NodeIds/Static/All Profiles/Scalar/UInt16",
        ["/Server Test/NodeIds/Static/All Profiles/Scalar/UInt32"],
        integerDeadband,
        MonitorTriggeringSubscription,
        PublishHelper,
        WriteHelper,
        integerWritesPass,
        integerWritesFail,
        BuiltInType.UInt16 );

    CreateMonitoredItemDeadbandAbsolute_VerifyWithPublish594006(
        "/Server Test/NodeIds/Static/All Profiles/Scalar/UInt32",
        ["/Server Test/NodeIds/Static/All Profiles/Scalar/UInt64"],
        integerDeadband,
        MonitorTriggeringSubscription,
        PublishHelper,
        WriteHelper,
        integerWritesPass,
        integerWritesFail,
        BuiltInType.UInt32 );

    CreateMonitoredItemDeadbandAbsolute_VerifyWithPublish594006(
        "/Server Test/NodeIds/Static/All Profiles/Scalar/UInt64",
        ["/Server Test/NodeIds/Static/All Profiles/Scalar/Float"],
        integerDeadband,
        MonitorTriggeringSubscription,
        PublishHelper,
        WriteHelper,
        integerWritesPass,
        integerWritesFail,
        BuiltInType.UInt64 );

    CreateMonitoredItemDeadbandAbsolute_VerifyWithPublish594006(
        "/Server Test/NodeIds/Static/All Profiles/Scalar/Float",
        ["/Server Test/NodeIds/Static/All Profiles/Scalar/SByte"],
        floatDeadband,
        MonitorTriggeringSubscription,
        PublishHelper,
        WriteHelper,
        floatWritesPass,
        floatWritesFail,
        BuiltInType.Float );
}

function triggering594006()
{
    DeadbandAbsoluteFiltering_SetPublishTesting594006( 
        INTEGER_DEADBAND_VALUE, INTEGER_WRITE_PASS, INTEGER_WRITE_FAIL, 
        FLOAT_DEADBAND_VALUE,   FLOAT_WRITE_PASS,   FLOAT_WRITE_FAIL );
    return( true );
}

Test.Execute( { Procedure: triggering594006 } );