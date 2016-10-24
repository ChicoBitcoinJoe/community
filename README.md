# LinkDB

function calls
--------------

Get Metadata From TxHash
LinkDB.getTxMetadata(txHash)              //endpoint defaults to localhost:8080
LinkDB.getTxMetadata(endPoint,txHash)     //endpoint can be set to any open ipfs gateway

generic: http://endpoint/ipfs/LinkIpfsHash/#/txHash
returns: { content_metadata }



content_metadata = {
      who:msg.sender
     what:media             //= text,link(hyperlink,ipfs,swarm),image,audio,video
     when:block.timestamp
    where:content           //= ipfs,swarm *but NOT a direct link to the media. In theory this could be an API endpoint?
      why:purpose           //= news,social,debate(serious discussion),Promotion(opt in advertising)
      how:version           //= 'community/(team_id)/0.0.1' *tbd
}