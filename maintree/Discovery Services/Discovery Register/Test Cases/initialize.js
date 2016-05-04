include( "./library/Base/connectChannel.js" )
include( "./library/Base/safeInvoke.js" );
include( "./library/ServiceBased/Helpers.js" );


function createSecureConnection() { 
    return( Test.Connect( { OpenSecureChannel: {
                                EndPointUrl: readSetting( "/Discovery/Endpoint Url" ),
                                MessageSecurityMode: readSetting( "/Discovery/MessageSecurityMode" ), 
                                RequestedSecurityPolicyUri: readSetting( "/Discovery/RequestedSecurityPolicyUri" ) } }
                ) ); 
}

function disconnectSecureConnection() { 
    Test.Disconnect();
}

// define pseudo server
var __uniqueId = 0;
var pseudoServer;
function getDefaultPseudoServer() {
    var pseudoServer = new RegisteredServer( { 
        DiscoveryUrls: [ "opc.tcp://localhost:4840/" ],
        GatewayServerUri: "",
        IsOnline: true,
        ProductUri: "opcfoundation:ctt:test",
        SemaphoreFilePath: "",
        ServerNames: [ "UACTT" + __uniqueId++ ],
        ServerType: ApplicationType.Server,
        ServerUri: "urn:localhost:opcfoundation:ctt" } );
    return( pseudoServer );
}

function resetServerRegistration() {
    if( isDefined( pseudoServer ) ) {
        print( "Resetting server registration (reset)" );
        pseudoServer.IsOnline = false;
        RegisterServerHelper.Execute( { Server: pseudoServer, SuppressValidation: true } );
    }
}

if( !Test.Connect() ) { 
    addError( "Unable to connect to Server. Please check settings." );
    stopCurrentUnit();
}
else Test.PostTestFunctions.push( resetServerRegistration );