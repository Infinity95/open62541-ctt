/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Vary the index range on a 2d ByteString array, where:
            Case 1: x = 2, y = 2
            Case 2: x = max index of array, y = 2
            Case 3: x = 2, y = max  size of string
            Case 4: x = max index of array, y = max  size of string
        Expectations:
            Case 1: three first characters of three first strings
            Case 2: three first characters of three last strings
            Case 3: three last  characters of three first strings
            Case 4: three last  characters of three last strings */

function test020() {
    const SETTING = "/Server Test/NodeIds/Static/All Profiles/Arrays/ByteString";
    var item = MonitoredItem.fromSetting( SETTING );
    if( !isDefined( item ) ) {
        addSkipped( "String array not defined in setting: " + SETTING + "s." );
        return( false );
    }

    // get the raw array values first
    ReadHelper.Execute( { NodesToRead: item } );
    var rawValue = item.Value.Value.toByteStringArray();
    print( "raw value: " + rawValue.toString() );

    // is the array large enough for this test?
    if( 4 >= rawValue.length ) {
        addSkipped( "The array is too small and needs to be increased, preferably [5][5] as a minumum." );
        return( false );
    }

    // find shortest element in bytestring array
    var minLength = 999999;
    for (var i = 0; i < rawValue.length; i++) {
        if (rawValue[i].length < minLength) minLength = rawValue[i].length;
    }

    // prepare an array of the index range tests which we can feed into a loop.
    var indexRangeTests = [];
    indexRangeTests.push( "0:2,0:2" ); // 1st 3 chars of 1st 3-strings
    indexRangeTests.push( ( rawValue.length - 3 ) + ":" + ( rawValue.length - 1 ) + ",0:2" ); //first 3-chars of last 3-strings
    indexRangeTests.push( "0:2," + ( minLength - 3 ) + ":" + ( minLength - 1 ) ); //last 3-chars of first 3-strings
    indexRangeTests.push( ( rawValue.length - 3 ) + ":" + ( rawValue.length - 1 ) + "," + ( minLength - 3 ) + ":" + ( minLength - 1 ) ); //last 3-chars of last 3-strings

    print( "IndexRange tests:\n\t" + indexRangeTests.toString() );

    // calculate the indexrange to obtain the first three characters of the first three strings.
    for( var t=0; t<indexRangeTests.length; t++ ) {
        item.IndexRange = indexRangeTests[t];
        var expectedValue = GetByteStringsAtIndexRange( rawValue, item.IndexRange );

        // create the monitored item and then compare the value in Publish matches expectations
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: MonitorBasicSubscription } ) ) {
            PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
            PublishHelper.Execute( { FirstPublish: true } );
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() expected to receive the initial value dataChange notification." ) ) {
                // compare value received vs. value expected
                var valueReceived = PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.Value.toByteStringArray();
                if( Assert.Equal( expectedValue.length, valueReceived.length, "Publish() received a value where the array-length did not match the expected length." ) ) {
                    Assert.Equal( expectedValue[0], valueReceived[0], "Publish() returned a value for the indexRange '" + item.IndexRange + "' that did not match expectations.\n", "Publish() returned expected value for IndexRange '" + item.IndexRange + "' expected: '" + expectedValue[0] + "'; received: '" + valueReceived[0] + "'." );
                }
            }
            // clean-up
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
        }
    }// for t...
    return( true );
}// function test020()

Test.Execute( { Procedure: test020 } );