/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to an invalid attribute of a valid node. */

function write582Err008() {
    var item = originalScalarValues[0].clone();
    GenerateScalarValue( item.Value.Value, NodeIdSetting.guessType( item.NodeSetting ) );
    item.AttributeId = 0;
    return( WriteHelper.Execute( { NodesToWrite: item, OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadAttributeIdInvalid ), ReadVerification: false } ) );
}

Test.Execute( { Procedure: write582Err008 } );