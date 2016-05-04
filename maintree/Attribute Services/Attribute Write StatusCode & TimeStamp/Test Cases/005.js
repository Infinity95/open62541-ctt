/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to a single valid Node a Value only. Do not specify a StatusCode or any Timestamps.*/

function write582014() {
    var item = scalarNodes[0].clone();
    InitializeValue( item.Value.Value, UaNodeId.GuessType( item.NodeSetting ) );
    return( WriteHelper.Execute( { NodesToWrite: item } ) );
}

Test.Execute( { Procedure: write582014 } );