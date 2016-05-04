/*  Test prepared by compliance@opcfoundation.org
    Description: Write() to an element that is outside of the bounds of the array, e.g. IndexRange="[length+2]".
*/

function write582006() { 
    var expectedResults = [];

    // specify invalid index range and generate values for each core data type
    for( var i=0; i<items.length; i++ ) {
        expectedResults[i] = new ExpectedAndAcceptedResults( [ StatusCode.BadOutOfRange, StatusCode.BadIndexRangeNoData, StatusCode.Good ] );
        items[i].IndexRange = items[i].Value.Value.getArraySize() + 2;
        items[i].Value.Value = generateArrayWriteValue(0, 0, items[i].Value.Value.DataType);
    }

    //WRITE the nodes.
    return( WriteHelper.Execute( { NodesToWrite: items, OperationResults: expectedResults, CheckNotSupported: true, ReadVerification: false } ) );
}

Test.Execute( { Procedure: write582006 } );