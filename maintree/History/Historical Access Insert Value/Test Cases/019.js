/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Insert multiple (5) values for multiple item in a single transaction */

function hainsertval() {
    // identify the max # of nodes in a call; if zero is specified then set a limit of 100.
    var maxNodes = parseInt( gServerCapabilities.MaxNodesPerHistoryUpdateData );
    if( maxNodes === 0 ) maxNodes = 100;

    var items = MonitoredItem.GetRequiredNodes( { Number: 500, Settings: Settings.ServerTest.NodeIds.Static.HAProfile.Scalar.Settings } );

    // prepare one large update request...
    var haparams = { 
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: [] };

    for( var i=0; i<maxNodes; i++ ) {
        haparams.HistoryUpdateDetails[i] = UaUpdateDataDetails.New(
                                              { NodeId: items[i],
                                                PerformInsertReplace: PerformUpdateType.Insert,
                                                UpdateValues: [ UaDataValue.New( {   StatusCode: StatusCode.Good,
                                                                                Value: CUVariables.Items[0].Value[0].Value,
                                                                                SourceTimestamp: UaDateTime.utcNow(),
                                                                                SourcePicoseconds: 0,
                                                                                ServerTimestamp: UaDateTime.utcNow(),
                                                                                ServerPicoseconds: 0 } ) ] } );
    }

    // invoke the update
    return( HistoryUpdateHelper.Execute( haparams ) );
}

Test.Execute( { Procedure: hainsertval } );