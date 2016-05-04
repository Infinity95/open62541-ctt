/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Provide an endpoint description Url with a hostname not known to the server. Service result = �Good�. Server returns a default EndpointUrl. */

function getendpoints552008() {
    GetEndpointsHelper.Execute2( { EndpointUrl:"opc.tcp://hostunknown:4840" } );
    Assert.GreaterThan( 0, GetEndpointsHelper.Response.Endpoints.length, "GetEndpoints().Response.Endpoints are empty; we expected the Server to return a list of endpoints from a default endpointUrl." );
    Assert.GreaterThan( 0, GetEndpointsHelper.Response.Endpoints[0].EndpointUrl.length, "GetEndpoints().Response[0].EndpointUrl is empty; expected a default endpointUrl to be specified.", "Received a default EndpointUrl of '" + GetEndpointsHelper.Response.Endpoints[0].EndpointUrl + "'." );
    return( true );
}

Test.Execute( { Procedure: getendpoints552008 } );