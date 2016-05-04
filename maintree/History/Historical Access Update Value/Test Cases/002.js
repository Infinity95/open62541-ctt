/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: update the a record where the timestamp has no data (should insert a record) */

function hainsertval() {
    // get a date that is NOT in the historian
    var newDate = OPCF.HA.Analysis.Date.GenerateNew( { RawData: CUVariables.Items[0].RawValues,
                                                         StartDate: CUVariables.Items[0].RawValues[1].SourceTimestamp,
                                                         OffsetMSEC: -105 } );

    var expectedResults = [ new ExpectedAndAcceptedResults( StatusCode.GoodEntryInserted ) ];
    expectedResults[0].TransactionResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];

    var params = {  Debug: CUVariables.Debug,
                    HistoryUpdateDetails: UaUpdateDataDetails.New( {
                        NodeId: CUVariables.Items[0].NodeId,
                        PerformInsertReplace: PerformUpdateType.Update,
                        UpdateValues: [ 
                            UaDataValue.New( { Value: UaVariant.Increment( { Value: CUVariables.Items[0].RawValues[0].Value } ),
                                               SourceTimestamp: newDate,
                                               ServerTimestamp: newDate,
                                               StatusCode: CUVariables.Items[0].RawValues[0].StatusCode } )
                            ] } ),
                    OperationResults: [ new ExpectedResults( { Expected: StatusCode.Good, 
                                                               TransactionResults: [
                                                                       new ExpectedResults( { Expected: StatusCode.GoodEntryInserted } )
                                                                   ] } ) ] };

    return( HistoryUpdateHelper.Execute( params ) );
}

Test.Execute( { Procedure: hainsertval } );