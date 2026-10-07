function waitIceGathering(connection: RTCPeerConnection): Promise<void> {
  return new Promise((resolve) => {
    connection.onicecandidate = (event) => {
      if (!event.candidate) resolve()
    }
  })
}

export async function createRoom(): Promise<[string, RTCPeerConnection, RTCDataChannel]> {
  const connection = new RTCPeerConnection({ iceServers: [] })

  const dataChannel = connection.createDataChannel('rpg-room')
  dataChannel.onopen = () => console.log('Conexão aberta')
  dataChannel.onclose = () => console.log('Conexão fechada')
  dataChannel.onmessage = (msg) => console.log('DC: ', msg.data)
  const iceGathered = waitIceGathering(connection)
  const offer = await connection.createOffer()
  await connection.setLocalDescription(offer)
  await iceGathered

  return [btoa(JSON.stringify(connection.localDescription)), connection, dataChannel]
}

export async function confirmRoomUser(code: string, connection: RTCPeerConnection) {
  const answer = JSON.parse(atob(code))
  await connection.setRemoteDescription(answer)
}

export async function enterRoom(
  lobbyRoomCode: string,
  setChannel: CallableFunction,
): Promise<[string, RTCPeerConnection]> {
  const connection = new RTCPeerConnection({ iceServers: [] })

  connection.ondatachannel = (event) => {
    const channel = event.channel
    channel.onopen = () => console.log('Conectados na mesma sala')
    channel.onmessage = (msg) => console.log('C: ', msg.data)
    setChannel(channel)
  }

  const offer = JSON.parse(atob(lobbyRoomCode))
  await connection.setRemoteDescription(offer)

  const iceGathered = waitIceGathering(connection)
  const answer = await connection.createAnswer()
  await connection.setLocalDescription(answer)
  await iceGathered

  return [btoa(JSON.stringify(connection.localDescription)), connection]
}
