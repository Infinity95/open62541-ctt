/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: update the first record */

function hainsertval() {
    var expectedResults = [ new ExpectedAndAcceptedResults( StatusCode.GoodEntryInserted ) ];
    expectedResults[0].TransactionResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];

    var params = {  Debug: CUVariables.Debug,
                    HistoryUpdateDetails: UaUpdateDataDetails.New( {
                        NodeId: CUVariables.Items[0].NodeId,
                        PerformInsertReplace: PerformUpdateType.Update,
                        UpdateValues: [ 
                            UaDataValue.New( { Value: UaVariant.Increment( { Value: CUVariables.Items[0].RawValues[0].Value } ),
                                               SourceTimestamp: CUVariables.Items[0].RawValues[0].SourceTimestamp,
                                               ServerTimestamp: CUVariables.Items[0].RawValues[0].ServerTimestamp,
                                               StatusCode: CUVariables.Items[0].RawValues[0].StatusCode } )
                            ] } ),
                    OperationResults: [ new ExpectedResults( { Expected: StatusCode.Good, 
                                                               TransactionResults: [
                                                                       new ExpectedResults( { Expected: StatusCode.GoodEntryReplaced } )
                                                                   ] } ) ] };

    return( HistoryUpdateHelper.Execute( params ) );
}

Test.Execute( { Procedure: hainsertval } );