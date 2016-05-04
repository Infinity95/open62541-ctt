/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to the value attribute a Value, a TimestampServer and TimestampSource, but do not specify a StatusCode. */

function write582015() {
    var sourceTimeOffset = 500; // milliseconds (in the past)
    var serverTimeOffset = 600;

    var item = scalarNodes[0].clone();
    InitializeValue( item.Value.Value, UaNodeId.GuessType( item.NodeSetting ) );
    item.Value.SourceTimestamp = UaDateTime.utcNow();
    item.Value.SourceTimestamp.addMilliSeconds(-sourceTimeOffset);
    item.Value.ServerTimestamp = UaDateTime.utcNow();
    item.Value.ServerTimestamp.addMilliSeconds(-serverTimeOffset);
    item.Value.Set = "ServerTimestamp;SourceTimestamp;Value"
    if( WriteHelper.Execute( { NodesToWrite: item, TimestampsToReturn: TimestampsToReturn.Both, OperationResults: WriteExpectedResult } ) ) {
        if( WriteHelper.Response.Results[0].isGood() ) {
            VQTsupport |= UaVQTSupport.ServerTimestamp | UaVQTSupport.SourceTimestamp | UaVQTSupport.Value;
            return( true );
        }
        else {
            addNotSupported( "Writing to ServerTimestamp+SourceTimestamp+Value" );
            return( false );
        }
    }
    else return( false );
}

Test.Execute( { Procedure: write582015 } );