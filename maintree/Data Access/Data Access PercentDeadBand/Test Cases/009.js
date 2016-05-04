/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Create a monitoredItem of type Array (of each analog type) with a 
        deadbandPercent = 10%.
        In a loop: Write a value to a single element within the array. Some values will exceed
        the deadband value, others will not. call Publish().
    Expected results:
        All service and operation level results are successful.
        Publish will yield dataChanges for the entire Array, but only when those
        values written exceeded the deadband value. */

Test.Execute( { Procedure: function test() {
    const ARRAY_NODES_NEEDED = 3;
    var items = MonitoredItem.GetRequiredNodes( { Settings: Settings.ServerTest.NodeIds.Static.DAProfile.AnalogTypeArrays.Settings, Number: ARRAY_NODES_NEEDED } );
    if( items == null || items.length < ARRAY_NODES_NEEDED ) { addSkipped( SETTING_UNDEFINED_SCALARARRAYS ); return( false ); }

    var i;
    var deadbandValue = 10;
    var abort = false;

    // before we do the test, read the analogType so that we can figure out
    // the data-type of the node. We'll need this information so that we can
    // properly specify the value that we'll WRITE to when seeing if the deadband
    // filters the write or not.
    var testedTypes = [];
    if( ReadHelper.Execute( { NodesToRead: items } ) ) {
        var currentType;
        // get the EURange for each item
        for( i=0; i<items.length; i++ ) {
            currentType = BuiltInType.toString( items[i].DataType );
            testedTypes.push( currentType );
            print( "\n\n\n\n~~~~~~~~~ Testing type " + currentType + " ~~~~~~~~" );
            addLog( "Testing PercentDeadband on Analog item of Type: " + currentType + "." );
            // is the item of type Array?
            if( items[i].Value.ValueRank < 0 ) {
                addWarning( "Not an array type, can't test Setting '" + items[i].NodeSetting + "'" );
                continue;
            }

            var expectation = [ new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadWriteNotSupported ] ) ];
            // get the EURange, and generate some values to write to test the deadband
            var eurange = GetNodeIdEURange( items[i].NodeSetting );
            if( eurange == null ) {
                addWarning( "Skipping the test of Setting '" + items[i].NodeSetting + "' because the node is not configured with an EURange as needed by this test." );
                continue;
            }

            // get the EURange, and then define values to test the deadband
            var getEURangeSize = GetEURangeAsSize( eurange );
            var writesToPass = GetEURangeWriteValues( 3, eurange, deadbandValue, true,  eurange.Low )
            var writesToFail = GetEURangeWriteValues( 3, eurange, deadbandValue, false, writesToPass[writesToPass.length-1] )

            // set the value to EURange.Min
            items[i].InitialValue = items[i].Value.Value.clone();
            items[i].Value.Set = "Value";
            var overrideValue = [ eurange.Low ];
            items[i].SafelySetArrayTypeKnown( overrideValue, items[i].Value.Value.DataType );
            items[i].IndexRange = "0";
            print( "\tResetting value for testing. Initial value is: " + items[i].InitialValue + "; but will become: " + items[i].Value );
            WriteHelper.Execute( { NodesToWrite: items[i], OperationResults: expectation, ReadVerification: false } );
            if( WriteHelper.Response.Results[0].StatusCode === StatusCode.BadWriteNotSupported ) {
                addSkipped( "Skipping test, writing to IndexRange not supported" );
                break;
            }          

            // define the deadband filter and create the monitoredItem
            items[i].Filter = Event.GetDataChangeFilter( DeadbandType.Percent, deadbandValue, DataChangeTrigger.StatusValue );
            if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items[i], TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
                addError( "Test aborted. Couldn't create the monitoredItems." );
                return( false );
            }
            // get the initial publish out of the way
            PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
            PublishHelper.Execute();
            var arraySize = PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.Value.getArraySize();
            if( arraySize == -1 ) arraySize = 0;
            // check to see if the server returned the specified index element or the whole array
            if( Assert.Equal( 1, arraySize, "Expected to receive only one datachange notification since only one index element was specified in Create MonitoredItems. Aborting the test." ) ) {   

                // test the 10% deadband by writing our values expect to PASS
                print( "\n\n\n~~~~~~~~~~~~~ Deadband testing: values expected to PASS ~ " + BuiltInType.toString( items[i].DataType ) + " ~~~~~~~~~~~~~~~~~" );
                addLog( "Testing " + currentType + " with values expected to Pass through the deadband filter." );
                for( var w=0; w<writesToPass.length; w++ ) {
                    // set the value, wait to allow UA server to poll the new value
                    var overrideValue = [ writesToPass[w] ];
                    items[i].SafelySetArrayTypeKnown( overrideValue, items[i].Value.Value.DataType );
                    items[i].IndexRange = "0";
                    if( WriteHelper.Execute( { NodesToWrite: items[i], OperationResults: expectation } ) ) {
                        PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
                        PublishHelper.Execute();
                        var arraySize = PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.Value.getArraySize();
                        // check to see if the server returned the specified index element or the whole array
                        if( !Assert.Equal( 1, arraySize, "Expected to receive only one datachange notification since only one index element was specified in Create MonitoredItems. Aborting the test." ) ) {
                            // clean-up
                            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items[i], SubscriptionId: MonitorBasicSubscription } );
                            abort = true;
                            break;
                        }
                        else {
                            PublishHelper.SetItemValuesFromDataChange( [ items[i] ] );
                            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a dataChange for a value expected to exceed the deadband." ) ) {
                                PublishHelper.PrintDataChanges();
                                var receivedArray = GetArrayTypeToNativeType( PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.Value );
                                for( var l=0; l<overrideValue.length; l++ ) Assert.CoercedEqual( overrideValue[l], receivedArray[l], "Expected to receive the value we just wrote." );
                            }
                        }
                    }
                    else {
                        addError( "Write(): status " + WriteHelper.UaStatus, WriteHelper.UaStatus );
                        break;
                    }
                }
    
                if( abort ) break;
                var publishCountBeforeFailTest = PublishHelper.ReceivedDataChanges.length;
                // test the 10% deadband by writing our values expect to FAIL
                print( "\n\n\n~~~~~~~~~~~~~ Deadband testing: values expected to FAIL ~ " + BuiltInType.toString( items[i].DataType ) + " ~~~~~~~~~~~~~~~~~" );
                addLog( "Testing " + currentType + " with values expected to be filtered by the deadband." );
                for( var f=0; f<writesToFail.length; f++ ) {
                    // set the value, wait to allow UA server to poll the new value 
                    var overrideValue = GetArrayTypeToNativeType( items[i].Value.Value );
                    overrideValue[0] = writesToFail[f];
                    items[i].SafelySetArrayTypeKnown( overrideValue, items[i].Value.Value.DataType );
                    items[i].IndexRange = "0";
                    items[i].Value.Value[0] = writesToFail[f];
                    if( WriteHelper.Execute( { NodesToWrite: items[i] } ) ) {
                        PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
                        PublishHelper.Execute();
                        Assert.False( PublishHelper.CurrentlyContainsData(), "Did not expect to receive a dataChange for a value expected to stay within the bounds of the deadband." );
                    }
                    else break;
                }
                Assert.Equal( publishCountBeforeFailTest, PublishHelper.ReceivedDataChanges.length, "Expected the number of DataChanges to remain the same since the values written should've filtered by the deadband." );
            }
            
            else { 
                // clean-up
                DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items[i], SubscriptionId: MonitorBasicSubscription } );
                // revert to the original value 
                print( "Reverting to initial value." );
                var initialValueAsNativeArray = GetArrayTypeToNativeType( items[i].InitialValue );
                items[i].SafelySetArrayTypeKnown( [ initialValueAsNativeArray[0] ], items[i].Value.Value.DataType );
                items[i].IndexRange = "0";
                print( "\tResetting value for testing. Initial value is: " + items[i].InitialValue + "; but will become: " + items[i].Value );
                WriteHelper.Execute( { NodesToWrite: items[i] } );
                break;
            }
            
            // clean-up
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items[i], SubscriptionId: MonitorBasicSubscription } );
            // revert to the original value 
            print( "Reverting to initial value." );
            var initialValueAsNativeArray = GetArrayTypeToNativeType( items[i].InitialValue );
            items[i].SafelySetArrayTypeKnown( [ initialValueAsNativeArray[0] ], items[i].Value.Value.DataType );
            items[i].IndexRange = "0";
            print( "\tResetting value for testing. Initial value is: " + items[i].InitialValue + "; but will become: " + items[i].Value );
            WriteHelper.Execute( { NodesToWrite: items[i] } );
        }// iterate over each array type
    }// read
    PublishHelper.Clear();
    // display the data-types tested:
    print( "Data Types tested:" );
    for( i=0; i<testedTypes.length; i++ ) print( "\t" + testedTypes[i] );
    return( true );
} } );