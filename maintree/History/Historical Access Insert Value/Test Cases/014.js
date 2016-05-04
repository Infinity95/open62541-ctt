/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: insert the same record over again */

function hainsertval() {
    var expectedResults = new ExpectedAndAcceptedResults( StatusCode.GoodEntryInserted );
    expectedResults.TransactionResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];

    var haparams = { 
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
            OperationResults: [ expectedResults ] };

    var result = true;
    var testResults = [ StatusCode.GoodEntryInserted, StatusCode.BadEntryExists, StatusCode.BadEntryExists ];

    for( var i=0; i<3; i++ ) {
        expectedResults.ExpectedResults[0].StatusCode = testResults[i];
        if( !HistoryUpdateHelper.Execute( haparams ) ) result = false;
    }


    return( result );
}

Test.Execute( { Procedure: hainsertval } );