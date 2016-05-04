/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: For a given node, read the Value attribute, and request invalid DataEncoding, e.g. �Xml�. */

function read581err020() {
    // get an item to work with
    var item = originalScalarItems[0];

    var deQN = new UaQualifiedName();
    deQN.Name = "Xml";
    item.DataEncoding = deQN;

    return( ReadHelper.Execute( { NodesToRead: item, OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.BadDataEncodingInvalid ) ] } ) );
}// function write581err020()

Test.Execute( { Procedure: read581err020 } );