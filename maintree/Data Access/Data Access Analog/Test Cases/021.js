/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: TranslateBrowsePathToNodeIds requests InstrumentRange, EURange, and EngineeringUnits for all AnalogItems. */

function analog613021() {
    var item1;
    // expectations when seeking properties: InstrumentRange, EURange, and EngineeringUnits
    var expectedResults = [ 
        new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] ),
        new ExpectedAndAcceptedResults( [ StatusCode.Good ] ),
        new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] )
        ];
    // iterate thru each configured analog item
    for( var i=0; i<AnalogItems.length; i++ ) {
        // define the 3 browse paths, to obtain the 3 properties 
        var uaBrowsePaths = [ 
            TranslateBrowsePathsToNodeIdsHelper.stringsToBrowsePaths( AnalogItems[i], [ "InstrumentRange" ] ), 
            TranslateBrowsePathsToNodeIdsHelper.stringsToBrowsePaths( AnalogItems[i], [ "EURange" ] ), 
            TranslateBrowsePathsToNodeIdsHelper.stringsToBrowsePaths( AnalogItems[i], [ "EngineeringUnits" ] ) 
            ];
         // call Translate
         if( !TranslateBrowsePathsToNodeIdsHelper.Execute( { Node: AnalogItems[i], UaBrowsePaths: uaBrowsePaths, OperationResults: expectedResults, } ) ) return( false );
    }//for i
    // clean-up
    item1 = null;
    return( true );
}// function analog613021()

Test.Execute( { Procedure: analog613021 } );