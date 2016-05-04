/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Vary the index range on a 2d string array, where:
            Case 1: x = 2, y = 2
            Case 2: x = max index of array, y = 2
            Case 3: x = 2, y = max  size of string
            Case 4: x = max index of array, y = max  size of string
        Expectations:
            Case 1: three first characters of three first strings
            Case 2: three first characters of three last strings
            Case 3: three last  characters of three first strings
            Case 4: three last  characters of three last strings */

function getMinStringSizeInArray( strings ) {
    var minLen = Constants.Int32_Max;
    if( isDefined( strings ) && isDefined( strings.length ) ) {
        for( var i=0; i<strings.length; i++ ) {
            if( strings[i].length < minLen ) minLen = strings[i].length;
        }//for i
    }
    return( minLen );
}

function createMonitoredItems591075() {
    var item = MonitoredItem.fromSetting( "/Server Test/NodeIds/Static/All Profiles/Arrays/String" );
    if( !isDefined( item ) ) {
        addSkipped( "String array not defined in settings. Aborting test." );
        return( false );
    }

    // get the raw array values first
    ReadHelper.Execute( { NodesToRead: item } );
    var rawValue = item.Value.Value.toStringArray();
    print( "raw value: " + rawValue.toString() );

    // is the array large enough for this test?
    if( 4 >= rawValue.length ) {
        addSkipped( "The array is too small and needs to be increased, preferably [5][5] (i.e. 5-strings with each string being 5-characters as a minumum)." );
        return( false );
    }

    var minArrayLength = getMinStringSizeInArray( rawValue );
    if( minArrayLength < 4 ) {
        addError( "CONFIGURATION: Array element(s) are too short. String lengths need to be a minimum of 4 characters long. Smallest element size found: " + minArrayLength );
        return( false );
    }

    // prepare an array of the index range tests which we can feed into a loop.
    var indexRangeTests = [];
    indexRangeTests.push( "0:2,0:2" ); // 1st 3 chars of 1st 3-strings
    indexRangeTests.push( ( rawValue.length - 3 ) + ":" + ( rawValue.length - 1 ) + ",0:2" ); //first 3-chars of last 3-strings
    indexRangeTests.push( "0:2," + ( rawValue[0].length - 3 ) + ":" + ( rawValue[0].length - 1 ) ); //last 3-chars of first 3-strings
    indexRangeTests.push( ( rawValue.length - 3 ) + ":" + ( rawValue.length - 1 ) + "," + ( minArrayLength - 3 ) + ":" + ( minArrayLength - 1 ) ); //last 3-chars of last 3-strings

    // calculate the indexrange to obtain the first three characters of the first three strings.
    for( var t=0; t<indexRangeTests.length; t++ ) { 
        item.IndexRange = indexRangeTests[t];
        var expectedValue = GetStringsAtIndexRange( rawValue, item.IndexRange );

        // create the monitored item and then compare the value in Publish matches expectations
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: MonitorBasicSubscription } ) ) {
            PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
            PublishHelper.Execute( { FirstPublish: true } );
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() expected to receive the initial value dataChange notification. Testing IndexRange: '" + item.IndexRange + "'." ) ) {
                // allow the 3rd test to fail because it cannot succeed with jagged arrays
                if( t==2 && PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.StatusCode === StatusCode.BadOutOfRange ) {
                    addWarning( "Jagged array detected because the Server rejected the request for last 3 items of first 3 strings." );
                }
                else if( Assert.True( PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.StatusCode.isGood(), "Publish.Response.NotificationData.DataChangeNotification.MonitoredItems[0].Value.StatusCode is bad; expected Good. Testing IndexRange: '" + item.IndexRange + "'." ) ) {
                    // compare value received vs. value expected
                    var valueReceived = PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.Value.toStringArray();
                    Assert.Equal( expectedValue.length, valueReceived.length, "Publish() received a value where the array-length did not match the expected length. Testing IndexRange: '" + item.IndexRange + "'." );
                    Assert.Equal( expectedValue[0], valueReceived[0], "Publish() returned a value for the indexRange '" + item.IndexRange + "' that did not match expectations.\n", "Publish() returned expected value for IndexRange '" + item.IndexRange + "' expected: '" + expectedValue[0] + "'; received: '" + valueReceived[0] + "'. Testing IndexRange: '" + item.IndexRange + "'." );
                }// if good quality
            }
            // clean-up
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
        }
    }// for t...
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591075 } );