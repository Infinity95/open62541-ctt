/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script creates a MonitoredItem of type StringArray with IndexRange of �0:2,0:2�. */

function createMonitoredItems591057() {
    var nodeSetting = "/Server Test/NodeIds/Static/All Profiles/Arrays/String";
    var item = MonitoredItem.fromSetting( nodeSetting );
    if( item === null ) { addSkipped( "String not configured." ); return( false ); }

    // first: read the raw array value for the item 
    ReadHelper.Execute( { NodesToRead: item } );
    print( item.Value.toString() );
    // store the initial value 
    item.InitialValue = item.Value.Value.clone();
    // second: check quality is good - otherwise exit
    if( Assert.True( item.Value.StatusCode.isGood(), "Cannot use node for testing because the quality is Bad." ) ) {
        // check the value contains the size of data we need
        if( item.Value.Value.ArrayType !== 1 ) {
            addWarning( "Node '" + item.NodeSetting + "' is not an array. Aborting test." );
            return( false );
        }
        var bs = item.Value.Value.toStringArray();
        var doInitialize = false;
        if( bs === null ) doInitialize = true;
        else {
            for( i=0; i<bs.length; i++ ) {
                if( bs[i].length < 5 ) {
                    doInitialize = true;
                    break;
                }
            }
        }

        if( doInitialize ) {
            print( "\n\n\n---< Setting the array values to something of use >---\n\n" );
            var initValue = new UaStrings();
            for( i=0; i<bs.length; i++ ) initValue[i] = "HelloWorld#" + i;
            item.Value.Value.setStringArray( initValue );
            if( !WriteHelper.Execute( { NodesToWrite: item } ) ) {
                addError( "Unable to setup the array type for the test. Aborting test." );
                return( false );
            }
            ReadHelper.Execute( { NodesToRead: item } );
            print( item.Value.toString() );
            print( "\n\n\n---< Test will now resume >---\n\n" );
        }
        // set the indexRange �0:2,0:2�
        item.IndexRange = "0:2,0:2";
        var expectedValues = GetStringsAtIndexRange( item.Value.Value.toStringArray(), item.IndexRange );
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
            // wait and then call Publish() 
            PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
            PublishHelper.Execute();
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive the initial values." ) ) {
                // now to compare the value in the Publish response to the value read,
                // we are expecting a subset of the array data
                var publishedValues = PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.Value.toStringArray();
                addLog( "\n\nRead value RAW: " + item.InitialValue );
                addLog( "Publish received value: " + publishedValues );
                addLog( "Expected values: " + expectedValues );
                // now to make sure we received ONLY the values expected 
                print( "**** Comparing Publish results to our expectations ****" );
                Assert.Equal( expectedValues.length, publishedValues.length, "Publish did not yield the same information as expected." );
                for( i=0; i<expectedValues.length; i++ ) {
                    print( "\t" + (1+i) + ".) Expecting: '" + expectedValues[i] + "'; Received: '" + publishedValues[i] + "'." );
                    Assert.Equal( expectedValues[i], publishedValues[i], "Publish yielded a different value at position " + i + " than expected.", "IndexRange '" + item.IndexRange + "' expected '" + expectedValues[i] + "'; Received: '" + publishedValues[i] + "'."  );
                }
            }
        }
        // clean-up
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
        // revert the previous value 
        if( doInitialize ) {
            print( "\n\nReverting to original value." );
            item.IndexRange = "";
            item.Value.Value = item.InitialValue.clone();
            WriteHelper.Execute( { NodesToWrite: item } );
        }
        revertOriginalValuesScalarStatic();
    }
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591057 } );