/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: insert a record timestamp is 'now' */

function hainsertval() {
    var expectedResults = [ new ExpectedAndAcceptedResults( StatusCode.GoodEntryInserted ) ];
    expectedResults[0].TransactionResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];

    CUVariables.HistoryUpdateParameters = { 
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: UaUpdateDataDetails.New(
                                  { NodeId: CUVariables.Items[0],
                                    PerformInsertReplace: PerformUpdateType.Insert,
                                    UpdateValues: [
                                        UaDataValue.New( { 
                                            Value: CUVariables.Items[0].Value[0].Value,
                                            StatusCode: StatusCode.Good,
                                            SourceTimestamp: UaDateTime.utcNow(),
                                            SourcePicoseconds: 0,
                                            ServerTimestamp: UaDateTime.utcNow(),
                                            ServerPicoseconds: 0 } )
                                         ] } ),
          OperationResults: expectedResults };

    return( HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) );
}

Test.Execute( { Procedure: hainsertval } );