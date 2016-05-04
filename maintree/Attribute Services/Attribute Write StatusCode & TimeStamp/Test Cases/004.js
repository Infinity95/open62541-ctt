/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to a single valid Node a Value and SourceTimestamp. */

function write582013() {
    var item = scalarNodes[0].clone();
    GenerateScalarValue( item.Value.Value, UaNodeId.GuessType( item.NodeSetting ) );

    // write the value and sourceTimestamp only
    item.Value.Value = item.Value.Value;
    item.Value.SourceTimestamp = UaDateTime.utcNow();
    item.Value.SourceTimestamp.addHours(1);
    item.Value.Set = "Value;SourceTimestamp";
    if( WriteHelper.Execute( { NodesToWrite: item, OperationResults: WriteExpectedResult } ) ) {
        if( WriteHelper.Response.Results[0].isGood() ) VQTsupport |= UaVQTSupport.SourceTimestamp;
        else {
            addNotSupported( "Writing to SourceTimestamp" );
            return( false );
        }
    }
    else return( false );
    return( true );
}

Test.Execute( { Procedure: write582013 } );