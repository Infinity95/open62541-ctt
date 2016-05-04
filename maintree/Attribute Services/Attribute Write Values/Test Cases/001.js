/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to the Value attribute (without statusCode, sourceTimestamp, or serverTimestamp) of a valid nodeId. */

function write582001() {
    var item = originalScalarValues[0].clone();
    UaVariant.Increment( { Value: item.Value } );
    return( WriteHelper.Execute( { NodesToWrite: item, 
                                   OperationResults: [ new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadWriteNotSupported ] ) ], 
                                   ReadVerification: false,
                                   CheckNotSupported: true } ) );
}

Test.Execute( { Procedure: write582001 } );