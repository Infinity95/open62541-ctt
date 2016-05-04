/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Create a monitoredItem of type Array (of each analog type) with a PercentDeadband = 10%
        specifying an IndexRange of �2:3�. In a loop:
            Write a value to a single element within the IndexRange. Some values will exceed the
            deadband value, others not.
            call Publish().
            In another loop:
                Write a value to a single element of the array that�s outside of the IndexRange.
                Some values will exceed the deadband filter, others will not.
                call Publish().
    Expected results:
        If the server does not support deadbands with arrays then the operation level result will
        be bad Bad_MonitoredItemFilterUnsupported. Otherwise, all service and operation level results
        are successful.
        The first call to Publish will yield dataChanges for the entire Array, but only when those
        values written exceeded the deadband value. The second call to Publish will not yield
        any dataChanges. */

include( "./library/ServiceBased/MonitoredItemServiceSet/ModifyMonitoredItems.js" );

function createMonitoredItems612010() {
    var dataTypesTest = [];
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogTypeArrays.Settings );
    if( items == null || items.length === 0 ) {
        addSkipped( "Arrays. No Array items (NodeIds\Static\DA Profile\Deadband) to test with." );
        return( false );
    }

    // reset any stats in the publish helper.
    PublishHelper.Clear();

    var i = 0;
    var deadbandValue = 10;
    var abort = false;
    for( i=0; i<items.length; i++ ) {
        print( "\n\n\nTesting item: " + items[i].NodeSetting );

        // before we do the test, read the analogType so that we can figure out
        // the data-type of the node. We'll need this information so that we can
        // properly specify the value that we'll WRITE to when seeing if the deadband
        // filters the write or not.
        if( ReadHelper.Execute( { NodesToRead: items[i] } ) ) {
            // is the item of type Array?
            if( !Assert.Equal( 1, items[i].Value.Value.ArrayType, "Not an Array type!" ) ) {
                addWarning( "Not an array type, can't test Setting '" + items[i].NodeSetting + "'" );
            }
            else {
                dataTypesTest.push( BuiltInType.toString( UaNodeId.GuessType( items[i].NodeSetting ) ) );

                // get the EURange, and generate some values to write to test the deadband
                var eurange = GetNodeIdEURange( items[i].NodeSetting );
                if( eurange == null ) {
                    addSkipped( "Skipping the test of Setting '" + items[i].NodeSetting + "' because the node is not configured with an EURange as needed by this test." );
                    return( false );
                }

                // get the EURange, and then define values to test the deadband
                var getEURangeSize = GetEURangeAsSize( eurange );
                // modify the writes to pass/succeed based on the indexRange of the array
                var writesToPass = GetEURangeWriteValues( 4, eurange, deadbandValue, true,  eurange.Low )
                var writesToFail = GetEURangeWriteValues( 3, eurange, deadbandValue, false, writesToPass[writesToPass.length-1] )

                // write initial value to analog item
                setValue( items[i], writesToPass[0], items[i].Value.Value.DataType, true );
                items[i].Value.Value[0] = writesToPass[0];
                items[i].IndexRange = "2";
                var expectedResults = new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadWriteNotSupported ] );
                WriteHelper.Execute( { NodesToWrite: items[i], OperationResults: expectedResults } );

                if( WriteHelper.Response.Results[0].isGood() ) {
                    // define the deadband filter and create the monitoredItem with an indexRange of "2:3"
                    items[i].IndexRange = "2:3";
                    items[i].Filter = Event.GetDataChangeFilter( DeadbandType.Percent, deadbandValue, DataChangeTrigger.StatusValue );
                    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items[i], TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
                        addError( "Test aborted. Couldn't create the monitoredItems." );
                        return( false );
                    }

                    // test the 10% deadband by writing our values expect to PASS
                    print( "\n\n\n~~~~~~~~~~~~~ Deadband testing: values expected to PASS ~~~~~~~~~~~~~~~~~" );
                    for( var w=1; w<writesToPass.length; w++ ) {
                        // set the value, wait to allow UA server to poll the new value
                        //items[i].SafelySetValueTypeKnown( writesToPass[w], items[i].Value.Value.DataType );
                        setValue( items[i], writesToPass[w], items[i].Value.Value.DataType, true );
                        items[i].Value.Value[0] = writesToPass[i];
                        items[i].IndexRange = "2";
                        if( WriteHelper.Execute( { NodesToWrite: items[i], OperationResults: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadWriteNotSupported ] ) } ) ) {
                            if( WriteHelper.Response.Results[0].StatusCode === StatusCode.BadWriteNotSupported ) {
                                addSkipped( "IndexRange writes are not supported. Skipping test." );
                                abort = true;
                                break;
                            }
                            PublishHelper.WaitInterval ( { Items: items, Subscription: MonitorBasicSubscription } );
                            PublishHelper.Execute();
                            var arraySize = PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.Value.getArraySize();
                            // check to see if the server returned the specified index element or the whole array
                            if( !Assert.Equal( 2, arraySize, "Expected to receive 2 datachange notification since 2 index element were specified in Create MonitoredItems. Aborting the test." ) ) {
                                // clean-up
                                DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items[i], SubscriptionId: MonitorBasicSubscription } );
                                abort = true;
                                break;
                            }
                            else {
                                PublishHelper.SetItemValuesFromDataChange( [ items[i] ] );
                                if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange for a value expected to exceed the deadband." ) ) {
                                    // we should receive an array of values back, although the length is only 1.
                                    // lets check that!
                                    if( Assert.Equal( 1, items[i].Value.Value.ArrayType, "Expected the dataChange value to be an Array (albeit with a length of 1). Skipping check that the value received matches the value written." ) ) {
                                        // convert the array value into a single value 
                                        var arrayValue = GetArrayTypeToNativeType( items[i].Value.Value )[0];
                                        Assert.Equal( writesToPass[w], arrayValue, "Expected to receive the same value as previously written." );
                                    }
                                }
                            }
                        }
                        else break;
                    }

                    if( abort ) break;
                    var publishCountBeforeFailTest = PublishHelper.ReceivedDataChanges.length;
                    // test the 10% deadband by writing our values expect to FAIL
                    print( "\n\n\n~~~~~~~~~~~~~ Deadband testing: values expected to FAIL ~~~~~~~~~~~~~~~~~" );
                    for( var w=0; w<writesToFail.length; w++ ) {
                        // set the value, wait to allow UA server to poll the new value
                        items[i].IndexRange = "0";
                        setValue( items[i], writesToFail[w], items[i].Value.Value.DataType, true );
                        if( WriteHelper.Execute( { NodesToWrite: items[i] } ) ) {
                            PublishHelper.WaitInterval ( { Items: items, Subscription: MonitorBasicSubscription } );
                            PublishHelper.Execute();
                            PublishHelper.SetItemValuesFromDataChange( [ items[i] ] );
                            Assert.False( PublishHelper.CurrentlyContainsData(), "Did not expect to receive a dataChange for a value expected to stay within the bounds of the deadband." );
                        }
                        else break;
                    }
                    Assert.Equal( publishCountBeforeFailTest, PublishHelper.ReceivedDataChanges.length, "Expected the number of DataChanges to remain the same since the values written should've filtered by the deadband." );
                    // clean-up
                    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items[i], SubscriptionId: MonitorBasicSubscription } );
                }
            }
        }// read
    }// for i...
    PublishHelper.Clear();
    //print a summary
    print( "\nData Types tested:" );
    for( i=0; i<dataTypesTest.length; i++ ) {
        print( "\t" + dataTypesTest[i] );
    }

    // show a summary of types tested.
    var msg ="Data Types tested: " + ArrayToFormattedString( dataTypesTest, "and" );
    addLog( msg );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems612010 } );