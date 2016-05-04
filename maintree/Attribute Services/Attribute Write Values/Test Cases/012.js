/*  Test prepared by compliance@opcfoundation.org 
    Description: Write() a value of NaN to all configured floating point numbers (Float, Double & Duration). */

function write582027() {
    // Get the float,double and duration setting 
   var settingScalar = ( ["/Server Test/NodeIds/Static/All Profiles/Scalar/Float", "/Server Test/NodeIds/Static/All Profiles/Scalar/Double", "/Server Test/NodeIds/Static/All Profiles/Scalar/Duration"] );
   var settingArray  = ( ["/Server Test/NodeIds/Static/All Profiles/Arrays/Float", "/Server Test/NodeIds/Static/All Profiles/Arrays/Double"] );
   var expectedResults = [];

   // test the SCALAR
   var itemsScalar = MonitoredItem.fromSettings( settingScalar );
      if( !isDefined( itemsScalar ) || itemsScalar.length === 0 ) {
        addSkipped( " Node type(s) not configured within the setting: " + settingScalar + "." );
        return( false );
    }
    if( ReadHelper.Execute( { NodesToRead: itemsScalar } ) ) {
        // Set item value to NaN and write the value
        for( var i=0; i<itemsScalar.length; i++ ) {
            setValue( itemsScalar[i], "NaN", itemsScalar[i].Value.Value.DataType );
            expectedResults[i] = new ExpectedAndAcceptedResults( [ StatusCode.BadOutOfRange, StatusCode.BadIndexRangeNoData, StatusCode.Good ] );
        }
        WriteHelper.Execute( { NodesToWrite: itemsScalar, OperationResults: expectedResults, CheckNotSupported: true, ReadVerification: false } );
    }// if

    // test the ARRAYs
    var expectedResultsArray = [];
    var arrayWriteValues = [];
    var itemsArray  = MonitoredItem.fromSettings( settingArray );
    if( !isDefined( itemsArray ) || itemsArray.length === 0 ) {
        addSkipped( "Node type(s) not configured within the setting: " + settingArray + "." );
        return( false );
    }
    if( ReadHelper.Execute( { NodesToRead: itemsArray } ) ) {
        for ( var j=0; j<itemsArray.length; j++ ) {
            // cache the values so that we can revert them
            itemsArray[j].OriginalValue = itemsArray[j].Value.Value.clone();
            expectedResultsArray[j] = new ExpectedAndAcceptedResults( [ StatusCode.BadOutOfRange, StatusCode.BadIndexRangeNoData, StatusCode.Good ] );
            valueLen = itemsArray[j].Value.Value.getArraySize();
            for (var jj=0; jj<valueLen; jj++ ) { arrayWriteValues[jj] = NaN; }
            // We can't be sure that a zero-length array can be changed, so make sure the array is populated
            if( Assert.GreaterThan( 0, valueLen, "The array is currently empty. Please reconfigure the array with a value and test again." ) ) {
                setValue( itemsArray[j], arrayWriteValues, itemsArray[j].Value.Value.DataType, true );
            }
        }// for(var j = 0;
        // Write the value; we expect it to succeed
        WriteHelper.Execute( { NodesToWrite: itemsArray, OperationResults: expectedResultsArray, CheckNotSupported: true, ReadVerification: false } );

        // revert to original values 
        for( var i=0; i<itemsArray.length; i++ ) itemsArray[i].Value.Value = itemsArray[i].OriginalValue.clone();
        WriteHelper.Execute( { NodesToWrite: itemsArray, ReadVerification: false } );
    }
    else return( false );
    return( true );
}

Test.Execute( { Procedure: write582027 } );