/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Insert 1 x BAD quality value, for multiple items in a single transaction */

function hainsertval() {
    var expectedResults = [];

    // prepare one large update request... and specify the expected 'insert' results... 
    var haparams = { 
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: [],
          OperationResults: expectedResults };

    for( var i=0; i<CUVariables.Items.length; i++ ) {
        haparams.HistoryUpdateDetails.push( UaUpdateDataDetails.New(
                                              { NodeId: CUVariables.Items[i],
                                                PerformInsertReplace: PerformUpdateType.Insert,
                                                UpdateValues: [
                                                    UaDataValue.New( { 
                                                        Value: CUVariables.Items[i].Value[0].Value,
                                                        StatusCode: StatusCode.Bad,
                                                        SourceTimestamp: UaDateTime.utcNow(),
                                                        SourcePicoseconds: 0,
                                                        ServerTimestamp: UaDateTime.utcNow(),
                                                        ServerPicoseconds: 0 } )
                                                     ] } ) );
        var expectedResult = new ExpectedAndAcceptedResults( StatusCode.GoodEntryInserted );
        expectedResult.TransactionResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];
        expectedResults.push( expectedResult );
    }// for i

    // invoke the update
    return( HistoryUpdateHelper.Execute( haparams ) );
}

Test.Execute( { Procedure: hainsertval } );