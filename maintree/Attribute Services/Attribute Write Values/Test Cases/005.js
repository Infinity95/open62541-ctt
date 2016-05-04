/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write the minimum value for each supported data-type. Some items may fail with BadOutOfRange. */

function write005() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    if( !isDefined( items ) ) {
        addError( "No Scalar items configured. Aborting test." );
        return( false );
    }
    else {
        // read all items to get their initial value (we can write them back, after the test) and their data-type 
        if( ReadHelper.Execute( { NodesToRead: items } ) ) {
            var expectedResults = [];
            for( var i=0; i<items.length; i++ ) { 
                items[i].OriginalValue = items[i].Value.Value.clone(); // remember the current/original value 
                UaVariant.SetValueMin( { Value: items[i].Value } ); // set the value to the smallest supported, for its data-type
            }//for i..
            // the test-case allows for some types to return an error if the server has minimum size requirements that 
            // don't match what this script is doing.
            var typesThatMayFail = [ BuiltInType.ByteString, BuiltInType.String, BuiltInType.XmlElement, BuiltInType.DateTime ];
            var expectedResults = [];
            for( var i=0; i<items.length; i++ ) {
                var er = new ExpectedAndAcceptedResults( StatusCode.Good );
                for( var t=0; t<typesThatMayFail.length; t++ ) {
                    if( items[i].Value.Value.DataType === typesThatMayFail[t] ) er.addExpectedResult( StatusCode.BadOutOfRange );
                }// for t...
                expectedResults.push( er );
            }//for i...
            // issue the read and then check the results match our expectations (defined in paragraph above)
            Assert.True( WriteHelper.Execute( { NodesToWrite: items, OperationResults: expectedResults } ) );
        }// if read success 
    }
    return( true );
}

Test.Execute( { Procedure: write005 } );