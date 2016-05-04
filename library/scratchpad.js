var g_channel = new UaChannel();
var g_session = new UaSession(g_channel);

var serverCertificate;
var clientCertificate;
var clientPrivateKey;
var sUrl = "https://localhost:48032";
//var sUrl = "opc.tcp://localhost:4841";


// get server certificate
getEndpoints(sUrl);

// connect channel
addLog("Connect to: " + sUrl)
g_channel.connect(sUrl);

// create session
createSession(g_session);

// activate session
activateSession(g_session);

wait(1000);

// closeSession
closeSession(g_session);

// disconnect channel
g_channel.disconnect();


function getEndpoints(discoveryUrl)
{
    var channel = new UaChannel();
    var discovery = new UaDiscovery(channel)
    var result;
    
    // pki type is none for getEndpoints
    channel.PkiType = PkiType.None;
    
    result = channel.connect(discoveryUrl);
    
    if(result.isGood())
    {
        addLog("Channel connected");
    }
    
    if(result.isGood())
    {
        var i;
        var request = new UaGetEndpointsRequest();
        var response = new UaGetEndpointsResponse();
        request.EndpointUrl = discoveryUrl;
        discovery.getEndpoints(request, response);
        
        addLog("response: " + response.toString());
        
        for(i = 0; i < response.Endpoints.length; i++)
        {
            serverCertificate = response.Endpoints[i].ServerCertificate;
            
            // find https endpoint
            if(response.Endpoints[i].EndpointUrl.substring(0, 8) == "https://")
            {
                addLog("response.Endpoint: " + response.Endpoints[i].toString());
                serverCertificate = response.Endpoints[i].ServerCertificate;
                addLog("serverCertificate: " + serverCertificate.toString());
                break;
            }
        }
    }    
    
    channel.disconnect();
    addLog("Channel disconnected");
}

function createSession(session)
{
    var request =  new UaCreateSessionRequest();
    var response = new UaCreateSessionResponse();
    
    // create and configure PkiProvider    
    var pkiProvider = new UaPkiUtility();
    pkiProvider.CertificateTrustListLocation = readSetting( "/Advanced/Certificates/CertificateTrustListLocation" );
    pkiProvider.CertificateRevocationListLocation = readSetting( "/Advanced/Certificates/CertificateRevocationListLocation" );
    pkiProvider.PkiType = PkiType.OpenSSL;

    // load client certificate
    clientCertificate = new UaByteString();
    uaStatus = pkiProvider.loadCertificateFromFile( readSetting( "/Advanced/Certificates/ClientCertificate" ), clientCertificate );
    addLog("clientCertificate: " + clientCertificate);
    
    // load private key
    clientPrivateKey = new UaByteString();
    uaStatus = pkiProvider.loadPrivateKeyFromFile( readSetting( "/Advanced/Certificates/ClientPrivateKey" ), clientPrivateKey );
    addLog("clientPrivateKey: " + clientPrivateKey);
    
    session.buildRequestHeader(request.RequestHeader);    
    var status = session.createSession(request, response);
    
    if(status.isGood())
    {
        if(response.ResponseHeader.ServiceResult.isGood())
        {
            addLog("createSession succeeded");
        }
        else
        {
            addLog("createSession failed");
        }
    }   
    else
    {
        addLog("createSession failed");
    }
    
    return status;
}

function activateSession(session)
{
    var request =  new UaActivateSessionRequest();
    var response = new UaActivateSessionResponse();
    
    session.buildRequestHeader(request.RequestHeader);
    
    var status = session.activateSession(request, response);
    
    if(status.isGood())
    {
        if(response.ResponseHeader.ServiceResult.isGood())
        {
            addLog("activateSession succeeded");
        }
        else
        {
            addLog("activateSession failed");
        }
    }   
    else
    {
        addLog("activateSession failed");
    }
    
    return status; 
}

function closeSession(session)
{
    var request =  new UaCloseSessionRequest();
    var response = new UaCloseSessionResponse();
    
    session.buildRequestHeader(request.RequestHeader);
    
    var status = session.closeSession(request, response);
    
    if(status.isGood())
    {
        if(response.ResponseHeader.ServiceResult.isGood())
        {
            addLog("closeSession succeeded");
        }
        else
        {
            addLog("closeSession failed");
        }
    }   
    else
    {
        addLog("closeSession failed");
    }
    
    return status; 
}
