/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Script calls FindServers and GetEndpoints. Script compares the ServerUri/ApplicationUri in all locations. The values must match.
        Searching the following locations:
            FindServers.Servers[0].ApplicationUri.
            GetEndpoints.Results[0].?
            AddressSpace->ServerArray[0]
            AddressSpace->NamespaceArray[1] */

function checkApplicationUri() {
    var obj = new Object();
    // find servers
    if( FindServersHelper.Execute() ) obj.FindServers = FindServersHelper.Response.Servers[0].ApplicationUri;

    // get endpoints
    if( GetEndpointsHelper.Execute() ) {
        if( GetEndpointsHelper.Response.Endpoints.length > 0 ) {
            obj.GetEndpoints = GetEndpointsHelper.Response.Endpoints[0].Server.ApplicationUri;
            //obtain appUri from serverCertificate
            var serverCert = UaPkiCertificate.fromDER( GetEndpointsHelper.Response.Endpoints[0].ServerCertificate );
            obj.ServerCertificate = serverCert.ApplicationUri;
        }
    }

    // address space 
    var serverArray = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.Server_ServerArray ) )[0];
    var namespaceArray = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.Server_NamespaceArray ) )[0];
    if( ReadHelper.Execute( { NodesToRead: [ serverArray, namespaceArray ] } ) ) {
        var strArray;
        if( serverArray.Value.Value.getArraySize() > 0 ) {
            strArray = serverArray.Value.Value.toStringArray();
            obj.ServerArray = strArray[0];
        }
        if( namespaceArray.Value.Value.getArraySize() > 0 ) {
            strArray = namespaceArray.Value.Value.toStringArray();
            obj.NamespaceArray = strArray[1];
        }
    }

    // now compare that all values in our object are equal
    if( !Assert.True( obj.FindServers == obj.GetEndpoints && obj.GetEndpoints == obj.ServerArray && obj.ServerArray == obj.NamespaceArray, "(insecure connection) ApplicationUri must match in all places where it is used." ) ) {
        addError( "ApplicationUri in FindServers: " + obj.FindServers +
                "\nApplicationUri in GetEndpoints: " + obj.GetEndpoints +
                "\nApplicationUri in ServerArray: " + obj.ServerArray +
                "\nApplicationUri in NamespaceArray: " + obj.NamespaceArray );
    }
    return( true );
}// function checkApplicationUri()

Test.Execute( { Procedure: checkApplicationUri } );