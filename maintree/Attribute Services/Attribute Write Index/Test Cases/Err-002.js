/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to Invalid elements "2:1" of a Node. Do this for each core data-type. */

function write582Err011() {
    var expectedResults = [];
    for( var i=0; i<items.length; i++ ) {
        expectedResults[i] = new ExpectedAndAcceptedResults( StatusCode.BadIndexRangeInvalid );

        // specify invalid index range
        items[i].IndexRange = "2:1";
        // specify the original values to write
        items[i].Value.Value = items[i].OriginalValue.clone();
    }

    //WRITE the nodes.
    WriteHelper.Execute( { NodesToWrite:items, OperationResults:expectedResults, CheckNotSupported:true, ReadVerification:false } );
    return( true );
}

Test.Execute( { Procedure: write582Err011 } );