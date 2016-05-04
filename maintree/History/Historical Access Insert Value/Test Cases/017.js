/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: insert a value for a variety of known/valid/invalid/unknown nodes */

function hainsertval() {
    var expectedResults = [ new ExpectedAndAcceptedResults( StatusCode.GoodEntryInserted ),
                            new ExpectedAndAcceptedResults( StatusCode.BadNodeIdInvalid ),
                            new ExpectedAndAcceptedResults( StatusCode.GoodEntryInserted ),
                            new ExpectedAndAcceptedResults( StatusCode.BadNodeIdUnknown ) ];
    var testNodeIds = [ CUVariables.Items[0],
                        MonitoredItem.fromSettings( Settings.Advanced.NodeIds.Invalid.Invalids )[0],
                        CUVariables.Items[1],
                        MonitoredItem.fromSettings( Settings.Advanced.NodeIds.Invalid.Unknowns )[0] ];
    var haparams = { 
          Debug: CUVariables.Debug,
          OperationResults: expectedResults,
          HistoryUpdateDetails: [ ] };

    for( var i=0; i<expectedResults.length; i++ ) {
        haparams.HistoryUpdateDetails[i] = UaUpdateDataDetails.New( { 
                                    NodeId: testNodeIds[i],
                                    PerformInsertReplace: PerformUpdateType.Insert,
                                    UpdateValues: [
                                        UaDataValue.New( { 
                                            Value: CUVariables.Items[0].Value[0].Value,
                                            StatusCode: StatusCode.Good,
                                            SourceTimestamp: UaDateTime.utcNow(),
                                            SourcePicoseconds: 0,
                                            ServerTimestamp: UaDateTime.utcNow(),
                                            ServerPicoseconds: 0 } )
                                         ] } );
    }

    var result = HistoryUpdateHelper.Execute( haparams );


    return( result );
}

Test.Execute( { Procedure: hainsertval } );