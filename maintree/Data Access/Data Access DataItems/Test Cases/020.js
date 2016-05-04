/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: For all items configured of this type, invoke a Read() requesting the following attributes: Value, DataType, AccessLevel, and MinimumSamplingInterval. */

function cloneItemForAttributes( item, attributes ) {
    var newItems = [];
    for( var i=0; i<attributes.length; i++ ) {
        var n = MonitoredItem.Clone( item );
        n.AttributeId = attributes[i];
        newItems.push( n );
    }
    return( newItems );
}

function translate64020() {
    // set our expectations
    var expectedAttributes = [ Attribute.Value, Attribute.DataType, Attribute.AccessLevel, Attribute.MinimumSamplingInterval ];
    var expectedResultsDefinition = [ 
            new ExpectedAndAcceptedResults( StatusCode.Good ) ,
            new ExpectedAndAcceptedResults( StatusCode.Good ) ,
            new ExpectedAndAcceptedResults( StatusCode.Good ) ,
            new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadAttributeIdInvalid ] ) ,
        ];

    // iterate thru each item and test above expectations
    var itemValues = [];
    var expectedResults = [];
    for( var i=0; i<allDataItems.length; i++ ) {
        // build an array of items to read 
        itemValues = itemValues.concat( cloneItemForAttributes( allDataItems[i], expectedAttributes ) );
        expectedResults = expectedResults.concat( expectedResultsDefinition );
        if( !isDefined( itemValues ) ) throw( "Check script, error cloning item into multiple-per-attribute." );
    }//for i

    ReadHelper.Execute( {
            NodesToRead: itemValues,
            OperationResults: expectedResults
            } );
    return( true );
}

Test.Execute( { Procedure: translate64020 } );