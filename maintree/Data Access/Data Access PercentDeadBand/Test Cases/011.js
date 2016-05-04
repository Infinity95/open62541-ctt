/*  Test prepared by Kevin Herron: kevin@inductiveautomation.ocm
    Description: Create a monitoredItem and specify a PercentDeadband value of 10%. For this node we want to write 4 individual values, after each write
        the script will then wait the revisedPublishingInterval and then call Publish(). The following values will be written:
            EURange.Low, EURange.High, a value that exceeds EURange.High. And a value that exceeds the EURange.Low.
            Note: an initial write should be performed to set the node in a state where the deadband can be accurately tested, such as EURange.High.
    Expected results:
        All service and operation level results are Good. For the write operation where a value that exceeds the EURange.High value
        is written the StatusCode may be either:
            a) Good, because the server supports values that exceed EURange.
            b) Bad_OutOfRange because the server does not support writes that
               exceed the EURange.
        The publish response will yield values that exceed the deadband, and if the server returned �good� for the writes that exceeded the EURange then those values will
        be received also. */

function writeToItemAndCheckResult( item, valueToWrite, eurange, validResults, checkControlValue, waitValue ) {
    var result = false;
    if( waitValue === undefined || waitValue == null ) waitValue = 1000;
    item.SafelySetValueTypeKnown( valueToWrite, item.Value.Value.DataType );
    var success = WriteHelper.Execute( { NodesToWrite: item, OperationResults: validResults, ReadVerification: false  } );
    if( success ) {
        if( WriteHelper.Response.Results[0].StatusCode === StatusCode.BadOutOfRange ) print( "\n\n***** We received Bad_OutOfRange which is acceptable. So we do NOT need to call Publish() now." );
        else {
            print( "Waiting " + waitValue + " msecs, before calling Publish." );
            wait( waitValue );
            PublishHelper.Execute();
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange notification.") ) {
                PublishHelper.SetItemValuesFromDataChange( [ item ] );
                // coerce the data-type so that we get just the raw/native value and not the UAVariant object!
                var value = UaVariantToSimpleType( item.Value.Value );
                if( value !== eurange.High && value !== eurange.Low ) {
                    if( checkControlValue ) addWarning( "Value received in Publish should have been either EURange.High: " + eurange.High + " or EURange.Low: " + eurange.Low + "; but was: " + value + "\nValue written that exceeded the bounds of the EURange: " + valueToWrite );
                }
                else result = true;
            }
        }
        print( "Read-back of the value written, result is: " + result );
        return( result );
    }
}

Test.Execute( { Procedure: function test() {
const DEADBAND = 10;
    PublishHelper.Clear();
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.NumericSettings )[0];
    if( item === undefined ) { addSkipped( SETTING_UNDEFINED_SCALARSTATIC ); return( false ); }
    if( ReadHelper.Execute( { NodesToRead: item } ) ) {
        item.OriginalValue = item.Value.Value.clone();
        var euRange = GetNodeIdEURange( item.NodeSetting );
        if( euRange === null || euRange === undefined ) { addError( "Test aborted: Setting '" + item.NodeSetting + "' did not yield a valid nodeId that has an EURange to test." ); return( false ); }

        var controlValue = euRange.High;
        item.SafelySetValueTypeKnown( controlValue, item.Value.Value.DataType );
        WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } );

        // Create the MonitoredItem
        item.Filter = Event.GetDataChangeFilter(DeadbandType.Percent, DEADBAND, DataChangeTrigger.StatusValue);
        if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) { addError( "Test aborted: Could not monitor the node specified by " + item.NodeSetting + "." ); return( false ); }

        // Accept Good and Bad_OutOfRange
        var validResults = [ new ExpectedAndAcceptedResults( [ StatusCode.BadOutOfRange, StatusCode.Good ] ) ];

        // Write something that exceeds EURange.Low
        print( "\n** Testing value that exceeds EURange.Low **" );
        writeToItemAndCheckResult( item, ( euRange.Low - 1 ), euRange, validResults, true, MonitorBasicSubscription.RevisedPublishingInterval );

        // Write EURange.Low
        PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
        print( "\n** Testing value equal to EURange.Low **" );
        controlValue = euRange.High;
        item.SafelySetValueTypeKnown( controlValue, item.Value.Value.DataType );
        WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } );
        wait( item.RevisedSamplingInterval * 2 );

        validResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];
        if( writeToItemAndCheckResult( item, euRange.Low, controlValue, validResults, false, MonitorBasicSubscription.RevisedPublishingInterval ) ) {
            // Write something that exceeds EURange.High
            print( "\n** Testing value that exceeds EURange.High **" );
            controlValue = euRange.Low;
            item.SafelySetValueTypeKnown( controlValue, item.Value.Value.DataType );
            WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } );

            validResults = [ new ExpectedAndAcceptedResults( StatusCode.BadOutOfRange ) ];
            validResults[0].addExpectedResult( StatusCode.Good );
            // if this write works, then write the LOW value again so we can get the value change (we have a 10% deadband)
            if( writeToItemAndCheckResult( item, euRange.High+1, controlValue, validResults, true, MonitorBasicSubscription.RevisedPublishingInterval ) ) {
                addLog( "Value exceeding EURange.High was permitted. Writing EURange.LOW again. Next write will be EURange.HIGH which should pass the deadband." );
                controlValue = euRange.High;
                item.SafelySetValueTypeKnown( controlValue, item.Value.Value.DataType );
                WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } );
                validResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];
                writeToItemAndCheckResult( item, euRange.Low, controlValue, validResults, false, MonitorBasicSubscription.RevisedPublishingInterval );
            }

            // Write EURange.High
            print( "\n** Testing value equal to EURange.High **" );
            controlValue = euRange.Low;
            item.SafelySetValueTypeKnown( controlValue, item.Value.Value.DataType );
            WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } );

            validResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];
            writeToItemAndCheckResult( item, euRange.High, controlValue, validResults, false, MonitorBasicSubscription.RevisedPublishingInterval );
        }

        // revert the item's value back to the original 
        item.Value.Value = item.OriginalValue.clone();
        WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } );
    }
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
    PublishHelper.Clear();
    return( true );
} } );