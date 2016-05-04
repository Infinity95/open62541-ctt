/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: endpointUrl=null.
    Expected results: Good and contains default Url
*/

function getEndpoints552err001() {
    if( GetEndpointsHelper.Execute2( { EndpointUrl:"null", ExpectedResults: new ExpectedAndAcceptedResults( StatusCode.Good ) } ) ) {
        Assert.GreaterThan( 0, GetEndpointsHelper.Response.Endpoints.length, "With no EndpointUrl specified, the Server returned 'Good' but did not return a default endpoint; expected a default endpoint!" );
    }
    return( true );
}

Test.Execute( { Procedure: getEndpoints552err001 } );