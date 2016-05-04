/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org (29-Nov-2012)
    Description: Write NaN, to all floating points numbers. Expect Good, BadNotSupported, or BadOutOfRange */

function test023() {
    var items = MonitoredItem.fromSettings( [ "/Server Test/NodeIds/Static/DA Profile/AnalogType/Double", "/Server Test/NodeIds/Static/DA Profile/AnalogType/Float" ] );
    if( !isDefined( items ) || items.length == 0 ) {
        addSkipped( "No float/double items to test with. Please check settings." );
        return( false );
    }
    // read and store the original value for all items
    ReadHelper.Execute( { NodesToRead: items } );
    var expectedResults = [];
    for( var i=0; i<items.length; i++ ) {
        items[i].OriginalValue = items[i].Value.Value.clone();                   // store the original value; to revert later.
        items[i].SafelySetValueTypeKnown( NaN, items[i].Value.Value.DataType );  // set the values to NaN 
        expectedResults.push( new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotSupported, StatusCode.BadOutOfRange ] ) );
    }// for i...
    // our test
    WriteHelper.Execute( { NodesToWrite: items, OperationResults: expectedResults } );

    // clean-up and revert values 
    for( var i=0; i<items.length; i++ ) items[i].Value.Value = items[i].OriginalValue;
    WriteHelper.Execute( { NodesToWrite: items, OperationResults: expectedResults } );
    return( true );
}// function test023() 

Test.Execute( { Procedure: test023 } );