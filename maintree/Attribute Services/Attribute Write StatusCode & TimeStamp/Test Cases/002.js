/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to a single valid Node a VTQ by passing the Value, Quality and sourceTimestamp. */

function write582011() {
var sourceTimeOffset = 5000
var item = scalarNodes[0].clone();
    GenerateScalarValue( item.Value.Value, UaNodeId.GuessType( item.NodeSetting ) );
    item.Value.StatusCode.StatusCode = StatusCode.GoodClamped;
    item.Value.SourceTimestamp = UaDateTime.utcNow();
    item.Value.SourceTimestamp.addMilliSeconds(sourceTimeOffset);
    item.Value.Set = "Value;StatusCode;SourceTimestamp";
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

Test.Execute( { Procedure: write582011 } );