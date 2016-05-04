/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Insert multiple (5) values for a single item in a single transaction; qualities are BAD */

function hainsertval() {
    const NUM_VALUES = 5;
    var expectedResults = [];

    // prepare one large update request... and specify the expected 'insert' results... 
    var haparams = { 
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: [],
          OperationResults: expectedResults };

    expectedResults[0] = new ExpectedAndAcceptedResults( StatusCode.GoodEntryInserted );
    expectedResults[0].TransactionResults = [];
    haparams.HistoryUpdateDetails[0] = UaUpdateDataDetails.New(
                                          { NodeId: CUVariables.Items[0],
                                            PerformInsertReplace: PerformUpdateType.Insert,
                                            UpdateValues: [] } );
    for( var i=0; i<NUM_VALUES; i++ ) {
        haparams.HistoryUpdateDetails[0].UpdateValues[i] = UaDataValue.New( {   StatusCode: StatusCode.Bad,
                                                                                Value: CUVariables.Items[0].Value[0].Value,
                                                                                SourceTimestamp: UaDateTime.utcNow(),
                                                                                SourcePicoseconds: 0,
                                                                                ServerTimestamp: UaDateTime.utcNow(),
                                                                                ServerPicoseconds: 0 } );
        expectedResults[0].TransactionResults[i] = new ExpectedAndAcceptedResults( StatusCode.Good );
        if( i < NUM_VALUES - 1 ) wait( 100 );
    }

    // invoke the update
    return( HistoryUpdateHelper.Execute( haparams ) );
}

Test.Execute( { Procedure: hainsertval } );