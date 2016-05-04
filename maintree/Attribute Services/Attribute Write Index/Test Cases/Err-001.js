/*  Test 5.8.2 Error Test 10; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to Invalid elements (IndexRage=MaxInt32 / 2) of a Node. Do this for each core data-type.
        Operation level result is �Bad_IndexRangeNoData� or Bad_WriteNotSupported */

function write582Err010() {
    var expectedResults = [];
    var invalidIndexRange = ( ( Constants.Int32_Max + 1 ) / 2 );
    for( var i=0; i<items.length; i++ ) {
        expectedResults[i] = new ExpectedAndAcceptedResults( StatusCode.BadIndexRangeNoData );
        expectedResults[i].addExpectedResult( StatusCode.BadWriteNotSupported );

        // specify invalid index range
        items[i].IndexRange = invalidIndexRange + ":" + ( invalidIndexRange + items[i].OriginalValue.getArraySize() );
        // specify the original values to write
        items[i].Value.Value = items[i].OriginalValue.clone();
    }

    //WRITE the nodes.
    WriteHelper.Execute( { NodesToWrite: items, OperationResults: expectedResults, CheckNotSupported: true, ReadVerification: false } );
    return( true );
}

Test.Execute( { Procedure: write582Err010 } );