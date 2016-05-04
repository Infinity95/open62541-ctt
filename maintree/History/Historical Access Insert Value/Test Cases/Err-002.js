/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: more requests than server can handle */

function hainsertval() {
    var maxItemsInCall = gServerCapabilities.OperationLimits.MaxNodesPerHistoryUpdateData;
    if( maxItemsInCall === 0 ) maxItemsInCall = 50;
    print( "Max # of transactions in an Update set to " + maxItemsInCall + " (detected value in Server.OperationLimits: " + gServerCapabilities.OperationLimits.MaxNodesPerHistoryUpdateData + ")" );

    CUVariables.HistoryUpdateParameters = { 
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: [],
          ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadTooManyOperations ] ) };

    var maxItems = MonitoredItem.GetRequiredNodes( { Number: maxItemsInCall, Settings: Settings.ServerTest.NodeIds.Static.HAProfile.Scalar.Settings } );

    for( var i=0; i<maxItems.length; i++ ) {
        var dt = parseInt( UaNodeId.GuessType( maxItems[i].NodeSetting ) );
        maxItems[i].SetValueMin( dt );

        // set the min value in our update request 
        CUVariables.HistoryUpdateParameters.HistoryUpdateDetails.push( 
            UaUpdateDataDetails.New( {
            NodeId: maxItems[i],
            PerformInsertReplace: PerformUpdateType.Insert,
            UpdateValues: [
                UaDataValue.New( { 
                    Value: maxItems[i].Value.Value,
                    StatusCode: StatusCode.Good,
                    SourceTimestamp: UaDateTime.utcNow(),
                    SourcePicoseconds: 0,
                    ServerTimestamp: UaDateTime.utcNow(),
                    ServerPicoseconds: 0 } )
                 ] } ) );
    }

    return( HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) );

}

Test.Execute( { Procedure: hainsertval } );