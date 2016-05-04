/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to the Value attribute a Value, StatusCode and TimestampSource, but do not specify a TimestampServer. */

function write582016() {
    var item = scalarNodes[0].clone();
    InitializeValue( item.Value.Value, UaNodeId.GuessType( item.NodeSetting ) );
    item.Value.StatusCode.StatusCode = StatusCode.GoodLocalOverride;
    item.Value.SourceTimestamp = UaDateTime.utcNow();
    item.Value.Set = "ServerTimestamp;StatusCode;Value"
    if( WriteHelper.Execute( { NodesToWrite: item, TimestampsToReturn: TimestampsToReturn.Both } ) ) {
        if( WriteHelper.Response.Results[0].isGood() ) {
            VQTsupport |= UaVQTSupport.ServerTimestamp | UaVQTSupport.StatusCode | UaVQTSupport.Value;
            return( true );
        }
        else {
            addNotSupported( "Writing to ServerTimestamp+StatusCode+Value" );
            return( false );
        }
    }
    else return( false );
}

Test.Execute( { Procedure: write582016 } );