/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to a single valid Node a Value and ServerTimestamp only. Expect Good or Bad_WriteNotSupported. */

function write582017() {
    var item = scalarNodes[0].clone();
    InitializeValue( item.Value.Value, UaNodeId.GuessType( item.NodeSetting ) );
    item.Value.ServerTimestamp = UaDateTime.utcNow();
    item.Value.Set = "ServerTimestamp;Value"
    if( WriteHelper.Execute( { NodesToWrite: item, OperationResults: WriteExpectedResult } ) ) {
        if( WriteHelper.Response.Results[0].isGood() ) VQTsupport |= UaVQTSupport.ServerTimestamp | UaVQTSupport.Value;
        else {
            addNotSupported( "Writing to ServerTimestamp+Value" );
            return( false );
        }
    }
    else return( false );
    return( true );
}

Test.Execute( { Procedure: write582017 } );