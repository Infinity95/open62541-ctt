/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: overwrite an existing record */

function hainsertval() {
    var haparams = { 
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: UaUpdateDataDetails.New(
                                  { NodeId: CUVariables.Items[0],
                                    PerformInsertReplace: 0x99,
                                    UpdateValues: [
                                        UaDataValue.New( { 
                                            Value: CUVariables.Items[0].Value[0].Value,
                                            StatusCode: StatusCode.Good,
                                            SourceTimestamp: CUVariables.Items[0].Value[0].ServerTimestamp,
                                            SourcePicoseconds: 0,
                                            ServerTimestamp: CUVariables.Items[0].Value[0].ServerTimestamp,
                                            ServerPicoseconds: 0 } )
                                         ] } ),
          OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.BadEntryExists ) ] };

    return( HistoryUpdateHelper.Execute( haparams ) );
}

Test.Execute( { Procedure: hainsertval } );